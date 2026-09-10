'use client';

import { useState } from 'react';
import { SubmitButton } from './SubmitButton';

/**
 * A destructive action behind a two-step confirmation.
 *
 * Shared by the collection editor and the request detail so that every
 * irreversible button in the panel behaves the same way — deleting a client's
 * data used to be a single unguarded click, unlike deleting a cocktail.
 */
export function ConfirmSubmit({
  action,
  hidden,
  question,
  confirmLabel,
  triggerLabel,
  pendingLabel = 'Eliminazione…',
  className,
}: {
  action: (formData: FormData) => void | Promise<void>;
  /** Hidden fields the action needs, as name/value pairs. */
  hidden: Record<string, string>;
  question: string;
  confirmLabel: string;
  triggerLabel: string;
  pendingLabel?: string;
  className?: string;
}) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className={className ?? 'inline-flex min-h-11 items-center px-1 text-sm text-red-700 hover:underline'}
      >
        {triggerLabel}
      </button>
    );
  }

  return (
    <span className="flex flex-wrap items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5">
      <span className="text-sm text-red-800">{question}</span>
      <form action={action}>
        {Object.entries(hidden).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
        <SubmitButton variant="danger" pendingLabel={pendingLabel} className="!min-h-9 !px-2.5 !py-1 !text-xs">
          {confirmLabel}
        </SubmitButton>
      </form>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="inline-flex min-h-9 items-center text-xs text-stone-600 hover:underline"
      >
        Annulla
      </button>
    </span>
  );
}
