import Script from 'next/script';
import { analyticsEnabled, env } from '@/lib/env';

/**
 * Privacy-first analytics, off unless configured.
 *
 * The site ships with no tracker at all — which is why it needs no cookie
 * banner. Pointing ANALYTICS_SCRIPT_URL at a self-hosted Umami or Plausible
 * keeps that property: both are cookieless and store no personal data, so
 * there is nothing to consent to. See docs/10-analytics.md before swapping in
 * anything that sets a cookie.
 */
export function Analytics() {
  if (!analyticsEnabled) return null;

  return (
    <Script
      src={env.ANALYTICS_SCRIPT_URL!}
      data-website-id={env.ANALYTICS_WEBSITE_ID}
      strategy="afterInteractive"
      defer
    />
  );
}
