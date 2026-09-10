'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { d } from '@/lib/dictionary';
import { defaultLocale, isLocale } from '@/lib/i18n';

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  // The error boundary has no params either; the path carries the language.
  const pathname = usePathname() ?? '';
  const first = pathname.split('/').filter(Boolean)[0];
  const copy = d(isLocale(first) ? first : defaultLocale);

  useEffect(() => {
    // The digest is what shows up in the server logs; nothing sensitive is
    // rendered to the visitor.
    console.error('[page error]', error.digest ?? error.message);
  }, [error]);

  return (
    <section className="section">
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center text-center">
        <h1 className="display-2 text-bone-50">{copy.misc.errorTitle}</h1>
        <p className="lede mt-4 max-w-md">{copy.misc.errorBody}</p>
        <button type="button" onClick={reset} className="btn btn-primary mt-9">
          {copy.misc.retry}
        </button>
      </div>
    </section>
  );
}
