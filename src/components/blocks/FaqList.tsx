import type { Faq } from '@/db/schema';
import { t, type Locale } from '@/lib/i18n';

/**
 * Native `<details>` rather than a JS accordion: it is keyboard-accessible and
 * searchable in-page for free, works without hydration, and Google can read the
 * answers whether or not they are open.
 */
export function FaqList({ faqs, locale }: { faqs: Faq[]; locale: Locale }) {
  if (!faqs.length) return null;

  return (
    <div className="divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
      {faqs.map((faq) => (
        <details key={faq.id} className="group py-5">
          <summary className="flex min-h-11 cursor-pointer list-none items-start justify-between gap-6 text-left">
            <h3 className="font-[family-name:var(--font-display)] text-lg leading-snug text-bone-50 transition-colors group-hover:text-brass-300 md:text-xl">
              {t(faq.question, locale)}
            </h3>
            <span
              aria-hidden
              className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--hairline-strong)] transition-transform duration-300 group-open:rotate-45"
            >
              <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 text-brass-400" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <path d="M7 2v10M2 7h10" strokeLinecap="round" />
              </svg>
            </span>
          </summary>
          <div className="mt-3 max-w-3xl whitespace-pre-line text-[0.95rem] leading-relaxed text-bone-400">
            {t(faq.answer, locale)}
          </div>
        </details>
      ))}
    </div>
  );
}
