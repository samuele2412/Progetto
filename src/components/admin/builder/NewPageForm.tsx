'use client';

import { useActionState, useEffect, useState } from 'react';
import { createPageAction, type CmsState } from '@/app/admin/cms-actions';
import { Drawer } from '../Drawer';
import { SubmitButton } from '../SubmitButton';
import { useActionToast } from '../Toasts';

/** Mirrors the server's slugify so the preview matches what will be saved. */
function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 140);
}

export function NewPageForm() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [touched, setTouched] = useState(false);
  const [state, formAction] = useActionState<CmsState, FormData>(createPageAction, {});
  useActionToast(state);

  // The address follows the title until the owner edits it by hand, at which
  // point it stops moving under them.
  useEffect(() => {
    if (!touched) setSlug(slugify(title));
  }, [title, touched]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="admin-btn !min-h-11">
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M10 4v12M4 10h12" strokeLinecap="round" />
        </svg>
        Nuova pagina
      </button>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Nuova pagina"
        description="Parte come bozza: nessuno la vede finché non la pubblichi."
      >
        <form action={formAction} className="space-y-4">
          {state.error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p>
          )}

          <div>
            <label htmlFor="new-title" className="admin-label">
              Titolo (italiano)
            </label>
            <input
              id="new-title"
              name="title.it"
              type="text"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Es. Cocktail bar per compleanni a Roma"
              className="admin-field"
            />
          </div>

          <div>
            <label htmlFor="new-title-en" className="admin-label">
              Titolo (inglese, opzionale)
            </label>
            <input id="new-title-en" name="title.en" type="text" className="admin-field" />
          </div>

          <div>
            <label htmlFor="new-slug" className="admin-label">
              Indirizzo
            </label>
            <div className="flex items-center gap-1.5">
              <span className="shrink-0 text-sm text-stone-500">/it/</span>
              <input
                id="new-slug"
                name="slug"
                type="text"
                value={slug}
                onChange={(event) => {
                  setTouched(true);
                  setSlug(event.target.value);
                }}
                className="admin-field"
              />
            </div>
            <p className="mt-1 text-xs text-stone-500">
              Corto e con le parole che cercherebbe un cliente. Si può cambiare dopo, ma i link già condivisi
              smetterebbero di funzionare.
            </p>
          </div>

          <div>
            <label htmlFor="new-slug-en" className="admin-label">
              Indirizzo inglese (opzionale)
            </label>
            <div className="flex items-center gap-1.5">
              <span className="shrink-0 text-sm text-stone-500">/en/</span>
              <input id="new-slug-en" name="slugEn" type="text" className="admin-field" placeholder={slug} />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="admin-btn admin-btn-secondary !min-h-11">
              Annulla
            </button>
            <SubmitButton className="!min-h-11 flex-1" pendingLabel="Creazione…">
              Crea e apri l’editor
            </SubmitButton>
          </div>
        </form>
      </Drawer>
    </>
  );
}
