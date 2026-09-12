import { z } from 'zod';
import { locales } from '@/lib/i18n';

/**
 * The pieces every block is built from.
 *
 * Two rules hold everywhere in here and are what keep the page builder from
 * being able to break the site:
 *
 *  1. Anything the owner types is *content*. There is no field anywhere that
 *     accepts a class name, a style, a colour or a size in raw form — layout is
 *     always a choice from a fixed list, so the design system stays in charge.
 *  2. Every schema has a default for every field. A block saved by an older
 *     version of the panel, or a config that lost a key, still parses and still
 *     renders instead of throwing inside a server component.
 */

/** Translatable copy, matching the `{ it, en }` jsonb used by every table. */
export const localizedSchema = z.object({
  it: z.string().max(4000).default(''),
  en: z.string().max(4000).default(''),
});
export type LocalizedValue = z.infer<typeof localizedSchema>;

export const emptyLocalized = (): LocalizedValue => ({ it: '', en: '' });

/**
 * A link the owner can point anywhere on the site — or at a phone number, an
 * email or an external page.
 *
 * `javascript:`, `data:` and `vbscript:` are rejected rather than cleaned:
 * there is no legitimate reason for the panel to produce one, and a scheme
 * allow-list is a rule you can read, unlike a blocklist you have to trust.
 */
const SAFE_SCHEME = /^(https?:|mailto:|tel:)/i;

export function isSafeHref(value: string): boolean {
  const href = value.trim();
  if (!href) return true; // empty means "no link", handled by the renderer
  // Relative URLs are the common case: /it/pacchetti, #prezzi, ?evento=laurea
  if (href.startsWith('/') || href.startsWith('#') || href.startsWith('?')) {
    // "//evil.example" is protocol-relative, i.e. off-site wearing a disguise.
    return !href.startsWith('//');
  }
  return SAFE_SCHEME.test(href);
}

export const hrefSchema = z
  .string()
  .max(400)
  .default('')
  .refine(isSafeHref, { message: 'link_unsafe' });

export const linkSchema = z.object({
  label: localizedSchema.default(emptyLocalized()),
  href: hrefSchema,
});
export type LinkValue = z.infer<typeof linkSchema>;

export const emptyLink = (): LinkValue => ({ label: emptyLocalized(), href: '' });

/**
 * A path into /uploads or /images. Absolute URLs are refused on purpose: an
 * image from someone else's server would escape next/image, the CSP and the
 * backup, and would break the day that server goes away.
 */
export const imagePathSchema = z
  .string()
  .max(300)
  .default('')
  .refine((value) => value === '' || /^\/(uploads|images)\/[\w\-./]+$/.test(value), {
    message: 'image_path_invalid',
  });

export const imageSchema = z.object({
  path: imagePathSchema,
  alt: localizedSchema.default(emptyLocalized()),
});
export type ImageValue = z.infer<typeof imageSchema>;

export const emptyImage = (): ImageValue => ({ path: '', alt: emptyLocalized() });

/* -------------------------------------------------------------------------- */
/* Layout vocabularies                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Every layout choice is one of these closed lists. They are deliberately
 * coarse: the point is to let the owner rearrange a page, not to hand them a
 * CSS editor that can produce something the mobile layout has never seen.
 */
export const alignValues = ['left', 'center'] as const;
export const widthValues = ['boxed', 'narrow', 'full'] as const;
export const backgroundValues = ['default', 'alt', 'contrast'] as const;
export const columnValues = ['2', '3', '4'] as const;
export const heightValues = ['short', 'medium', 'tall'] as const;
export const imagePositionValues = ['left', 'right'] as const;
/** Desktop split; every ratio collapses to one column on a phone. */
export const ratioValues = ['50-50', '40-60', '60-40'] as const;
export const overlayValues = ['none', 'soft', 'strong'] as const;

export const alignSchema = z.enum(alignValues).default('left');
export const widthSchema = z.enum(widthValues).default('boxed');
export const backgroundSchema = z.enum(backgroundValues).default('default');
export const columnsSchema = z.enum(columnValues).default('3');
export const heightSchema = z.enum(heightValues).default('medium');
export const imagePositionSchema = z.enum(imagePositionValues).default('left');
export const ratioSchema = z.enum(ratioValues).default('50-50');
export const overlaySchema = z.enum(overlayValues).default('soft');

export type Align = (typeof alignValues)[number];
export type Width = (typeof widthValues)[number];
export type Background = (typeof backgroundValues)[number];
export type Columns = (typeof columnValues)[number];

/** Where a block gets its items: the catalogue, a hand-picked subset, or both. */
export const sourceValues = ['auto', 'selected', 'custom'] as const;
export const sourceSchema = z.enum(sourceValues).default('auto');

/** Slugs of catalogue rows chosen by hand in the panel. */
export const slugListSchema = z.array(z.string().max(120)).max(60).default([]);

/** Guards the localised text used in a heading — one line, no markdown. */
export const headingSchema = localizedSchema.default(emptyLocalized());

export const localeKeys = locales;
