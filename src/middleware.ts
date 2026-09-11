import { NextResponse, type NextRequest } from 'next/server';
import { buildCsp, generateNonce } from '@/lib/csp';
import { defaultLocale, isLocale, type Locale } from '@/lib/i18n';
import { routeSlugs } from '@/lib/routes';
import { SESSION_COOKIE_NAMES, usesSecureCookies } from '@/lib/session-cookie';

/**
 * Three jobs:
 *  1. give every HTML response a nonce-based Content-Security-Policy;
 *  2. make sure every public URL carries a locale prefix;
 *  3. keep unauthenticated visitors out of /admin without touching the database
 *     (the real check happens in the admin layout — this is just a cheap gate).
 */
const PUBLIC_FILE = /\.(?:png|jpe?g|gif|svg|webp|avif|ico|txt|xml|webmanifest|woff2?|mp4)$/i;

/**
 * Strict-Transport-Security, built per request.
 *
 * It used to live in next.config.ts, but `headers()` runs during `next build`:
 * the image was baking in whatever HSTS_* the build machine had and ignoring
 * the container's own configuration for good. Here the values are read when the
 * request is served, which is what the .env file promises.
 *
 * Sent only when SITE_URL is https — the same signal that decides Secure
 * cookies. Over plain http a browser ignores the header anyway, so this only
 * avoids claiming a policy the install does not actually have. `max-age=0` is
 * honoured and forwarded: it is how a host is un-pinned.
 */
function hstsHeader(): string | undefined {
  if (!usesSecureCookies()) return undefined;
  const isOn = (value: string | undefined) => /^(1|true|yes|on)$/i.test(value ?? '');
  const parsed = Number(process.env.HSTS_MAX_AGE);
  const maxAge = Number.isFinite(parsed) && parsed >= 0 ? Math.trunc(parsed) : 31_536_000;
  return [
    `max-age=${maxAge}`,
    // Both are near-irreversible commitments for every subdomain, so they stay
    // opt-in (see lib/env.ts).
    isOn(process.env.HSTS_INCLUDE_SUBDOMAINS) ? 'includeSubDomains' : '',
    isOn(process.env.HSTS_PRELOAD) ? 'preload' : '',
  ]
    .filter(Boolean)
    .join('; ');
}

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
  // `Host` first: cloudflared and every sane proxy already set it to the public
  // hostname. X-Forwarded-Host is only consulted when the deployment has said
  // there *is* a proxy in front — otherwise any client could name the host it
  // wants to be redirected to.
  const behindProxy = (process.env.TRUSTED_IP_HEADER ?? 'cf-connecting-ip') !== 'none';
  const host =
    request.headers.get('host') ??
    (behindProxy ? request.headers.get('x-forwarded-host') : null) ??
    request.nextUrl.host;
  const proto =
    request.headers.get('x-forwarded-proto')?.split(',')[0].trim() ??
    request.nextUrl.protocol.replace(':', '') ??
    'http';
  return NextResponse.redirect(new URL(path, `${proto}://${host}`), status);
}

/** The locale a known static slug belongs to, if any. */
function localeOwningSlug(slug: string): Locale | undefined {
  for (const entry of Object.values(routeSlugs)) {
    if (entry.it && entry.it === slug) return 'it';
    if (entry.en && entry.en === slug) return 'en';
  }
  return undefined;
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

  // Assets and JSON skip the nonce, but they still get HSTS: a policy that only
  // covered HTML would leave the first asset request of a cold visit unpinned.
  const hsts = hstsHeader();
  const withHsts = (response: NextResponse) => {
    if (hsts) response.headers.set('strict-transport-security', hsts);
    return response;
  };

  if (isPassThrough(pathname)) return withHsts(NextResponse.next());

  // The nonce has to reach both the renderer and the browser: Next reads it
  // back out of the CSP on the *request* headers to stamp its own script tags,
  // and `x-nonce` is what our own inline JSON-LD blocks read.
  const nonce = generateNonce();
  const analyticsUrl = process.env.ANALYTICS_SCRIPT_URL;
  const csp = buildCsp(nonce, {
    // Only when the public origin really is https — see buildCsp.
    upgradeInsecureRequests: usesSecureCookies(),
    allowEval: process.env.NODE_ENV === 'development',
    analyticsOrigin: analyticsUrl ? safeOrigin(analyticsUrl) : undefined,
  });

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('content-security-policy', csp);
  // not-found.tsx and error.tsx get no route params, so the path is the only
  // way for them to know which language the visitor was reading.
  requestHeaders.set('x-pathname', pathname);

  const withCsp = (response: NextResponse) => {
    response.headers.set('content-security-policy', csp);
    return withHsts(response);
  };

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    if (pathname !== '/admin/login' && !SESSION_COOKIE_NAMES.some((name) => request.cookies.get(name))) {
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
  // If the path is a known slug, the language it belongs to wins over the
  // browser's preference: /pacchetti sent an English-configured browser to
  // /en/pacchetti, which does not exist.
  const slug = pathname.split('/').filter(Boolean)[0];
  const locale = (slug && localeOwningSlug(slug)) || preferredLocale(request);
  const target = `/${locale}${pathname === '/' ? '' : pathname}${search}`;
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
