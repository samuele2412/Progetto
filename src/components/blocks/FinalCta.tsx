import Link from 'next/link';
import { WhatsAppIcon } from '@/components/icons';
import { d } from '@/lib/dictionary';
import { t, type Locale } from '@/lib/i18n';
import { path } from '@/lib/routes';
import { getSettings } from '@/lib/settings';
import { whatsappLink } from '@/lib/utils';

/**
 * The closing call to action at the bottom of every public page.
 *
 * It reads the settings itself: every page used to pass down the same title,
 * body and WhatsApp link, sixteen copies of one decision. The note says how a
 * date gets fixed while he is at sea; the periods line appears only once he
 * has written his dates on land in the panel.
 *
 * `brief` leaves out the line on how a request works and that the quote is
 * free: on the service page, the landings, the FAQ and the articles the page
 * itself has just said both, and the block would say them again.
 */
export async function FinalCta({
  locale,
  packageSlug,
  eventTypeSlug,
  brief = false,
}: {
  locale: Locale;
  packageSlug?: string;
  eventTypeSlug?: string;
  brief?: boolean;
}) {
  const settings = await getSettings();
  const copy = d(locale);
  const whatsappHref = whatsappLink(settings.contact.whatsapp, t(settings.contact.whatsappMessage, locale));
  const note = t(settings.home.finalCtaNote, locale);
  const periods = t(settings.contact.periods, locale);

  return (
    <section className="section border-t border-[var(--hairline)] bg-paper-2">
      <div className="container-page text-center">
        <div className="reveal mx-auto max-w-2xl">
          <div className="rule-brass mx-auto" />
          <h2 className="display-2 mt-6">{t(settings.home.finalCtaTitle, locale)}</h2>
          {!brief && <p className="lede mx-auto mt-5 max-w-xl">{t(settings.home.finalCtaBody, locale)}</p>}
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={path('request', locale, { pacchetto: packageSlug, evento: eventTypeSlug })}
              className="btn btn-primary"
              data-track="quote"
              data-track-location="final"
            >
              {copy.cta.quoteLong}
            </Link>
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
                data-track="whatsapp"
                data-track-location="final"
              >
                <WhatsAppIcon />
                {copy.cta.whatsappLong}
              </a>
            )}
          </div>
          {(note || periods) && (
            <div className="mt-7 space-y-1.5 text-sm text-ink-3">
              {note && <p>{note}</p>}
              {periods && <p className="font-medium text-ink">{periods}</p>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
