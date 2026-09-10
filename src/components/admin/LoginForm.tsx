'use client';

import { useActionState } from 'react';
import { loginAction, type ActionState } from '@/app/admin/actions';
import { SubmitButton } from './SubmitButton';

export function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useActionState(loginAction, {} as ActionState);

  return (
    <form action={formAction} className="admin-card p-6">
      <input type="hidden" name="next" value={next} />

      <label htmlFor="email" className="admin-label">
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="username"
        required
        autoFocus
        className="admin-field"
      />

      <label htmlFor="password" className="admin-label mt-4">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        className="admin-field"
      />

      {state?.error && (
        <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {state.error}
        </p>
      )}

      <SubmitButton className="mt-6 w-full" pendingLabel="Accesso…">
        Accedi
      </SubmitButton>
    </form>
  );
}
