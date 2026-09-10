import 'server-only';
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
 * Read helpers for the public site. Every one of them tolerates an unreachable
 * database by returning an empty list: a partially populated page beats a 500.
 */
async function safe<T>(run: () => Promise<T[]>): Promise<T[]> {
  try {
    return await run();
  } catch (error) {
    console.error('[queries] read failed:', error instanceof Error ? error.message : error);
    return [];
  }
}

export const getPackages = () =>
  safe(() => db.select().from(packages).where(eq(packages.active, true)).orderBy(asc(packages.position)));

export const getAddons = () =>
  safe(() => db.select().from(addons).where(eq(addons.active, true)).orderBy(asc(addons.position)));

export const getCocktails = () =>
  safe(() =>
    db.select().from(cocktails).where(eq(cocktails.active, true)).orderBy(asc(cocktails.position), asc(cocktails.name)),
  );

export const getFeaturedCocktails = () =>
  safe(() =>
    db
      .select()
      .from(cocktails)
      .where(and(eq(cocktails.active, true), eq(cocktails.featured, true)))
      .orderBy(asc(cocktails.position)),
  );

export const getEventTypes = () =>
  safe(() => db.select().from(eventTypes).where(eq(eventTypes.active, true)).orderBy(asc(eventTypes.position)));

export const getFaqs = (topic = 'general') =>
  safe(() =>
    db
      .select()
      .from(faqs)
      .where(and(eq(faqs.active, true), eq(faqs.topic, topic)))
      .orderBy(asc(faqs.position)),
  );

export const getTestimonials = () =>
  safe(() =>
    db.select().from(testimonials).where(eq(testimonials.active, true)).orderBy(asc(testimonials.position)),
  );

export const getGalleryItems = () =>
  safe(() =>
    db.select().from(galleryItems).where(eq(galleryItems.active, true)).orderBy(asc(galleryItems.position)),
  );

export const getLandingPages = () =>
  safe(() =>
    db.select().from(landingPages).where(eq(landingPages.active, true)).orderBy(asc(landingPages.position)),
  );

export const getNavigationLandings = () =>
  safe(() =>
    db
      .select()
      .from(landingPages)
      .where(and(eq(landingPages.active, true), eq(landingPages.inNavigation, true)))
      .orderBy(asc(landingPages.position)),
  );

export const getPosts = () =>
  safe(() => db.select().from(posts).where(eq(posts.published, true)).orderBy(desc(posts.publishedAt)));

export async function getLandingBySlug(slug: string) {
  const rows = await safe(() =>
    db
      .select()
      .from(landingPages)
      .where(and(eq(landingPages.active, true), or(eq(landingPages.slugIt, slug), eq(landingPages.slugEn, slug))!))
      .limit(1),
  );
  return rows[0] ?? null;
}

export async function getPostBySlug(slug: string) {
  const rows = await safe(() =>
    db
      .select()
      .from(posts)
      .where(and(eq(posts.published, true), or(eq(posts.slugIt, slug), eq(posts.slugEn, slug))!))
      .limit(1),
  );
  return rows[0] ?? null;
}

/** The slug of a landing page or post in the *other* language, for hreflang. */
export function slugFor(entity: { slugIt: string; slugEn: string }, locale: Locale): string {
  return locale === 'en' ? entity.slugEn : entity.slugIt;
}
