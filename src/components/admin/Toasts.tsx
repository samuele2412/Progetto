'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

/**
 * Feedback after an action, without a layout shift.
 *
 * Server actions in this panel return `{ ok, message, error }` rather than
 * throwing, so every screen needs the same "it worked / it did not" affordance.
 * Announced through a live region as well as shown, because a toast that only
 * exists visually tells a screen-reader user nothing at all.
 */
type Toast = { id: number; kind: 'ok' | 'error' | 'info'; text: string };

const ToastContext = createContext<((kind: Toast['kind'], text: string) => void) | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const push = useCallback((kind: Toast['kind'], text: string) => {
    if (!text) return;
    const id = nextId.current;
    nextId.current += 1;
    setToasts((current) => [...current.slice(-3), { id, kind, text }]);
    const timer = setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
      timers.current.delete(id);
    }, kind === 'error' ? 7000 : 4000);
    timers.current.set(id, timer);
  }, []);

  // Without this a toast fired just before navigating leaves its timer behind.
  useEffect(() => {
    const pending = timers.current;
    return () => {
      for (const timer of pending.values()) clearTimeout(timer);
      pending.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex flex-col items-center gap-2 p-4 sm:items-end"
        style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.kind === 'error' ? 'alert' : 'status'}
            className={[
              'admin-toast pointer-events-auto max-w-sm',
              toast.kind === 'ok' ? 'admin-toast-ok' : '',
              toast.kind === 'error' ? 'admin-toast-error' : '',
            ].join(' ')}
          >
            {toast.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const push = useContext(ToastContext);
  // Falls back to a no-op rather than throwing: a component rendered outside
  // the provider should still work, just without the toast.
  return useMemo(() => push ?? (() => {}), [push]);
}

/**
 * Shows a server action's result exactly once per change.
 *
 * `useActionState` keeps returning the same object until the next submit, so a
 * naive effect fires the toast again on every unrelated re-render.
 */
export function useActionToast(state: { ok?: boolean; error?: string; message?: string } | undefined) {
  const toast = useToast();
  const lastSeen = useRef<unknown>(null);

  useEffect(() => {
    if (!state || state === lastSeen.current) return;
    lastSeen.current = state;
    if (state.error) toast('error', state.error);
    else if (state.message) toast('ok', state.message);
  }, [state, toast]);
}
