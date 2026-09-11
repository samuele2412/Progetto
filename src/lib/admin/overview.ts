import 'server-only';
import { and, count, desc, eq, isNull } from 'drizzle-orm';
import { db } from '@/db';
import {
  cocktails,
  faqs,
  galleryItems,
  mediaAssets,
  packages,
  pageSections,
  pages,
  testimonials,
} from '@/db/schema';

/**
 * What the dashboard shows at a glance.
 *
 * One round trip per number would be a dozen queries for a screen that is meant
 * to load instantly; they go out together instead, and any one of them failing
 * degrades to a zero rather than taking the page down.
 */
export type ContentStats = {
  pagesTotal: number;
  pagesPublished: number;
  pagesDraft: number;
  sections: number;
  media: number;
  cocktails: number;
  packages: number;
  faqs: number;
  testimonials: number;
  gallery: number;
};

async function counted(run: () => Promise<{ value: number }[]>): Promise<number> {
  try {
    const [row] = await run();
    return row?.value ?? 0;
  } catch {
    return 0;
  }
}

export async function getContentStats(): Promise<ContentStats> {
  const [
    pagesTotal,
    pagesPublished,
    sections,
    media,
    cocktailCount,
    packageCount,
    faqCount,
    testimonialCount,
    galleryCount,
  ] = await Promise.all([
    counted(() => db.select({ value: count() }).from(pages).where(isNull(pages.routeKey))),
    counted(() =>
      db
        .select({ value: count() })
        .from(pages)
        .where(and(isNull(pages.routeKey), eq(pages.status, 'published'))),
    ),
    counted(() => db.select({ value: count() }).from(pageSections)),
    counted(() => db.select({ value: count() }).from(mediaAssets)),
    counted(() => db.select({ value: count() }).from(cocktails)),
    counted(() => db.select({ value: count() }).from(packages)),
    counted(() => db.select({ value: count() }).from(faqs)),
    counted(() => db.select({ value: count() }).from(testimonials)),
    counted(() => db.select({ value: count() }).from(galleryItems)),
  ]);

  return {
    pagesTotal,
    pagesPublished,
    pagesDraft: Math.max(0, pagesTotal - pagesPublished),
    sections,
    media,
    cocktails: cocktailCount,
    packages: packageCount,
    faqs: faqCount,
    testimonials: testimonialCount,
    gallery: galleryCount,
  };
}

export type RecentChange = {
  id: string;
  label: string;
  detail: string;
  href: string;
  at: string;
};

/**
 * The last things that were touched.
 *
 * Built from the pages' own `updated_at` rather than from an audit log: a real
 * audit trail is a different feature with different retention questions, and
 * "what did I change recently" is answered well enough by the rows themselves.
 */
export async function getRecentChanges(limit = 8): Promise<RecentChange[]> {
  try {
    const rows = await db
      .select({
        id: pages.id,
        title: pages.title,
        slugIt: pages.slugIt,
        status: pages.status,
        dirty: pages.hasUnpublishedChanges,
        updatedAt: pages.updatedAt,
        updatedBy: pages.updatedBy,
        routeKey: pages.routeKey,
      })
      .from(pages)
      .orderBy(desc(pages.updatedAt))
      .limit(limit);

    return rows.map((row) => ({
      id: `page-${row.id}`,
      label: row.title.it || 'Senza titolo',
      detail: row.dirty
        ? 'modificata, non ancora pubblicata'
        : row.status === 'published'
          ? 'pubblicata'
          : 'bozza',
      href: `/admin/pagine/${row.id}`,
      at: row.updatedAt.toISOString(),
    }));
  } catch {
    return [];
  }
}
