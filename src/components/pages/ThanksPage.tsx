import Link from 'next/link';
import { PageHero } from '@/components/blocks/PageHero';
import { PhoneIcon, WhatsAppIcon } from '@/components/icons';
import { d } from '@/lib/dictionary';
import { t, type Locale } from '@/lib/i18n';
import { path } from '@/lib/routes';
import { getSettings } from '@/lib/settings';
import { isPlaceholder, telLink, whatsappLink } from '@/lib/utils';

export async function ThanksPage({ locale, reference }: { locale: Locale; reference?: string }) {
  const settings = await getSettings();
  const copy = d(locale);
  const whatsappHref = whatsappLink(settings.contact.whatsapp, t(settings.contact.whatsappMessage, locale));

  return (
    <>
      <PageHero title={t(settings.requestForm.successTitle, locale)} intro={t(settings.requestForm.successBody, locale)} />

      <section className="section">
        <div className="container-page">
          <div className="max-w-2xl">
            {reference && (
              <div className="card p-6 text-center">
                <p className="text-xs uppercase tracking-[0.16em] text-ink-3">{copy.misc.reference}</p>
                <p className="mt-2 text-2xl font-medium tabular-nums tracking-[0.12em] text-accent">
                  {reference}
                </p>
                <p className="mt-3 text-sm text-ink-3">
                  {locale === 'en'
                    ? 'Quote this code if you message me before I reply.'
                    : 'Cita questo codice se mi scrivi prima che ti risponda.'}
                </p>
              </div>
            )}

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp flex-1"
                  data-track="whatsapp"
                  data-track-location="thanks"
                >
                  <WhatsAppIcon />
                  {copy.cta.whatsappLong}
                </a>
              )}
              {!isPlaceholder(settings.contact.phone) && (
                <a href={telLink(settings.contact.phone)} className="btn btn-ghost flex-1" data-track-location="thanks">
                  <PhoneIcon />
                  {copy.cta.call}
                </a>
              )}
            </div>

            <div className="mt-12 border-t border-[var(--hairline)] pt-8">
              <p className="text-sm text-ink-3">
                {locale === 'en' ? 'While you wait:' : 'Nel frattempo:'}
              </p>
              <ul className="mt-4 flex flex-wrap gap-3">
                <li>
                  <Link href={path('cocktails', locale)} className="btn btn-ghost !min-h-11 !py-2.5 text-sm">
                    {copy.cta.seeCocktails}
                  </Link>
                </li>
                <li>
                  <Link href={path('journal', locale)} className="btn btn-ghost !min-h-11 !py-2.5 text-sm">
                    Journal
                  </Link>
                </li>
                <li>
                  <Link href={path('home', locale)} className="btn btn-ghost !min-h-11 !py-2.5 text-sm">
                    {copy.cta.backHome}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
