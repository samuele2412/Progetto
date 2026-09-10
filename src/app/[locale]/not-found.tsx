import Link from 'next/link';
import { d } from '@/lib/dictionary';
import { defaultLocale } from '@/lib/i18n';
import { path } from '@/lib/routes';

export default function NotFound() {
  // A 404 has no route params to read the locale from; Italian is the default
  // audience and the page stays short enough to be obvious in either language.
  const copy = d(defaultLocale);

  return (
    <section className="section">
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center text-center">
        <p className="eyebrow">404</p>
        <h1 className="display-2 mt-4 text-bone-50">{copy.misc.notFoundTitle}</h1>
        <p className="lede mt-4 max-w-md">{copy.misc.notFoundBody}</p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link href={path('home', defaultLocale)} className="btn btn-primary">
            {copy.cta.backHome}
          </Link>
          <Link href={path('request', defaultLocale)} className="btn btn-ghost">
            {copy.cta.quoteLong}
          </Link>
        </div>
      </div>
    </section>
  );
}
