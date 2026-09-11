import { CocktailCard } from '@/components/blocks/CocktailCard';
import { FaqList } from '@/components/blocks/FaqList';
import { PackageCard } from '@/components/blocks/PackageCard';
import { SectionHeader } from '@/components/blocks/SectionHeader';
import { StepList } from '@/components/blocks/StepList';
import { Testimonials } from '@/components/blocks/Testimonials';
import { Media } from '@/components/Media';
import type { Dictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n';
import { renderMarkdown } from '@/lib/markdown';
import { renderSafeHtml } from '@/lib/safe-html';
import { cn } from '@/lib/utils';
import type { Testimonial } from '@/db/schema';
import type { ParsedBlock } from '@/lib/blocks';
import { pickBySlug, type BlockData } from './data';
import {
  alignClass,
  containerClass,
  gridClass,
  heroHeightClass,
  imageGridClass,
  overlayStyle,
  sectionClass,
  splitClass,
} from './layout';

/**
 * Turns one stored block into the markup the site already uses.
 *
 * The important thing this file does *not* do is invent presentation. Every
 * block ends up inside the same `section` / `container-page` shell and delegates
 * to the components the hand-written pages use — `SectionHeader`, `PackageCard`,
 * `FaqList` and the rest, unchanged. That is what keeps a page assembled in the
 * panel looking like the rest of the site instead of like a page builder.
 */

/* -------------------------------------------------------------------------- */
/* Small helpers                                                              */
/* -------------------------------------------------------------------------- */

type Loc = { it?: string; en?: string } | undefined;

/** Reads a localised value out of a block config, falling back to Italian. */
function tx(value: unknown, locale: Locale): string {
  const loc = value as Loc;
  if (!loc || typeof loc !== 'object') return '';
  const own = loc[locale];
  if (own && own.trim()) return own;
  return (loc.it ?? '').trim();
}

function str(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

type LinkConfig = { label?: Loc; href?: string };

/** A configured button, or null when the owner left it empty. */
function Cta({
  link,
  locale,
  variant = 'primary',
}: {
  link: unknown;
  locale: Locale;
  variant?: 'primary' | 'ghost';
}) {
  const value = link as LinkConfig | undefined;
  const href = str(value?.href).trim();
  const label = tx(value?.label, locale);
  if (!href || !label) return null;
  const external = /^https?:/i.test(href);
  return (
    <a
      href={href}
      className={cn('btn', variant === 'primary' ? 'btn-primary' : 'btn-ghost')}
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
    >
      {label}
    </a>
  );
}

/** The heading every content block shares. Renders nothing when it is empty. */
function Header({
  config,
  locale,
  align = 'left',
}: {
  config: Record<string, unknown>;
  locale: Locale;
  align?: 'left' | 'center';
}) {
  const title = tx(config.title, locale);
  const eyebrow = tx(config.eyebrow, locale);
  const intro = tx(config.intro, locale);
  if (!title && !eyebrow && !intro) return null;
  return <SectionHeader eyebrow={eyebrow || undefined} title={title} intro={intro || undefined} align={align} />;
}

/** Markdown body, styled the way the hand-written pages style theirs. */
function Body({ source, className }: { source: string; className?: string }) {
  if (!source.trim()) return null;
  return (
    <div className={cn('reveal space-y-4 text-bone-300', className)}>
      {renderMarkdown(source, {
        h2: 'display-3 mt-10 text-bone-50 first:mt-0',
        h3: 'mt-8 font-[family-name:var(--font-display)] text-xl text-bone-50 first:mt-0',
        p: 'leading-relaxed',
        ul: 'list-disc space-y-2 pl-5 marker:text-brass-500',
        ol: 'list-decimal space-y-2 pl-5 marker:text-brass-500',
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Blocks                                                                     */
/* -------------------------------------------------------------------------- */

export function BlockSection({
  block,
  locale,
  copy,
  data,
  /** The first block on a page gets the eager image and the h1. */
  isFirst,
}: {
  block: ParsedBlock;
  locale: Locale;
  copy: Dictionary;
  data: BlockData;
  isFirst: boolean;
}) {
  const c = block.config;
  const background = (c.background ?? 'default') as 'default' | 'alt' | 'contrast';
  const width = (c.width ?? 'boxed') as 'boxed' | 'narrow' | 'full';
  const columns = (c.columns ?? '3') as '2' | '3' | '4';
  const align = (c.align ?? 'left') as 'left' | 'center';

  switch (block.type) {
    /* ---------------------------------------------------------------- hero */
    case 'hero': {
      const title = tx(c.title, locale);
      const image = c.image as { path?: string; alt?: Loc } | undefined;
      const imagePath = str(image?.path);
      const hasImage = Boolean(imagePath);
      const heading = isFirst ? 'h1' : 'h2';
      return (
        <section
          className={cn(
            'relative isolate flex items-end overflow-hidden border-b border-[var(--hairline)]',
            heroHeightClass(str(c.height) || 'medium'),
          )}
        >
          {hasImage && (
            <div className="absolute inset-0 -z-10">
              <Media
                src={imagePath}
                alt={tx(image?.alt, locale) || title}
                priority={isFirst}
                sizes="100vw"
                variant="background"
                placeholderLabel={title}
              />
              <div aria-hidden className="absolute inset-0" style={{ background: overlayStyle(str(c.overlay) || 'soft') }} />
            </div>
          )}
          <div className={cn('container-page w-full pb-14 pt-28 md:pb-20', align === 'center' && 'text-center')}>
            <div className={cn('max-w-3xl', align === 'center' && 'mx-auto')}>
              {tx(c.eyebrow, locale) && <p className="eyebrow fade-in-up">{tx(c.eyebrow, locale)}</p>}
              {title &&
                (heading === 'h1' ? (
                  <h1 className={cn('display-1 fade-in-up mt-4 text-bone-50', hasImage && 'text-shadow-hero')}>{title}</h1>
                ) : (
                  <h2 className={cn('display-1 fade-in-up mt-4 text-bone-50', hasImage && 'text-shadow-hero')}>{title}</h2>
                ))}
              {tx(c.intro, locale) && (
                <p className={cn('lede fade-in-up mt-6 max-w-2xl text-bone-200', align === 'center' && 'mx-auto')}>
                  {tx(c.intro, locale)}
                </p>
              )}
              <div className={cn('mt-9 flex flex-wrap gap-3', align === 'center' && 'justify-center')}>
                <Cta link={c.primaryCta} locale={locale} />
                <Cta link={c.secondaryCta} locale={locale} variant="ghost" />
              </div>
            </div>
          </div>
        </section>
      );
    }

    /* ---------------------------------------------------------------- text */
    case 'text': {
      const image = c.image as { path?: string; alt?: Loc } | undefined;
      const imagePath = str(image?.path);
      return (
        <section className={sectionClass(background)}>
          <div className={containerClass(width)}>
            <div className={alignClass(align)}>
              <Header config={c} locale={locale} align={align} />
              <Body source={tx(c.body, locale)} className={cn('mt-8 max-w-3xl', align === 'center' && 'mx-auto')} />
            </div>
            {imagePath && (
              <div className="reveal relative mt-10 aspect-[16/9] overflow-hidden rounded-[var(--radius-card)]">
                <Media src={imagePath} alt={tx(image?.alt, locale)} sizes="(max-width: 1024px) 100vw, 900px" />
              </div>
            )}
          </div>
        </section>
      );
    }

    /* ----------------------------------------------------------- imageText */
    case 'imageText': {
      const image = c.image as { path?: string; alt?: Loc } | undefined;
      const imagePath = str(image?.path);
      const imageFirst = (c.imagePosition ?? 'left') === 'left';
      const mediaColumn = (
        <div className={cn('reveal relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)]', !imageFirst && 'lg:order-2')}>
          <Media
            src={imagePath}
            alt={tx(image?.alt, locale) || tx(c.title, locale)}
            sizes="(max-width: 1024px) 100vw, 50vw"
            placeholderLabel={tx(c.title, locale)}
          />
        </div>
      );
      const textColumn = (
        <div className={cn('reveal', !imageFirst && 'lg:order-1')}>
          {tx(c.eyebrow, locale) && <p className="eyebrow">{tx(c.eyebrow, locale)}</p>}
          {tx(c.title, locale) && <h2 className="display-2 mt-3 text-bone-50">{tx(c.title, locale)}</h2>}
          <Body source={tx(c.body, locale)} className="mt-5" />
          {(() => {
            const cta = <Cta link={c.cta} locale={locale} />;
            return cta ? <div className="mt-7">{cta}</div> : null;
          })()}
        </div>
      );
      return (
        <section className={sectionClass(background)}>
          <div className={containerClass(width)}>
            <div className={splitClass(str(c.ratio) || '50-50')}>
              {mediaColumn}
              {textColumn}
            </div>
          </div>
        </section>
      );
    }

    /* ------------------------------------------------------------- gallery */
    case 'gallery': {
      const configured = (c.images as { path?: string; alt?: Loc }[] | undefined) ?? [];
      const items =
        c.source === 'selected'
          ? configured
              .filter((image) => str(image.path))
              .map((image) => ({ path: str(image.path), alt: tx(image.alt, locale) }))
          : data.gallery.map((item) => ({ path: item.imagePath, alt: tx(item.caption, locale) }));
      if (!items.length) return null;
      return (
        <section className={sectionClass(background)}>
          <div className={containerClass(width)}>
            <Header config={c} locale={locale} />
            <div className={cn(imageGridClass(columns), 'mt-12')}>
              {items.map((item, index) => (
                <figure
                  key={`${item.path}-${index}`}
                  className={cn(
                    'reveal relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)]',
                    `reveal-delay-${Math.min((index % 4) + 1, 4)}`,
                  )}
                >
                  <Media
                    src={item.path}
                    alt={item.alt}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    placeholderLabel={item.alt || undefined}
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>
      );
    }

    /* ----------------------------------------------------------- cocktails */
    case 'cocktails': {
      const slugs = (c.slugs as string[] | undefined) ?? [];
      const items = c.source === 'selected' ? pickBySlug(data.cocktails, slugs) : data.featuredCocktails;
      if (!items.length) return null;
      return (
        <section className={sectionClass(background)}>
          <div className={containerClass(width)}>
            <Header config={c} locale={locale} />
            <div className={cn(gridClass(columns), 'mt-12')}>
              {items.map((cocktail, index) => (
                <div key={cocktail.id} className={cn('reveal', `reveal-delay-${Math.min((index % 4) + 1, 4)}`)}>
                  <CocktailCard cocktail={cocktail} locale={locale} />
                </div>
              ))}
            </div>
            {(() => {
              const cta = <Cta link={c.cta} locale={locale} variant="ghost" />;
              return cta ? <div className="reveal mt-10">{cta}</div> : null;
            })()}
          </div>
        </section>
      );
    }

    /* ------------------------------------------------------------ packages */
    case 'packages': {
      const slugs = (c.slugs as string[] | undefined) ?? [];
      const items = c.source === 'selected' ? pickBySlug(data.packages, slugs) : data.packages;
      if (!items.length) return null;
      const hasHeader = Boolean(tx(c.title, locale) || tx(c.eyebrow, locale) || tx(c.intro, locale));
      return (
        <section className={sectionClass(background)}>
          <div className={containerClass(width)}>
            <Header config={c} locale={locale} />
            <div className={cn(gridClass(columns), hasHeader ? 'mt-12' : '')}>
              {items.map((pkg, index) => (
                <div key={pkg.id} className={cn('reveal', `reveal-delay-${Math.min((index % 4) + 1, 4)}`)}>
                  {/* Without a heading above the grid the cards are the page's
                      first subheading, so they move up a level to keep the
                      outline continuous. */}
                  <PackageCard pkg={pkg} locale={locale} copy={copy} headingLevel={hasHeader ? 3 : 2} />
                </div>
              ))}
            </div>
            {(() => {
              const cta = <Cta link={c.cta} locale={locale} variant="ghost" />;
              return cta ? <div className="reveal mt-10">{cta}</div> : null;
            })()}
          </div>
        </section>
      );
    }

    /* -------------------------------------------------------- testimonials */
    case 'testimonials': {
      const custom = (c.items as { name?: string; text?: Loc; rating?: number; image?: { path?: string } }[] | undefined) ?? [];
      // Shaped like a catalogue row so the existing component renders it
      // without knowing where it came from. Negative ids keep the React keys
      // distinct from real rows.
      const items: Testimonial[] =
        c.source === 'custom'
          ? custom
              .filter((item) => tx(item.text, locale))
              .map((item, index) => ({
                id: -(index + 1),
                position: index,
                active: true,
                authorName: str(item.name),
                rating: Math.min(5, Math.max(1, Number(item.rating) || 5)),
                eventLabel: { it: '', en: '' },
                quote: { it: str(item.text?.it), en: str(item.text?.en) },
                imagePath: str(item.image?.path),
                eventDate: null,
              }))
          : data.testimonials;
      return (
        <section className={sectionClass(background)}>
          <div className={containerClass(width)}>
            <Header config={c} locale={locale} />
            <div className="mt-12">
              <Testimonials testimonials={items} locale={locale} copy={copy} />
            </div>
          </div>
        </section>
      );
    }

    /* ----------------------------------------------------------------- faq */
    case 'faq': {
      const custom = (c.items as { question?: Loc; answer?: Loc }[] | undefined) ?? [];
      const topic = str(c.topic) || 'general';
      const items =
        c.source === 'custom'
          ? custom
              .filter((item) => tx(item.question, locale))
              .map((item, index) => ({
                id: -(index + 1),
                position: index,
                active: true,
                topic,
                question: { it: str(item.question?.it), en: str(item.question?.en) },
                answer: { it: str(item.answer?.it), en: str(item.answer?.en) },
              }))
          : (data.faqsByTopic[topic] ?? []);
      if (!items.length) return null;
      return (
        <section className={sectionClass(background)}>
          <div className={containerClass(width)}>
            <Header config={c} locale={locale} />
            <div className="mt-10">
              <FaqList faqs={items} locale={locale} />
            </div>
          </div>
        </section>
      );
    }

    /* --------------------------------------------------------------- steps */
    case 'steps': {
      const items = ((c.items as { title?: Loc; body?: Loc }[] | undefined) ?? [])
        .map((item) => ({ title: tx(item.title, locale), body: tx(item.body, locale) }))
        .filter((item) => item.title);
      if (!items.length) return null;
      return (
        <section className={sectionClass(background)}>
          <div className={containerClass(width)}>
            <Header config={c} locale={locale} />
            <div className="mt-12">
              <StepList steps={items} />
            </div>
          </div>
        </section>
      );
    }

    /* ----------------------------------------------------------------- cta */
    case 'cta': {
      const title = tx(c.title, locale);
      if (!title) return null;
      return (
        <section className={sectionClass(background, 'relative overflow-hidden')}>
          <div
            aria-hidden
            className="absolute inset-0 opacity-60"
            style={{ background: 'radial-gradient(90% 70% at 50% 0%, rgba(201,164,106,0.12), transparent 60%)' }}
          />
          <div className="container-page relative text-center">
            <h2 className="display-2 reveal mx-auto max-w-2xl text-bone-50">{title}</h2>
            {tx(c.body, locale) && (
              <p className="reveal mx-auto mt-5 max-w-xl leading-relaxed text-bone-400">{tx(c.body, locale)}</p>
            )}
            <div className="reveal mt-9 flex flex-wrap justify-center gap-3">
              <Cta link={c.primaryCta} locale={locale} />
              <Cta link={c.secondaryCta} locale={locale} variant="ghost" />
            </div>
          </div>
        </section>
      );
    }

    /* ------------------------------------------------------------ richText */
    case 'richText': {
      const body = tx(c.body, locale);
      if (!body.trim() && !tx(c.title, locale)) return null;
      return (
        <section className={sectionClass(background)}>
          <div className={containerClass(width)}>
            <div className={alignClass(align)}>
              {tx(c.title, locale) && <h2 className="display-2 reveal text-bone-50">{tx(c.title, locale)}</h2>}
              <Body source={body} className={cn('mt-6 max-w-3xl', align === 'center' && 'mx-auto')} />
            </div>
          </div>
        </section>
      );
    }

    /* ---------------------------------------------------------------- html */
    case 'html': {
      const html = tx(c.html, locale);
      if (!html.trim()) return null;
      return (
        <section className={sectionClass(background)}>
          <div className={containerClass(width)}>
            {tx(c.title, locale) && <h2 className="display-2 reveal mb-6 text-bone-50">{tx(c.title, locale)}</h2>}
            {/* Parsed against an allow-list into React elements — see
                lib/safe-html.ts. Nothing here is raw markup. */}
            <div className="reveal max-w-3xl">{renderSafeHtml(html)}</div>
          </div>
        </section>
      );
    }

    default:
      // A block type removed by an update. Rendering nothing is the only safe
      // answer; the panel still shows the row so the content is not lost.
      return null;
  }
}
