import { FinalCta } from '@/components/blocks/FinalCta';
import { PageHero } from '@/components/blocks/PageHero';
import { Media } from '@/components/Media';
import { t, tList, type Locale } from '@/lib/i18n';
import { getSettings } from '@/lib/settings';
import { isPlaceholder } from '@/lib/utils';

/** Paragraphs are separated by a blank line in the panel's text areas. */
function paragraphs(text: string): string[] {
  return text.split('\n\n').filter((paragraph) => paragraph.trim());
}

/**
 * "Chi sono": his story, his training as a plain list, and how he works. Only
 * facts he confirmed — docs/13-brand-voice.md says where each one may appear.
 */
export async function AboutPage({ locale }: { locale: Locale }) {
  const settings = await getSettings();
  const about = settings.about;
  const facts = tList(about.facts, locale);
  const approach = paragraphs(t(about.approachBody, locale));

  return (
    <>
      <PageHero eyebrow={t(about.eyebrow, locale)} title={t(about.title, locale)} />

      <section className="section">
        <div className="container-page grid gap-10 sm:gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div className="reveal relative aspect-[4/5] max-h-[34rem] overflow-hidden rounded-[var(--radius-panel)] lg:max-h-none">
            <Media
              src={about.imagePath}
              alt={t(about.imageAlt, locale)}
              sizes="(max-width: 1024px) 100vw, 42vw"
              priority
              placeholderLabel={locale === 'en' ? 'Portrait of the bartender' : 'Ritratto del bartender'}
            />
          </div>
          <div className="reveal reveal-delay-1">
            <div className="space-y-5 text-[1.02rem] leading-relaxed text-bone-200">
              {paragraphs(t(about.body, locale)).map((paragraph, index) => (
                <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
              ))}
            </div>
            {facts.length > 0 && (
              <div className="mt-9 border-t border-[var(--hairline)] pt-8">
                <h2 className="eyebrow">{t(about.factsTitle, locale)}</h2>
                <ul className="mt-4 space-y-3 text-sm text-bone-200">
                  {facts.map((fact) => (
                    <li key={fact} className="flex gap-3">
                      <svg viewBox="0 0 16 16" className="mt-1 h-3.5 w-3.5 shrink-0 text-brass-500" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                        <path d="M3 8.5l3.2 3.2L13 5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {!isPlaceholder(about.signature) && (
              <p className="mt-8 font-[family-name:var(--font-display)] text-xl text-brass-400">{about.signature}</p>
            )}
          </div>
        </div>
      </section>

      {approach.length > 0 && (
        <section className="section border-t border-[var(--hairline)] bg-ink-900">
          <div className="container-page grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <h2 className="display-2 reveal text-bone-50">{t(about.approachTitle, locale)}</h2>
            <div className="reveal reveal-delay-1 space-y-5 text-[1.02rem] leading-relaxed text-bone-200 lg:pt-2">
              {approach.map((paragraph, index) => (
                <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      <FinalCta locale={locale} />
    </>
  );
}
