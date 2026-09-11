import 'server-only';
import { cache } from 'react';
import { and, asc, eq, isNull, or } from 'drizzle-orm';
import { db } from '@/db';
import { pageSections, pages, sectionTemplates, type Page, type PublishedPage } from '@/db/schema';
import type { Locale } from './i18n';

/**
 * Read helpers for pages built in the panel.
 *
 * The public side only ever reads `published_content`: one row, one query, and
 * a half-finished draft physically cannot leak. The panel reads the section
 * rows instead — see `getPageForEditor`.
 */

/** Cached per request, like every other public query. */
export const getPublishedPageBySlug = cache(
  async (slug: string, locale: Locale): Promise<{ page: Page; content: PublishedPage } | null> => {
    if (!slug) return null;
    try {
      const rows = await db
        .select()
        .from(pages)
        .where(
          and(
            eq(pages.status, 'published'),
            eq(pages.managed, true),
            locale === 'en' ? eq(pages.slugEn, slug) : eq(pages.slugIt, slug),
          ),
        )
        .limit(1);

      const page = rows[0];
      if (!page || !page.publishedContent) return null;
      return { page, content: page.publishedContent };
    } catch (error) {
      console.error(`[cms] lookup failed: ${error instanceof Error ? error.name : 'unknown error'}`);
      return null;
    }
  },
);

/** Every published page, for the sitemap. */
export const getPublishedPages = cache(async (): Promise<Page[]> => {
  try {
    return await db
      .select()
      .from(pages)
      .where(and(eq(pages.status, 'published'), eq(pages.managed, true)))
      .orderBy(asc(pages.position), asc(pages.id));
  } catch {
    return [];
  }
});

/** Published pages that asked to appear in the site navigation. */
export const getNavigationPages = cache(async (): Promise<Page[]> => {
  const all = await getPublishedPages();
  return all.filter((page) => page.inNavigation);
});

/* -------------------------------------------------------------------------- */
/* Panel side                                                                 */
/* -------------------------------------------------------------------------- */

export type EditorSection = {
  id: number;
  type: string;
  position: number;
  visible: boolean;
  config: Record<string, unknown>;
  templateId: number | null;
  /** Set when the section follows a global template. */
  templateName: string | null;
};

export type EditorPage = { page: Page; sections: EditorSection[] };

/**
 * The working copy, as the builder sees it.
 *
 * A section linked to a global template renders that template's configuration
 * rather than its own, both here and at publish time — which is the whole point
 * of a global section, and the reason the link is resolved in one place instead
 * of in every caller.
 */
export async function getPageForEditor(id: number): Promise<EditorPage | null> {
  const rows = await db.select().from(pages).where(eq(pages.id, id)).limit(1);
  const page = rows[0];
  if (!page) return null;

  const sectionRows = await db
    .select({
      id: pageSections.id,
      type: pageSections.type,
      position: pageSections.position,
      visible: pageSections.visible,
      config: pageSections.config,
      templateId: pageSections.templateId,
      templateName: sectionTemplates.name,
      templateConfig: sectionTemplates.config,
      templateIsGlobal: sectionTemplates.isGlobal,
    })
    .from(pageSections)
    .leftJoin(sectionTemplates, eq(pageSections.templateId, sectionTemplates.id))
    .where(eq(pageSections.pageId, id))
    .orderBy(asc(pageSections.position), asc(pageSections.id));

  const sections: EditorSection[] = sectionRows.map((row) => {
    const followsGlobal = Boolean(row.templateId && row.templateIsGlobal);
    return {
      id: row.id,
      type: row.type,
      position: row.position,
      visible: row.visible,
      config: followsGlobal ? (row.templateConfig ?? row.config) : row.config,
      templateId: followsGlobal ? row.templateId : null,
      templateName: followsGlobal ? row.templateName : null,
    };
  });

  return { page, sections };
}

/** All pages for the panel list, newest activity first within the manual order. */
export async function listPages(): Promise<Page[]> {
  return db.select().from(pages).orderBy(asc(pages.position), asc(pages.id));
}

/**
 * Turns the working copy into the shape the renderer takes. Used by `Publish`
 * (stored as the snapshot) and by the draft preview (rendered on the fly), so
 * what you preview is exactly what publishing would produce.
 */
export function toPublishedContent(page: Page, sections: EditorSection[]): PublishedPage {
  return {
    title: page.title,
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
    ogTitle: page.ogTitle,
    ogDescription: page.ogDescription,
    ogImagePath: page.ogImagePath,
    canonicalUrl: page.canonicalUrl,
    noIndex: page.noIndex,
    sections: sections
      .filter((section) => section.visible)
      .sort((a, b) => a.position - b.position)
      .map((section) => ({ id: section.id, type: section.type, config: section.config })),
  };
}

/** Slugs already taken, so the panel can refuse a duplicate before the database does. */
export async function slugConflict(slugIt: string, slugEn: string, excludeId?: number): Promise<boolean> {
  const rows = await db
    .select({ id: pages.id })
    .from(pages)
    .where(or(eq(pages.slugIt, slugIt), eq(pages.slugEn, slugEn), eq(pages.slugIt, slugEn), eq(pages.slugEn, slugIt)));
  return rows.some((row) => row.id !== excludeId);
}

/** Saved sections available in the "add section" dialog. */
export async function listSectionTemplates() {
  return db.select().from(sectionTemplates).orderBy(asc(sectionTemplates.name));
}

/** Pages created in the panel, i.e. not one of the built-in routes. */
export async function listCustomPages(): Promise<Page[]> {
  return db.select().from(pages).where(isNull(pages.routeKey)).orderBy(asc(pages.position), asc(pages.id));
}
