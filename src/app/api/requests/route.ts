import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { db } from '@/db';
import { eventRequests, eventTypes, packages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { env } from '@/lib/env';
import { t } from '@/lib/i18n';
import { areaLabels, cocktailPreferenceLabels, guestRangeLabels, serviceModeLabels } from '@/lib/form-options';
import { buildClientAcknowledgement, buildOwnerNotification, sendMail } from '@/lib/mail';
import { clientIp, hashIp, limitEventRequest } from '@/lib/rate-limit';
import { getSettings } from '@/lib/settings';
import { verifyTurnstile } from '@/lib/turnstile';
import { eventRequestSchema, minimumFillMs } from '@/lib/validation';
import { makeReference, whatsappLink } from '@/lib/utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Receives a quote request.
 *
 * Order of operations matters: the lead is written to the database *before*
 * anything is emailed. Notifications are best-effort — if SMTP is down the
 * owner still finds the request in the panel, which is the difference between
 * a slow reply and a lost booking.
 */
export async function POST(request: Request) {
  const headerList = await headers();
  const ip = clientIp(headerList);
  const ipHash = hashIp(ip);

  // 1. Throttle before doing any work.
  const limit = limitEventRequest(ipHash);
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: 'rate_limited' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    );
  }

  // 2. Parse and validate.
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'generic' }, { status: 400 });
  }

  const parsed = eventRequestSchema.safeParse(payload);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? 'form');
      if (!fields[field]) fields[field] = issue.message;
    }
    return NextResponse.json({ ok: false, error: 'generic', fields }, { status: 422 });
  }
  const data = parsed.data;

  // 3. Cheap bot signals: the honeypot is already covered by the schema
  //    (company must be empty); this catches scripted instant submissions.
  if (typeof data.elapsedMs === 'number' && data.elapsedMs < minimumFillMs) {
    return NextResponse.json({ ok: false, error: 'too_fast' }, { status: 422 });
  }

  // 4. Turnstile, when configured.
  const humanVerified = await verifyTurnstile(data.turnstileToken, ip);
  if (!humanVerified) {
    return NextResponse.json({ ok: false, error: 'turnstile_failed' }, { status: 422 });
  }

  // 5. Persist.
  const reference = makeReference();
  const now = new Date();

  let saved;
  try {
    [saved] = await db
      .insert(eventRequests)
      .values({
        reference,
        name: data.name,
        email: data.email,
        phone: data.phone,
        prefersWhatsapp: data.prefersWhatsapp,
        eventDate: data.eventDate ? data.eventDate : null,
        dateFlexible: data.dateFlexible,
        eventTypeSlug: data.eventTypeSlug,
        area: data.area,
        venueNote: data.venueNote,
        guestsRange: data.guestsRange,
        packageSlug: data.packageSlug,
        serviceMode: data.serviceMode,
        preferences: data.preferences,
        message: data.message,
        locale: data.locale,
        consentPrivacy: data.consentPrivacy,
        consentPrivacyAt: now,
        source: data.source,
        ipHash,
        statusHistory: [{ status: 'new', at: now.toISOString(), by: 'website' }],
      })
      .returning();
  } catch (error) {
    console.error('[requests] insert failed:', error);
    return NextResponse.json({ ok: false, error: 'server' }, { status: 500 });
  }

  // 6. Notify. Failures are logged and swallowed on purpose.
  void notify(saved.id, reference, data).catch((error) => console.error('[requests] notify failed:', error));

  return NextResponse.json({ ok: true, reference }, { status: 201 });
}

type Parsed = ReturnType<typeof eventRequestSchema.parse>;

async function notify(id: number, reference: string, data: Parsed) {
  const settings = await getSettings();
  const locale = data.locale;

  const [eventType] = data.eventTypeSlug
    ? await db.select().from(eventTypes).where(eq(eventTypes.slug, data.eventTypeSlug)).limit(1)
    : [];
  const [pkg] = data.packageSlug
    ? await db.select().from(packages).where(eq(packages.slug, data.packageSlug)).limit(1)
    : [];

  const sourceParts = [
    data.source.utmSource && `source=${data.source.utmSource}`,
    data.source.utmMedium && `medium=${data.source.utmMedium}`,
    data.source.utmCampaign && `campaign=${data.source.utmCampaign}`,
    data.source.referrer && `ref=${data.source.referrer}`,
    data.source.landingPath && `landing=${data.source.landingPath}`,
  ].filter(Boolean);

  await sendMail(
    buildOwnerNotification({
      reference,
      name: data.name,
      email: data.email,
      phone: data.phone,
      eventDate: data.eventDate || (data.dateFlexible ? 'da definire' : '—'),
      eventType: eventType ? t(eventType.name, 'it') : data.eventTypeSlug,
      guests: data.guestsRange ? guestRangeLabels[data.guestsRange].it : '—',
      area: data.area ? areaLabels[data.area].it : '—',
      packageName: pkg ? t(pkg.name, 'it') : 'Da consigliare',
      serviceMode: serviceModeLabels[data.serviceMode].it,
      preferences: data.preferences.map((key) => cocktailPreferenceLabels[key].it).join(', '),
      message: data.message,
      source: sourceParts.length ? sourceParts.join(' · ') : 'diretto',
      adminUrl: `${env.SITE_URL}/admin/richieste/${id}`,
    }),
  );

  await sendMail(
    buildClientAcknowledgement({
      to: data.email,
      name: data.name.split(' ')[0],
      reference,
      brandName: settings.brand.name,
      locale,
      whatsappUrl: whatsappLink(settings.contact.whatsapp, t(settings.contact.whatsappMessage, locale)),
    }),
  );
}
