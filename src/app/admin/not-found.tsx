import Link from 'next/link';

/**
 * 404 inside the panel.
 *
 * Without this file a mistyped admin URL — or a collection slug that no longer
 * exists — fell through to Next's built-in error document: an unstyled English
 * page with no `lang`, no landmark and no way back to the panel. This one is
 * rendered inside admin/layout, so it keeps the light shell and the `<html
 * lang="it">` the rest of the panel has.
 *
 * It deliberately sits at admin/ rather than admin/(panel)/: the (panel) layout
 * is the one that requires a session, and a 404 has nothing to protect.
 */
export default function AdminNotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
      {/* stone-600, not stone-500: at 12px the lighter grey lands at 4.39:1 on
          the panel background, just under AA. */}
      <p className="text-xs uppercase tracking-[0.2em] text-stone-600">404</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-stone-900">
        Questa pagina del pannello non esiste
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-stone-600">
        Può succedere se un indirizzo è stato salvato fra i preferiti e nel frattempo è cambiato.
        Dalla dashboard trovi tutte le sezioni.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/admin" className="admin-btn">
          Torna alla dashboard
        </Link>
        <Link href="/admin/pagine" className="admin-btn admin-btn-secondary">
          Vai alle pagine
        </Link>
      </div>
    </main>
  );
}
