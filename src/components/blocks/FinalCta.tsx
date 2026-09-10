import Link from 'next/link';
import type { Dictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n';
import { path } from '@/lib/routes';

export function FinalCta({
  locale,
  copy,
  title,
  body,
  whatsappHref,
  packageSlug,
  eventTypeSlug,
}: {
  locale: Locale;
  copy: Dictionary;
  title: string;
  body: string;
  whatsappHref: string;
  packageSlug?: string;
  eventTypeSlug?: string;
}) {
  return (
    <section className="section relative overflow-hidden border-t border-[var(--hairline)] bg-ink-900">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(70% 60% at 50% 0%, rgba(201,164,106,0.14), transparent 65%)',
        }}
      />
      <div className="container-page relative text-center">
        <div className="reveal mx-auto max-w-2xl">
          <div className="rule-brass mx-auto" />
          <h2 className="display-2 mt-6 text-bone-50">{title}</h2>
          <p className="lede mt-5">{body}</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={path('request', locale, { pacchetto: packageSlug, evento: eventTypeSlug })}
              className="btn btn-primary"
            >
              {copy.cta.quoteLong}
            </Link>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              {copy.cta.whatsappLong}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
