'use client';

import { useFormStatus } from 'react-dom';
import { cn } from '@/lib/utils';

/** Disables itself while its form is in flight — the cheapest double-submit guard. */
export function SubmitButton({
  children,
  pendingLabel = 'Salvataggio…',
  className,
  variant = 'primary',
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger';
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        'admin-btn',
        variant === 'secondary' && 'admin-btn-secondary',
        variant === 'danger' && 'admin-btn-danger',
        className,
      )}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
