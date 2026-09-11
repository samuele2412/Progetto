'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { unlink } from 'node:fs/promises';
import path from 'node:path';
import { and, asc, eq, max, sql } from 'drizzle-orm';
import { db } from '@/db';
import {
  mediaAssets,
  pageSections,
  pageVersions,
  pages,
  sectionTemplates,
  type Page,
  type PublishedPage,
} from '@/db/schema';
import { env } from '@/lib/env';
import { getPageForEditor, slugConflict, toPublishedContent } from '@/lib/cms';
import { isSameOrigin, requireSession } from '@/lib/auth';
import { defaultBlockConfig, isBlockType, validateBlockConfig } from '@/lib/blocks';
import { isUniqueViolation } from '@/lib/db-errors';
import { slugify } from '@/lib/utils';
import { routeSlugs } from '@/lib/routes';

/**
 * Every mutation the page builder performs.
 *
 * Three rules hold throughout, and between them they are what makes the builder
 * safe to hand to someone who is not a developer:
 *
 *  1. Nothing runs without `guard()` — a session and a same-origin request.
 *  2. Nothing is stored without passing its block's zod schema. The panel is
 *     not trusted to send a valid configuration, because "the panel" is just
 *     whatever posted to this endpoint.
 *  3. Editing never touches what visitors see. Every action here writes to the
 *     working copy and marks the page as having unpublished changes; only
 *     `publishPage` moves anything to the public side.
 */
async function guard() {
  const headerList = await headers();
  if (!isSameOrigin(headerList.get('origin'), headerList.get('host'))) {
    throw new Error('CSRF');
  }
  return requireSession();
}

export type CmsState = { ok?: boolean; error?: string; message?: string; id?: number };

/** Slugs the coded routes already own, in either language. */
const RESERVED_SLUGS = new Set<string>([
  ...Object.values(routeSlugs).flatMap((entry) => [entry.it, entry.en]),
  'anteprima',
  'admin',
  'api',
  'uploads',
  'images',
  'fonts',
]);

