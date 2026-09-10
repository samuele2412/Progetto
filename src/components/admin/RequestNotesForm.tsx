'use client';

import { useActionState } from 'react';
import { saveRequestNotesAction, type ActionState } from '@/app/admin/actions';
import { SubmitButton } from './SubmitButton';

export function RequestNotesForm({
  id,
  adminNotes,
  estimatedValue,
}: {
  id: number;
  adminNotes: string;
  estimatedValue: number | null;
}) {
  const [state, formAction] = useActionState(saveRequestNotesAction, {} as ActionState);

  return (
    <form action={formAction} className="admin-card p-5">
      <input type="hidden" name="id" value={id} />
      <h2 className="mb-4 text-lg">Le tue note</h2>

      <label htmlFor="adminNotes" className="admin-label">
        Note interne (non visibili al cliente)
      </label>
      <textarea id="adminNotes" name="adminNotes" rows={5} defaultValue={adminNotes} className="admin-field" />

      <label htmlFor="estimatedValue" className="admin-label mt-4">
        Valore stimato dell’evento (€)
      </label>
      <input
        id="estimatedValue"
        name="estimatedValue"
        type="number"
        min="0"
        step="10"
        defaultValue={estimatedValue ?? ''}
        className="admin-field sm:w-48"
      />
      <p className="mt-1 text-xs text-stone-500">Alimenta il valore in pipeline della dashboard.</p>

      {state?.error && (
        <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p role="status" className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          {state.message}
        </p>
      )}

      <SubmitButton className="mt-5">Salva note</SubmitButton>
    </form>
  );
}
