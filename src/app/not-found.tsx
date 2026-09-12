import Link from 'next/link';
import '@/app/globals.css';

/**
 * Last-resort 404.
 *
 * The two real 404s are [locale]/not-found (site) and admin/not-found (panel);
 * this one only catches what never reaches either — a missing asset path such
 * as /foo.png, which the middleware lets through untouched. Without it those
 * requests rendered Next's built-in error document, which carries no `lang`
 * and no styling of ours.
 *
 * It renders its own <html> because the root layout is a pass-through: the two
 * real roots ([locale] and admin) own the document, and a not-found at this
 * level has neither.
 */
export default function RootNotFound() {
  return (
    <html lang="it">
      {/* Written out rather than exported as `metadata`: Next only merges a
          metadata export from a layout or a page, and the root layout here is a
          pass-through with no <head> of its own, so the file has to carry it. */}
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
        <title>Pagina non trovata</title>
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <main className="container-page flex min-h-screen flex-col items-center justify-center text-center">
          <p className="eyebrow">404</p>
          <h1 className="display-2 mt-4 text-bone-50">Pagina non trovata</h1>
          <p className="lede mt-4 max-w-md">
            Il link che hai seguito non porta da nessuna parte. Può capitare.
          </p>
          <div className="mt-9">
            <Link href="/it" className="btn btn-primary">
              Torna alla home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
