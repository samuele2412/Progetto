import Link from 'next/link';
import { headers } from 'next/headers';
import { d } from '@/lib/dictionary';
import { defaultLocale, isLocale, type Locale } from '@/lib/i18n';
import { path } from '@/lib/routes';

/**
 * A not-found page receives no route params, so the locale is recovered from
 * the path the middleware recorded. Without it an English visitor got an
 * Italian 404 in the middle of an otherwise English site.
 */
async function localeFromPath(): Promise<Locale> {
  const pathname = (await headers()).get('x-pathname') ?? '';
  const first = pathname.split('/').filter(Boolean)[0];
  return isLocale(first) ? first : defaultLocale;
}

export default async function NotFound() {
  const locale = await localeFromPath();
  const copy = d(locale);

  return (
    <section className="section">
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center text-center">
        <p className="eyebrow">404</p>
        <h1 className="display-2 mt-4 text-bone-50">{copy.misc.notFoundTitle}</h1>
        <p className="lede mt-4 max-w-md">{copy.misc.notFoundBody}</p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link href={path('home', locale)} className="btn btn-primary">
            {copy.cta.backHome}
          </Link>
          <Link href={path('request', locale)} className="btn btn-ghost">
            {copy.cta.quoteLong}
          </Link>
        </div>
      </div>
    </section>
  );
}
