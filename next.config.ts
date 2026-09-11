import type { NextConfig } from 'next';

/**
 * Security headers applied to every response.
 *
 * Only headers with a constant value belong here. `headers()` is evaluated once
 * during `next build`, so anything that has to read the environment of the
 * running container would be frozen at the value it had on the build machine —
 * that is why Content-Security-Policy (per-request nonce) and
 * Strict-Transport-Security (HSTS_* are set when the container starts) are
 * emitted by the middleware instead. See src/middleware.ts.
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
    return [
      { source: '/:path*', headers: securityHeaders },
      // Self-hosted fonts were being revalidated on every navigation: without an
      // explicit rule Next serves /public with `max-age=0`, which costs a round
      // trip per file per page for something that never changes.
      { source: '/fonts/:path*', headers: immutableCache },
      {
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }],
      },
    ];
  },
};

export default nextConfig;
