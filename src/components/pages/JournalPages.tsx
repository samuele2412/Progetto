import Link from 'next/link';
import { FinalCta } from '@/components/blocks/FinalCta';
import { PageHero } from '@/components/blocks/PageHero';
import { JsonLd } from '@/components/JsonLd';
import { Media, mediaExists } from '@/components/Media';
import type { Post } from '@/db/schema';
import { d } from '@/lib/dictionary';
import { formatDate, t, type Locale } from '@/lib/i18n';
import { markdownToPlainText, renderMarkdown } from '@/lib/markdown';
import { getPosts } from '@/lib/queries';
import { journalPath, path } from '@/lib/routes';
import { absoluteUrl, articleJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { getSettings } from '@/lib/settings';

function readingMinutes(body: string): number {
  return Math.max(2, Math.round(body.split(/\s+/).length / 210));
}

export async function JournalIndexPage({ locale }: { locale: Locale }) {
  const [settings, posts] = await Promise.all([getSettings(), getPosts()]);
  const copy = d(locale);

  return (
    <>
      <PageHero
        eyebrow={t(settings.brand.descriptor, locale)}
        title="Journal"
        intro={
          locale === 'en'
            ? 'Practical notes on organising the bar for a party: costs, quantities, what actually goes wrong.'
            : 'Note pratiche su come si organizza il bar di una festa: costi, quantità, quello che va storto davvero.'
        }
        compact
      />

      <section className="section">
        <div className="container-page">
          {posts.length === 0 ? (
            <p className="text-sm text-ink-3">
              {locale === 'en' ? 'Nothing published yet.' : 'Non c’è ancora niente di pubblicato.'}
            </p>
          ) : (
            // An index of articles, not a grid of cards: the covers are not
            // shot yet, and a title with two lines of summary is what someone
            // choosing what to read actually needs. A cover appears beside its
            // article as soon as the file exists.
            <ul className="max-w-4xl border-t border-[var(--hairline-strong)]">
              {posts.map((post) => {
                const slug = locale === 'en' ? post.slugEn : post.slugIt;
                const hasCover = mediaExists(post.coverImagePath);
                return (
                  <li key={post.id} className="border-b border-[var(--hairline)]">
                    <Link
                      href={journalPath(slug, locale)}
                      className={`group grid gap-5 py-7 ${hasCover ? 'sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-8' : ''}`}
                    >
                      {hasCover && (
                        <div className="frame aspect-[16/10]">
                          <Media src={post.coverImagePath} alt="" sizes="(max-width: 640px) 100vw, 12rem" />
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-ink-3">
                          {formatDate(post.publishedAt, locale)} · {readingMinutes(t(post.body, locale))}{' '}
                          {copy.misc.readingTime}
                        </p>
                        <h2 className="display-3 mt-2 transition-colors group-hover:text-accent-strong">{t(post.title, locale)}</h2>
                        <p className="mt-3 max-w-xl leading-relaxed text-ink-2">{t(post.excerpt, locale)}</p>
                        <p className="link-more mt-3">
                          <span className="label">{copy.cta.readMore}</span> <span aria-hidden className="arrow">→</span>
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <FinalCta locale={locale} />
    </>
  );
}

export async function JournalPostPage({ locale, post }: { locale: Locale; post: Post }) {
  const [settings, posts] = await Promise.all([getSettings(), getPosts()]);
  const copy = d(locale);
  const slug = locale === 'en' ? post.slugEn : post.slugIt;
  const body = t(post.body, locale);
  const others = posts.filter((item) => item.id !== post.id).slice(0, 2);

  return (
    <>
      {/* On the same left edge as every other page (the header, the menu, the
          footer), with the measure kept by the inner width: a centred column
          was the one page off the site's vertical line. */}
      <article>
        <header className="border-b border-[var(--hairline)]">
          <div className="container-page py-14 md:py-20">
            <div className="max-w-3xl">
              <Link href={path('journal', locale)} className="tap-target text-sm text-ink-3 transition-colors hover:text-ink">
                ← Journal
              </Link>
              <h1 className="display-2 mt-6">{t(post.title, locale)}</h1>
              <p className="mt-5 text-sm text-ink-3">
                {copy.misc.published} {formatDate(post.publishedAt, locale)} · {readingMinutes(body)}{' '}
                {copy.misc.readingTime}
              </p>
              <p className="lede mt-6 max-w-2xl">{t(post.excerpt, locale)}</p>
            </div>
          </div>
        </header>

        {mediaExists(post.coverImagePath) && (
          <div className="container-page py-10">
            <div className="frame aspect-[16/9] max-w-4xl">
              <Media
                src={post.coverImagePath}
                alt={t(post.title, locale)}
                priority
                sizes="(max-width: 1024px) 100vw, 60rem"
                placeholderLabel={t(post.title, locale)}
              />
            </div>
          </div>
        )}

        <div className="container-page pb-16 pt-10 md:pb-24 md:pt-14">
          <div className="prose-cordiale max-w-2xl">{renderMarkdown(body)}</div>
        </div>
      </article>

      {others.length > 0 && (
        <section className="border-t border-[var(--hairline)] py-14">
          <div className="container-page">
            <h2 className="display-3">
              {locale === 'en' ? 'Keep reading' : 'Continua a leggere'}
            </h2>
            <ul className="mt-6 grid max-w-4xl gap-x-10 sm:grid-cols-2">
              {others.map((item) => {
                const otherSlug = locale === 'en' ? item.slugEn : item.slugIt;
                return (
                  <li key={item.id} className="border-t border-[var(--hairline-strong)]">
                    <Link href={journalPath(otherSlug, locale)} className="group block py-5">
                      <h3 className="font-[family-name:var(--font-display)] text-2xl leading-snug transition-colors group-hover:text-accent-strong">
                        {t(item.title, locale)}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-2">{t(item.excerpt, locale)}</p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      <FinalCta locale={locale} brief />

      <JsonLd
        data={articleJsonLd({
          headline: t(post.title, locale),
          description: markdownToPlainText(t(post.excerpt, locale), 200),
          url: absoluteUrl(journalPath(slug, locale)),
          // Never a cover that is not there yet: the structured data would
          // name a 404 as the article's image.
          imagePath: mediaExists(post.coverImagePath) ? post.coverImagePath : settings.seo.ogImagePath,
          publishedTime: new Date(post.publishedAt).toISOString(),
          authorName: settings.brand.name,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: settings.brand.name, path: path('home', locale) },
          { name: 'Journal', path: path('journal', locale) },
          { name: t(post.title, locale), path: journalPath(slug, locale) },
        ])}
      />
    </>
  );
}
