/**
 * Shared option lists for the request form. Imported by both the client form
 * and the server validator, so the two can never drift apart.
 */
import type { Locale } from './i18n';

export const guestRanges = ['10-20', '20-30', '30-50', '50-70', '70-100', '100+'] as const;
export type GuestRange = (typeof guestRanges)[number];

export const guestRangeLabels: Record<GuestRange, Record<Locale, string>> = {
  '10-20': { it: '10–20 ospiti', en: '10–20 guests' },
  '20-30': { it: '20–30 ospiti', en: '20–30 guests' },
  '30-50': { it: '30–50 ospiti', en: '30–50 guests' },
  '50-70': { it: '50–70 ospiti', en: '50–70 guests' },
  '70-100': { it: '70–100 ospiti', en: '70–100 guests' },
  '100+': { it: 'Più di 100 ospiti', en: 'More than 100 guests' },
};

/** Which package we pre-select for a given crowd size. */
export const suggestedPackageFor: Record<GuestRange, string> = {
  '10-20': 'aperitivo',
  '20-30': 'signature',
  '30-50': 'signature',
  '50-70': 'prestige',
  '70-100': 'prestige',
  '100+': 'su-misura',
};

export const cocktailPreferences = [
  'classics',
  'fresh',
  'signature',
  'bubbles',
  'zero',
  'surprise',
] as const;
export type CocktailPreference = (typeof cocktailPreferences)[number];

export const cocktailPreferenceLabels: Record<CocktailPreference, Record<Locale, string>> = {
  classics: { it: 'Grandi classici', en: 'The classics' },
  fresh: { it: 'Freschi e dissetanti', en: 'Fresh and refreshing' },
  signature: { it: 'Signature della casa', en: 'House signatures' },
  bubbles: { it: 'Bollicine e brindisi', en: 'Bubbles and toasts' },
  zero: { it: 'Analcolici curati', en: 'Proper alcohol-free' },
  surprise: { it: 'Scegliete voi', en: 'You choose' },
};

export const serviceModes = ['full_service', 'bar_only', 'undecided'] as const;
export type ServiceMode = (typeof serviceModes)[number];

export const serviceModeLabels: Record<ServiceMode, Record<Locale, string>> = {
  full_service: {
    it: 'Full service — alle bottiglie pensate voi',
    en: 'Full service — you take care of the bottles',
  },
  bar_only: {
    it: 'Solo bar — le bottiglie le fornisco io',
    en: 'Bar only — I supply the bottles',
  },
  undecided: { it: 'Non ho ancora deciso', en: 'Not decided yet' },
};

/**
 * Areas, coarse enough to be useful for pricing travel without asking for a
 * street address at first contact. The exact address is agreed on the phone.
 */
export const areaOptions = [
  'roma-centro',
  'roma-nord',
  'roma-sud',
  'roma-est',
  'roma-ovest',
  'litorale',
  'castelli',
  'provincia',
  'fuori-provincia',
] as const;
export type AreaOption = (typeof areaOptions)[number];

export const areaLabels: Record<AreaOption, Record<Locale, string>> = {
  'roma-centro': { it: 'Roma centro', en: 'Central Rome' },
  'roma-nord': { it: 'Roma nord (Parioli, Flaminio, Cassia…)', en: 'North Rome (Parioli, Flaminio, Cassia…)' },
  'roma-sud': { it: 'Roma sud (EUR, Appia, Garbatella…)', en: 'South Rome (EUR, Appia, Garbatella…)' },
  'roma-est': { it: 'Roma est (Prenestina, Tiburtina…)', en: 'East Rome (Prenestina, Tiburtina…)' },
  'roma-ovest': { it: 'Roma ovest (Aurelio, Boccea…)', en: 'West Rome (Aurelio, Boccea…)' },
  litorale: { it: 'Litorale (Ostia, Fregene, Fiumicino)', en: 'Coast (Ostia, Fregene, Fiumicino)' },
  castelli: { it: 'Castelli Romani', en: 'Castelli Romani' },
  provincia: { it: 'Provincia di Roma', en: 'Province of Rome' },
  'fuori-provincia': { it: 'Fuori provincia', en: 'Outside the province' },
};

export const maxMessageLength = 1200;
