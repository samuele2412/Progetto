/** Join class names, skipping falsy values. */
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

/**
 * "Bartender privato · Roma e provincia": the space before each dot made
 * unbreakable, so a narrow screen breaks the line after the dot and never
 * starts the next line with it.
 */
export function keepSeparators(text: string): string {
  return text.replace(/ · /g, '\u00a0· ');
}

/**
 * Articles, prepositions, conjunctions and the unstressed pronouns that lean on
 * the verb after them ("Ti preparo", "li porto"), Italian and English: the
 * words a compositor never leaves at the end of a line, where they read as a
 * sentence stopping half-way ("Dal compleanno in / casa").
 */
const BOUND_WORDS = new Set(
  (
    'a ad al allo alla ai agli alle da dal dallo dalla dai dagli dalle di del dello della dei degli delle ' +
    'in nel nello nella nei negli nelle su sul sullo sulla sui sugli sulle con col per tra fra ' +
    'il lo la i gli le un uno una e ed o od ma né se che non è mi ti ci vi si ne li ' +
    'an the of to on at by for and or but nor as is my our your no not'
  ).split(' '),
);

/**
 * Display copy, set by hand: each short word in BOUND_WORDS, and each number,
 * travels to the next line with the word it introduces (a no-break space), and
 * the separator dots stay off the start of a line. Nothing else changes, so it
 * is safe on any heading or lede; the stored text is left as written.
 */
export function typeset(text: string | null | undefined): string {
  // The columns and steps come from the database as written: a missing field
  // renders as nothing, as it did before, rather than failing the page.
  if (!text) return '';
  return keepSeparators(text).replace(/(?<=^|[\s(“‘"«])([\p{L}\d’']+) +(?=\S)/gu, (match, word: string) =>
    BOUND_WORDS.has(word.toLowerCase()) || /^\d+$/.test(word) ? `${word}\u00a0` : match,
  );
}

/** Turn free text into a URL-safe slug (accents folded, punctuation dropped). */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 140);
}

/** Short, unambiguous reference shown to clients (no 0/O/1/I confusion). */
export function makeReference(): string {
  const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  let out = '';
  for (const b of bytes) out += alphabet[b % alphabet.length];
  return `RQ-${out}`;
}

/**
 * Normalises a phone number to the digits-with-country-code form wa.me needs.
 *
 * Visitors type "333 1234567" far more often than "+39 333 1234567", and the
 * bare number reads as country code 33 — France. Anything already carrying a
 * country code (a leading + or 00) is left alone; a national number is given
 * the configured default prefix.
 */
export function toWhatsappNumber(input: string, defaultCountryCode = '39'): string {
  const trimmed = input.trim();
  if (trimmed.startsWith('+')) return trimmed.replace(/\D/g, '');

  const digits = trimmed.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('00')) return digits.slice(2);
  // Already prefixed (e.g. "39333…") — leave it be.
  if (digits.startsWith(defaultCountryCode) && digits.length > 10) return digits;
  return `${defaultCountryCode}${digits.replace(/^0+/, '')}`;
}

/**
 * Builds a wa.me link, or an empty string when there is no usable number —
 * a bare `wa.me/?text=…` opens WhatsApp with no recipient, which looks broken.
 * Callers check for '' and hide the button.
 */
export function whatsappLink(number: string, message: string, defaultCountryCode = '39'): string {
  if (isPlaceholder(number)) return '';
  const digits = toWhatsappNumber(number, defaultCountryCode);
  if (digits.length < 8) return '';
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function telLink(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

/** True when a setting still holds its shipped placeholder. */
export function isPlaceholder(value: string | undefined | null): boolean {
  return !value || /_HERE$|^PLACEHOLDER/i.test(value.trim());
}
