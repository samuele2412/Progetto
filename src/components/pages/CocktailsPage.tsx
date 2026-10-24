import { FinalCta } from '@/components/blocks/FinalCta';
import { PageHero } from '@/components/blocks/PageHero';
import { d } from '@/lib/dictionary';
import { t, type Locale } from '@/lib/i18n';
import { getCocktails } from '@/lib/queries';
import { getSettings } from '@/lib/settings';

const order = ['signature', 'classics', 'fresh', 'zero'] as const;

/**
 * The cocktail list, set like a printed menu: name, ingredients, one line on
 * what it is like. It used to be a grid of photo cards, and with photographs
 * for five drinks out of fifteen most of the grid was placeholders — a list
 * reads as finished with no pictures at all, and is quicker to scan.
 *
 * The photographs still appear where there is one per drink: the three on the
 * home page, and the page builder's cocktail block (CocktailCard).
 */
export async function CocktailsPage({ locale }: { locale: Locale }) {
  const [settings, cocktails] = await Promise.all([getSettings(), getCocktails()]);
  const copy = d(locale);

  const grouped = order
    .map((category) => ({ category, items: cocktails.filter((c) => c.category === category) }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      <PageHero
        eyebrow={t(settings.brand.descriptor, locale)}
        title={t(settings.home.cocktailsTitle, locale)}
        intro={t(settings.home.cocktailsIntro, locale)}
      >
        {grouped.length > 1 && (
          <nav aria-label={copy.nav.cocktails} className="mt-8 flex flex-wrap gap-2">
            {grouped.map((group) => (
              <a
                key={group.category}
                href={`#${group.category}`}
                className="inline-flex min-h-11 items-center rounded-full border border-[var(--hairline-strong)] px-4 text-sm text-ink-2 transition-colors hover:border-ink hover:text-ink"
              >
                {copy.cocktails[group.category]}
              </a>
            ))}
          </nav>
        )}
      </PageHero>

      <section className="section">
        <div className="container-page grid gap-14 md:gap-20">
          {grouped.map((group) => (
            <div key={group.category} id={group.category} className="grid scroll-mt-28 gap-6 lg:grid-cols-12 lg:gap-12">
              <h2 className="display-3 lg:col-span-3">{copy.cocktails[group.category]}</h2>
              <ul className="grid border-t border-[var(--hairline-strong)] md:grid-cols-2 md:gap-x-12 lg:col-span-9">
                {group.items.map((cocktail) => (
                  <li key={cocktail.id} className="border-b border-[var(--hairline)] py-5">
                    <h3 className="font-[family-name:var(--font-display)] text-xl">{cocktail.name}</h3>
                    <p className="mt-1.5 text-xs uppercase tracking-[0.14em] text-accent">{t(cocktail.ingredients, locale)}</p>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-2">{t(cocktail.description, locale)}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <FinalCta locale={locale} />
    </>
  );
}
