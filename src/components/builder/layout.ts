import type { Align, Background, Columns, Width } from '@/lib/blocks';

/**
 * The only place a layout choice turns into class names.
 *
 * Every value comes from a closed list in the block schema, so this is a total
 * mapping with no fallthrough to "whatever the owner typed" — which is the
 * mechanism that makes the builder unable to produce a layout the site has
 * never been tested at. In particular every multi-column grid starts at one
 * column and widens at a breakpoint, so no configuration can produce a phone
 * layout with two cramped columns.
 */

export function sectionClass(background: Background, extra?: string): string {
  const base =
    background === 'default'
      ? 'section'
      : background === 'alt'
        ? 'section border-t border-[var(--hairline)] bg-ink-900'
        : 'section border-t border-[var(--hairline)] bg-ink-850';
  return extra ? `${base} ${extra}` : base;
}

export function containerClass(width: Width): string {
  if (width === 'narrow') return 'container-page max-w-3xl';
  if (width === 'full') return 'container-page max-w-none';
  return 'container-page';
}

export function alignClass(align: Align): string {
  return align === 'center' ? 'mx-auto max-w-2xl text-center' : '';
}

/** Card grids. One column on a phone, always. */
export function gridClass(columns: Columns): string {
  if (columns === '2') return 'grid gap-5 sm:grid-cols-2';
  if (columns === '4') return 'grid gap-5 sm:grid-cols-2 xl:grid-cols-4';
  return 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3';
}

/** Image grids can go tighter than card grids, since there is no copy to fit. */
export function imageGridClass(columns: Columns): string {
  if (columns === '2') return 'grid gap-3 sm:grid-cols-2 sm:gap-4';
  if (columns === '4') return 'grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4';
  return 'grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3';
}

/**
 * The two-column split of the image + text block. The ratio only exists from
 * `lg` up: below that the two halves stack, which is the behaviour the mobile
 * layout was designed around.
 */
export function splitClass(ratio: string): string {
  if (ratio === '40-60') return 'grid items-center gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14';
  if (ratio === '60-40') return 'grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14';
  return 'grid items-center gap-8 lg:grid-cols-2 lg:gap-14';
}

/** Hero height. `svh` so a phone's collapsing address bar does not resize it. */
export function heroHeightClass(height: string): string {
  if (height === 'short') return 'min-h-[42svh] md:min-h-[46svh]';
  if (height === 'tall') return 'min-h-[86svh] md:min-h-[90svh]';
  return 'min-h-[60svh] md:min-h-[66svh]';
}

export function overlayStyle(overlay: string): string {
  if (overlay === 'none') {
    return 'linear-gradient(to top, rgba(10,9,8,0.85) 0%, rgba(10,9,8,0.15) 60%, transparent 100%)';
  }
  if (overlay === 'strong') {
    return 'linear-gradient(to top, rgba(10,9,8,0.99) 12%, rgba(10,9,8,0.9) 55%, rgba(10,9,8,0.72) 100%)';
  }
  return 'linear-gradient(to top, rgba(10,9,8,0.97) 10%, rgba(10,9,8,0.75) 55%, rgba(10,9,8,0.5) 100%)';
}
