import { PageHero } from '@/components/blocks/PageHero';
import { RequestForm } from '@/components/request/RequestForm';
import { SourceTracker } from '@/components/request/SourceTracker';
import { PhoneIcon, WhatsAppIcon } from '@/components/icons';
import { d } from '@/lib/dictionary';
import { env, turnstileEnabled } from '@/lib/env';
import { formatEuro, t, type Locale } from '@/lib/i18n';
import { getEventTypes, getPackages } from '@/lib/queries';
import { path } from '@/lib/routes';
import { getSettings } from '@/lib/settings';
import { isPlaceholder, telLink, whatsappLink } from '@/lib/utils';

export async function RequestPage({
  locale,
  initialEventType,
  initialPackage,
  isPartner = false,
}: {
  locale: Locale;
  initialEventType?: string;
  initialPackage?: string;
  isPartner?: boolean;
}) {
  const [settings, eventTypes, packages] = await Promise.all([getSettings(), getEventTypes(), getPackages()]);
  const copy = d(locale);
  const whatsappHref = whatsappLink(settings.contact.whatsapp, t(settings.contact.whatsappMessage, locale));
  const hasPhone = !isPlaceholder(settings.contact.phone);
  const periods = t(settings.contact.periods, locale);
  const steps = settings.service.steps[locale]?.length ? settings.service.steps[locale] : settings.service.steps.it;
  // An old link can still carry ?pacchetto= for a format that has since been
  // switched off; the form would keep it, hidden, and the email would name it.
  const packageSlug = packages.some((pkg) => pkg.slug === initialPackage) ? initialPackage : undefined;

  return (
    <>
      <SourceTracker />
      <PageHero
        eyebrow={t(settings.brand.descriptor, locale)}
        title={t(settings.requestForm.title, locale)}
        intro={t(settings.requestForm.intro, locale)}
        compact
      />

      <section className="section !pt-10">
        <div className="container-page grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <RequestForm
              locale={locale}
              copy={copy}
              eventTypes={eventTypes
                .filter((type) => type.selectable)
                .map((type) => ({ slug: type.slug, label: t(type.name, locale) }))}
              packages={packages.map((pkg) => ({
                slug: pkg.slug,
                label: t(pkg.name, locale),
                hint:
                  pkg.pricePerGuestFrom > 0
                    ? `${copy.packages.from} ${formatEuro(pkg.pricePerGuestFrom, locale)} ${copy.packages.perGuest}`
                    : copy.packages.onRequest,
              }))}
              privacyHref={path('privacy', locale)}
              thanksHref={path('thanks', locale)}
              submitLabel={t(settings.requestForm.submitLabel, locale)}
              reassurance={t(settings.requestForm.reassurance, locale)}
              turnstileSiteKey={turnstileEnabled ? env.TURNSTILE_SITE_KEY : undefined}
              initialEventType={initialEventType}
              initialPackage={packageSlug}
              isPartner={isPartner}
            />
          </div>

          <aside className="h-fit lg:sticky lg:top-28">
            {/* Only with a number to offer: without one the card said "write
                to me directly" above no button at all. */}
            {(whatsappHref || hasPhone) && (
              <div className="card mb-8 p-6">
                <p className="eyebrow">{copy.promises.inAHurry}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-2">{copy.promises.inAHurryBody}</p>
                <div className="mt-5 space-y-2.5">
                  {whatsappHref && (
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp w-full"
                      data-track="whatsapp"
                      data-track-location="request"
                    >
                      <WhatsAppIcon />
                      {copy.cta.whatsappLong}
                    </a>
                  )}
                  {hasPhone && (
                    <a href={telLink(settings.contact.phone)} className="btn btn-ghost w-full" data-track-location="request">
                      <PhoneIcon />
                      {copy.cta.call}
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* What happens after "Invia": the uncertainty that stops people at
                the last step. Titles only — the date note sits by the date
                field and "no payment, no commitment" by the submit button, so
                this column adds only what the form does not already say. */}
            <div className="border-t border-[var(--hairline-strong)] pt-5">
              <p className="eyebrow">{copy.form.nextTitle}</p>
              <ol className="mt-4 space-y-3">
                {steps.map((item, index) => (
                  <li key={item.title} className="flex items-baseline gap-3">
                    <span className="numeral text-xl leading-none">{String(index + 1).padStart(2, '0')}</span>
                    <span className="text-ink">{item.title}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-sm leading-relaxed text-ink-2">{copy.promises.fromBoard}</p>
              {periods && <p className="mt-2 text-sm font-medium text-ink">{periods}</p>}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
