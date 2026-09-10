/** Join class names, skipping falsy values. */
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
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
