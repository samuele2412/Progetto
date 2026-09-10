import { cn } from '@/lib/utils';

export function SectionHeader({
  eyebrow,
  title,
  intro,
  align = 'left',
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: 'left' | 'center';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'reveal',
        align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl',
        className,
      )}
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className={cn('display-2 text-bone-50', eyebrow && 'mt-3')}>{title}</h2>
      {intro && <p className="lede mt-5">{intro}</p>}
    </div>
  );
}
