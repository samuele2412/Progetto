/**
 * Database schema — PostgreSQL via Drizzle ORM.
 *
 * Design notes
 * ------------
 * 1. Translatable copy is stored as jsonb `{ it, en }` instead of two columns
 *    per field. It keeps the tables narrow, makes the admin forms generic and
 *    means adding a third language later is a data change, not a migration.
 * 2. Nothing here stores more personal data than is needed to call a client
 *    back about their party (GDPR data minimisation — see docs/09-gdpr.md).
 * 3. Everything the owner may want to reword lives in the database, not in the
 *    code, so the admin panel can edit it without a redeploy.
 */
import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

/** A short piece of copy in every supported language. */
export type Localized = { it: string; en: string };
/** A bullet list in every supported language. */
export type LocalizedList = { it: string[]; en: string[] };

const localized = (name: string) => jsonb(name).$type<Localized>().notNull();
const localizedList = (name: string) => jsonb(name).$type<LocalizedList>().notNull();

/* -------------------------------------------------------------------------- */
/* Enums                                                                      */
/* -------------------------------------------------------------------------- */

export const requestStatusEnum = pgEnum('request_status', [
  'new',
  'contacted',
  'quoted',
  'confirmed',
  'completed',
  'lost',
]);

export const cocktailCategoryEnum = pgEnum('cocktail_category', [
  'classics',
  'fresh',
  'signature',
  'zero',
]);

export const serviceModeEnum = pgEnum('service_mode', ['full_service', 'bar_only', 'undecided']);

/* -------------------------------------------------------------------------- */
/* Admin & configuration                                                      */
/* -------------------------------------------------------------------------- */

export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 120 }).notNull().default(''),
  passwordHash: text('password_hash').notNull(),
  /** Bumped on password change so every existing session cookie is invalidated. */
  sessionVersion: integer('session_version').notNull().default(1),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Free-form site configuration (brand name, contacts, hero copy, SEO defaults…).
 * One row per key; the value shape is validated in `src/lib/settings.ts`.
 */
export const settings = pgTable('settings', {
  key: varchar('key', { length: 120 }).primaryKey(),
  value: jsonb('value').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

/* -------------------------------------------------------------------------- */
/* Catalogue                                                                  */
/* -------------------------------------------------------------------------- */

export const packages = pgTable('packages', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 80 }).notNull().unique(),
  position: integer('position').notNull().default(0),
  active: boolean('active').notNull().default(true),
  /** Renders the "most requested" ribbon. Only one package should carry it. */
  highlighted: boolean('highlighted').notNull().default(false),

  name: localized('name'),
  /** Small line above the name, e.g. "Cene e aperitivi in casa". */
  kicker: localized('kicker'),
  description: localized('description'),

  guestsMin: integer('guests_min').notNull().default(0),
  guestsMax: integer('guests_max'),

  /** "a partire da" price per guest, in whole euro. */
  pricePerGuestFrom: integer('price_per_guest_from').notNull().default(0),
  /** Smallest total the owner will take on for this formula, in whole euro. */
  minimumTotal: integer('minimum_total').notNull().default(0),
  priceNote: localized('price_note'),

  includes: localizedList('includes'),
  /** Shown greyed-out to make the ladder between formulas obvious. */
  excludes: localizedList('excludes'),

  imagePath: varchar('image_path', { length: 300 }).notNull().default(''),
});

export const addons = pgTable('addons', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 80 }).notNull().unique(),
  position: integer('position').notNull().default(0),
  active: boolean('active').notNull().default(true),
  name: localized('name'),
  description: localized('description'),
  /** Human-readable price ("da 180 €", "25 €/ospite") — kept as copy on purpose. */
  price: localized('price'),
});

export const cocktails = pgTable(
  'cocktails',
  {
    id: serial('id').primaryKey(),
    slug: varchar('slug', { length: 80 }).notNull().unique(),
    position: integer('position').notNull().default(0),
    active: boolean('active').notNull().default(true),
    featured: boolean('featured').notNull().default(false),
    category: cocktailCategoryEnum('category').notNull().default('classics'),
    /** Cocktail names are proper nouns — one string, not translated. */
    name: varchar('name', { length: 120 }).notNull(),
    /** Ingredient line, e.g. "Gin, Campari, vermouth rosso". */
    ingredients: localized('ingredients'),
    description: localized('description'),
    imagePath: varchar('image_path', { length: 300 }).notNull().default(''),
  },
  (t) => [index('cocktails_category_idx').on(t.category)],
);

