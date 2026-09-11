import { z } from 'zod';
import {
  alignSchema,
  backgroundSchema,
  columnsSchema,
  emptyImage,
  emptyLink,
  emptyLocalized,
  headingSchema,
  heightSchema,
  imagePositionSchema,
  imageSchema,
  linkSchema,
  localizedSchema,
  overlaySchema,
  ratioSchema,
  slugListSchema,
  sourceSchema,
  widthSchema,
} from './common';
import type { BlockField, FieldGroup } from './fields';

/**
 * The block catalogue: the single place that decides what a page can be made
 * of. Everything else — the "+ Aggiungi sezione" list, the edit drawer, the
 * server-side validation and the renderer — is driven from here.
 *
 * A block is defined by four things:
 *   schema    what a valid configuration looks like (zod, with defaults)
 *   defaults  what you get when you add one
 *   groups    how the panel lays out its form
 *   meta      name, description and the family it belongs to
 */

/* -------------------------------------------------------------------------- */
/* Reusable option lists                                                      */
/* -------------------------------------------------------------------------- */

const alignOptions = [
  { value: 'left', label: 'A sinistra' },
  { value: 'center', label: 'Centrato' },
];

const widthOptions = [
  { value: 'boxed', label: 'Normale', hint: 'La larghezza usata dal resto del sito' },
  { value: 'narrow', label: 'Stretto', hint: 'Colonna di lettura, buona per testi lunghi' },
  { value: 'full', label: 'Tutta la larghezza' },
];

const backgroundOptions = [
  { value: 'default', label: 'Sfondo base' },
  { value: 'alt', label: 'Sfondo alternato', hint: 'Il grigio scuro che separa due sezioni' },
  { value: 'contrast', label: 'Sfondo in evidenza' },
];

const columnOptions = [
  { value: '2', label: '2 colonne' },
  { value: '3', label: '3 colonne' },
  { value: '4', label: '4 colonne' },
];

const imagePositionOptions = [
  { value: 'left', label: 'Immagine a sinistra' },
  { value: 'right', label: 'Immagine a destra' },
];

const ratioOptions = [
  { value: '50-50', label: '50 / 50' },
  { value: '40-60', label: '40 / 60', hint: 'Immagine più piccola' },
  { value: '60-40', label: '60 / 40', hint: 'Immagine più grande' },
];

const heightOptions = [
  { value: 'short', label: 'Bassa' },
  { value: 'medium', label: 'Media' },
  { value: 'tall', label: 'Alta', hint: 'Quasi tutto lo schermo, come la home' },
];

const overlayOptions = [
  { value: 'none', label: 'Nessuna' },
  { value: 'soft', label: 'Leggera', hint: 'Consigliata: tiene il testo leggibile' },
  { value: 'strong', label: 'Marcata' },
];

const sourceOptions = (auto: string) => [
  { value: 'auto', label: auto },
  { value: 'selected', label: 'Scelgo io quali mostrare' },
];

/** The two layout controls almost every block has. */
const layoutGroup = (extra: BlockField[] = []): FieldGroup => ({
  id: 'layout',
  label: 'Aspetto',
  fields: [
    { kind: 'select', name: 'width', label: 'Larghezza contenuto', options: widthOptions },
    { kind: 'select', name: 'background', label: 'Sfondo', options: backgroundOptions },
    ...extra,
  ],
});

const headerFields: BlockField[] = [
  { kind: 'localizedText', name: 'eyebrow', label: 'Sopratitolo', hint: 'La riga piccola sopra al titolo. Opzionale.' },
  { kind: 'localizedText', name: 'title', label: 'Titolo' },
  { kind: 'localizedTextarea', name: 'intro', label: 'Introduzione', rows: 3 },
];

/** Shared by every block that has a heading and a body above its content. */
const headerSchema = {
  eyebrow: headingSchema,
  title: headingSchema,
  intro: localizedSchema.default(emptyLocalized()),
};

const layoutSchema = {
  width: widthSchema,
  background: backgroundSchema,
};

/* -------------------------------------------------------------------------- */
/* Blocks                                                                     */
/* -------------------------------------------------------------------------- */

