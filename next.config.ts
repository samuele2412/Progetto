import type { NextConfig } from 'next';

/**
 * Security headers applied to every response.
 *
 * Content-Security-Policy is *not* here: it carries a per-request nonce and is
 * therefore set by the middleware (see src/lib/csp.ts).
 */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
];

/**
 * HSTS is sent by the app as well as by Cloudflare: the app is the only thing
 * that knows the response was served, and a header emitted over plain HTTP is
 * ignored by browsers anyway, so there is no way for this to strand a local
 * install on https. Kept out of development so localhost never gets pinned.
 */
const productionHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

/** A year, immutable: these files are replaced by name, never edited in place. */
const immutableCache = [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }];

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    // Uploaded media is served from the /uploads volume; everything else is
    // shipped in /public/images. No remote hosts are allowed on purpose.
    remotePatterns: [],
  },
  async headers() {
    const isProduction = process.env.NODE_ENV === 'production';
    return [
      {
        source: '/:path*',
        headers: isProduction ? [...securityHeaders, ...productionHeaders] : securityHeaders,
      },
      // Self-hosted fonts were being revalidated on every navigation: without an
      // explicit rule Next serves /public with `max-age=0`, which costs a round
      // trip per file per page for something that never changes.
      { source: '/fonts/:path*', headers: immutableCache },
      { source: '/uploads/:path*', headers: immutableCache },
      {
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }],
      },
    ];
  },
};

export default nextConfig;
