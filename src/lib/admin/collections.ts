import 'server-only';
import {
  addons,
  cocktails,
  eventTypes,
  faqs,
  galleryItems,
  landingPages,
  packages,
  posts,
  testimonials,
} from '@/db/schema';

/**
 * The admin panel is nine near-identical CRUD screens. Rather than writing
 * nine pages and nine actions, each collection is described once — table,
 * fields, labels — and a single generic editor and a single generic action
 * cover all of them. Adding a field is one line here.
 */
export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'select'
  | 'localized'
  | 'localizedText'
  | 'localizedBody'
  | 'localizedList'
  | 'image';

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  hint?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  /** Layout hint: half-width on wide screens. */
  half?: boolean;
};

export type CollectionDef = {
  key: string;
  /** URL segment under /admin. */
  slug: string;
  title: string;
  description: string;
  table:
    | typeof packages
    | typeof addons
    | typeof cocktails
    | typeof eventTypes
    | typeof faqs
    | typeof testimonials
    | typeof galleryItems
    | typeof landingPages
    | typeof posts;
  /** Column used to build each row's heading in the list. */
  titleField: string;
  orderBy: 'position' | 'publishedAt';
  fields: FieldDef[];
};

const activeField: FieldDef = { name: 'active', label: 'Attivo (visibile sul sito)', type: 'boolean' };
const positionField: FieldDef = { name: 'position', label: 'Ordine', type: 'number', half: true, hint: 'Numero più basso = più in alto' };