function readString(form: FormData, key: string, max = 400): string {
  const value = form.get(key);
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function readLocalized(form: FormData, key: string, max = 4000) {
  return {
    it: readString(form, `${key}.it`, max),
    en: readString(form, `${key}.en`, max),
  };
}

function readBool(form: FormData, key: string): boolean {
  return form.get(key) === 'on' || form.get(key) === 'true';
}

/** Marks the working copy as ahead of what is published. */
async function touchPage(pageId: number, email: string) {
  await db
    .update(pages)
    .set({ updatedAt: new Date(), updatedBy: email, hasUnpublishedChanges: true })
    .where(eq(pages.id, pageId));
  revalidatePath(`/admin/pagine/${pageId}`);
}

/** Ensures the section belongs to the page the caller named. */
async function sectionOwnedBy(sectionId: number, pageId: number) {
  const rows = await db
    .select()
    .from(pageSections)
    .where(and(eq(pageSections.id, sectionId), eq(pageSections.pageId, pageId)))
    .limit(1);
  return rows[0] ?? null;
}

/* -------------------------------------------------------------------------- */
/* Pages                                                                      */
/* -------------------------------------------------------------------------- */

export async function createPageAction(_prev: CmsState, form: FormData): Promise<CmsState> {
  const session = await guard();

  const title = readLocalized(form, 'title', 200);
  if (!title.it) return { error: 'Serve almeno il titolo in italiano.' };

  const rawSlug = readString(form, 'slug', 160);
  const slugIt = slugify(rawSlug || title.it);
  const slugEn = slugify(readString(form, 'slugEn', 160) || title.en || slugIt);

  if (!slugIt) return { error: 'Il titolo non produce un indirizzo valido: scrivilo a mano.' };
  if (RESERVED_SLUGS.has(slugIt) || RESERVED_SLUGS.has(slugEn)) {
    return { error: `“${slugIt}” è un indirizzo già usato dal sito. Scegline un altro.` };
  }
  if (await slugConflict(slugIt, slugEn)) {
    return { error: 'Esiste già una pagina con questo indirizzo.' };
  }

  const empty = { it: '', en: '' };
  try {
    const [created] = await db
      .insert(pages)
      .values({
        slugIt,
        slugEn,
        title,
        status: 'draft',
        managed: true,
        seoTitle: empty,
        seoDescription: empty,
        ogTitle: empty,
        ogDescription: empty,
        updatedBy: session.email,
      })
      .returning({ id: pages.id });

    revalidatePath('/admin/pagine');
    redirect(`/admin/pagine/${created.id}`);
  } catch (error) {
    // `redirect` throws by design; let it through.
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') throw error;
    if (isUniqueViolation(error)) return { error: 'Esiste già una pagina con questo indirizzo.' };
    throw error;
  }
}

export async function savePageSettingsAction(_prev: CmsState, form: FormData): Promise<CmsState> {
  const session = await guard();
  const pageId = Number(form.get('pageId'));
  if (!Number.isInteger(pageId)) return { error: 'Pagina non valida.' };

  const existing = (await db.select().from(pages).where(eq(pages.id, pageId)).limit(1))[0];
  if (!existing) return { error: 'Pagina non trovata.' };

  const title = readLocalized(form, 'title', 200);
  if (!title.it) return { error: 'Serve almeno il titolo in italiano.' };

  // A built-in page keeps its address: the route is in the code, and letting
  // the slug drift would break every link to it.
  const slugIt = existing.routeKey ? existing.slugIt : slugify(readString(form, 'slugIt', 160) || title.it);
  const slugEn = existing.routeKey ? existing.slugEn : slugify(readString(form, 'slugEn', 160) || slugIt);

  if (!existing.routeKey) {
    if (!slugIt) return { error: 'L’indirizzo non può restare vuoto.' };
    if (RESERVED_SLUGS.has(slugIt) || RESERVED_SLUGS.has(slugEn)) {
      return { error: `“${slugIt}” è un indirizzo già usato dal sito.` };
    }
    if (await slugConflict(slugIt, slugEn, pageId)) {
      return { error: 'Un’altra pagina usa già questo indirizzo.' };
    }
  }

  const canonical = readString(form, 'canonicalUrl', 400);
  if (canonical && !/^https?:\/\//i.test(canonical)) {
    return { error: 'Il canonical deve essere un indirizzo completo (https://…) oppure vuoto.' };
  }

  const ogImagePath = readString(form, 'ogImagePath', 300);
  if (ogImagePath && !/^\/(uploads|images)\/[\w\-./]+$/.test(ogImagePath)) {
    return { error: 'L’immagine social deve venire dalla libreria del sito.' };
  }

  try {
    await db
      .update(pages)
      .set({
        title,
        slugIt,
        slugEn,
        seoTitle: readLocalized(form, 'seoTitle', 200),
        seoDescription: readLocalized(form, 'seoDescription', 400),
        ogTitle: readLocalized(form, 'ogTitle', 200),
        ogDescription: readLocalized(form, 'ogDescription', 400),
        ogImagePath,
        canonicalUrl: canonical,
        noIndex: readBool(form, 'noIndex'),
        inNavigation: readBool(form, 'inNavigation'),
        updatedAt: new Date(),
        updatedBy: session.email,
        hasUnpublishedChanges: true,
      })
      .where(eq(pages.id, pageId));
  } catch (error) {
    if (isUniqueViolation(error)) return { error: 'Un’altra pagina usa già questo indirizzo.' };
    throw error;
  }

  revalidatePath('/admin/pagine');
  revalidatePath(`/admin/pagine/${pageId}`);
  return { ok: true, message: 'Impostazioni salvate come bozza.' };
}

export async function duplicatePageAction(form: FormData) {
  const session = await guard();
  const pageId = Number(form.get('pageId'));
  if (!Number.isInteger(pageId)) return;

  const source = await getPageForEditor(pageId);
  if (!source) return;

  // A copy has to land on a free address; the counter is the simplest thing
  // that cannot collide with a name the owner might have chosen.
  let suffix = 2;
  let slugIt = `${source.page.slugIt}-copia`;
  let slugEn = `${source.page.slugEn}-copy`;
  while (await slugConflict(slugIt, slugEn)) {
    slugIt = `${source.page.slugIt}-copia-${suffix}`;
    slugEn = `${source.page.slugEn}-copy-${suffix}`;
    suffix += 1;
    if (suffix > 50) return;
  }

  const [created] = await db
    .insert(pages)
    .values({
      slugIt,
      slugEn,
      title: { it: `${source.page.title.it} (copia)`, en: `${source.page.title.en} (copy)` },
      // A duplicate always starts as a draft, whatever the original was: a copy
      // going live the moment it is made is never what anyone meant.
      status: 'draft',
      managed: true,
      publishedContent: null,
      hasUnpublishedChanges: true,
      seoTitle: source.page.seoTitle,
      seoDescription: source.page.seoDescription,
      ogTitle: source.page.ogTitle,
      ogDescription: source.page.ogDescription,
      ogImagePath: source.page.ogImagePath,
      canonicalUrl: '',
      noIndex: source.page.noIndex,
      inNavigation: false,
      updatedBy: session.email,
    })
    .returning({ id: pages.id });

  if (source.sections.length) {
    await db.insert(pageSections).values(
      source.sections.map((section) => ({
        pageId: created.id,
        type: section.type,
        position: section.position,
        visible: section.visible,
        config: section.config,
        templateId: section.templateId,
      })),
    );
  }

  revalidatePath('/admin/pagine');
  redirect(`/admin/pagine/${created.id}`);
}

export async function deletePageAction(form: FormData) {
  await guard();
  const pageId = Number(form.get('pageId'));
  if (!Number.isInteger(pageId)) return;

  const existing = (await db.select().from(pages).where(eq(pages.id, pageId)).limit(1))[0];
  // A built-in page has a coded route behind it: deleting the row would only
  // lose its SEO settings and leave the URL working, which is confusing.
  if (!existing || existing.routeKey) return;

  await db.delete(pages).where(eq(pages.id, pageId));
  revalidatePath('/admin/pagine');
  redirect('/admin/pagine');
}

/* -------------------------------------------------------------------------- */
/* Draft / publish / versions                                                 */
/* -------------------------------------------------------------------------- */

/** How many publishes are kept per page before the oldest is dropped. */
const KEEP_VERSIONS = 20;

export async function publishPageAction(form: FormData): Promise<CmsState> {
  const session = await guard();
  const pageId = Number(form.get('pageId'));
  if (!Number.isInteger(pageId)) return { error: 'Pagina non valida.' };

  const found = await getPageForEditor(pageId);
  if (!found) return { error: 'Pagina non trovata.' };

  const visible = found.sections.filter((section) => section.visible);
  if (!visible.length) {
    return { error: 'La pagina non ha sezioni visibili: aggiungine almeno una prima di pubblicare.' };
  }

  const content = toPublishedContent(found.page, found.sections);
  const now = new Date();

  await db
    .update(pages)
    .set({
      status: 'published',
      publishedContent: content,
      publishedAt: now,
      hasUnpublishedChanges: false,
      updatedAt: now,
      updatedBy: session.email,
    })
    .where(eq(pages.id, pageId));

  await recordVersion(pageId, content, session.email, readString(form, 'label', 160));
  revalidateForPage(found.page);
  return { ok: true, message: 'Pagina pubblicata.' };
}

export async function unpublishPageAction(form: FormData): Promise<CmsState> {
  const session = await guard();
  const pageId = Number(form.get('pageId'));
  if (!Number.isInteger(pageId)) return { error: 'Pagina non valida.' };

  const existing = (await db.select().from(pages).where(eq(pages.id, pageId)).limit(1))[0];
  if (!existing) return { error: 'Pagina non trovata.' };

  // The snapshot is kept: un-publishing hides the page, it does not throw the
  // published content away, so re-publishing restores exactly what was live.
  await db
    .update(pages)
    .set({ status: 'draft', hasUnpublishedChanges: true, updatedAt: new Date(), updatedBy: session.email })
    .where(eq(pages.id, pageId));

  revalidateForPage(existing);
  return { ok: true, message: 'Pagina ritirata dal sito. Il contenuto resta qui.' };
}

async function recordVersion(pageId: number, snapshot: PublishedPage, email: string, label: string) {
  const [{ value: current }] = await db
    .select({ value: max(pageVersions.version) })
    .from(pageVersions)
    .where(eq(pageVersions.pageId, pageId));

  const next = (current ?? 0) + 1;
  await db.insert(pageVersions).values({
    pageId,
    version: next,
    label,
    snapshot,
    createdBy: email,
  });

  // Prune in one statement rather than reading the whole history back.
  await db.execute(sql`
    delete from page_versions
    where page_id = ${pageId}
      and version <= ${next - KEEP_VERSIONS}
  `);
}

export async function restoreVersionAction(form: FormData): Promise<CmsState> {
  const session = await guard();
  const pageId = Number(form.get('pageId'));
  const versionId = Number(form.get('versionId'));
  if (!Number.isInteger(pageId) || !Number.isInteger(versionId)) return { error: 'Versione non valida.' };

  const rows = await db
    .select()
    .from(pageVersions)
    .where(and(eq(pageVersions.id, versionId), eq(pageVersions.pageId, pageId)))
    .limit(1);
  const version = rows[0];
  if (!version) return { error: 'Versione non trovata.' };

  const snapshot = version.snapshot;

  // Restoring rebuilds the *working copy* from the snapshot and leaves the site
  // untouched until Publish. Pressing restore can therefore never be the thing
  // that changes the live site — you always get to look first.
  await db.delete(pageSections).where(eq(pageSections.pageId, pageId));
  if (snapshot.sections.length) {
    await db.insert(pageSections).values(
      snapshot.sections.map((section, index) => ({
        pageId,
        type: section.type,
        position: index,
        visible: true,
        config: section.config,
      })),
    );
  }

  await db
    .update(pages)
    .set({
      title: snapshot.title,
      seoTitle: snapshot.seoTitle,
      seoDescription: snapshot.seoDescription,
      ogTitle: snapshot.ogTitle,
      ogDescription: snapshot.ogDescription,
      ogImagePath: snapshot.ogImagePath,
      canonicalUrl: snapshot.canonicalUrl,
      noIndex: snapshot.noIndex,
      hasUnpublishedChanges: true,
      updatedAt: new Date(),
      updatedBy: session.email,
    })
    .where(eq(pages.id, pageId));

  revalidatePath(`/admin/pagine/${pageId}`);
  return { ok: true, message: `Versione ${version.version} ripristinata come bozza. Controllala e poi pubblica.` };
}

function revalidateForPage(page: Page) {
  revalidatePath('/admin/pagine');
  revalidatePath(`/admin/pagine/${page.id}`);
  revalidatePath(`/it/${page.slugIt}`);
  revalidatePath(`/en/${page.slugEn}`);
  revalidatePath('/sitemap.xml');
}

/* -------------------------------------------------------------------------- */
/* Sections                                                                   */
/* -------------------------------------------------------------------------- */

export async function addSectionAction(form: FormData): Promise<CmsState> {
  const session = await guard();
  const pageId = Number(form.get('pageId'));
  const type = readString(form, 'type', 40);
  const templateId = Number(form.get('templateId')) || null;

  if (!Number.isInteger(pageId)) return { error: 'Pagina non valida.' };

  let config: Record<string, unknown> | null = null;
  let blockType = type;
  let linkTemplate: number | null = null;

  if (templateId) {
    const rows = await db.select().from(sectionTemplates).where(eq(sectionTemplates.id, templateId)).limit(1);
    const template = rows[0];
    if (!template) return { error: 'Sezione salvata non trovata.' };
    blockType = template.type;
    // A normal insert copies the configuration and goes its own way; only a
    // template explicitly marked global keeps the link, so editing a saved
    // section can never silently rewrite pages the owner has forgotten about.
    config = template.config;
    linkTemplate = template.isGlobal ? template.id : null;
  } else {
    if (!isBlockType(type)) return { error: 'Tipo di sezione sconosciuto.' };
    config = defaultBlockConfig(type);
  }

  if (!config) return { error: 'Impossibile creare la sezione.' };

  const [{ value: last }] = await db
    .select({ value: max(pageSections.position) })
    .from(pageSections)
    .where(eq(pageSections.pageId, pageId));

  await db.insert(pageSections).values({
    pageId,
    type: blockType,
    position: (last ?? -1) + 1,
    visible: true,
    config,
    templateId: linkTemplate,
  });

  await touchPage(pageId, session.email);
  return { ok: true, message: 'Sezione aggiunta.' };
}

export async function updateSectionAction(_prev: CmsState, form: FormData): Promise<CmsState> {
  const session = await guard();
  const pageId = Number(form.get('pageId'));
  const sectionId = Number(form.get('sectionId'));
  if (!Number.isInteger(pageId) || !Number.isInteger(sectionId)) return { error: 'Sezione non valida.' };

  const section = await sectionOwnedBy(sectionId, pageId);
  if (!section) return { error: 'Sezione non trovata.' };

  const raw = form.get('config');
  if (typeof raw !== 'string') return { error: 'Configurazione mancante.' };

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { error: 'Configurazione non leggibile.' };
  }

  // The panel is not trusted: whatever it posted goes through the block's own
  // schema before it can reach the database, and the errors come back named so
  // the drawer can point at the field.
  const result = validateBlockConfig(section.type, parsed);
  if (!result.ok) return { error: result.errors.slice(0, 3).join(' · ') };

  if (section.templateId) {
    // Editing a section that follows a global template edits the template, so
    // every page using it changes together — that is what "global" means, and
    // the panel says so before letting the edit start.
    await db
      .update(sectionTemplates)
      .set({ config: result.config, updatedAt: new Date() })
      .where(eq(sectionTemplates.id, section.templateId));
  } else {
    await db
      .update(pageSections)
      .set({ config: result.config, updatedAt: new Date() })
      .where(eq(pageSections.id, sectionId));
  }

  await touchPage(pageId, session.email);
  return { ok: true, message: 'Sezione salvata come bozza.' };
}

