export type Step = { title: string; body: string };

/**
 * Numbered steps as an open list: a rule above each one, the number in the
 * accent, no boxes. Boxed cards made three short sentences look like a
 * product comparison.
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
    <ol className={`grid gap-x-10 gap-y-8 ${columns}`}>
      {steps.map((step, index) => (
        <li
          key={`${index}-${step.title}`}
          className={`reveal reveal-delay-${Math.min(index + 1, 4)} border-t border-[var(--hairline-strong)] pt-5`}
        >
          <span className="text-sm font-medium tabular-nums text-accent">
            {String(index + 1).padStart(2, '0')}
          </span>
          <Heading className="mt-3 font-[family-name:var(--font-display)] text-xl">{step.title}</Heading>
          <p className="mt-2 leading-relaxed text-ink-2">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
