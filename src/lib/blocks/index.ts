import type { PublishedSection } from '@/db/schema';
import { getBlockDefinition, isBlockType } from './registry';

export * from './common';
export * from './registry';
export type { BlockField, FieldGroup, SelectOption, CatalogueSource } from './fields';

/**
 * The gate between the panel and the site.
 *
 * Every configuration crosses it twice: once on the way into the database, so
 * nothing invalid is ever stored, and once on the way out, so a row written by
 * an older version of the panel — or edited directly in psql — still cannot
 * reach a server component in a shape it does not expect.
 *
 * Parsing on read is the part that is easy to skip and expensive to skip: a
 * server component that destructures a missing key throws, and a throw during
 * render is a 500 on a public page.
 */
export type ParsedBlock = {
  id: number;
  type: string;
  config: Record<string, unknown>;
};

/** Validates a configuration for storage. Returns the issues, never throws. */
export function validateBlockConfig(
  type: string,
  config: unknown,
): { ok: true; config: Record<string, unknown> } | { ok: false; errors: string[] } {
  const definition = getBlockDefinition(type);
  if (!definition) return { ok: false, errors: [`Tipo di sezione sconosciuto: ${type}`] };

  const result = definition.schema.safeParse(config ?? {});
  if (result.success) return { ok: true, config: result.data };

  return {
    ok: false,
    errors: result.error.issues.map((issue) => {
      const where = issue.path.join('.');
      return where ? `${where}: ${describeIssue(issue.message)}` : describeIssue(issue.message);
    }),
  };
}

/** Turns the schema's internal codes into something the panel can show. */
function describeIssue(message: string): string {
  if (message === 'link_unsafe') return 'il link non è valido (ammessi http, https, mailto, tel o un percorso del sito)';
  if (message === 'image_path_invalid') return 'l’immagine deve venire dalla libreria del sito';
  return message;
}

/**
 * Reads a stored configuration back, filling in whatever is missing.
 *
 * Returns null only for a type that no longer exists in the registry — a block
 * removed by an update. The renderer skips those rather than failing the page.
 */
export function parseBlockConfig(type: string, config: unknown): Record<string, unknown> | null {
  const definition = getBlockDefinition(type);
  if (!definition) return null;

  const result = definition.schema.safeParse(config ?? {});
  if (result.success) return result.data;

  // A stored config that no longer fits its schema still has to render: parsing
  // an empty object gives every field its default, which is a block that looks
  // empty in the panel rather than a page that 500s.
  const fallback = definition.schema.safeParse({});
  return fallback.success ? fallback.data : null;
}

/** Default configuration for a freshly added block. */
export function defaultBlockConfig(type: string): Record<string, unknown> | null {
  return parseBlockConfig(type, {});
}

/**
 * Prepares the sections of a published snapshot for rendering: unknown types
 * dropped, everything else parsed against its current schema.
 */
export function parseSections(sections: PublishedSection[] | undefined | null): ParsedBlock[] {
  if (!Array.isArray(sections)) return [];
  const out: ParsedBlock[] = [];
  for (const section of sections) {
    if (!section || typeof section.type !== 'string' || !isBlockType(section.type)) continue;
    const config = parseBlockConfig(section.type, section.config);
    if (!config) continue;
    out.push({ id: Number(section.id) || out.length, type: section.type, config });
  }
  return out;
}
