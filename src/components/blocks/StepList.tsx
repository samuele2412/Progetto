export type Step = { title: string; body: string };

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
  // Three steps in a four-column grid left an empty hairline cell at the end
  // of the row, which reads as a missing step.
  const columns = steps.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4';
  return (
    <ol className={`grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--hairline)] ${columns}`}>
      {steps.map((step, index) => (
        <li
          key={`${index}-${step.title}`}
          className={`reveal reveal-delay-${Math.min(index + 1, 4)} flex flex-col bg-ink-900 p-5 sm:p-6 md:p-7`}
        >
          <span className="font-[family-name:var(--font-display)] text-3xl text-brass-500/70">
            {String(index + 1).padStart(2, '0')}
          </span>
          <Heading className="mt-3 font-[family-name:var(--font-display)] text-lg text-bone-50 sm:mt-4">{step.title}</Heading>
          <p className="mt-2 text-sm leading-relaxed text-bone-400">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
