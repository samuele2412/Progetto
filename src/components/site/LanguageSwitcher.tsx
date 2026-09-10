'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales, localeShort, type Locale } from '@/lib/i18n';
import { routeSlugs } from '@/lib/routes';
import { cn } from '@/lib/utils';

/**
 * Swaps the locale while keeping the visitor on the *same* page.
 *
 * Static pages are translated through the route map; landing pages and journal
 * posts carry their own slug pair, handed down from the server so the switcher
 * never has to hit the database.
 */
export type SlugPair = { it: string; en: string };

export function LanguageSwitcher({
  locale,
  slugPairs,
  className,
}: {
  locale: Locale;
  slugPairs: SlugPair[];
  className?: string;
}) {
  const pathname = usePathname() ?? `/${locale}`;

  function translate(target: Locale): string {
    if (target === locale) return pathname;

    const segments = pathname.split('/').filter(Boolean);
    // segments[0] is the current locale.
    const rest = segments.slice(1);
    if (rest.length === 0) return `/${target}`;

    // A journal post: /<locale>/journal/<slug>
    if (rest.length === 2 && rest[0] === routeSlugs.journal[locale]) {
      const pair = slugPairs.find((p) => p[locale] === rest[1]);
      const slug = pair ? pair[target] : rest[1];
      return `/${target}/${routeSlugs.journal[target]}/${slug}`;
    }

    if (rest.length === 1) {
      // A known static page?
      for (const value of Object.values(routeSlugs)) {
        if (value[locale] === rest[0]) return `/${target}/${value[target]}`.replace(/\/$/, '');
      }
      // A landing page?
      const pair = slugPairs.find((p) => p[locale] === rest[0]);
      if (pair) return `/${target}/${pair[target]}`;
    }

    return `/${target}`;
  }

  return (
    <div className={cn('flex items-center gap-1 text-xs', className)}>
      {locales.map((target, index) => (
        <span key={target} className="flex items-center gap-1">
          {index > 0 && <span aria-hidden className="text-bone-500/50">/</span>}
          <Link
            href={translate(target)}
            hrefLang={target}
            aria-current={target === locale ? 'true' : undefined}
            className={cn(
              'rounded px-1 py-0.5 tracking-wider transition-colors',
              target === locale ? 'text-brass-400' : 'text-bone-500 hover:text-bone-100',
            )}
          >
            {localeShort[target]}
          </Link>
        </span>
      ))}
    </div>
  );
}
