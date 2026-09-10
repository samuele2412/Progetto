export const locales = ['it', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'it';

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** BCP-47 tags used in <html lang>, hreflang and Open Graph. */
export const htmlLang: Record<Locale, string> = { it: 'it-IT', en: 'en-GB' };
export const ogLocale: Record<Locale, string> = { it: 'it_IT', en: 'en_GB' };

export const localeLabel: Record<Locale, string> = { it: 'Italiano', en: 'English' };
export const localeShort: Record<Locale, string> = { it: 'IT', en: 'EN' };

/** Pick the localized half of a `{ it, en }` value, falling back to Italian. */
export function t<T extends { it: string; en: string }>(value: T | null | undefined, locale: Locale): string {
  if (!value) return '';
  return value[locale] || value.it || '';
}

export function tList(
  value: { it: string[]; en: string[] } | null | undefined,
  locale: Locale,
): string[] {
  if (!value) return [];
  const list = value[locale];
  return list && list.length ? list : (value.it ?? []);
}

/** Formats whole euro amounts the Italian way: 1.850 €. */
export function formatEuro(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === 'it' ? 'it-IT' : 'en-GB', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(value: Date | string | null, locale: Locale): string {
  if (!value) return '—';
  const date = typeof value === 'string' ? new Date(`${value}T00:00:00`) : value;
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(locale === 'it' ? 'it-IT' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
