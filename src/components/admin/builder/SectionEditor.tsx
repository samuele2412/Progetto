'use client';

import { useActionState, useEffect, useState, useTransition } from 'react';
import { saveSectionTemplateAction, updateSectionAction, type CmsState } from '@/app/admin/cms-actions';
import { getBlockDefinition } from '@/lib/blocks';
import { Drawer } from '../Drawer';
import { SubmitButton } from '../SubmitButton';
import { useActionToast, useToast } from '../Toasts';
import { FieldRenderer, type Catalogues } from './FieldRenderer';

/**
 * The drawer that edits one section.
 *
 * Everything is kept in local state and posted as a single JSON blob, rather
 * than as a form of named inputs. That is what lets a block have nested shapes
 * — a list of images, a repeater of FAQ entries — without inventing a naming
 * convention like `items[2].question.it` that both sides then have to agree on.
 * The server parses the JSON against the block's schema, so the fact that it
 * arrived as one field costs nothing in validation.
 */
export function SectionEditor({
  pageId,
  section,
  catalogues,
  onClose,
}: {
  pageId: number;
  section: { id: number; type: string; config: Record<string, unknown>; templateName: string | null };
  catalogues: Catalogues;
  onClose: () => void;
}) {
  const definition = getBlockDefinition(section.type);
  const [config, setConfig] = useState<Record<string, unknown>>(section.config);
  const [tab, setTab] = useState(definition?.groups[0]?.id ?? '');
  const [state, formAction] = useActionState<CmsState, FormData>(updateSectionAction, {});
  useActionToast(state);

  // Close once the save has gone through, so the list behind shows the change.
  useEffect(() => {
    if (state.ok === true) onClose();
  }, [state, onClose]);

  if (!definition) {
    return (
      <Drawer open onClose={onClose} title="Sezione sconosciuta">
        <p className="text-sm text-stone-600">
          Questa sezione usa un tipo che non esiste più in questa versione del sito. Puoi eliminarla dalla lista.
        </p>
      </Drawer>
    );
  }

  const set = (name: string, value: unknown) => setConfig((current) => ({ ...current, [name]: value }));
  const groups = definition.groups.filter((group) => group.fields.length > 0);
  const active = groups.find((group) => group.id === tab) ?? groups[0];

  return (
    <Drawer
      open
      onClose={onClose}
      title={definition.label}
      description={section.templateName ? `Sezione globale “${section.templateName}”` : definition.description}
      footer={
        <form action={formAction} className="flex items-center justify-between gap-3">
          <input type="hidden" name="pageId" value={pageId} />
          <input type="hidden" name="sectionId" value={section.id} />
          <input type="hidden" name="config" value={JSON.stringify(config)} />
          <button type="button" onClick={onClose} className="admin-btn admin-btn-secondary !min-h-11">
            Annulla
          </button>
          <SubmitButton className="!min-h-11 flex-1 sm:flex-none">Salva bozza</SubmitButton>
        </form>
      }
    >
      {section.templateName && (
        <p className="mb-4 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs leading-relaxed text-indigo-900">
          Questa è una <strong className="font-semibold">sezione globale</strong>: salvando, la modifica vale per tutte
          le pagine che la usano.
        </p>
      )}

      {state.error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p>
      )}

      {groups.length > 1 && (
        <div className="mb-5 flex flex-wrap gap-1 rounded-lg bg-stone-200/60 p-1">
          {groups.map((group) => (
            <button
              key={group.id}
              type="button"
              onClick={() => setTab(group.id)}
              aria-pressed={active?.id === group.id}
              className={[
                'min-h-10 flex-1 rounded-md px-3 text-sm font-medium transition-colors',
                active?.id === group.id ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900',
              ].join(' ')}
            >
              {group.label}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-5">
        {active?.fields.map((field) => (
          <FieldRenderer key={field.name} field={field} config={config} set={set} catalogues={catalogues} />
        ))}
      </div>

      {!section.templateName && <SaveAsTemplate pageId={pageId} sectionId={section.id} />}
    </Drawer>
  );
}

/**
 * Turns the section into something reusable.
 *
 * The global switch is worded as a consequence rather than as a setting,
 * because it is the one choice here that can change pages the owner is not
 * looking at — and the default, an independent copy, is the one that cannot.
 */
function SaveAsTemplate({ pageId, sectionId }: { pageId: number; sectionId: number }) {
  const [name, setName] = useState('');
  const [isGlobal, setIsGlobal] = useState(false);
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  return (
    <details className="mt-6 rounded-lg border border-stone-200 bg-white p-3">
      <summary className="min-h-11 cursor-pointer text-sm font-medium text-stone-700">
        Salva come sezione riutilizzabile
      </summary>
      <p className="mt-2 text-xs leading-relaxed text-stone-600">
        La ritrovi in “Aggiungi sezione” su qualsiasi pagina. Salva prima le modifiche: viene registrata la versione
        attualmente memorizzata.
      </p>
      <div className="mt-3 space-y-3">
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nome, es. “CTA preventivo”"
          className="admin-field"
        />
        <label className="flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            checked={isGlobal}
            onChange={(event) => setIsGlobal(event.target.checked)}
            className="mt-1 h-4 w-4 accent-stone-900"
          />
          <span className="text-sm text-stone-800">
            Rendila globale
            <span className="block text-xs text-stone-600">
              Modificandola in futuro cambieranno insieme tutte le pagine che la usano. Senza la spunta, ogni
              inserimento è una copia indipendente.
            </span>
          </span>
        </label>
        <button
          type="button"
          disabled={pending || !name.trim()}
          onClick={() => {
            const form = new FormData();
            form.set('pageId', String(pageId));
            form.set('sectionId', String(sectionId));
            form.set('name', name.trim());
            if (isGlobal) form.set('isGlobal', 'on');
            startTransition(async () => {
              const result = await saveSectionTemplateAction(form);
              if (result?.error) toast('error', result.error);
              else {
                toast('ok', result?.message ?? 'Sezione salvata.');
                setName('');
              }
            });
          }}
          className="admin-btn admin-btn-secondary !min-h-11 w-full"
        >
          Salva sezione
        </button>
      </div>
    </details>
  );
}
