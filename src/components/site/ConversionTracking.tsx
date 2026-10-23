'use client';

import { useEffect } from 'react';
import { track } from '@/lib/track';

/**
 * One listener for every contact link on the site, instead of an onClick on
 * each: links opt in with `data-track` ("quote", "whatsapp") and an optional
 * `data-track-location`; phone, email and WhatsApp links are recognised by
 * their address even without the attribute.
 *
 * A click is an intention, not a contact: the request counted as received is
 * the one the form reports as saved (`form-submit-success`).
 */
export function ConversionTracking() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a');
      if (!link) return;
      const href = link.getAttribute('href') ?? '';
      const kind =
        link.dataset.track ??
        (href.startsWith('tel:')
          ? 'phone'
          : href.startsWith('mailto:')
            ? 'email'
            : href.includes('wa.me/')
              ? 'whatsapp'
              : null);
      if (!kind) return;
      track(`${kind}-click`, {
        location: link.dataset.trackLocation ?? 'other',
        page: window.location.pathname,
      });
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return null;
}
