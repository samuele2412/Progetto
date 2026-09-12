import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { db } from '@/db';
import { eventRequests, eventTypes, packages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { env } from '@/lib/env';
import { t } from '@/lib/i18n';
import { areaLabels, cocktailPreferenceLabels, guestRangeLabels, serviceModeLabels } from '@/lib/form-options';
import { buildClientAcknowledgement, buildOwnerNotification, sendMail } from '@/lib/mail';
import {
  chargeAttempt,
  checkEventRequest,
  clientIp,
  consumeEventRequest,
  hashIp,
  limitAcknowledgement,
} from '@/lib/rate-limit';
import { getSettings } from '@/lib/settings';
import { verifyTurnstile } from '@/lib/turnstile';
import { eventRequestSchema, minimumFillMs } from '@/lib/validation';
import { describeDbError, isUniqueViolation } from '@/lib/db-errors';
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
/** Our own message keys: lower snake_case, nothing else. */
const MESSAGE_KEY = /^[a-z][a-z0-9_]{2,39}$/;

/**
 * What to say when a field is missing altogether.
 *
 * The schema attaches a key to every *constraint*, but a field that is absent
 * fails zod's type check first, and that carries zod's own English sentence
 * ("Invalid input: expected string, received undefined"). It was going out over
 * the wire as-is: an internal detail on a public endpoint, in the wrong
 * language, and one the client cannot translate — so a missing name showed the
 * generic "check the highlighted fields" instead of naming the problem.
 */
const FALLBACK_KEY: Record<string, string> = {
  name: 'name_short',
  email: 'email_invalid',
  phone: 'phone_invalid',
  eventDate: 'date_invalid',
  eventTypeSlug: 'event_type_required',
  area: 'area_required',
  guestsRange: 'guests_required',
  message: 'message_long',
  consentPrivacy: 'consent_required',
  cordialeHp: 'spam_detected',
};

function messageKeyFor(field: string, message: string): string {
  if (MESSAGE_KEY.test(message)) return message;
  return FALLBACK_KEY[field] ?? 'generic';
}

export async function POST(request: Request) {
  const headerList = await headers();
  const ip = clientIp(headerList);
  const ipHash = hashIp(ip);

  // 1a. Every call, valid or not, costs an attempt: this is what stops the
  //     endpoint being hammered with malformed payloads for free.
  const attempt = chargeAttempt(ipHash);
  if (!attempt.allowed) {
    return NextResponse.json(
      { ok: false, error: 'rate_limited' },
      { status: 429, headers: { 'Retry-After': String(attempt.retryAfterSeconds) } },
    );
  }

  // 1b. The submission budget is only *read* here and spent once the request
  //     has been stored, so a typo in an email address does not cost the
  //     visitor one of five hourly requests.
  const limit = checkEventRequest(ipHash);
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
      if (!fields[field]) fields[field] = messageKeyFor(field, issue.message);
    }
    return NextResponse.json({ ok: false, error: 'generic', fields }, { status: 422 });
  }
  const data = parsed.data;

  // 3. Cheap bot signals: the honeypot is already covered by the schema
  //    (cordialeHp must be empty); this catches scripted instant submissions.
  if (typeof data.elapsedMs === 'number' && data.elapsedMs < minimumFillMs) {
    return NextResponse.json({ ok: false, error: 'too_fast' }, { status: 422 });
  }

  // 4. Turnstile, when configured.
  const humanVerified = await verifyTurnstile(data.turnstileToken, ip);
  if (!humanVerified) {
    return NextResponse.json({ ok: false, error: 'turnstile_failed' }, { status: 422 });
  }

  // 5. Persist. The reference is random and unique, so on the rare collision the
  //    honest answer is to draw another one — not to hand the visitor a 500.
  const now = new Date();
  let saved: typeof eventRequests.$inferSelect | undefined;
  let reference = '';

  for (let attempt = 0; attempt < 5 && !saved; attempt += 1) {
    reference = makeReference();
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
          isPartner: data.isPartner,
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
      if (isUniqueViolation(error)) continue;
      // Never the raw error: it carries the statement and its parameters, which
      // here means the visitor's name, email and phone number.
      console.error('[requests] insert failed:', describeDbError(error));
      return NextResponse.json({ ok: false, error: 'server' }, { status: 500 });
    }
  }

  if (!saved) {
    console.error('[requests] could not allocate a unique reference');
    return NextResponse.json({ ok: false, error: 'server' }, { status: 500 });
  }

  // 6. Now that the request is stored, charge it against the hourly budget.
  consumeEventRequest(ipHash);

  // 7. Notify. Failures are logged and swallowed on purpose.
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

  // Capped per recipient: the form must not become a way of mailing a stranger
  // repeatedly just by rotating IP addresses.
  if (!limitAcknowledgement(hashIp(`ack:${data.email}`)).allowed) return;

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
