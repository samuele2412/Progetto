import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';

export default function robots(): MetadataRoute.Robots {
  // Nothing is indexable until a real domain is configured — this stops a
  // staging deployment from being crawled while the copy is still a draft.
  const isLive = !env.SITE_URL.includes('localhost');

  return {
    rules: isLive
      ? [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/it/richiesta-inviata', '/en/request-sent'] }]
      : [{ userAgent: '*', disallow: '/' }],
    sitemap: `${env.SITE_URL}/sitemap.xml`,
    host: env.SITE_URL,
  };
}
