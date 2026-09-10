import Link from 'next/link';
import { PageHero } from '@/components/blocks/PageHero';
import { d } from '@/lib/dictionary';
import { t, tList, type Locale } from '@/lib/i18n';
import { path } from '@/lib/routes';
import { getSettings } from '@/lib/settings';
import { isPlaceholder, telLink, whatsappLink } from '@/lib/utils';

/**
 * The B2B page. Worth having: venues, planners and caterers book repeat work,
 * and they will not send business to a supplier whose site only speaks to
 * private clients. It stays a single page — a whole B2B section would be
 * disproportionate at this stage.
 */
export async function PartnersPage({ locale }: { locale: Locale }) {
  const settings = await getSettings();
  const copy = d(locale);
  const whatsappHref = whatsappLink(settings.contact.whatsapp, t(settings.contact.whatsappMessage, locale));

  return (
    <>
      <PageHero
        eyebrow={locale === 'en' ? 'For professionals' : 'Per professionisti'}
        title={t(settings.partners.title, locale)}
        intro={t(settings.partners.intro, locale)}
      />

      <section className="section">
        <div className="container-page grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <ul className="reveal space-y-6">
            {tList(settings.partners.bullets, locale).map((bullet) => (
              <li key={bullet} className="flex gap-4 border-b border-[var(--hairline)] pb-6 last:border-0">
                <svg viewBox="0 0 16 16" className="mt-1 h-4 w-4 shrink-0 text-brass-500" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                  <path d="M3 8.5l3.2 3.2L13 5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[1.02rem] leading-relaxed text-bone-200">{bullet}</span>
              </li>
            ))}
          </ul>

          <aside className="card reveal reveal-delay-1 h-fit p-7">
            <h2 className="font-[family-name:var(--font-display)] text-xl text-bone-50">
              {t(settings.partners.ctaLabel, locale)}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-bone-400">
              {locale === 'en'
                ? 'Tell us what you organise and how often. We will send rates and availability for the season.'
                : 'Raccontaci che eventi organizzi e con che frequenza. Ti mandiamo listino e disponibilità per la stagione.'}
            </p>
            <div className="mt-7 space-y-3">
              <Link
                href={path('request', locale, { evento: 'aziendale', partner: '1' })}
                className="btn btn-primary w-full"
              >
                {copy.cta.quoteLong}
              </Link>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-ghost w-full">
                {copy.cta.whatsappLong}
              </a>
              {!isPlaceholder(settings.contact.phone) && (
                <a href={telLink(settings.contact.phone)} className="btn btn-ghost w-full">
                  {copy.cta.call}
                </a>
              )}
            </div>
            {!isPlaceholder(settings.contact.email) && (
              <p className="mt-6 break-all text-center text-xs text-bone-500">{settings.contact.email}</p>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