export const heroSchema = z.object({
  ...headerSchema,
  image: imageSchema.default(emptyImage()),
  overlay: overlaySchema,
  align: alignSchema,
  height: heightSchema,
  primaryCta: linkSchema.default(emptyLink()),
  secondaryCta: linkSchema.default(emptyLink()),
});

export const textSchema = z.object({
  ...headerSchema,
  ...layoutSchema,
  body: localizedSchema.default(emptyLocalized()),
  align: alignSchema,
  image: imageSchema.default(emptyImage()),
});

export const imageTextSchema = z.object({
  ...layoutSchema,
  eyebrow: headingSchema,
  title: headingSchema,
  body: localizedSchema.default(emptyLocalized()),
  image: imageSchema.default(emptyImage()),
  imagePosition: imagePositionSchema,
  ratio: ratioSchema,
  cta: linkSchema.default(emptyLink()),
});

export const gallerySchema = z.object({
  ...headerSchema,
  ...layoutSchema,
  source: sourceSchema,
  images: z.array(imageSchema).max(40).default([]),
  columns: columnsSchema,
});

export const cocktailsSchema = z.object({
  ...headerSchema,
  ...layoutSchema,
  source: sourceSchema,
  slugs: slugListSchema,
  columns: columnsSchema,
  cta: linkSchema.default(emptyLink()),
});

export const packagesSchema = z.object({
  ...headerSchema,
  ...layoutSchema,
  source: sourceSchema,
  slugs: slugListSchema,
  columns: columnsSchema,
  showPrice: z.boolean().default(true),
  cta: linkSchema.default(emptyLink()),
});

export const testimonialsSchema = z.object({
  ...headerSchema,
  ...layoutSchema,
  source: sourceSchema,
  /**
   * Hand-written entries stay possible, but the panel says out loud that a
   * review must be something a real client actually said.
   */
  items: z
    .array(
      z.object({
        name: z.string().max(120).default(''),
        text: localizedSchema.default(emptyLocalized()),
        rating: z.coerce.number().int().min(1).max(5).default(5),
        image: imageSchema.default(emptyImage()),
      }),
    )
    .max(20)
    .default([]),
});

export const faqSchema = z.object({
  ...headerSchema,
  ...layoutSchema,
  source: sourceSchema,
  topic: z.string().max(60).default('general'),
  items: z
    .array(
      z.object({
        question: localizedSchema.default(emptyLocalized()),
        answer: localizedSchema.default(emptyLocalized()),
      }),
    )
    .max(30)
    .default([]),
});

export const stepsSchema = z.object({
  ...headerSchema,
  ...layoutSchema,
  items: z
    .array(
      z.object({
        title: localizedSchema.default(emptyLocalized()),
        body: localizedSchema.default(emptyLocalized()),
      }),
    )
    .max(8)
    .default([]),
});

export const ctaSchema = z.object({
  title: headingSchema,
  body: localizedSchema.default(emptyLocalized()),
  primaryCta: linkSchema.default(emptyLink()),
  secondaryCta: linkSchema.default(emptyLink()),
  background: backgroundSchema,
});

export const richTextSchema = z.object({
  ...layoutSchema,
  title: headingSchema,
  body: localizedSchema.default(emptyLocalized()),
  align: alignSchema,
});

export const htmlSchema = z.object({
  ...layoutSchema,
  title: headingSchema,
  html: localizedSchema.default(emptyLocalized()),
});

/* -------------------------------------------------------------------------- */
/* Catalogue                                                                  */
/* -------------------------------------------------------------------------- */

export type BlockDefinition = {
  type: string;
  label: string;
  description: string;
  /** Groups the catalogue into families in the "add section" dialog. */
  family: 'intro' | 'contenuto' | 'catalogo' | 'conversione';
  /** A small inline SVG path, drawn by the panel at 24×24. */
  icon: string;
  schema: z.ZodType<Record<string, unknown>>;
  groups: FieldGroup[];
};

