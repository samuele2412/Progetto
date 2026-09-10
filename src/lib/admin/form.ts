import type { FieldDef } from './collections';

// Pure helpers — deliberately not server-only: the field renderer in the admin
// panel is a client component and needs `listToText` too.

/**
 * Turns the flat FormData produced by the generic editor back into a record
 * shaped like the table. Every value is coerced here — nothing typed by hand in
 * a browser is trusted to already be the right shape.
 */
export function parseFormData(fields: FieldDef[], formData: FormData): Record<string, unknown> {
  const record: Record<string, unknown> = {};

  for (const field of fields) {
    switch (field.type) {
      case 'boolean':
        record[field.name] = formData.get(field.name) === 'on';
        break;

      case 'number': {
        const raw = String(formData.get(field.name) ?? '').trim();
        if (raw === '') {
          // `guestsMax` is genuinely nullable; the rest fall back to zero.
          record[field.name] = field.name === 'guestsMax' ? null : 0;
        } else {
          const parsed = Number(raw);
          record[field.name] = Number.isFinite(parsed) ? Math.trunc(parsed) : 0;
        }
        break;
      }

      case 'date': {
        const raw = String(formData.get(field.name) ?? '').trim();
        record[field.name] = raw === '' ? null : raw;
        break;
      }

      case 'datetime': {
        const raw = String(formData.get(field.name) ?? '').trim();
        const parsed = raw ? new Date(raw) : new Date();
        record[field.name] = Number.isNaN(parsed.getTime()) ? new Date() : parsed;
        break;
      }

      case 'localized':
      case 'localizedText':
      case 'localizedBody':
        record[field.name] = {
          it: String(formData.get(`${field.name}.it`) ?? '').trim(),
          en: String(formData.get(`${field.name}.en`) ?? '').trim(),
        };
        break;

      case 'localizedList':
        record[field.name] = {
          it: splitLines(String(formData.get(`${field.name}.it`) ?? '')),
          en: splitLines(String(formData.get(`${field.name}.en`) ?? '')),
        };
        break;

      default:
        record[field.name] = String(formData.get(field.name) ?? '').trim();
    }
  }

  return record;
}

function splitLines(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean);
}

export function listToText(value: unknown): string {
  return Array.isArray(value) ? value.join('\n') : '';
}

/** Basic checks the database would otherwise reject with a 500. */
export function validateRecord(fields: FieldDef[], record: Record<string, unknown>): string | null {
  for (const field of fields) {
    if (!field.required) continue;
    const value = record[field.name];

    if (field.type === 'localized' || field.type === 'localizedText' || field.type === 'localizedBody') {
      const localized = value as { it?: string } | undefined;
      if (!localized?.it) return `Il campo “${field.label}” è obbligatorio (almeno in italiano).`;
      continue;
    }
    if (typeof value === 'string' && value.trim() === '') {
      return `Il campo “${field.label}” è obbligatorio.`;
    }
  }

  const slug = record.slug ?? record.slugIt ?? record.key;
  if (typeof slug === 'string' && slug && !/^[a-z0-9-]+$/.test(slug)) {
    return 'Gli slug possono contenere solo lettere minuscole, numeri e trattini.';
  }
  return null;
}
