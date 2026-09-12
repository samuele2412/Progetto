import { JsonLd } from '@/components/JsonLd';
import { d } from '@/lib/dictionary';
import { t, type Locale } from '@/lib/i18n';
import { parseSections, type ParsedBlock } from '@/lib/blocks';
import type { PublishedPage } from '@/db/schema';
import { path } from '@/lib/routes';
import { breadcrumbJsonLd } from '@/lib/seo';
import { getSettings } from '@/lib/settings';
import { BlockSection } from './BlockRenderer';
import { loadBlockData } from './data';

/**
 * Does this block render a heading the page can use as its h1?
 *
 * Mirrors what BlockRenderer does with `isFirst`: every block type promotes its
 * own title to an h1 when it is the first on the page. A block whose title was
 * simply left empty produces none, and the caller fills the gap.
 */
function hasHeading(block: ParsedBlock | undefined, locale: Locale): boolean {
  if (!block) return false;
  const title = block.config.title as { it?: string; en?: string } | undefined;
  if (!title) return false;
  return Boolean(title[locale]?.trim() || title.it?.trim());
}

/**
 * Renders a page assembled in the panel.
 *
 * Takes a snapshot rather than a page id so the same component serves both the
 * public site (the published snapshot) and the draft preview (the working copy
 * shaped as one) — the two can never drift, because there is only one renderer.
 */
export async function CmsPage({
  locale,
  page,
  slug,
}: {
  locale: Locale;
  page: PublishedPage;
  /** This page's own slug, for the breadcrumb. Absent in the draft preview. */
  slug?: string;
}) {
  const blocks = parseSections(page.sections);
  if (!blocks.length) {
    return (
      <section className="section">
        <div className="container-page">
          <p className="text-sm text-bone-500">
            {locale === 'en' ? 'This page has no content yet.' : 'Questa pagina non ha ancora contenuti.'}
          </p>
        </div>
      </section>
    );
  }

  const [data, copy, settings] = [await loadBlockData(blocks), d(locale), await getSettings()];

  return (
    <>
      {/* Every page needs exactly one h1. The first block takes it when it has
          a title of its own; when it has none — a gallery with no header, a
          plain body of text — the page would have had no h1 at all, so the page
          title stands in, for the outline and for search engines rather than
          for the eye. */}
      {!hasHeading(blocks[0], locale) && <h1 className="sr-only">{t(page.title, locale)}</h1>}
      {/* Two levels is all there is: the pages built in the panel hang off the
          home page. The hand-written landings and journal posts already publish
          the same shape — see LandingPageView. */}
      {slug && (
        <JsonLd
          data={breadcrumbJsonLd([
            { name: settings.brand.name, path: path('home', locale) },
            { name: t(page.title, locale), path: `/${locale}/${slug}` },
          ])}
        />
      )}
      {blocks.map((block, index) => (
        <BlockSection
          key={block.id}
          block={block}
          locale={locale}
          copy={copy}
          data={data}
          isFirst={index === 0}
        />
      ))}
    </>
  );
}