const ICONS = {
  hero: 'M3 5h18v9H3zM3 17h10',
  text: 'M4 6h16M4 11h16M4 16h10',
  imageText: 'M3 5h8v14H3zM14 7h7M14 12h7M14 17h4',
  gallery: 'M3 5h8v7H3zM13 5h8v7h-8zM3 14h8v5H3zM13 14h8v5h-8z',
  cocktails: 'M5 4h14l-7 8v7M8 19h8',
  packages: 'M4 7l8-3 8 3-8 3zM4 7v10l8 3 8-3V7',
  testimonials: 'M5 5h14v10H9l-4 4z',
  faq: 'M9 9a3 3 0 1 1 4 2.8V14M12 18h.01',
  steps: 'M4 7h4v4H4zM10 7h10M4 15h4v4H4zM10 17h10',
  cta: 'M4 8h16v8H4zM9 12h6',
  richText: 'M6 4h12M6 9h12M6 14h8M6 19h5',
  html: 'M9 8l-4 4 4 4M15 8l4 4-4 4',
};

export const blockRegistry: Record<string, BlockDefinition> = {
  hero: {
    type: 'hero',
    label: 'Hero',
    description: 'La testata della pagina: immagine, titolo grande e i due bottoni principali.',
    family: 'intro',
    icon: ICONS.hero,
    schema: heroSchema,
    groups: [
      { id: 'content', label: 'Contenuto', fields: headerFields },
      {
        id: 'media',
        label: 'Immagine',
        fields: [
          { kind: 'image', name: 'image', label: 'Immagine di sfondo', hint: 'Senza immagine resta lo sfondo scuro con la grana: è una scelta valida.' },
          { kind: 'select', name: 'overlay', label: 'Velatura sull’immagine', options: overlayOptions },
        ],
      },
      {
        id: 'cta',
        label: 'Bottoni',
        fields: [
          { kind: 'link', name: 'primaryCta', label: 'Bottone principale' },
          { kind: 'link', name: 'secondaryCta', label: 'Bottone secondario', hint: 'Lascialo vuoto per mostrarne uno solo.' },
        ],
      },
      {
        // The hero spans the viewport by definition, so it has no width or
        // background choice — only how tall it is and where the copy sits.
        id: 'layout',
        label: 'Aspetto',
        fields: [
          { kind: 'select', name: 'align', label: 'Allineamento', options: alignOptions },
          { kind: 'select', name: 'height', label: 'Altezza', options: heightOptions },
        ],
      },
    ],
  },

  text: {
    type: 'text',
    label: 'Testo',
    description: 'Un titolo e un testo, con un’immagine opzionale sotto.',
    family: 'contenuto',
    icon: ICONS.text,
    schema: textSchema,
    groups: [
      {
        id: 'content',
        label: 'Contenuto',
        fields: [
          ...headerFields,
          { kind: 'markdown', name: 'body', label: 'Testo', hint: 'Grassetto, corsivo, elenchi, titoli e link. La formattazione segue il design del sito.' },
          { kind: 'image', name: 'image', label: 'Immagine (opzionale)' },
        ],
      },
      layoutGroup([{ kind: 'select', name: 'align', label: 'Allineamento', options: alignOptions }]),
    ],
  },

  imageText: {
    type: 'imageText',
    label: 'Immagine + testo',
    description: 'Due colonne affiancate su desktop, una sopra l’altra sul telefono.',
    family: 'contenuto',
    icon: ICONS.imageText,
    schema: imageTextSchema,
    groups: [
      {
        id: 'content',
        label: 'Contenuto',
        fields: [
          { kind: 'localizedText', name: 'eyebrow', label: 'Sopratitolo' },
          { kind: 'localizedText', name: 'title', label: 'Titolo' },
          { kind: 'markdown', name: 'body', label: 'Testo' },
          { kind: 'image', name: 'image', label: 'Immagine' },
          { kind: 'link', name: 'cta', label: 'Bottone (opzionale)' },
        ],
      },
      layoutGroup([
        { kind: 'select', name: 'imagePosition', label: 'Posizione immagine', options: imagePositionOptions },
        { kind: 'select', name: 'ratio', label: 'Proporzione colonne', options: ratioOptions, hint: 'Sul telefono le colonne si impilano sempre.' },
      ]),
    ],
  },

  gallery: {
    type: 'gallery',
    label: 'Galleria',
    description: 'Una griglia di immagini, dalla galleria del sito o scelte a mano.',
    family: 'contenuto',
    icon: ICONS.gallery,
    schema: gallerySchema,
    groups: [
      { id: 'content', label: 'Contenuto', fields: headerFields },
      {
        id: 'items',
        label: 'Immagini',
        fields: [
          { kind: 'select', name: 'source', label: 'Da dove', options: sourceOptions('Tutte quelle della Galleria') },
          { kind: 'imageList', name: 'images', label: 'Immagini scelte', max: 40, hint: 'Usate solo se hai scelto "Scelgo io".' },
        ],
      },
      layoutGroup([{ kind: 'select', name: 'columns', label: 'Colonne', options: columnOptions }]),
    ],
  },

  cocktails: {
    type: 'cocktails',
    label: 'Griglia cocktail',
    description: 'Prende i cocktail dal catalogo: li aggiorni una volta sola e cambiano ovunque.',
    family: 'catalogo',
    icon: ICONS.cocktails,
    schema: cocktailsSchema,
    groups: [
      { id: 'content', label: 'Contenuto', fields: headerFields },
      {
        id: 'items',
        label: 'Cocktail',
        fields: [
          { kind: 'select', name: 'source', label: 'Quali cocktail', options: sourceOptions('Quelli in evidenza') },
          { kind: 'catalogue', name: 'slugs', label: 'Cocktail scelti', source: 'cocktails' },
          { kind: 'link', name: 'cta', label: 'Bottone sotto la griglia (opzionale)' },
        ],
      },
      layoutGroup([{ kind: 'select', name: 'columns', label: 'Colonne', options: columnOptions }]),
    ],
  },

  packages: {
    type: 'packages',
    label: 'Pacchetti',
    description: 'I pacchetti dal catalogo, con prezzo e bottone di richiesta.',
    family: 'catalogo',
    icon: ICONS.packages,
    schema: packagesSchema,
    groups: [
      { id: 'content', label: 'Contenuto', fields: headerFields },
      {
        id: 'items',
        label: 'Pacchetti',
        fields: [
          { kind: 'select', name: 'source', label: 'Quali pacchetti', options: sourceOptions('Tutti') },
          { kind: 'catalogue', name: 'slugs', label: 'Pacchetti scelti', source: 'packages' },
          { kind: 'toggle', name: 'showPrice', label: 'Mostra il prezzo' },
          { kind: 'link', name: 'cta', label: 'Bottone sotto i pacchetti (opzionale)' },
        ],
      },
      layoutGroup([{ kind: 'select', name: 'columns', label: 'Colonne', options: columnOptions }]),
    ],
  },

  testimonials: {
    type: 'testimonials',
    label: 'Recensioni',
    description: 'Le recensioni salvate nel catalogo, oppure un elenco scritto qui.',
    family: 'conversione',
    icon: ICONS.testimonials,
    schema: testimonialsSchema,
    groups: [
      { id: 'content', label: 'Contenuto', fields: headerFields },
      {
        id: 'items',
        label: 'Recensioni',
        fields: [
          {
            kind: 'select',
            name: 'source',
            label: 'Da dove',
            options: [
              { value: 'auto', label: 'Dal catalogo Recensioni' },
              { value: 'custom', label: 'Le scrivo qui' },
            ],
          },
          {
            kind: 'repeater',
            name: 'items',
            label: 'Recensioni scritte a mano',
            itemLabel: 'Recensione',
            max: 20,
            hint: 'Scrivi solo recensioni che un cliente ti ha davvero lasciato.',
            fields: [
              { kind: 'text', name: 'name', label: 'Nome' },
              { kind: 'localizedTextarea', name: 'text', label: 'Testo', rows: 3 },
            ],
          },
        ],
      },
      layoutGroup(),
    ],
  },

  faq: {
    type: 'faq',
    label: 'FAQ',
    description: 'Domande frequenti, dal catalogo per argomento o scritte qui.',
    family: 'conversione',
    icon: ICONS.faq,
    schema: faqSchema,
    groups: [
      { id: 'content', label: 'Contenuto', fields: headerFields },
      {
        id: 'items',
        label: 'Domande',
        fields: [
          {
            kind: 'select',
            name: 'source',
            label: 'Da dove',
            options: [
              { value: 'auto', label: 'Dal catalogo FAQ' },
              { value: 'custom', label: 'Le scrivo qui' },
            ],
          },
          { kind: 'text', name: 'topic', label: 'Argomento del catalogo', hint: 'Per esempio: general, pricing, logistics.' },
          {
            kind: 'repeater',
            name: 'items',
            label: 'Domande scritte a mano',
            itemLabel: 'Domanda',
            max: 30,
            fields: [
              { kind: 'localizedText', name: 'question', label: 'Domanda' },
              { kind: 'localizedTextarea', name: 'answer', label: 'Risposta', rows: 3 },
            ],
          },
        ],
      },
      layoutGroup(),
    ],
  },

  steps: {
    type: 'steps',
    label: 'Come funziona',
    description: 'Passaggi numerati, come la sezione "come funziona" della home.',
    family: 'contenuto',
    icon: ICONS.steps,
    schema: stepsSchema,
    groups: [
      { id: 'content', label: 'Contenuto', fields: headerFields },
      {
        id: 'items',
        label: 'Passaggi',
        fields: [
          {
            kind: 'repeater',
            name: 'items',
            label: 'Passaggi',
            itemLabel: 'Passaggio',
            max: 8,
            fields: [
              { kind: 'localizedText', name: 'title', label: 'Titolo' },
              { kind: 'localizedTextarea', name: 'body', label: 'Descrizione', rows: 2 },
            ],
          },
        ],
      },
      layoutGroup(),
    ],
  },

  cta: {
    type: 'cta',
    label: 'Chiamata all’azione',
    description: 'Il blocco finale che porta al preventivo o a WhatsApp.',
    family: 'conversione',
    icon: ICONS.cta,
    schema: ctaSchema,
    groups: [
      {
        id: 'content',
        label: 'Contenuto',
        fields: [
          { kind: 'localizedText', name: 'title', label: 'Titolo' },
          { kind: 'localizedTextarea', name: 'body', label: 'Testo', rows: 3 },
          { kind: 'link', name: 'primaryCta', label: 'Bottone principale' },
          { kind: 'link', name: 'secondaryCta', label: 'Bottone secondario' },
        ],
      },
      {
        id: 'layout',
        label: 'Aspetto',
        fields: [{ kind: 'select', name: 'background', label: 'Sfondo', options: backgroundOptions }],
      },
    ],
  },

  richText: {
    type: 'richText',
    label: 'Testo formattato',
    description: 'Un blocco di testo lungo: titoli, elenchi, grassetto, link.',
    family: 'contenuto',
    icon: ICONS.richText,
    schema: richTextSchema,
    groups: [
      {
        id: 'content',
        label: 'Contenuto',
        fields: [
          { kind: 'localizedText', name: 'title', label: 'Titolo' },
          { kind: 'markdown', name: 'body', label: 'Testo' },
        ],
      },
      layoutGroup([{ kind: 'select', name: 'align', label: 'Allineamento', options: alignOptions }]),
    ],
  },

  html: {
    type: 'html',
    label: 'HTML personalizzato',
    description: 'Per casi particolari. Solo i tag della lista consentita vengono mostrati.',
    family: 'contenuto',
    icon: ICONS.html,
    schema: htmlSchema,
    groups: [
      {
        id: 'content',
        label: 'Contenuto',
        fields: [
          { kind: 'localizedText', name: 'title', label: 'Titolo' },
          {
            kind: 'safeHtml',
            name: 'html',
            label: 'HTML',
            hint: 'Consentiti: paragrafi, titoli, grassetto, corsivo, elenchi, link, citazioni e tabelle semplici. Tutto il resto viene ignorato, script compresi.',
          },
        ],
      },
      layoutGroup(),
    ],
  },
};

export const blockTypes = Object.keys(blockRegistry);

export function getBlockDefinition(type: string): BlockDefinition | undefined {
  return Object.prototype.hasOwnProperty.call(blockRegistry, type) ? blockRegistry[type] : undefined;
}

export function isBlockType(type: string): boolean {
  return getBlockDefinition(type) !== undefined;
}

export const blockFamilies: { id: BlockDefinition['family']; label: string }[] = [
  { id: 'intro', label: 'Testata' },
  { id: 'contenuto', label: 'Contenuto' },
  { id: 'catalogo', label: 'Dal catalogo' },
  { id: 'conversione', label: 'Conversione' },
];
