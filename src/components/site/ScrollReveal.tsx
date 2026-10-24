'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Lets sections settle in once, as they come into view.
 *
 * Elements opt in with `data-reveal` (empty for a rise, or `image`;
 * `--reveal-delay` staggers a group). Nothing is hidden by the server: only
 * here, once JavaScript is running and the visitor has not asked for reduced
 * motion, are the elements still *below the fold* marked `pending` — so a
 * page without JavaScript, a crawler, or a reader who jumps to an anchor
 * always gets every word. Elements already on screen are left alone: hiding
 * them to fade them back would be a flash, not an entrance.
 *
 * Where each element is comes from the observer's first report rather than
 * from measuring it: asking every element for its position on load would
 * force the whole page to be laid out at once, sections the browser is
 * otherwise allowed to skip until they are near (content-visibility).
 *
 * Each element plays once. When its entrance is over the state attribute is
 * removed, so the transition it carried does not linger over the element's
 * own hover effects. Lives in the shell and re-scans on every navigation.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;

    const timers = new Set<number>();
    const seen = new WeakSet<Element>();

    const reveal = (element: HTMLElement) => {
      element.dataset.revealState = 'in';
      const raw = getComputedStyle(element).getPropertyValue('--reveal-delay').trim();
      const delay = raw.endsWith('ms') ? parseFloat(raw) : (parseFloat(raw) || 0) * 1000;
      const timer = window.setTimeout(() => {
        element.removeAttribute('data-reveal-state');
        timers.delete(timer);
      }, 1600 + delay);
      timers.add(timer);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const element = entry.target as HTMLElement;
          if (!seen.has(element)) {
            // The first report says where the element starts. Anything that
            // begins on (or above) the first screen stays as it is. A box of
            // no size is inside a section the browser has not laid out yet
            // (content-visibility), which it only skips off screen.
            seen.add(element);
            const box = entry.boundingClientRect;
            const notLaidOut = box.width === 0 && box.height === 0;
            if (!notLaidOut && box.top < window.innerHeight) {
              observer.unobserve(element);
              continue;
            }
            element.dataset.revealState = 'pending';
            continue;
          }
          if (!entry.isIntersecting) continue;
          observer.unobserve(element);
          reveal(element);
        }
      },
      // A little before the element is fully in: it should be moving as the
      // eye reaches it, not after.
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
    );

    document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-reveal-done])').forEach((element) => {
      element.dataset.revealDone = '';
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
      // Leaving the page half-way: whatever was still waiting is shown, so a
      // cached page coming back from history is never left blank.
      document.querySelectorAll<HTMLElement>('[data-reveal-state="pending"]').forEach((element) => {
        element.removeAttribute('data-reveal-state');
      });
    };
  }, [pathname]);

  return null;
}
