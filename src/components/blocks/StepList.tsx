import type { CSSProperties } from 'react';

export type Step = { title: string; body: string };

/**
 * Numbered steps as an open list: a large number in the gold with a rule
 * running from it, the title, a line of text. No boxes: boxed cards made
 * three short sentences look like a product comparison. The numbers are for
 * the eye; the list itself is an <ol>, so they are hidden from screen readers.
 */
export function StepList({ steps, headingLevel = 3 }: {
  steps: Step[];
  /**
   * h3 by default: these sit under a section heading. A section built in the
   * panel can have its title left empty, and then these become the first
   * headings under the page h1 — a skipped level — so the renderer moves them
   * up to h2. See BlockRenderer.
   */
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  // Three steps share a row; any other number wraps two by two first, so no
  // row ends with an empty column that reads as a missing step.
  const columns = steps.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4';
  return (
    <ol className={`grid gap-x-10 gap-y-12 ${columns}`}>
      {steps.map((step, index) => (
        <li
          key={`${index}-${step.title}`}
          data-reveal
          style={{ '--reveal-delay': `${index * 0.1}s` } as CSSProperties}
        >
          <div className="flex items-center gap-4">
            <span aria-hidden className="numeral text-[2.75rem] leading-none">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span aria-hidden className="h-px flex-1 bg-[var(--hairline-strong)]" />
          </div>
          <Heading className="mt-5 font-[family-name:var(--font-display)] text-2xl leading-tight">{step.title}</Heading>
          <p className="mt-2 leading-relaxed text-ink-2">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
