import Link from 'next/link';
import { PageHero } from '@/components/blocks/PageHero';
import { CheckIcon, PhoneIcon, WhatsAppIcon } from '@/components/icons';
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
          <ul className="space-y-6">
            {tList(settings.partners.bullets, locale).map((bullet) => (
              <li key={bullet} className="flex gap-4 border-b border-[var(--hairline)] pb-6 last:border-0">
                <CheckIcon className="mt-1 h-4 w-4 text-accent" />
                <span className="text-[1.02rem] leading-relaxed text-ink-2">{bullet}</span>
              </li>
            ))}
          </ul>

          <aside className="card h-fit p-7">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-ink">
              {t(settings.partners.ctaLabel, locale)}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-2">{t(settings.partners.ctaBody, locale)}</p>
            <div className="mt-7 space-y-3" data-cta-zone>
              <Link
                href={path('request', locale, { evento: 'aziendale', partner: '1' })}
                className="btn btn-primary w-full"
                data-track="quote"
                data-track-location="partners"
              >
                {copy.cta.quoteLong}
              </Link>
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp w-full"
                  data-track="whatsapp"
                  data-track-location="partners"
                >
                  <WhatsAppIcon />
                  {copy.cta.whatsappLong}
                </a>
              )}
              {!isPlaceholder(settings.contact.phone) && (
                <a href={telLink(settings.contact.phone)} className="btn btn-ghost w-full" data-track-location="partners">
                  <PhoneIcon />
                  {copy.cta.call}
                </a>
              )}
            </div>
            {!isPlaceholder(settings.contact.email) && (
              <p className="mt-6 break-all text-center text-xs text-ink-3">{settings.contact.email}</p>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
