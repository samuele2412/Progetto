import Link from 'next/link';
import type { Package } from '@/db/schema';
import type { Dictionary } from '@/lib/dictionary';
import { formatEuro, t, tList, type Locale } from '@/lib/i18n';
import { path } from '@/lib/routes';
import { cn } from '@/lib/utils';

export function PackageCard({
  pkg,
  locale,
  copy,
  compact = false,
}: {
  pkg: Package;
  locale: Locale;
  copy: Dictionary;
  /** Home page variant: fewer bullets, no "not included" list. */
  compact?: boolean;
}) {
  const includes = tList(pkg.includes, locale);
  const excludes = tList(pkg.excludes, locale);
  const onRequest = pkg.pricePerGuestFrom <= 0;

  const guestLabel = pkg.guestsMax
    ? `${pkg.guestsMin}–${pkg.guestsMax} ${copy.packages.guests}`
    : `${copy.packages.guestsOver} ${pkg.guestsMin} ${copy.packages.guests}`;

  return (
    <article
      className={cn(
        'card card-hover relative flex flex-col p-6 md:p-7',
        pkg.highlighted && 'border-brass-500/50 bg-ink-850',
      )}
    >
      {pkg.highlighted && (
        <span className="absolute -top-3 left-6 rounded-full bg-brass-500 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-wider text-ink-950">
          {copy.packages.mostRequested}
        </span>
      )}

      {/* Reserves two lines so the four cards stay aligned when one kicker wraps. */}
      <p className="eyebrow sm:min-h-[2.1em]">{t(pkg.kicker, locale)}</p>
      <h3 className="display-3 mt-2 text-bone-50">{t(pkg.name, locale)}</h3>
      <p className="mt-1 text-sm text-bone-500">{guestLabel}</p>

      <div className="mt-6">
        {onRequest ? (
          <span className="font-[family-name:var(--font-display)] text-2xl text-bone-100">
            {copy.packages.onRequest}
          </span>
        ) : (
          <>
            {/* The label sits on its own line: at narrow card widths "a partire
                da" and "a ospite" both wrap, and the price stops reading as a
                single number. */}
            <p className="text-[0.7rem] uppercase tracking-[0.14em] text-bone-500">{copy.packages.from}</p>
            <p className="mt-1 flex items-baseline gap-2">
              <span className="font-[family-name:var(--font-display)] text-4xl leading-none text-brass-400">
                {formatEuro(pkg.pricePerGuestFrom, locale)}
              </span>
              <span className="whitespace-nowrap text-sm text-bone-400">{copy.packages.perGuest}</span>
            </p>
          </>
        )}
      </div>
      {pkg.minimumTotal > 0 && (
        <p className="mt-1.5 text-xs text-bone-500">
          {copy.packages.minimum} {formatEuro(pkg.minimumTotal, locale)}
        </p>
      )}

      <p className="mt-5 text-sm leading-relaxed text-bone-400">{t(pkg.description, locale)}</p>

      <ul className="mt-6 space-y-2.5 text-sm text-bone-200">
        {(compact ? includes.slice(0, 5) : includes).map((item) => (
          <li key={item} className="flex gap-2.5">
            <svg viewBox="0 0 16 16" className="mt-1 h-3.5 w-3.5 shrink-0 text-brass-500" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M3 8.5l3.2 3.2L13 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{item}</span>
          </li>
        ))}
        {compact && includes.length > 5 && (
          <li className="pl-6 text-xs text-bone-500">+ {includes.length - 5}…</li>
        )}
      </ul>

      {!compact && excludes.length > 0 && (
        <>
          <p className="mt-6 text-xs uppercase tracking-wider text-bone-500">{copy.packages.notIncluded}</p>
          <ul className="mt-2.5 space-y-1.5 text-sm text-bone-500">
            {excludes.map((item) => (
              <li key={item} className="flex gap-2.5">
                <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-bone-500/60" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <p className="mt-6 text-xs leading-relaxed text-bone-500">{t(pkg.priceNote, locale)}</p>

      <Link
        href={path('request', locale, { pacchetto: pkg.slug })}
        className={cn('btn mt-6 w-full', pkg.highlighted ? 'btn-primary' : 'btn-ghost')}
      >
        {copy.packages.choose}
      </Link>
    </article>
  );
}
