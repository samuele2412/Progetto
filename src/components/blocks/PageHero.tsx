import { Media, mediaExists } from '@/components/Media';
import { cn } from '@/lib/utils';

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
      <div className={cn('container-page', compact ? 'pb-12 pt-10 md:pb-16 md:pt-16' : 'pb-14 pt-12 md:pb-20 md:pt-20')}>
        <div className="max-w-3xl">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className={cn('display-1', eyebrow && 'mt-4')}>{title}</h1>
          {intro && <p className="lede mt-6 max-w-2xl">{intro}</p>}
          {children}
        </div>
        {hasImage && (
          <div className="frame mt-10 aspect-[16/10] md:mt-14 md:aspect-[21/9]">
            <Media src={imagePath!} alt="" priority sizes="(min-width: 1280px) 1200px, 100vw" />
          </div>
        )}
      </div>
    </section>
  );
}
