import type { CSSProperties } from 'react';
import { Media, mediaExists } from '@/components/Media';
import { cn, keepSeparators, typeset } from '@/lib/utils';

/**
 * The opening of every inner page: type on paper, then — only when the file
 * really exists — a framed photograph under it.
 *
 * It used to put the title over a full-bleed image. Without a photograph that
 * meant a placeholder box in the most visible spot of the page (and the
 * placeholder's caption became the page's largest paint), so a page whose
 * photo has not been taken yet now simply has none.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  imagePath,
  children,
  compact = false,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  imagePath?: string;
  children?: React.ReactNode;
  compact?: boolean;
}) {
  const hasImage = mediaExists(imagePath);

  return (
    <section className="border-b border-[var(--hairline)]">
      <div className={cn('container-page', compact ? 'pb-14 pt-12 md:pb-20 md:pt-20' : 'pb-16 pt-14 md:pb-24 md:pt-24')}>
        {/* The same opening as the home page, shorter: the eyebrow, then the
            title, then the intro settle in one after the other (CSS only,
            ending on the page as it would be without it). */}
        <div className="max-w-4xl">
          {eyebrow && (
            <p className="eyebrow eyebrow-ruled hero-in" style={{ '--d': '0.05s' } as CSSProperties}>
              {keepSeparators(eyebrow)}
            </p>
          )}
          <h1 className={cn('display-1 hero-rise', eyebrow && 'mt-6')} style={{ '--d': '0.05s' } as CSSProperties}>
            {typeset(title)}
          </h1>
          {intro && (
            <p className="lede hero-in mt-7 max-w-2xl" style={{ '--d': '0.3s' } as CSSProperties}>
              {typeset(intro)}
            </p>
          )}
          {children}
        </div>
        {hasImage && (
          <div className="frame mt-12 aspect-[16/10] md:mt-16 md:aspect-[21/9]">
            <Media src={imagePath!} alt="" priority sizes="(min-width: 1280px) 1280px, 100vw" />
          </div>
        )}
      </div>
    </section>
  );
}
