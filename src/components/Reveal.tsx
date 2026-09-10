'use client';

import { useEffect } from 'react';

/**
 * Adds `.is-visible` to every `.reveal` element once it scrolls into view.
 *
 * One observer for the whole page rather than a wrapper component per element:
 * it keeps the markup clean and costs a single listener. Elements that are
 * already on screen at load are revealed immediately, so the hero never flashes
 * empty. `prefers-reduced-motion` is handled in CSS, not here.
 */
export function Reveal() {
  useEffect(() => {
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
    return () => observer.disconnect();
  });

  return null;
}
