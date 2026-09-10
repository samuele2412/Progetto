import Link from 'next/link';
import { CocktailCard } from '@/components/blocks/CocktailCard';
import { FinalCta } from '@/components/blocks/FinalCta';
import { PageHero } from '@/components/blocks/PageHero';
import { d } from '@/lib/dictionary';
import { t, type Locale } from '@/lib/i18n';
import { getCocktails } from '@/lib/queries';
import { path } from '@/lib/routes';
import { getSettings } from '@/lib/settings';
import { whatsappLink } from '@/lib/utils';

const order = ['signature', 'classics', 'fresh', 'zero'] as const;

export async function CocktailsPage({ locale }: { locale: Locale }) {
  const [settings, cocktails] = await Promise.all([getSettings(), getCocktails()]);
  const copy = d(locale);
  const whatsappHref = whatsappLink(settings.contact.whatsapp, t(settings.contact.whatsappMessage, locale));

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
                className="rounded-full border border-[var(--hairline-strong)] px-4 py-2 text-sm text-bone-300 transition-colors hover:border-brass-500 hover:text-brass-300"
              >
                {copy.cocktails[group.category]}
              </a>
            ))}
          </nav>
        )}
      </PageHero>

      {grouped.map((group, groupIndex) => (
        <section
          key={group.category}
          id={group.category}
          className={groupIndex % 2 === 1 ? 'section border-t border-[var(--hairline)] bg-ink-900' : 'section'}
        >
          <div className="container-page">
            <div className="reveal flex items-center gap-4">
              <h2 className="display-3 text-bone-50">{copy.cocktails[group.category]}</h2>
              <span aria-hidden className="h-px flex-1 bg-[var(--hairline)]" />
              <span className="text-sm text-bone-500">{group.items.length}</span>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {group.items.map((cocktail, index) => (
                <div key={cocktail.id} className={`reveal reveal-delay-${Math.min(index % 4 + 1, 4)}`}>
                  <CocktailCard cocktail={cocktail} locale={locale} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="section border-t border-[var(--hairline)]">
        <div className="container-page">
          <div className="card reveal mx-auto max-w-2xl p-8 text-center md:p-12">
            <p className="eyebrow">{copy.cocktails.custom}</p>
            <h2 className="display-3 mt-3 text-bone-50">{copy.cocktails.custom}</h2>
            <p className="mt-4 text-[0.98rem] leading-relaxed text-bone-400">{copy.cocktails.customBody}</p>
            <Link href={path('request', locale)} className="btn btn-primary mt-8">
              {copy.cta.quoteLong}
            </Link>
          </div>
        </div>
      </section>

      <FinalCta
        locale={locale}
        copy={copy}
        title={t(settings.home.finalCtaTitle, locale)}
        body={t(settings.home.finalCtaBody, locale)}
        whatsappHref={whatsappHref}
      />
    </>
  );
}
