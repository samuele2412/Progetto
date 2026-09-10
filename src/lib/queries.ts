import 'server-only';
import { cache } from 'react';
import { and, asc, desc, eq, or } from 'drizzle-orm';
import { db } from '@/db';
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
import type { Locale } from './i18n';

/**
 * Read helpers for the public site.
 *
 * Every one is wrapped in React's `cache()`, which memoises per request: the
 * layout, the shell and the page component all ask for the settings and the
 * navigation, and without this each ask was its own round trip (27 queries to
 * render the home page). Deduplication happens inside one request only —
 * nothing is shared between visitors, so edits from the panel still appear
 * immediately.
 *
 * Each helper also tolerates an unreachable database by returning an empty
 * list: a partially populated page beats a 500.
 */
async function safe<T>(run: () => Promise<T[]>, label: string): Promise<T[]> {
  try {
    return await run();
  } catch (error) {
    // Deliberately not the driver's message: it embeds the full statement and
    // its bound parameters, which for the admin search means logging whatever
    // was typed — a client's name or email. The label locates it just as well.
    const cause = error instanceof Error ? error.name : 'unknown error';
    console.error(`[queries] ${label} failed: ${cause}`);
    return [];
  }
}

export const getPackages = cache(() =>
  safe(
    () => db.select().from(packages).where(eq(packages.active, true)).orderBy(asc(packages.position)),
    'packages',
  ),
);

export const getAddons = cache(() =>
  safe(() => db.select().from(addons).where(eq(addons.active, true)).orderBy(asc(addons.position)), 'addons'),
);

export const getCocktails = cache(() =>
  safe(
    () =>
      db
        .select()
        .from(cocktails)
        .where(eq(cocktails.active, true))
        .orderBy(asc(cocktails.position), asc(cocktails.name)),
    'cocktails',
  ),
);

export const getFeaturedCocktails = cache(() =>
  safe(
    () =>
      db
        .select()
        .from(cocktails)
        .where(and(eq(cocktails.active, true), eq(cocktails.featured, true)))
        .orderBy(asc(cocktails.position)),
    'featured cocktails',
  ),
);

export const getEventTypes = cache(() =>
  safe(
    () => db.select().from(eventTypes).where(eq(eventTypes.active, true)).orderBy(asc(eventTypes.position)),
    'event types',
  ),
);

export const getFaqs = cache((topic = 'general') =>
  safe(
    () =>
      db
        .select()
        .from(faqs)
        .where(and(eq(faqs.active, true), eq(faqs.topic, topic)))
        .orderBy(asc(faqs.position)),
    'faqs',
  ),
);

export const getTestimonials = cache(() =>
  safe(
    () => db.select().from(testimonials).where(eq(testimonials.active, true)).orderBy(asc(testimonials.position)),
    'testimonials',
  ),
);

export const getGalleryItems = cache(() =>
  safe(
    () => db.select().from(galleryItems).where(eq(galleryItems.active, true)).orderBy(asc(galleryItems.position)),
    'gallery',
  ),
);

export const getLandingPages = cache(() =>
  safe(
    () => db.select().from(landingPages).where(eq(landingPages.active, true)).orderBy(asc(landingPages.position)),
    'landing pages',
  ),
);

export const getNavigationLandings = cache(() =>
  safe(
    () =>
      db
        .select()
        .from(landingPages)
        .where(and(eq(landingPages.active, true), eq(landingPages.inNavigation, true)))
        .orderBy(asc(landingPages.position)),
    'navigation landings',
  ),
);

export const getPosts = cache(() =>
  safe(() => db.select().from(posts).where(eq(posts.published, true)).orderBy(desc(posts.publishedAt)), 'posts'),
);

/** Matched against either locale's slug: the same page answers both addresses. */
export const getLandingBySlug = cache(async (slug: string) => {
  const rows = await safe(
    () =>
      db
        .select()
        .from(landingPages)
        .where(and(eq(landingPages.active, true), or(eq(landingPages.slugIt, slug), eq(landingPages.slugEn, slug))))
        .limit(1),
    'landing by slug',
  );
  return rows[0] ?? null;
});

export const getPostBySlug = cache(async (slug: string) => {
  const rows = await safe(
    () =>
      db
        .select()
        .from(posts)
        .where(and(eq(posts.published, true), or(eq(posts.slugIt, slug), eq(posts.slugEn, slug))))
        .limit(1),
    'post by slug',
  );
  return rows[0] ?? null;
});

/** The slug of a landing page or post in the *other* language, for hreflang. */
export function slugFor(entity: { slugIt: string; slugEn: string }, locale: Locale): string {
  return locale === 'en' ? entity.slugEn : entity.slugIt;
}
