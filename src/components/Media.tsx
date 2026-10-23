import Image from 'next/image';
import { mediaExists } from '@/lib/media-files';
import { cn } from '@/lib/utils';

export { mediaExists };

/**
 * An image that degrades gracefully.
 *
 * The site ships before the photographs exist, so a missing file renders a
 * deliberate placeholder (with the expected path printed in development)
 * instead of a broken image icon. Drop a file at the same path later and the
 * real photo appears — no code change, which is the whole point.
 */
type MediaProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** Renders with fill layout inside a positioned parent. */
  fill?: boolean;
  width?: number;
  height?: number;
  /** Short label shown on the placeholder, e.g. "Bancone in terrazza". */
  placeholderLabel?: string;
  /**
   * 'card' centres the placeholder label; 'background' tucks it into a corner,
   * because a full-bleed hero has copy sitting on top of it and a centred label
   * would collide with the headline.
   */
  variant?: 'card' | 'background';
};

export function Media({
  src,
  alt,
  className,
  imageClassName,
  sizes = '100vw',
  priority = false,
  fill = true,
  width,
  height,
  placeholderLabel,
  variant = 'card',
}: MediaProps) {
  const present = mediaExists(src);

  if (!present) {
    const isBackground = variant === 'background';
    return (
      <div
        className={cn(
          'relative overflow-hidden bg-paper-2',
          isBackground ? 'flex items-end justify-end' : 'flex items-center justify-center',
          fill ? 'absolute inset-0 h-full w-full' : '',
          className,
        )}
        role="img"
        aria-label={alt}
      >
        {/* A quiet paper tone with a fine diagonal hatch: reads as "a photo
            goes here", not as a broken image or a design element. */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, rgba(28,26,23,0.045) 0 1px, transparent 1px 11px)',
          }}
        />
        <div
          className={cn(
            'relative z-10',
            isBackground ? 'p-3 text-right' : 'max-w-[80%] px-4 text-center',
          )}
        >
          {!isBackground && (
            <svg
              className="mx-auto mb-2 h-6 w-6 text-ink-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              aria-hidden
            >
              <path d="M3 5h18l-8 9v5l-2 1v-6z" strokeLinejoin="round" />
            </svg>
          )}
          <p className="text-[0.7rem] uppercase tracking-[0.18em] text-ink-3">
            {placeholderLabel ?? 'Foto in arrivo'}
          </p>
          {process.env.NODE_ENV !== 'production' && src ? (
            <p className="mt-1 break-all font-mono text-[0.62rem] text-ink-3">{src}</p>
          ) : null}
        </div>
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        // `priority` alone preloads the file at the browser's default image
        // priority, Low: under a slow connection the fonts went first and the
        // largest image on the page arrived last.
        fetchPriority={priority ? 'high' : undefined}
        className={cn('object-cover', imageClassName)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 1200}
      height={height ?? 800}
      sizes={sizes}
      priority={priority}
      fetchPriority={priority ? 'high' : undefined}
      className={cn('h-auto w-full', imageClassName)}
    />
  );
}
