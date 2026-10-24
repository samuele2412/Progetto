import { FinalCta } from '@/components/blocks/FinalCta';
import { PageHero } from '@/components/blocks/PageHero';
import { Media } from '@/components/Media';
import { CheckIcon } from '@/components/icons';
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
          {/* Landscape until the two columns open, as on the home page: a capped
              portrait left half the row empty on a tablet. */}
          <div className="frame aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5]">
            <Media
              src={about.imagePath}
              alt={t(about.imageAlt, locale)}
              sizes="(max-width: 1024px) 100vw, 42vw"
              priority
              placeholderLabel={locale === 'en' ? 'Portrait of the bartender' : 'Ritratto del bartender'}
            />
          </div>
          <div>
            <div className="copy space-y-5">
              {paragraphs(t(about.body, locale)).map((paragraph, index) => (
                <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
              ))}
            </div>
            {facts.length > 0 && (
              <div className="mt-9 border-t border-[var(--hairline)] pt-8">
                <h2 className="eyebrow">{t(about.factsTitle, locale)}</h2>
                <ul className="mt-4 space-y-3 text-sm text-ink-2">
                  {facts.map((fact) => (
                    <li key={fact} className="flex gap-3">
                      <CheckIcon className="mt-1 h-3.5 w-3.5 text-accent" />
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {!isPlaceholder(about.signature) && (
              <p className="mt-8 font-[family-name:var(--font-display)] text-2xl italic text-accent">{about.signature}</p>
            )}
          </div>
        </div>
      </section>

      {approach.length > 0 && (
        <section className="section border-t border-[var(--hairline)]">
          <div className="container-page grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <h2 className="display-2">{t(about.approachTitle, locale)}</h2>
            <div className="copy space-y-5 lg:pt-2">
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
