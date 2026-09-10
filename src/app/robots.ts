import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';

/**
 * Generated per request. As a static route it was evaluated during `next build`,
 * when SITE_URL is only a placeholder: every production image shipped with
 * `Disallow: /` and a sitemap pointing at localhost.
 */
export const dynamic = 'force-dynamic';

export default function robots(): MetadataRoute.Robots {
  // Nothing is indexable until a real domain is configured — this stops a
  // staging deployment from being crawled while the copy is still a draft.
  const isLive = !env.SITE_URL.includes('localhost');

  return {
    rules: isLive
      ? [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api'] }]
      : [{ userAgent: '*', disallow: '/' }],
    sitemap: `${env.SITE_URL}/sitemap.xml`,
    host: env.SITE_URL,
  };
}
