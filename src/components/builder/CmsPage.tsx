import { d } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n';
import { parseSections } from '@/lib/blocks';
import type { PublishedPage } from '@/db/schema';
import { BlockSection } from './BlockRenderer';
import { loadBlockData } from './data';

/**
 * Renders a page assembled in the panel.
 *
 * Takes a snapshot rather than a page id so the same component serves both the
 * public site (the published snapshot) and the draft preview (the working copy
 * shaped as one) — the two can never drift, because there is only one renderer.
 */
export async function CmsPage({ locale, page }: { locale: Locale; page: PublishedPage }) {
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

  const [data, copy] = [await loadBlockData(blocks), d(locale)];

  return (
    <>
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
