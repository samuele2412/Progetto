import type { Locale } from './i18n';

/**
 * Localised URL segments. English visitors get English slugs — the same page,
 * a different address — which is what hreflang expects and what Google indexes.
 * Adding a page means adding one entry here and one branch in the catch-all.
 */
export const routeSlugs = {
  home: { it: '', en: '' },
  packages: { it: 'pacchetti', en: 'packages' },
  cocktails: { it: 'cocktail', en: 'cocktails' },
  gallery: { it: 'galleria', en: 'gallery' },
  about: { it: 'chi-siamo', en: 'about' },
  partners: { it: 'collaboriamo', en: 'partners' },
  faq: { it: 'domande-frequenti', en: 'faq' },
  request: { it: 'richiedi-preventivo', en: 'request-a-quote' },
  thanks: { it: 'richiesta-inviata', en: 'request-sent' },
  journal: { it: 'journal', en: 'journal' },
  privacy: { it: 'privacy-policy', en: 'privacy-policy' },
  cookies: { it: 'cookie-policy', en: 'cookie-policy' },
} as const;

export type RouteKey = keyof typeof routeSlugs;

/** Build an absolute-from-root path for a known page. */
export function path(key: RouteKey, locale: Locale, query?: Record<string, string | undefined>): string {
  const slug = routeSlugs[key][locale];
  const base = slug ? `/${locale}/${slug}` : `/${locale}`;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query ?? {})) if (v) params.set(k, v);
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

/** Path of a hand-written SEO landing page. */
export function landingPath(slug: string, locale: Locale): string {
  return `/${locale}/${slug}`;
}

export function journalPath(slug: string, locale: Locale): string {
  return `/${locale}/${routeSlugs.journal[locale]}/${slug}`;
}

/** Reverse lookup: which page does this slug belong to? */
export function routeKeyForSlug(slug: string, locale: Locale): RouteKey | null {
  for (const [key, value] of Object.entries(routeSlugs)) {
    if (value[locale] === slug) return key as RouteKey;
  }
  return null;
}

/**
 * The short form of a landing page's title, for menus and rows of links:
 * "Bartender per matrimoni a Roma" becomes "Matrimoni". The full title is
 * written for the page and for Google; six of them stacked in a menu read as
 * one phrase repeated. A title that does not follow the pattern comes back
 * whole, minus anything after a dash.
 */
export function landingNavLabel(title: string, locale: Locale): string {
  const [prefix, suffix] =
    locale === 'en'
      ? [/^(?:an?\s+)?(?:bartender|cocktail bar)\s+for\s+(?:an?\s+)?/i, /\s+in\s+rome$/i]
      : [/^(?:bartender|cocktail bar)\s+per\s+(?:una?\s+)?/i, /\s+a\s+roma$/i];
  const base = title.replace(/\s+—.*$/, '').trim();
  const short = base.replace(prefix, '').replace(suffix, '').trim();
  if (!short) return base;
  return short.charAt(0).toUpperCase() + short.slice(1);
}
