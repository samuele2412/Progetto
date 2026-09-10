import type { NextConfig } from 'next';

/**
 * Security headers applied to every response.
 * HSTS is intentionally left to Cloudflare (see README § Cloudflare Tunnel):
 * the container itself speaks plain HTTP behind the tunnel.
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
  experimental: {
    optimizePackageImports: [],
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      {
        source: '/uploads/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;