export async function duplicateSectionAction(form: FormData): Promise<CmsState> {
  const session = await guard();
  const pageId = Number(form.get('pageId'));
  const sectionId = Number(form.get('sectionId'));
  if (!Number.isInteger(pageId) || !Number.isInteger(sectionId)) return { error: 'Sezione non valida.' };

  const section = await sectionOwnedBy(sectionId, pageId);
  if (!section) return { error: 'Sezione non trovata.' };

  // The copy is independent even when the original follows a global template:
  // duplicating is how you say "like that one, but different".
  const siblings = await db
    .select({ id: pageSections.id, position: pageSections.position })
    .from(pageSections)
    .where(eq(pageSections.pageId, pageId))
    .orderBy(asc(pageSections.position), asc(pageSections.id));

  const config = section.templateId
    ? ((await db.select().from(sectionTemplates).where(eq(sectionTemplates.id, section.templateId)).limit(1))[0]
        ?.config ?? section.config)
    : section.config;

  const at = siblings.findIndex((row) => row.id === sectionId);
  // Push everything after the original down so the copy lands right below it.
  await db
    .update(pageSections)
    .set({ position: sql`${pageSections.position} + 1` })
    .where(and(eq(pageSections.pageId, pageId), sql`${pageSections.position} > ${section.position}`));

  await db.insert(pageSections).values({
    pageId,
    type: section.type,
    position: section.position + 1,
    visible: section.visible,
    config,
    templateId: null,
  });

  await touchPage(pageId, session.email);
  return { ok: true, message: at >= 0 ? 'Sezione duplicata.' : 'Sezione duplicata in fondo.' };
}

