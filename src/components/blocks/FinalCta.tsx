import type { CSSProperties } from 'react';
import Link from 'next/link';
import { CoupeMark, WhatsAppIcon } from '@/components/icons';
import { d } from '@/lib/dictionary';
import { t, type Locale } from '@/lib/i18n';
import { path } from '@/lib/routes';
import { getSettings } from '@/lib/settings';
import { typeset, whatsappLink } from '@/lib/utils';

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
    // A dark band in either theme, and the last thing before the footer: the
    // page closes on the one question that matters, set as large as the
    // opening. The coupe over the buttons is drawn, not photographed.
    <section className="tone-night border-t border-[var(--hairline)] bg-paper">
      <div className="section container-page">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-7" data-reveal>
            <div aria-hidden className="rule-brass" />
            <h2 className="display-1 mt-8 max-w-[14ch]">{typeset(t(settings.home.finalCtaTitle, locale))}</h2>
            {!brief && <p className="lede mt-7 max-w-xl">{typeset(t(settings.home.finalCtaBody, locale))}</p>}
          </div>
          <div className="lg:col-span-4 lg:col-start-9" data-reveal style={{ '--reveal-delay': '0.12s' } as CSSProperties}>
            <CoupeMark className="mx-auto mb-10 hidden h-44 w-auto text-brass opacity-70 lg:block" />
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col" data-cta-zone="end">
              <Link
                href={path('request', locale, { pacchetto: packageSlug, evento: eventTypeSlug })}
                className="btn btn-primary sm:flex-1 lg:w-full"
                data-track="quote"
                data-track-location="final"
              >
                {copy.cta.quoteLong}
                <span aria-hidden className="arrow">
                  →
                </span>
              </Link>
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp sm:flex-1 lg:w-full"
                  data-track="whatsapp"
                  data-track-location="final"
                >
                  <WhatsAppIcon />
                  {copy.cta.whatsappLong}
                </a>
              )}
            </div>
            {(note || periods) && (
              <div className="mt-6 space-y-1.5 border-t border-[var(--hairline)] pt-5 text-sm leading-relaxed text-ink-3">
                {note && <p>{note}</p>}
                {periods && <p className="font-medium text-ink">{periods}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
