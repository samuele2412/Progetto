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