export const collections: Record<string, CollectionDef> = {
  pacchetti: {
    key: 'pacchetti',
    slug: 'pacchetti',
    title: 'Pacchetti',
    description: 'Formule mostrate in home, nella pagina Pacchetti e nel configuratore.',
    table: packages,
    titleField: 'name',
    orderBy: 'position',
    fields: [
      { name: 'slug', label: 'Slug', type: 'text', required: true, half: true, hint: 'Usato negli URL: non cambiarlo dopo il lancio' },
      positionField,
      activeField,
      { name: 'highlighted', label: 'Evidenziato ("la più richiesta")', type: 'boolean' },
      { name: 'name', label: 'Nome', type: 'localized', required: true },
      { name: 'kicker', label: 'Sopratitolo', type: 'localized' },
      { name: 'description', label: 'Descrizione', type: 'localizedText' },
      { name: 'guestsMin', label: 'Ospiti da', type: 'number', half: true },
      { name: 'guestsMax', label: 'Ospiti a (vuoto = senza limite)', type: 'number', half: true },
      { name: 'pricePerGuestFrom', label: 'Prezzo a ospite da (€, 0 = su preventivo)', type: 'number', half: true },
      { name: 'minimumTotal', label: 'Minimo evento (€)', type: 'number', half: true },
      { name: 'priceNote', label: 'Nota sul prezzo', type: 'localizedText' },
      { name: 'includes', label: 'Cosa comprende (una voce per riga)', type: 'localizedList' },
      { name: 'excludes', label: 'Non incluso (una voce per riga)', type: 'localizedList' },
      { name: 'imagePath', label: 'Immagine', type: 'image' },
    ],
  },

  extra: {
    key: 'extra',
    slug: 'extra',
    title: 'Extra',
    description: 'Servizi aggiuntivi elencati nella pagina Pacchetti.',
    table: addons,
    titleField: 'name',
    orderBy: 'position',
    fields: [
      { name: 'slug', label: 'Slug', type: 'text', required: true, half: true },
      positionField,
      activeField,
      { name: 'name', label: 'Nome', type: 'localized', required: true },
      { name: 'description', label: 'Descrizione', type: 'localizedText' },
      { name: 'price', label: 'Prezzo (testo libero, es. "da 220 €")', type: 'localized' },
    ],
  },

  cocktail: {
    key: 'cocktail',
    slug: 'cocktail',
    title: 'Cocktail',
    description: 'La carta mostrata in home e nella pagina Cocktail.',
    table: cocktails,
    titleField: 'name',
    orderBy: 'position',
    fields: [
      { name: 'slug', label: 'Slug', type: 'text', required: true, half: true },
      positionField,
      activeField,
      { name: 'featured', label: 'In evidenza (appare in home)', type: 'boolean' },
      { name: 'name', label: 'Nome del cocktail', type: 'text', required: true },
      {
        name: 'category',
        label: 'Categoria',
        type: 'select',
        options: [
          { value: 'classics', label: 'Grandi classici' },
          { value: 'fresh', label: 'Freschi' },
          { value: 'signature', label: 'Signature' },
          { value: 'zero', label: 'Analcolici' },
        ],
      },
      { name: 'ingredients', label: 'Ingredienti (riga singola)', type: 'localized' },
      { name: 'description', label: 'Descrizione', type: 'localizedText' },
      { name: 'imagePath', label: 'Immagine', type: 'image' },
    ],
  },

  eventi: {
    key: 'eventi',
    slug: 'eventi',
    title: 'Tipi di evento',
    description: 'Card della sezione “Per che tipo di serata” e opzioni del configuratore.',
    table: eventTypes,
    titleField: 'name',
    orderBy: 'position',
    fields: [
      { name: 'slug', label: 'Slug', type: 'text', required: true, half: true },
      positionField,
      activeField,
      { name: 'selectable', label: 'Selezionabile nel form richiesta', type: 'boolean' },
      { name: 'name', label: 'Nome', type: 'localized', required: true },
      { name: 'blurb', label: 'Descrizione breve', type: 'localizedText' },
      { name: 'imagePath', label: 'Immagine', type: 'image' },
    ],
  },

  faq: {
    key: 'faq',
    slug: 'faq',
    title: 'FAQ',
    description: 'Domande frequenti. Il “tema” decide su quali pagine appaiono.',
    table: faqs,
    titleField: 'question',
    orderBy: 'position',
    fields: [
      positionField,
      activeField,
      {
        name: 'topic',
        label: 'Tema',
        type: 'select',
        half: true,
        options: [
          { value: 'general', label: 'Generale (home + FAQ)' },
          { value: 'pricing', label: 'Prezzi (pagina Pacchetti)' },
          { value: 'wedding', label: 'Matrimoni' },
          { value: 'corporate', label: 'Eventi aziendali' },
        ],
      },
      { name: 'question', label: 'Domanda', type: 'localized', required: true },
      { name: 'answer', label: 'Risposta', type: 'localizedText' },
    ],
  },

  recensioni: {
    key: 'recensioni',
    slug: 'recensioni',
    title: 'Recensioni',
    description: 'Pubblica solo recensioni reali. Restano nascoste finché non le attivi.',
    table: testimonials,
    titleField: 'authorName',
    orderBy: 'position',
    fields: [
      positionField,
      activeField,
      { name: 'authorName', label: 'Nome di chi ha scritto', type: 'text', required: true, half: true },
      { name: 'rating', label: 'Voto (1–5)', type: 'number', half: true },
      { name: 'eventDate', label: 'Data dell’evento', type: 'date', half: true },
      { name: 'eventLabel', label: 'Tipo di evento (es. “Compleanno, Roma nord”)', type: 'localized' },
      { name: 'quote', label: 'Testo della recensione', type: 'localizedText' },
      { name: 'imagePath', label: 'Foto (facoltativa)', type: 'image' },
    ],
  },

  galleria: {
    key: 'galleria',
    slug: 'galleria',
    title: 'Galleria',
    description: 'Poche foto buone valgono più di quaranta mediocri.',
    table: galleryItems,
    titleField: 'imagePath',
    orderBy: 'position',
    fields: [
      positionField,
      activeField,
      { name: 'imagePath', label: 'Immagine', type: 'image', required: true },
      { name: 'tag', label: 'Tag (es. setup, cocktail, villa)', type: 'text', half: true },
      { name: 'alt', label: 'Testo alternativo (accessibilità)', type: 'localized', required: true },
      { name: 'caption', label: 'Didascalia', type: 'localized' },
    ],
  },

  landing: {
    key: 'landing',
    slug: 'landing',
    title: 'Pagine SEO',
    description:
      'Pagine dedicate a una ricerca specifica. Scrivi contenuti realmente diversi: pagine quasi identiche danneggiano il posizionamento.',
    table: landingPages,
    titleField: 'heroTitle',
    orderBy: 'position',
    fields: [
      { name: 'key', label: 'Chiave interna', type: 'text', required: true, half: true },
      positionField,
      activeField,
      { name: 'inNavigation', label: 'Mostra nel menu “Eventi”', type: 'boolean' },
      { name: 'slugIt', label: 'Slug italiano', type: 'text', required: true, half: true },
      { name: 'slugEn', label: 'Slug inglese', type: 'text', required: true, half: true },
      { name: 'heroTitle', label: 'Titolo (H1)', type: 'localized', required: true },
      { name: 'heroSubtitle', label: 'Sottotitolo', type: 'localizedText' },
      { name: 'heroImagePath', label: 'Immagine hero', type: 'image' },
      { name: 'highlights', label: 'Punti chiave (una voce per riga)', type: 'localizedList' },
      { name: 'body', label: 'Contenuto', type: 'localizedBody', hint: 'Markdown: ## titolo, - elenco, **grassetto**' },
      { name: 'recommendedPackage', label: 'Slug del pacchetto consigliato', type: 'text', half: true },
      { name: 'eventTypeSlug', label: 'Slug del tipo di evento', type: 'text', half: true },
      { name: 'faqTopic', label: 'Tema FAQ da mostrare', type: 'text', half: true },
      { name: 'seoTitle', label: 'Title SEO', type: 'localized' },
      { name: 'seoDescription', label: 'Meta description', type: 'localizedText' },
    ],
  },

  journal: {
    key: 'journal',
    slug: 'journal',
    title: 'Journal',
    description: 'Articoli che intercettano ricerche informative ("quanto costa…", "quanti cocktail…").',
    table: posts,
    titleField: 'title',
    orderBy: 'publishedAt',
    fields: [
      { name: 'published', label: 'Pubblicato', type: 'boolean' },
      { name: 'publishedAt', label: 'Data di pubblicazione', type: 'datetime', half: true },
      { name: 'slugIt', label: 'Slug italiano', type: 'text', required: true, half: true },
      { name: 'slugEn', label: 'Slug inglese', type: 'text', required: true, half: true },
      { name: 'title', label: 'Titolo', type: 'localized', required: true },
      { name: 'excerpt', label: 'Sommario', type: 'localizedText' },
      { name: 'coverImagePath', label: 'Immagine di copertina', type: 'image' },
      { name: 'body', label: 'Testo', type: 'localizedBody', hint: 'Markdown: ## titolo, - elenco, **grassetto**' },
      { name: 'seoTitle', label: 'Title SEO', type: 'localized' },
      { name: 'seoDescription', label: 'Meta description', type: 'localizedText' },
    ],
  },
};

export const collectionList = Object.values(collections);

export function getCollection(slug: string): CollectionDef | null {
  return collections[slug] ?? null;
}
