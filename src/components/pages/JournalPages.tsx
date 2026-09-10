import Link from 'next/link';
import { FinalCta } from '@/components/blocks/FinalCta';
import { PageHero } from '@/components/blocks/PageHero';
import { JsonLd } from '@/components/JsonLd';
import { Media } from '@/components/Media';
import type { Post } from '@/db/schema';
import { d } from '@/lib/dictionary';
import { formatDate, t, type Locale } from '@/lib/i18n';
import { markdownToPlainText, renderMarkdown } from '@/lib/markdown';
import { getPosts } from '@/lib/queries';
import { journalPath, path } from '@/lib/routes';
import { absoluteUrl, articleJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { getSettings } from '@/lib/settings';
import { whatsappLink } from '@/lib/utils';

function readingMinutes(body: string): number {
  return Math.max(2, Math.round(body.split(/\s+/).length / 210));
}

export async function JournalIndexPage({ locale }: { locale: Locale }) {
  const [settings, posts] = await Promise.all([getSettings(), getPosts()]);
  const copy = d(locale);
  const whatsappHref = whatsappLink(settings.contact.whatsapp, t(settings.contact.whatsappMessage, locale));

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
            <p className="text-sm text-bone-500">
              {locale === 'en' ? 'Nothing published yet.' : 'Non c’è ancora niente di pubblicato.'}
            </p>
          ) : (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => {
                const slug = locale === 'en' ? post.slugEn : post.slugIt;
                return (
                  <li key={post.id} className={`reveal reveal-delay-${Math.min(index % 3 + 1, 4)}`}>
                    <Link href={journalPath(slug, locale)} className="card card-hover group block h-full overflow-hidden">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Media
                          src={post.coverImagePath}
                          alt={t(post.title, locale)}
                          sizes="(max-width: 768px) 100vw, 33vw"
                          imageClassName="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                          placeholderLabel={t(post.title, locale)}
                        />
                      </div>
                      <div className="p-6">
                        <p className="text-xs text-bone-500">
                          {formatDate(post.publishedAt, locale)} · {readingMinutes(t(post.body, locale))}{' '}
                          {copy.misc.readingTime}
                        </p>
                        <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl leading-snug text-bone-50 transition-colors group-hover:text-brass-300">
                          {t(post.title, locale)}
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-bone-400">{t(post.excerpt, locale)}</p>
                        <p className="mt-5 text-sm text-brass-400">{copy.cta.readMore} →</p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <FinalCta
        locale={locale}
        copy={copy}
        title={t(settings.home.finalCtaTitle, locale)}
        body={t(settings.home.finalCtaBody, locale)}
        whatsappHref={whatsappHref}
      />
    </>
  );
}

export async function JournalPostPage({ locale, post }: { locale: Locale; post: Post }) {
  const [settings, posts] = await Promise.all([getSettings(), getPosts()]);
  const copy = d(locale);
  const whatsappHref = whatsappLink(settings.contact.whatsapp, t(settings.contact.whatsappMessage, locale));
  const slug = locale === 'en' ? post.slugEn : post.slugIt;
  const body = t(post.body, locale);
  const others = posts.filter((item) => item.id !== post.id).slice(0, 2);

  return (
    <>
      <article>
        <header className="border-b border-[var(--hairline)]">
          <div className="container-page max-w-3xl py-14 md:py-20">
            <Link href={path('journal', locale)} className="text-sm text-bone-500 transition-colors hover:text-brass-300">
              ← Journal
            </Link>
            <h1 className="display-2 fade-in-up mt-6 text-bone-50">{t(post.title, locale)}</h1>
            <p className="mt-5 text-sm text-bone-500">
              {copy.misc.published} {formatDate(post.publishedAt, locale)} · {readingMinutes(body)}{' '}
              {copy.misc.readingTime}
            </p>
            <p className="lede mt-6">{t(post.excerpt, locale)}</p>
          </div>
        </header>

        {post.coverImagePath && (
          <div className="container-page max-w-4xl py-10">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-panel)]">
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

        <div className="container-page max-w-3xl pb-16 md:pb-24">
          <div className="prose-cordiale">{renderMarkdown(body)}</div>
        </div>
      </article>

      {others.length > 0 && (
        <section className="border-t border-[var(--hairline)] bg-ink-900 py-14">
          <div className="container-page max-w-4xl">
            <h2 className="display-3 text-bone-50">
              {locale === 'en' ? 'Keep reading' : 'Continua a leggere'}
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {others.map((item) => {
                const otherSlug = locale === 'en' ? item.slugEn : item.slugIt;
                return (
                  <li key={item.id}>
                    <Link href={journalPath(otherSlug, locale)} className="card card-hover block h-full p-6">
                      <h3 className="font-[family-name:var(--font-display)] text-lg text-bone-50">
                        {t(item.title, locale)}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-bone-400">{t(item.excerpt, locale)}</p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      <FinalCta
        locale={locale}
        copy={copy}
        title={t(settings.home.finalCtaTitle, locale)}
        body={t(settings.home.finalCtaBody, locale)}
        whatsappHref={whatsappHref}
      />

      <JsonLd
        data={articleJsonLd({
          headline: t(post.title, locale),
          description: markdownToPlainText(t(post.excerpt, locale), 200),
          url: absoluteUrl(journalPath(slug, locale)),
          imagePath: post.coverImagePath || settings.seo.ogImagePath,
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