export async function toggleSectionAction(form: FormData): Promise<CmsState> {
  const session = await guard();
  const pageId = Number(form.get('pageId'));
  const sectionId = Number(form.get('sectionId'));
  if (!Number.isInteger(pageId) || !Number.isInteger(sectionId)) return { error: 'Sezione non valida.' };

  const section = await sectionOwnedBy(sectionId, pageId);
  if (!section) return { error: 'Sezione non trovata.' };

  await db
    .update(pageSections)
    .set({ visible: !section.visible, updatedAt: new Date() })
    .where(eq(pageSections.id, sectionId));

  await touchPage(pageId, session.email);
  return { ok: true, message: section.visible ? 'Sezione nascosta.' : 'Sezione di nuovo visibile.' };
}

export async function deleteSectionAction(form: FormData): Promise<CmsState> {
  const session = await guard();
  const pageId = Number(form.get('pageId'));
  const sectionId = Number(form.get('sectionId'));
  if (!Number.isInteger(pageId) || !Number.isInteger(sectionId)) return { error: 'Sezione non valida.' };

  const section = await sectionOwnedBy(sectionId, pageId);
  if (!section) return { error: 'Sezione non trovata.' };

  await db.delete(pageSections).where(eq(pageSections.id, sectionId));
  await touchPage(pageId, session.email);
  return { ok: true, message: 'Sezione eliminata. La modifica vale dalla prossima pubblicazione.' };
}

