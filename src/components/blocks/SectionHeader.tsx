import { cn } from '@/lib/utils';

export function SectionHeader({
  eyebrow,
  title,
  intro,
  align = 'left',
  className,
  /**
   * h2 everywhere on the hand-written pages, which already carry their own h1.
   * A page built in the panel may open with any block, so the first one has to
   * be able to take the h1 — otherwise a page that starts with, say, a text
   * section had no h1 at all.
   */
  headingLevel = 2,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: 'left' | 'center';
  className?: string;
  headingLevel?: 1 | 2;
}) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2';
  return (
    <div
      className={cn(
        'reveal',
        align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl',
        className,
      )}
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      {/* A section built in the panel can have an intro and no title; an empty
          heading element is worse than none, so it is simply not rendered. */}
      {title && <Heading className={cn('display-2 text-bone-50', eyebrow && 'mt-3')}>{title}</Heading>}
      {intro && <p className="lede mt-5">{intro}</p>}
    </div>
  );
}
