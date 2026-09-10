'use client';

import { useActionState, useState } from 'react';
import type { FieldDef } from '@/lib/admin/collections';
import { deleteCollectionItem, saveCollectionItem, type ActionState } from '@/app/admin/actions';
import { Field } from './Fields';
import { SubmitButton } from './SubmitButton';

const initialState: ActionState = {};

/**
 * One editor for every collection. Each record gets a collapsed `<details>`
 * holding its own form, so the page stays readable with forty cocktails on it
 * and a save only ever posts the record being edited.
 */
export function CollectionEditor({
  slug,
  fields,
  rows,
  labelFor,
}: {
  /** Only the serialisable half of the collection definition crosses the
   *  server/client boundary — the Drizzle table object never does. */
  slug: string;
  fields: FieldDef[];
  rows: Record<string, unknown>[];
  /** Pre-computed heading for each row (the server resolves localised titles). */
  labelFor: Record<number, string>;
}) {
  const [creating, setCreating] = useState(rows.length === 0);

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <RecordForm
          key={String(row.id)}
          slug={slug}
          fields={fields}
          row={row}
          title={labelFor[Number(row.id)] ?? `#${row.id}`}
        />
      ))}

      {creating ? (
        <RecordForm slug={slug} fields={fields} row={null} title="Nuovo elemento" defaultOpen />
      ) : (
        <button type="button" onClick={() => setCreating(true)} className="admin-btn admin-btn-secondary">
          + Aggiungi
        </button>
      )}
    </div>
  );
}

function RecordForm({
  slug,
  fields,
  row,
  title,
  defaultOpen = false,
}: {
  slug: string;
  fields: FieldDef[];
  row: Record<string, unknown> | null;
  title: string;
  defaultOpen?: boolean;
}) {
  const [state, formAction] = useActionState(saveCollectionItem, initialState);
  const idPrefix = `${slug}-${row ? String(row.id) : 'new'}`;
  const isInactive = row ? row.active === false || row.published === false : false;

  return (
    <details open={defaultOpen} className="admin-card overflow-hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
        <span className="flex min-w-0 items-center gap-3">
          <span className="truncate font-medium text-stone-900">{title}</span>
          {isInactive && (
            <span className="shrink-0 rounded-full border border-stone-300 bg-stone-100 px-2 py-0.5 text-[0.68rem] font-medium text-stone-600">
              nascosto
            </span>
          )}
        </span>
        <span className="shrink-0 text-xs text-stone-500">modifica</span>
      </summary>

      <form action={formAction} className="border-t border-stone-200 p-5">
        <input type="hidden" name="__collection" value={slug} />
        {row && <input type="hidden" name="__id" value={String(row.id)} />}

        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <Field key={field.name} field={field} value={row?.[field.name]} idPrefix={idPrefix} />
          ))}
        </div>

        {state.error && (
          <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {state.error}
          </p>
        )}
        {state.ok && (
          <p role="status" className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            {state.message}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <SubmitButton>Salva</SubmitButton>
          {row && <DeleteButton collection={slug} id={Number(row.id)} />}
        </div>
      </form>
    </details>
  );
}

function DeleteButton({ collection, id }: { collection: string; id: number }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button type="button" onClick={() => setConfirming(true)} className="text-sm text-red-700 hover:underline">
        Elimina
      </button>
    );
  }

  return (
    <span className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5">
      <span className="text-sm text-red-800">Eliminare definitivamente?</span>
      <form action={deleteCollectionItem}>
        <input type="hidden" name="__collection" value={collection} />
        <input type="hidden" name="__id" value={String(id)} />
        <SubmitButton variant="danger" pendingLabel="…" className="!min-h-0 !px-2.5 !py-1 !text-xs">
          Sì, elimina
        </SubmitButton>
      </form>
      <button type="button" onClick={() => setConfirming(false)} className="text-xs text-stone-600 hover:underline">
        Annulla
      </button>
    </span>
  );
}
