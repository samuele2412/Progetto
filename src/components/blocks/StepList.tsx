export type Step = { title: string; body: string };

export function StepList({ steps }: { steps: Step[] }) {
  return (
    <ol className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--hairline)] md:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, index) => (
        <li
          key={step.title}
          className={`reveal reveal-delay-${Math.min(index + 1, 4)} flex flex-col bg-ink-900 p-6 md:p-7`}
        >
          <span className="font-[family-name:var(--font-display)] text-3xl text-brass-500/70">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="mt-4 font-[family-name:var(--font-display)] text-lg text-bone-50">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-bone-400">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
