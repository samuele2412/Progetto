import { NextResponse, type NextRequest } from 'next/server';
import { buildCsp, generateNonce } from '@/lib/csp';
import { defaultLocale, isLocale } from '@/lib/i18n';
import { SESSION_COOKIE } from '@/lib/session-cookie';

/**
 * Three jobs:
 *  1. give every HTML response a nonce-based Content-Security-Policy;
 *  2. make sure every public URL carries a locale prefix;
 *  3. keep unauthenticated visitors out of /admin without touching the database
 *     (the real check happens in the admin layout — this is just a cheap gate).
 */
const PUBLIC_FILE = /\.(?:png|jpe?g|gif|svg|webp|avif|ico|txt|xml|webmanifest|woff2?|mp4)$/i;

/** Paths served as-is: assets and JSON, none of which need a nonce. */
function isPassThrough(pathname: string): boolean {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/uploads') ||
    pathname.startsWith('/fonts') ||
    pathname.startsWith('/images') ||
    PUBLIC_FILE.test(pathname)
  );
}

/**
 * Redirects while keeping the visitor on the host they actually used.
 *
 * Next requires an absolute Location, and the origin it infers is not always
 * the right one — behind Cloudflare Tunnel the internal host is not the public
 * domain, and locally 127.0.0.1 and localhost are different origins that do not
 * share a session cookie. So the forwarded headers decide, and `nextUrl` is
 * only the last resort.
 */
function redirectTo(request: NextRequest, path: string, status: 307 | 308 = 307) {
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? request.nextUrl.host;
  const proto =
    request.headers.get('x-forwarded-proto')?.split(',')[0].trim() ??
    request.nextUrl.protocol.replace(':', '') ??
    'http';
  return NextResponse.redirect(new URL(path, `${proto}://${host}`), status);
}

function preferredLocale(request: NextRequest) {
  const header = request.headers.get('accept-language');
  if (!header) return defaultLocale;
  // "en-GB,en;q=0.9,it;q=0.8" -> first supported tag wins.
  const tags = header
    .split(',')
    .map((part) => part.split(';')[0].trim().slice(0, 2).toLowerCase())
    .filter(Boolean);
  for (const tag of tags) if (isLocale(tag)) return tag;
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (isPassThrough(pathname)) return NextResponse.next();

  // The nonce has to reach both the renderer and the browser: Next reads it
  // back out of the CSP on the *request* headers to stamp its own script tags,
  // and `x-nonce` is what our own inline JSON-LD blocks read.
  const nonce = generateNonce();
  const analyticsUrl = process.env.ANALYTICS_SCRIPT_URL;
  const csp = buildCsp(nonce, {
    isProduction: process.env.NODE_ENV === 'production',
    analyticsOrigin: analyticsUrl ? safeOrigin(analyticsUrl) : undefined,
  });

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('content-security-policy', csp);

  const withCsp = (response: NextResponse) => {
    response.headers.set('content-security-policy', csp);
    return response;
  };

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    if (pathname !== '/admin/login' && !request.cookies.get(SESSION_COOKIE)) {
      const target =
        pathname === '/admin' ? '/admin/login' : `/admin/login?next=${encodeURIComponent(pathname)}`;
      return withCsp(redirectTo(request, target));
    }
    return withCsp(NextResponse.next({ request: { headers: requestHeaders } }));
  }

  const first = pathname.split('/')[1];
  if (isLocale(first)) {
    return withCsp(NextResponse.next({ request: { headers: requestHeaders } }));
  }

  // 307 rather than 308: the language choice is a negotiation, not a permanent
  // address change, and we may want to revisit it without poisoning caches.
  const target = `/${preferredLocale(request)}${pathname === '/' ? '' : pathname}${search}`;
  return withCsp(redirectTo(request, target));
}

/** Origin of a configured URL, or undefined if it is not parseable. */
function safeOrigin(url: string): string | undefined {
  try {
    return new URL(url).origin;
  } catch {
    return undefined;
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
