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
 * Renders nothing but an honest note until real reviews exist. Inventing
 * testimonials is the fastest way to lose a client who checks.
 */
export function Testimonials({
  testimonials,
  locale,
  copy,
}: {
  testimonials: Testimonial[];
  locale: Locale;
  copy: Dictionary;
}) {
  if (!testimonials.length) {
    return (
      <p className="reveal max-w-xl text-sm leading-relaxed text-bone-500">{copy.misc.noReviewsYet}</p>
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
