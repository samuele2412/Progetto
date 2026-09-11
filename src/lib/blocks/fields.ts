/**
 * Declarative description of a block's editing form.
 *
 * The panel renders these instead of a hand-written form per block, which is
 * what stops the catalogue and the UI from drifting apart: adding an option to
 * a block means adding one entry here, and the drawer, the validation and the
 * renderer all pick it up.
 *
 * Plain data on purpose — no JSX, no functions — so the same definitions can be
 * read on the server (validation) and shipped to the client (the editor).
 */
export type SelectOption = { value: string; label: string; hint?: string };

export type BlockField =
  /** One line of copy per language. */
  | { kind: 'localizedText'; name: string; label: string; hint?: string; placeholder?: string }
  /** One line that is the same in every language — a person's name, a slug. */
  | { kind: 'text'; name: string; label: string; hint?: string; placeholder?: string }
  /** A paragraph per language. `rich` turns on the markdown toolbar. */
  | { kind: 'localizedTextarea'; name: string; label: string; hint?: string; rows?: number; rich?: boolean }
  /** An image chosen from the media library. */
  | { kind: 'image'; name: string; label: string; hint?: string }
  /** An ordered set of images. */
  | { kind: 'imageList'; name: string; label: string; hint?: string; max?: number }
  /** A button: localised label + destination. */
  | { kind: 'link'; name: string; label: string; hint?: string }
  /** A layout choice from a closed list. */
  | { kind: 'select'; name: string; label: string; options: SelectOption[]; hint?: string }
  | { kind: 'toggle'; name: string; label: string; hint?: string }
  /** Hand-picked rows from an existing catalogue table. */
  | { kind: 'catalogue'; name: string; label: string; source: CatalogueSource; hint?: string }
  /** A short list of sub-items, each with its own fields. */
  | { kind: 'repeater'; name: string; label: string; fields: BlockField[]; max: number; itemLabel: string; hint?: string }
  /** Markdown body with the restricted toolbar. */
  | { kind: 'markdown'; name: string; label: string; hint?: string }
  /** The escape hatch, parsed against an allow-list before it is ever shown. */
  | { kind: 'safeHtml'; name: string; label: string; hint?: string };

/** Catalogue tables a block can pull live rows from. */
export type CatalogueSource = 'cocktails' | 'packages' | 'faqs' | 'testimonials' | 'gallery';

/** Groups the fields into tabs so a long block is not one endless column. */
export type FieldGroup = {
  id: string;
  label: string;
  fields: BlockField[];
};
