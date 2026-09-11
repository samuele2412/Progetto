'use client';

import { useState, useTransition } from 'react';
import { addSectionAction } from '@/app/admin/cms-actions';
import { blockFamilies, blockRegistry } from '@/lib/blocks';
import { Drawer } from '../Drawer';
import { useToast } from '../Toasts';

/**
 * The catalogue of things a page can be made of.
 *
 * Grouped by what the owner is trying to do rather than alphabetically, and
 * every entry carries one sentence explaining when to reach for it — a list of
 * twelve nouns is not a choice anyone can make confidently the first time.
 */
export type SavedSection = { id: number; name: string; type: string; isGlobal: boolean };

export function AddSection({ pageId, templates }: { pageId: number; templates: SavedSection[] }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  function add(fields: Record<string, string>) {
    const form = new FormData();
    form.set('pageId', String(pageId));
    for (const [key, value] of Object.entries(fields)) form.set(key, value);
    startTransition(async () => {
      const result = await addSectionAction(form);
      if (result?.error) toast('error', result.error);
      else {
        toast('ok', result?.message ?? 'Sezione aggiunta.');
        setOpen(false);
      }
    });
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="admin-btn w-full !min-h-12 sm:w-auto">
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M10 4v12M4 10h12" strokeLinecap="round" />
        </svg>
        Aggiungi sezione
      </button>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Aggiungi una sezione"
        description="Ogni sezione segue il design del sito: non puoi romperlo scegliendo quella sbagliata."
      >
        {templates.length > 0 && (
          <section className="mb-6">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-400">Sezioni salvate</h3>
            <ul className="space-y-2">
              {templates.map((template) => (
                <li key={template.id}>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => add({ templateId: String(template.id) })}
                    className="flex w-full items-center gap-3 rounded-lg border border-stone-200 bg-white p-3 text-left transition-colors hover:border-stone-900 disabled:opacity-50"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-stone-900">{template.name}</span>
                      <span className="block text-xs text-stone-600">
                        {blockRegistry[template.type]?.label ?? template.type}
                        {template.isGlobal
                          ? ' · globale: modificandola cambiano tutte le pagine'
                          : ' · verrà inserita come copia indipendente'}
                      </span>
                    </span>
                    {template.isGlobal && <span className="admin-chip admin-chip-global">globale</span>}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {blockFamilies.map((family) => {
          const blocks = Object.values(blockRegistry).filter((block) => block.family === family.id);
          if (!blocks.length) return null;
          return (
            <section key={family.id} className="mb-6 last:mb-0">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-400">{family.label}</h3>
              <ul className="space-y-2">
                {blocks.map((block) => (
                  <li key={block.type}>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => add({ type: block.type })}
                      className="flex w-full items-start gap-3 rounded-lg border border-stone-200 bg-white p-3 text-left transition-colors hover:border-stone-900 disabled:opacity-50"
                    >
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-stone-100 text-stone-700">
                        <svg viewBox="0 0 24 24" className="h-[1.1rem] w-[1.1rem]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d={block.icon} />
                        </svg>
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-stone-900">{block.label}</span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-stone-600">{block.description}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </Drawer>
    </>
  );
}
