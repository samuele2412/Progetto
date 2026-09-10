import { existsSync } from 'node:fs';
import path from 'node:path';
import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * An image that degrades gracefully.
 *
 * The site ships before the photographs exist, so a missing file renders a
 * deliberate placeholder (with the expected path printed in development)
 * instead of a broken image icon. Drop a file at the same path later and the
 * real photo appears — no code change, which is the whole point.
 */
const publicDir = path.join(process.cwd(), 'public');

function fileExists(src: string): boolean {
  if (!src.startsWith('/')) return false;
  // Uploads live on a mounted volume; assume present and let the CDN 404.
  if (src.startsWith('/uploads/')) return true;
  try {
    return existsSync(path.join(publicDir, src.replace(/^\//, '').split('?')[0]));
  } catch {
    return false;
  }
}

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
  const present = src ? fileExists(src) : false;

  if (!present) {
    const isBackground = variant === 'background';
    return (
      <div
        className={cn(
          'relative overflow-hidden bg-ink-800 grain',
          isBackground ? 'flex items-end justify-end' : 'flex items-center justify-center',
          fill ? 'absolute inset-0 h-full w-full' : '',
          className,
        )}
        role="img"
        aria-label={alt}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(120% 90% at 25% 15%, rgba(201,164,106,0.16), transparent 55%), linear-gradient(150deg, #1c1814 0%, #100e0c 100%)',
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
              className="mx-auto mb-2 h-6 w-6 text-brass-500/70"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              aria-hidden
            >
              <path d="M3 5h18l-8 9v5l-2 1v-6z" strokeLinejoin="round" />
            </svg>
          )}
          <p
            className={cn(
              'uppercase tracking-[0.18em]',
              isBackground ? 'text-[0.6rem] text-bone-500/40' : 'text-[0.7rem] text-bone-500',
            )}
          >
            {placeholderLabel ?? 'Foto in arrivo'}
          </p>
          {process.env.NODE_ENV !== 'production' && src ? (
            <p
              className={cn(
                'mt-1 break-all font-mono',
                isBackground ? 'text-[0.58rem] text-bone-500/30' : 'text-[0.62rem] text-bone-500/60',
              )}
            >
              {src}
            </p>
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
      className={cn('h-auto w-full', imageClassName)}
    />
  );
}
