import { PageHero } from '@/components/blocks/PageHero';
import { RequestForm } from '@/components/request/RequestForm';
import { SourceTracker } from '@/components/request/SourceTracker';
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
              initialPackage={initialPackage}
              isPartner={isPartner}
            />
          </div>

          <aside className="h-fit lg:sticky lg:top-28">
            <div className="card p-6">
              <p className="eyebrow">{locale === 'en' ? 'In a hurry?' : 'Hai fretta?'}</p>
              <p className="mt-3 text-sm leading-relaxed text-bone-400">
                {locale === 'en'
                  ? 'Write to us directly. It is the same person who reads the form.'
                  : 'Scrivici direttamente. Legge la stessa persona che riceve il modulo.'}
              </p>
              <div className="mt-5 space-y-2.5">
                {whatsappHref && (
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-full">
                    {copy.cta.whatsappLong}
                  </a>
                )}
                {!isPlaceholder(settings.contact.phone) && (
                  <a href={telLink(settings.contact.phone)} className="btn btn-ghost w-full">
                    {copy.cta.call}
                  </a>
                )}
              </div>
              <p className="mt-5 text-xs text-bone-500">{t(settings.contact.availability, locale)}</p>
            </div>

            <ul className="mt-6 space-y-4 text-sm text-bone-400">
              {[
                locale === 'en'
                  ? 'Nothing is booked automatically — we check the date ourselves.'
                  : 'Niente viene prenotato automaticamente: la data la verifichiamo noi.',
                locale === 'en'
                  ? 'No payment is required to ask for a quote.'
                  : 'Non serve pagare nulla per chiedere un preventivo.',
                locale === 'en'
                  ? 'We usually reply within 24 hours.'
                  : 'Di solito rispondiamo entro 24 ore.',
              ].map((line) => (
                <li key={line} className="flex gap-3">
                  <svg viewBox="0 0 16 16" className="mt-1 h-3.5 w-3.5 shrink-0 text-brass-500" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <path d="M3 8.5l3.2 3.2L13 5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}
