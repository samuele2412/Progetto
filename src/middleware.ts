import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale, isLocale, locales } from '@/lib/i18n';

/**
 * Two jobs only:
 *  1. make sure every public URL carries a locale prefix;
 *  2. keep unauthenticated visitors out of /admin without touching the database
 *     (the real check happens in the admin layout — this is just a cheap gate).
 */
const PUBLIC_FILE = /\.(?:png|jpe?g|gif|svg|webp|avif|ico|txt|xml|webmanifest|woff2?|mp4)$/i;

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

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/uploads') ||
    pathname.startsWith('/fonts') ||
    pathname.startsWith('/images') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    if (pathname === '/admin/login') return NextResponse.next();
    if (!request.cookies.get('cordiale_session')) {
      const target =
        pathname === '/admin' ? '/admin/login' : `/admin/login?next=${encodeURIComponent(pathname)}`;
      return redirectTo(request, target);
    }
    return NextResponse.next();
  }

  const first = pathname.split('/')[1];
  if (isLocale(first)) return NextResponse.next();

  const locale = preferredLocale(request);
  // 307 rather than 308: the language choice is a negotiation, not a permanent
  // address change, and we may want to revisit it without poisoning caches.
  return redirectTo(request, `/${locale}${pathname === '/' ? '' : pathname}${search}`);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

export const supportedLocales = locales;