export const eventTypes = pgTable('event_types', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 80 }).notNull().unique(),
  position: integer('position').notNull().default(0),
  active: boolean('active').notNull().default(true),
  /** Offered in the request form's "tipo di evento" select. */
  selectable: boolean('selectable').notNull().default(true),
  name: localized('name'),
  blurb: localized('blurb'),
  imagePath: varchar('image_path', { length: 300 }).notNull().default(''),
});

/* -------------------------------------------------------------------------- */
/* Editorial                                                                  */
/* -------------------------------------------------------------------------- */

export const faqs = pgTable('faqs', {
  id: serial('id').primaryKey(),
  position: integer('position').notNull().default(0),
  active: boolean('active').notNull().default(true),
  /** Grouping key so a landing page can show only its own questions. */
  topic: varchar('topic', { length: 60 }).notNull().default('general'),
  question: localized('question'),
  answer: localized('answer'),
});

export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  position: integer('position').notNull().default(0),
  /** Off by default: nothing is published until a real review exists. */
  active: boolean('active').notNull().default(false),
  authorName: varchar('author_name', { length: 120 }).notNull(),
  rating: integer('rating').notNull().default(5),
  eventLabel: localized('event_label'),
  quote: localized('quote'),
  imagePath: varchar('image_path', { length: 300 }).notNull().default(''),
  eventDate: date('event_date'),
});

export const galleryItems = pgTable('gallery_items', {
  id: serial('id').primaryKey(),
  position: integer('position').notNull().default(0),
  active: boolean('active').notNull().default(true),
  imagePath: varchar('image_path', { length: 300 }).notNull(),
  alt: localized('alt'),
  caption: localized('caption'),
  /** Free tag used by the gallery filter ("setup", "cocktail", "villa"…). */
  tag: varchar('tag', { length: 60 }).notNull().default(''),
});

/**
 * Hand-written SEO landing pages ("cocktail bar matrimonio Roma"…).
 * Deliberately a table and not a generator: Google should see pages somebody
 * actually wrote, not twenty near-duplicates.
 */
export const landingPages = pgTable(
  'landing_pages',
  {
    id: serial('id').primaryKey(),
    key: varchar('key', { length: 80 }).notNull().unique(),
    position: integer('position').notNull().default(0),
    active: boolean('active').notNull().default(true),
    /** Shown in the "Eventi" menu; PPC-only landings stay out of it. */
    inNavigation: boolean('in_navigation').notNull().default(true),
    slugIt: varchar('slug_it', { length: 140 }).notNull(),
    slugEn: varchar('slug_en', { length: 140 }).notNull(),

    heroTitle: localized('hero_title'),
    heroSubtitle: localized('hero_subtitle'),
    heroImagePath: varchar('hero_image_path', { length: 300 }).notNull().default(''),
    /** Markdown-ish body: `## heading`, paragraphs, `- bullets`. */
    body: localized('body'),
    /** Bullet list rendered as the "cosa comprende" block. */
    highlights: localizedList('highlights'),

    seoTitle: localized('seo_title'),
    seoDescription: localized('seo_description'),
    /** Slug of the package pushed as "consigliato" on this page. */
    recommendedPackage: varchar('recommended_package', { length: 80 }).notNull().default(''),
    /** Pre-selects the event type when the CTA opens the request form. */
    eventTypeSlug: varchar('event_type_slug', { length: 80 }).notNull().default(''),
    faqTopic: varchar('faq_topic', { length: 60 }).notNull().default('general'),
  },
  (t) => [
    uniqueIndex('landing_slug_it_idx').on(t.slugIt),
    uniqueIndex('landing_slug_en_idx').on(t.slugEn),
  ],
);

