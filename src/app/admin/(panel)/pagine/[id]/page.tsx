import Link from 'next/link';
import { notFound } from 'next/navigation';
import { desc, eq } from 'drizzle-orm';
import { PageWorkspace } from '@/components/admin/builder/PageWorkspace';
import { db } from '@/db';
import { pageVersions } from '@/db/schema';
import { getPageForEditor, listSectionTemplates } from '@/lib/cms';
import { getCocktails, getFaqs, getGalleryItems, getPackages, getTestimonials } from '@/lib/queries';
import type { Catalogues } from '@/components/admin/builder/FieldRenderer';

export const dynamic = 'force-dynamic';

/**
 * Catalogue rows offered to the blocks that pick from them.
 *
 * Fetched here, on the server, rather than by the picker over an API: the lists
 * are small and already cached per request, and this way the editor opens with
 * its options present instead of flashing an empty list on a phone connection.
 */
async function loadCatalogues(): Promise<Catalogues> {
  const [cocktails, packages, faqs, testimonials, gallery] = await Promise.all([
    getCocktails(),
    getPackages(),
    getFaqs('general'),
    getTestimonials(),
    getGalleryItems(),
  ]);

  return {
    cocktails: cocktails.map((row) => ({ slug: row.slug, label: row.name })),
    packages: packages.map((row) => ({ slug: row.slug, label: row.name.it })),
    faqs: faqs.map((row) => ({ slug: String(row.id), label: row.question.it })),
    testimonials: testimonials.map((row) => ({ slug: String(row.id), label: row.authorName })),
    gallery: gallery.map((row) => ({ slug: row.imagePath, label: row.caption.it || row.imagePath })),
  };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const found = await getPageForEditor(Number(id));
  return { title: found ? `${found.page.title.it} — Page Builder` : 'Page Builder' };
}

export default async function PageEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pageId = Number(id);
  if (!Number.isInteger(pageId) || pageId <= 0) notFound();

  const found = await getPageForEditor(pageId);
  if (!found) notFound();

  const [templates, catalogues, versions] = await Promise.all([
    listSectionTemplates(),
    loadCatalogues(),
    db
      .select({
        id: pageVersions.id,
        version: pageVersions.version,
        label: pageVersions.label,
        createdAt: pageVersions.createdAt,
        createdBy: pageVersions.createdBy,
      })
      .from(pageVersions)
      .where(eq(pageVersions.pageId, pageId))
      .orderBy(desc(pageVersions.version))
      .limit(20),
  ]);

  return (
    <div className="space-y-5">
      <nav aria-label="Percorso">
        <Link href="/admin/pagine" className="text-sm text-stone-500 hover:underline">
          ← Tutte le pagine
        </Link>
      </nav>

      <PageWorkspace
        page={{
          id: found.page.id,
          routeKey: found.page.routeKey,
          managed: found.page.managed,
          status: found.page.status,
          hasUnpublishedChanges: found.page.hasUnpublishedChanges,
          publishedAt: found.page.publishedAt ? found.page.publishedAt.toISOString() : null,
          slugIt: found.page.slugIt,
          slugEn: found.page.slugEn,
          title: found.page.title,
          seoTitle: found.page.seoTitle,
          seoDescription: found.page.seoDescription,
          ogTitle: found.page.ogTitle,
          ogDescription: found.page.ogDescription,
          ogImagePath: found.page.ogImagePath,
          canonicalUrl: found.page.canonicalUrl,
          noIndex: found.page.noIndex,
          inNavigation: found.page.inNavigation,
        }}
        sections={found.sections.map((section) => ({
          id: section.id,
          type: section.type,
          visible: section.visible,
          config: section.config,
          templateId: section.templateId,
          templateName: section.templateName,
        }))}
        templates={templates.map((template) => ({
          id: template.id,
          name: template.name,
          type: template.type,
          isGlobal: template.isGlobal,
        }))}
        catalogues={catalogues}
        versions={versions.map((version) => ({
          id: version.id,
          version: version.version,
          label: version.label,
          createdAt: version.createdAt.toISOString(),
          createdBy: version.createdBy,
        }))}
      />
    </div>
  );
}