export async function reorderSectionsAction(form: FormData): Promise<CmsState> {
  const session = await guard();
  const pageId = Number(form.get('pageId'));
  const raw = form.get('order');
  if (!Number.isInteger(pageId) || typeof raw !== 'string') return { error: 'Ordine non valido.' };

  let order: unknown;
  try {
    order = JSON.parse(raw);
  } catch {
    return { error: 'Ordine non leggibile.' };
  }
  if (!Array.isArray(order)) return { error: 'Ordine non valido.' };

  const ids = order.map(Number).filter((id) => Number.isInteger(id) && id > 0);

  // Only sections that really belong to this page are moved. A posted id from
  // another page is simply not in the set and is ignored.
  const owned = await db
    .select({ id: pageSections.id })
    .from(pageSections)
    .where(eq(pageSections.pageId, pageId));
  const ownedIds = new Set(owned.map((row) => row.id));

  let position = 0;
  for (const id of ids) {
    if (!ownedIds.has(id)) continue;
    await db
      .update(pageSections)
      .set({ position, updatedAt: new Date() })
      .where(and(eq(pageSections.id, id), eq(pageSections.pageId, pageId)));
    position += 1;
  }

  await touchPage(pageId, session.email);
  return { ok: true, message: 'Nuovo ordine salvato.' };
}