export const posts = pgTable(
  'posts',
  {
    id: serial('id').primaryKey(),
    slugIt: varchar('slug_it', { length: 160 }).notNull(),
    slugEn: varchar('slug_en', { length: 160 }).notNull(),
    published: boolean('published').notNull().default(false),
    publishedAt: timestamp('published_at', { withTimezone: true }).notNull().defaultNow(),
    title: localized('title'),
    excerpt: localized('excerpt'),
    body: localized('body'),
    coverImagePath: varchar('cover_image_path', { length: 300 }).notNull().default(''),
    seoTitle: localized('seo_title'),
    seoDescription: localized('seo_description'),
  },
  (t) => [
    uniqueIndex('posts_slug_it_idx').on(t.slugIt),
    uniqueIndex('posts_slug_en_idx').on(t.slugEn),
  ],
);

/* -------------------------------------------------------------------------- */
/* Leads                                                                      */
/* -------------------------------------------------------------------------- */

export type RequestSource = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referrer?: string;
  landingPath?: string;
};

export type StatusChange = { status: string; at: string; by: string };

export const eventRequests = pgTable(
  'event_requests',
  {
    id: serial('id').primaryKey(),
    /** Human reference quoted in emails and on the phone, e.g. "RQ-4F7K2". */
    reference: varchar('reference', { length: 16 }).notNull().unique(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    status: requestStatusEnum('status').notNull().default('new'),

    // Contact — the minimum needed to call the client back.
    name: varchar('name', { length: 160 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 40 }).notNull(),
    prefersWhatsapp: boolean('prefers_whatsapp').notNull().default(true),

    // Event
    eventDate: date('event_date'),
    dateFlexible: boolean('date_flexible').notNull().default(false),
    eventTypeSlug: varchar('event_type_slug', { length: 80 }).notNull().default(''),
    area: varchar('area', { length: 120 }).notNull().default(''),
    venueNote: varchar('venue_note', { length: 200 }).notNull().default(''),
    guestsRange: varchar('guests_range', { length: 20 }).notNull().default(''),
    packageSlug: varchar('package_slug', { length: 80 }).notNull().default(''),
    serviceMode: serviceModeEnum('service_mode').notNull().default('full_service'),
    /** Selected cocktail styles, e.g. ["classics","fresh"]. */
    preferences: jsonb('preferences').$type<string[]>().notNull().default([]),
    message: text('message').notNull().default(''),

    // Consent & provenance
    locale: varchar('locale', { length: 5 }).notNull().default('it'),
    consentPrivacy: boolean('consent_privacy').notNull().default(false),
    consentPrivacyAt: timestamp('consent_privacy_at', { withTimezone: true }),
    source: jsonb('source').$type<RequestSource>().notNull().default({}),

    // Internal
    adminNotes: text('admin_notes').notNull().default(''),
    /** Owner's own estimate in whole euro, powers the dashboard pipeline value. */
    estimatedValue: integer('estimated_value'),
    statusHistory: jsonb('status_history').$type<StatusChange[]>().notNull().default([]),
    /**
     * Salted SHA-256 of the client IP. Used only to throttle abuse; it is not
     * reversible and is dropped by the retention job (see scripts/retention.ts).
     */
    ipHash: varchar('ip_hash', { length: 64 }).notNull().default(''),
  },
  (t) => [
    index('event_requests_status_idx').on(t.status),
    index('event_requests_created_idx').on(t.createdAt),
    index('event_requests_event_date_idx').on(t.eventDate),
  ],
);

/* -------------------------------------------------------------------------- */
/* Media                                                                      */
/* -------------------------------------------------------------------------- */

export const mediaAssets = pgTable('media_assets', {
  id: serial('id').primaryKey(),
  /** Public path, e.g. "/uploads/2026/03/terrazza.webp". */
  path: varchar('path', { length: 300 }).notNull().unique(),
  originalName: varchar('original_name', { length: 255 }).notNull(),
  mimeType: varchar('mime_type', { length: 80 }).notNull(),
  sizeBytes: integer('size_bytes').notNull().default(0),
  alt: localized('alt'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export type Package = typeof packages.$inferSelect;
export type Addon = typeof addons.$inferSelect;
export type Cocktail = typeof cocktails.$inferSelect;
export type EventType = typeof eventTypes.$inferSelect;
export type Faq = typeof faqs.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type GalleryItem = typeof galleryItems.$inferSelect;
export type LandingPage = typeof landingPages.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type EventRequest = typeof eventRequests.$inferSelect;
export type MediaAsset = typeof mediaAssets.$inferSelect;
export type Admin = typeof admins.$inferSelect;
export type RequestStatus = (typeof requestStatusEnum.enumValues)[number];
