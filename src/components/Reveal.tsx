'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Adds `.is-visible` to every `.reveal` element once it scrolls into view.
 *
 * One observer for the whole page rather than a wrapper component per element:
 * it keeps the markup clean and costs a single listener. Elements already on
 * screen are revealed immediately, so nothing flashes empty.
 *
 * The effect re-runs on `pathname` because this component lives in the layout,
 * which survives client-side navigation: without that dependency the blocks of
 * every page after the first stayed at `opacity: 0` until a hard reload.
 * `prefers-reduced-motion` is handled in CSS, not here.
 */
export function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    // The new page's markup is committed in the same pass as this effect, so a
    // frame is given to the browser before measuring what is on screen.
    const frame = requestAnimationFrame(() => {
      const elements = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.is-visible)'));
      if (!elements.length) return;

      if (!('IntersectionObserver' in window)) {
        elements.forEach((el) => el.classList.add('is-visible'));
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        },
        { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
      );

      elements.forEach((el) => observer.observe(el));
      cleanup = () => observer.disconnect();
    });

    return () => {
      cancelAnimationFrame(frame);
      cleanup?.();
    };
  }, [pathname]);

  return null;
}