/* -------------------------------------------------------------------------- */
/* Saved sections                                                             */
/* -------------------------------------------------------------------------- */

export async function saveSectionTemplateAction(form: FormData): Promise<CmsState> {
  await guard();
  const pageId = Number(form.get('pageId'));
  const sectionId = Number(form.get('sectionId'));
  const name = readString(form, 'name', 120);
  const isGlobal = readBool(form, 'isGlobal');

  if (!Number.isInteger(pageId) || !Number.isInteger(sectionId)) return { error: 'Sezione non valida.' };
  if (!name) return { error: 'Dai un nome alla sezione salvata.' };

  const section = await sectionOwnedBy(sectionId, pageId);
  if (!section) return { error: 'Sezione non trovata.' };

  const [template] = await db
    .insert(sectionTemplates)
    .values({ name, type: section.type, config: section.config, isGlobal })
    .returning({ id: sectionTemplates.id });

  // Saving a section as global also links the section it came from, otherwise
  // the original would be the one page that ignores its own template.
  if (isGlobal) {
    await db.update(pageSections).set({ templateId: template.id }).where(eq(pageSections.id, sectionId));
  }

  revalidatePath(`/admin/pagine/${pageId}`);
  return {
    ok: true,
    message: isGlobal
      ? 'Sezione salvata come globale: modificandola cambieranno tutte le pagine che la usano.'
      : 'Sezione salvata. Inserendola altrove ne creerai una copia indipendente.',
  };
}

export async function deleteSectionTemplateAction(form: FormData) {
  await guard();
  const templateId = Number(form.get('templateId'));
  if (!Number.isInteger(templateId)) return;
  // Sections following it fall back to their own stored config (the foreign key
  // is ON DELETE SET NULL), so no page loses its content.
  await db.delete(sectionTemplates).where(eq(sectionTemplates.id, templateId));
  revalidatePath('/admin/sezioni');
}

