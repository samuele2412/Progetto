'use client';

import type { RequestSource } from '@/db/schema';

const STORAGE_KEY = 'cordiale_source';

/**
 * Remembers where a visitor came from.
 *
 * UTM parameters live on the landing URL, but the form is usually two or three
 * clicks later — so the first page of the session wins and is kept in
 * sessionStorage. It expires with the tab, which keeps it out of GDPR
 * "persistent identifier" territory while still answering the only question
 * that matters: is Instagram or Google paying the bills?
 */
export function captureSource(): RequestSource {
  if (typeof window === 'undefined') return {};

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as RequestSource;
  } catch {
    // Private browsing or storage disabled — fall through and just read the URL.
  }

  const params = new URLSearchParams(window.location.search);

  /**
   * Every value is clipped to what the server accepts. A campaign name longer
   * than the limit used to fail validation on a field the form never shows,
   * so the visitor saw "check the highlighted fields" with nothing highlighted
   * — and because the value was cached in sessionStorage, every retry failed
   * the same way. Attribution is worth having, never worth losing a lead over.
   */
  const clip = (value: string | null, max: number) => {
    const trimmed = value?.trim();
    return trimmed ? trimmed.slice(0, max) : undefined;
  };

  const referrer =
    document.referrer && !document.referrer.includes(window.location.host) ? document.referrer : '';

  const source: RequestSource = {
    utmSource: clip(params.get('utm_source'), 120),
    utmMedium: clip(params.get('utm_medium'), 120),
    utmCampaign: clip(params.get('utm_campaign'), 160),
    utmTerm: clip(params.get('utm_term'), 160),
    utmContent: clip(params.get('utm_content'), 160),
    referrer: clip(referrer, 300),
    landingPath: window.location.pathname.slice(0, 300),
  };

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(source));
  } catch {
    // Not being able to remember it is not worth failing the form over.
  }
  return source;
}
