'use client';

import { useEffect } from 'react';
import { track } from '@/lib/track';

/**
 * One listener for every contact link on the site, instead of an onClick on
 * each: links opt in with `data-track` ("quote", "whatsapp") and an optional
 * `data-track-location`; phone, email and WhatsApp links are recognised by
 * their address even without the attribute, and so is any link to the request
 * page — a button added from the page builder counts too.
 *
 * A click is an intention, not a contact: the request counted as received is
 * the one the form reports as saved (`form-submit-success`).
 */
export function ConversionTracking({ quotePaths }: { quotePaths: string[] }) {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a');
      if (!link) return;
      const href = link.getAttribute('href') ?? '';
      const toRequestPage = link.origin === window.location.origin && quotePaths.includes(link.pathname);
      const kind =
        link.dataset.track ??
        (href.startsWith('tel:')
          ? 'phone'
          : href.startsWith('mailto:')
            ? 'email'
            : href.includes('wa.me/')
              ? 'whatsapp'
              : toRequestPage
                ? 'quote'
                : null);
      if (!kind) return;
      track(`${kind}-click`, {
        location: link.dataset.trackLocation ?? 'other',
        page: window.location.pathname,
      });
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, [quotePaths]);

  return null;
}