/* -------------------------------------------------------------------------- */
/* Built-in pages                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Hands a coded page over to the builder.
 *
 * Deliberately a separate, explicit action rather than something that happens
 * on install: until the owner presses this, every existing page renders from
 * the code exactly as it does today. Switching back is `managed = false`, and
 * because the coded component was never removed, that really does restore the
 * original page rather than an approximation of it.
 */
export async function setPageManagedAction(form: FormData): Promise<CmsState> {
  const session = await guard();
  const pageId = Number(form.get('pageId'));
  const managed = readBool(form, 'managed');
  if (!Number.isInteger(pageId)) return { error: 'Pagina non valida.' };

  const existing = (await db.select().from(pages).where(eq(pages.id, pageId)).limit(1))[0];
  if (!existing || !existing.routeKey) return { error: 'Questa pagina non ha una versione nel codice.' };

  if (managed) {
    const sections = await db
      .select({ id: pageSections.id })
      .from(pageSections)
      .where(eq(pageSections.pageId, pageId));
    if (!sections.length) {
      return { error: 'Aggiungi almeno una sezione prima di far gestire questa pagina dal Page Builder.' };
    }
  }

  await db
    .update(pages)
    .set({ managed, updatedAt: new Date(), updatedBy: session.email, hasUnpublishedChanges: true })
    .where(eq(pages.id, pageId));

  revalidateForPage(existing);
  return {
    ok: true,
    message: managed
      ? 'Da ora questa pagina è gestita dal Page Builder. Ricordati di pubblicare.'
      : 'Pagina tornata alla versione del codice.',
  };
}

/* -------------------------------------------------------------------------- */
/* Media                                                                      */
/* -------------------------------------------------------------------------- */

export async function updateMediaAction(_prev: CmsState, form: FormData): Promise<CmsState> {
  await guard();
  const id = Number(form.get('mediaId'));
  if (!Number.isInteger(id)) return { error: 'Immagine non valida.' };

  await db
    .update(mediaAssets)
    .set({ alt: readLocalized(form, 'alt', 200) })
    .where(eq(mediaAssets.id, id));

  revalidatePath('/admin/media');
  return { ok: true, message: 'Descrizione aggiornata.' };
}

/**
 * Removes an image from the library and from the disk.
 *
 * The row goes first and the file second: a row without a file shows a broken
 * image everywhere it is used, while a file without a row is merely an orphan
 * taking up space. If the unlink fails the row is already gone, so the panel
 * says so rather than pretending the deletion was clean.
 */
export async function deleteMediaAction(form: FormData): Promise<CmsState> {
  await guard();
  const id = Number(form.get('mediaId'));
  if (!Number.isInteger(id)) return { error: 'Immagine non valida.' };

  const rows = await db.select().from(mediaAssets).where(eq(mediaAssets.id, id)).limit(1);
  const asset = rows[0];
  if (!asset) return { error: 'Immagine non trovata.' };

  await db.delete(mediaAssets).where(eq(mediaAssets.id, id));

  // The stored path is always "/uploads/<year>/<month>/<file>", produced by the
  // upload route — never anything the client chose. It is still re-checked here
  // rather than trusted, because this is the one place that deletes a file.
  const relative = asset.path.replace(/^\/uploads\//, '');
  if (/^\d{4}\/\d{2}\/[A-Za-z0-9._-]+$/.test(relative)) {
    const target = path.join(env.UPLOAD_DIR, relative);
    const resolved = path.resolve(target);
    const root = path.resolve(env.UPLOAD_DIR);
    if (resolved.startsWith(`${root}${path.sep}`)) {
      try {
        await unlink(resolved);
      } catch {
        revalidatePath('/admin/media');
        return { ok: true, message: 'Rimossa dalla libreria, ma il file era già assente dal disco.' };
      }
    }
  }

  revalidatePath('/admin/media');
  return { ok: true, message: 'Immagine eliminata.' };
}
