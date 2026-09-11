import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CmsPage } from '@/components/builder/CmsPage';
import { getSession } from '@/lib/auth';
import { getPageForEditor, toPublishedContent } from '@/lib/cms';
import { isLocale, t, type Locale } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

/**
 * Draft preview.
 *
 * It lives under /[locale] rather than under /admin for one reason: the site
 * chrome. Rendering the working copy inside the real header and footer is the
 * only way a preview answers the question the owner is actually asking — "what
 * will this look like on my site" — instead of showing the blocks on a bare
 * page that matches nothing.
 *
 * Access is the session, checked here: without it the URL 404s exactly like a
 * page that does not exist, so the existence of a draft is not discoverable by
 * guessing ids. `noindex` is belt and braces on top of that.
 */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: rawLocale, id } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;

  if (!(await getSession())) notFound();

  const pageId = Number(id);
  if (!Number.isInteger(pageId) || pageId <= 0) notFound();

  const found = await getPageForEditor(pageId);
  if (!found) notFound();

  // Hidden sections are filtered out here as well, so the preview shows what
  // publishing would show and not one block more.
  const content = toPublishedContent(found.page, found.sections);
  const unpublished = found.page.hasUnpublishedChanges;

  return (
    <>
      <div className="sticky top-16 z-40 border-b border-brass-500/30 bg-brass-500/10 backdrop-blur md:top-20">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-2.5">
          <p className="text-xs text-brass-200">
            <strong className="font-semibold">Anteprima</strong> — {t(found.page.title, locale) || 'senza titolo'}
            {unpublished ? ' · contiene modifiche non ancora pubblicate' : ' · identica alla versione pubblicata'}
          </p>
          <Link
            href={`/admin/pagine/${pageId}`}
            className="flex min-h-9 items-center rounded-full border border-brass-500/50 px-3 text-xs text-brass-200 transition-colors hover:bg-brass-500/15"
          >
            Torna all’editor
          </Link>
        </div>
      </div>
      <CmsPage locale={locale} page={content} />
    </>
  );
}
