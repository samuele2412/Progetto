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
  const referrer = document.referrer && !document.referrer.includes(window.location.host)
    ? document.referrer.slice(0, 300)
    : '';

  const source: RequestSource = {
    utmSource: params.get('utm_source') ?? undefined,
    utmMedium: params.get('utm_medium') ?? undefined,
    utmCampaign: params.get('utm_campaign') ?? undefined,
    utmTerm: params.get('utm_term') ?? undefined,
    utmContent: params.get('utm_content') ?? undefined,
    referrer: referrer || undefined,
    landingPath: window.location.pathname,
  };

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(source));
  } catch {
    // Not being able to remember it is not worth failing the form over.
  }
  return source;
}
