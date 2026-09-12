import type { Testimonial } from '@/db/schema';
import type { Dictionary } from '@/lib/dictionary';
import { t, type Locale } from '@/lib/i18n';

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating}/5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <svg
          key={index}
          viewBox="0 0 20 20"
          className={index < rating ? 'h-3.5 w-3.5 text-brass-400' : 'h-3.5 w-3.5 text-bone-500/40'}
          fill="currentColor"
          aria-hidden
        >
          <path d="M10 1.8l2.4 5 5.5.8-4 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-4-3.8 5.5-.8z" />
        </svg>
      ))}
    </div>
  );
}

/**
 * Real reviews, or — until there are any — what we commit to instead.
 *
 * Inventing testimonials is the fastest way to lose a client who checks, so the
 * empty state says plainly that there are none yet. It used to say only that,
 * which left a titled section holding one grey sentence: the most important
 * page on the site went quiet exactly where a visitor looks for reassurance.
 * The promises beside it are restatements of commitments already made on this
 * site (see dictionary.promises) — never a claim about a past we do not have.
 */
export function Testimonials({
  testimonials,
  locale,
  copy,
  headingLevel = 3,
}: {
  testimonials: Testimonial[];
  locale: Locale;
  copy: Dictionary;
  /**
   * h3 by default: these sit under a section heading. A section built in the
   * panel can have its title left empty, and then these become the first
   * headings under the page h1 — a skipped level — so the renderer moves them
   * up to h2. See BlockRenderer.
   */
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  if (!testimonials.length) {
    const promises = [
      copy.promises.fixedPrice,
      copy.promises.noAutoBooking,
      copy.promises.freeQuote,
      copy.promises.onePerson,
    ];
    return (
      <div className="reveal card grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_1.15fr] lg:gap-12 lg:p-10">
        <div>
          <Heading className="font-[family-name:var(--font-display)] text-xl text-bone-50 sm:text-2xl">
            {copy.misc.noReviewsTitle}
          </Heading>
          <p className="mt-4 text-sm leading-relaxed text-bone-400">{copy.misc.noReviewsYet}</p>
        </div>
        <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:border-l lg:border-[var(--hairline)] lg:pl-12">
          {promises.map((promise) => (
            <li key={promise} className="flex gap-3 text-sm leading-relaxed text-bone-200">
              <svg
                viewBox="0 0 16 16"
                className="mt-1 h-3.5 w-3.5 shrink-0 text-brass-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden
              >
                <path d="M3 8.5l3.2 3.2L13 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{promise}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((item, index) => (
        <figure
          key={item.id}
          className={`card reveal reveal-delay-${Math.min(index + 1, 4)} flex flex-col p-6`}
        >
          <Stars rating={item.rating} />
          <blockquote className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-bone-200">
            “{t(item.quote, locale)}”
          </blockquote>
          <figcaption className="mt-5 border-t border-[var(--hairline)] pt-4 text-sm">
            <span className="text-bone-100">{item.authorName}</span>
            <span className="block text-xs text-bone-500">{t(item.eventLabel, locale)}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
