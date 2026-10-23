'use client';

import { useState } from 'react';
import { flushSync } from 'react-dom';
import { THEME_COOKIE, themeColor, type Theme } from '@/lib/theme';
import { cn } from '@/lib/utils';

/**
 * The sun and moon in the header.
 *
 * A toggle button with a fixed name ("Tema scuro") and `aria-pressed`, the
 * pattern screen readers announce best; the tooltip says what a click does.
 * The icon is drawn by CSS from <html data-theme>, so it can never disagree
 * with the colours on screen (globals.css, "Theme switch").
 *
 * Where the browser has view transitions, the new theme opens as a circle from
 * the button; with reduced motion, or without them, it simply changes.
 */
export function ThemeToggle({
  initialTheme,
  label,
  toLight,
  toDark,
  className,
}: {
  initialTheme: Theme;
  /** The button's name, e.g. "Tema scuro". */
  label: string;
  /** Tooltips: what a click does from each theme. */
  toLight: string;
  toDark: string;
  className?: string;
}) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  function apply(next: Theme) {
    const root = document.documentElement;
    root.dataset.theme = next;
    const secure = window.location.protocol === 'https:' ? '; secure' : '';
    document.cookie = `${THEME_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax${secure}`;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor[next]);
    document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', next);
  }

  function onClick(event: React.MouseEvent<HTMLButtonElement>) {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    const swap = () => {
      apply(next);
      flushSync(() => setTheme(next));
    };

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || typeof document.startViewTransition !== 'function') {
      swap();
      return;
    }

    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const transition = document.startViewTransition(swap);
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 650, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
        );
      })
      // A transition skipped by the browser has already applied the change.
      .catch(() => {});
  }

  const dark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={dark}
      aria-label={label}
      title={dark ? toLight : toDark}
      className={cn(
        'theme-toggle flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--hairline-strong)] text-accent transition-colors hover:border-ink hover:text-ink',
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <g className="sun">
          <circle cx="12" cy="12" r="4.25" />
          <path d="M12 2.25v2M12 19.75v2M2.25 12h2M19.75 12h2M5.1 5.1l1.42 1.42M17.48 17.48l1.42 1.42M5.1 18.9l1.42-1.42M17.48 6.52l1.42-1.42" />
        </g>
        <path className="moon" d="M19.6 14.7A8 8 0 1 1 9.3 4.4a7.5 7.5 0 0 0 10.3 10.3Z" />
      </svg>
    </button>
  );
}
