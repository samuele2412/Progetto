import { PageHero } from '@/components/blocks/PageHero';
import { defaultCookieBody, defaultPrivacyBody } from '@/content/legal';
import { formatDate, t, type Locale } from '@/lib/i18n';
import { renderMarkdown } from '@/lib/markdown';
import { getSettings } from '@/lib/settings';
import { isPlaceholder } from '@/lib/utils';

/**
 * Privacy and cookie pages. The shipped text is a reviewed structure with
 * explicit [[…]] gaps; while any of them survive, the page says so out loud
 * rather than pretending to be a finished legal document.
 */
export async function LegalPage({ locale, kind }: { locale: Locale; kind: 'privacy' | 'cookies' }) {
  const settings = await getSettings();

  const custom = kind === 'privacy' ? settings.legal.privacyBody : settings.legal.cookieBody;
  const fallback = kind === 'privacy' ? defaultPrivacyBody : defaultCookieBody;
  const raw = t(custom, locale) || fallback[locale];

  const filled = raw
    .replace(/\[\[RAGIONE SOCIALE\]\]|\[\[LEGAL NAME\]\]/g, isPlaceholder(settings.legal.dataController) ? '[[RAGIONE SOCIALE]]' : settings.legal.dataController)
    .replace(/\[\[INDIRIZZO\]\]|\[\[ADDRESS\]\]/g, isPlaceholder(settings.legal.controllerAddress) ? '[[INDIRIZZO]]' : settings.legal.controllerAddress)
    .replace(/\[\[EMAIL\]\]/g, isPlaceholder(settings.legal.privacyEmail) ? '[[EMAIL]]' : settings.legal.privacyEmail)
    .replace(/\[\[PARTITA IVA\]\]|\[\[VAT NUMBER\]\]/g, isPlaceholder(settings.brand.vatNumber) ? '[[PARTITA IVA]]' : settings.brand.vatNumber);

  const stillDraft = /\[\[/.test(filled);

  const title =
    kind === 'privacy'
      ? locale === 'en'
        ? 'Privacy policy'
        : 'Informativa privacy'
      : 'Cookie policy';

  return (
    <>
      <PageHero title={title} compact />

      <section className="section">
        <div className="container-page max-w-3xl">
          {stillDraft && (
            <div
              role="note"
              className="mb-10 rounded-xl border border-bitter-500/40 bg-bitter-500/10 p-5 text-sm leading-relaxed text-bone-200"
            >
              <strong className="block text-bone-50">
                {locale === 'en' ? 'Draft — not yet in force' : 'Bozza — non ancora valida'}
              </strong>
              <p className="mt-2">
                {locale === 'en'
                  ? 'This text is a structure to be completed and reviewed by a qualified professional before the site goes live. Every [[…]] marker is a gap that still has to be filled in.'
                  : 'Questo testo è una traccia da completare e far verificare a un professionista prima della pubblicazione del sito. Ogni segnaposto [[…]] è un punto ancora da compilare.'}
              </p>
            </div>
          )}

          <div className="prose-cordiale">{renderMarkdown(filled)}</div>

          <p className="mt-12 border-t border-[var(--hairline)] pt-6 text-xs text-bone-500">
            {locale === 'en' ? 'Last updated' : 'Ultimo aggiornamento'}:{' '}
            {formatDate(settings.legal.lastUpdated, locale)}
          </p>
        </div>
      </section>
    </>
  );
}
