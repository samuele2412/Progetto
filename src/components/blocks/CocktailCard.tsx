import { Media } from '@/components/Media';
import type { Cocktail } from '@/db/schema';
import { t, type Locale } from '@/lib/i18n';

export function CocktailCard({ cocktail, locale }: { cocktail: Cocktail; locale: Locale }) {
  return (
    <article className="card card-hover group overflow-hidden">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Media
          src={cocktail.imagePath}
          alt={cocktail.name}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          imageClassName="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
          placeholderLabel={cocktail.name}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent"
        />
      </div>
      <div className="p-4 sm:p-5">
        <h3 className="font-[family-name:var(--font-display)] text-lg text-bone-50">{cocktail.name}</h3>
        <p className="mt-1 text-xs uppercase tracking-wider text-brass-500">{t(cocktail.ingredients, locale)}</p>
        <p className="mt-2.5 text-sm leading-relaxed text-bone-400 sm:mt-3">{t(cocktail.description, locale)}</p>
      </div>
    </article>
  );
}
