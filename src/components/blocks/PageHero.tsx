import { Media } from '@/components/Media';
import { cn } from '@/lib/utils';

export function PageHero({
  eyebrow,
  title,
  intro,
  imagePath,
  children,
  compact = false,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  imagePath?: string;
  children?: React.ReactNode;
  compact?: boolean;
}) {
  const hasImage = Boolean(imagePath);

  return (
    <section
      className={cn(
        'relative isolate overflow-hidden border-b border-[var(--hairline)]',
        hasImage ? 'min-h-[52svh] md:min-h-[58svh]' : '',
      )}
    >
      {hasImage && (
        <div className="absolute inset-0 -z-10">
          <Media src={imagePath!} alt={title} priority sizes="100vw" variant="background" placeholderLabel={title} />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(10,9,8,0.97) 10%, rgba(10,9,8,0.75) 55%, rgba(10,9,8,0.5) 100%)',
            }}
          />
        </div>
      )}

      <div
        className={cn(
          'container-page flex flex-col justify-end',
          hasImage ? 'min-h-[52svh] pb-14 pt-24 md:min-h-[58svh] md:pb-20' : compact ? 'py-14 md:py-16' : 'py-16 md:py-24',
        )}
      >
        <div className="max-w-3xl">
          {eyebrow && <p className="eyebrow fade-in-up">{eyebrow}</p>}
          <h1 className={cn('display-1 fade-in-up text-bone-50', eyebrow && 'mt-4', hasImage && 'text-shadow-hero')}>
            {title}
          </h1>
          {intro && <p className="lede fade-in-up mt-6 max-w-2xl text-bone-200">{intro}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
