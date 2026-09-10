'use client';

import { useActionState } from 'react';
import { changePasswordAction, type ActionState } from '@/app/admin/actions';
import { SubmitButton } from './SubmitButton';

export function PasswordForm() {
  const [state, formAction] = useActionState(changePasswordAction, {} as ActionState);

  return (
    <form action={formAction} className="admin-card p-5">
      <h2 className="mb-4 text-lg">Cambia password</h2>

      <label htmlFor="currentPassword" className="admin-label">
        Password attuale
      </label>
      <input
        id="currentPassword"
        name="currentPassword"
        type="password"
        autoComplete="current-password"
        required
        className="admin-field"
      />

      <label htmlFor="newPassword" className="admin-label mt-4">
        Nuova password (almeno 12 caratteri)
      </label>
      <input
        id="newPassword"
        name="newPassword"
        type="password"
        autoComplete="new-password"
        minLength={12}
        required
        className="admin-field"
      />

      <label htmlFor="confirmPassword" className="admin-label mt-4">
        Conferma la nuova password
      </label>
      <input
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        minLength={12}
        required
        className="admin-field"
      />

      {state?.error && (
        <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {state.error}
        </p>
      )}

      <SubmitButton className="mt-5">Aggiorna password</SubmitButton>
    </form>
  );
}
