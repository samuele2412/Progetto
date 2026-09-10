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
 * Builds a wa.me link. `number` is digits only with country code (39…);
 * the placeholder value is passed through so the UI can spot it and warn.
 */
export function whatsappLink(number: string, message: string): string {
  const digits = number.replace(/\D/g, '');
  const text = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${text}`;
}

export function telLink(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

/** True when a setting still holds its shipped placeholder. */
export function isPlaceholder(value: string | undefined | null): boolean {
  return !value || /_HERE$|^PLACEHOLDER/i.test(value.trim());
}
