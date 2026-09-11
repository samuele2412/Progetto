'use client';

import { useActionState, useState, useTransition } from 'react';
import {
  deletePageAction,
  duplicatePageAction,
  publishPageAction,
  restoreVersionAction,
  savePageSettingsAction,
  setPageManagedAction,
  unpublishPageAction,
  type CmsState,
} from '@/app/admin/cms-actions';
import { MediaPicker } from '../MediaPicker';
import { SubmitButton } from '../SubmitButton';
import { useActionToast, useToast } from '../Toasts';
import { AddSection, type SavedSection } from './AddSection';
import type { Catalogues } from './FieldRenderer';
import { PreviewPane } from './PreviewPane';
import { SectionList, type BuilderSection } from './SectionList';

/**
 * The page editor.
 *
 * Three tabs rather than one long screen, because the three things you do to a
 * page are genuinely different tasks: arranging it, describing it for search
 * engines, and looking at the result. On a phone a single column containing all
 * of that is unusable, and tabs cost nothing on a laptop.
 */
type PageInfo = {
  id: number;
  routeKey: string | null;
  managed: boolean;
  status: 'draft' | 'published';
  hasUnpublishedChanges: boolean;
  publishedAt: string | null;
  slugIt: string;
  slugEn: string;
  title: { it: string; en: string };
  seoTitle: { it: string; en: string };
  seoDescription: { it: string; en: string };
  ogTitle: { it: string; en: string };
  ogDescription: { it: string; en: string };
  ogImagePath: string;
  canonicalUrl: string;
  noIndex: boolean;
  inNavigation: boolean;
};

type VersionInfo = { id: number; version: number; label: string; createdAt: string; createdBy: string };

const TABS = [
  { id: 'build', label: 'Struttura' },
  { id: 'seo', label: 'SEO e indirizzo' },
  { id: 'preview', label: 'Anteprima' },
] as const;

export function PageWorkspace({
  page,
  sections,
  templates,
  catalogues,
  versions,
}: {
  page: PageInfo;
  sections: BuilderSection[];
  templates: SavedSection[];
  catalogues: Catalogues;
  versions: VersionInfo[];
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('build');
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  const run = (
    action: (form: FormData) => Promise<CmsState | void>,
    extra: Record<string, string> = {},
  ) => {
    const form = new FormData();
    form.set('pageId', String(page.id));
    for (const [key, value] of Object.entries(extra)) form.set(key, value);
    startTransition(async () => {
      const result = await action(form);
      if (result?.error) toast('error', result.error);
      else if (result?.message) toast('ok', result.message);
    });
  };

  const live = page.status === 'published';
  const dirty = page.hasUnpublishedChanges;

  return (
    <div className="space-y-5">
      <header className="admin-card p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-xl sm:text-2xl">{page.title.it || 'Senza titolo'}</h1>
            <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-stone-500">
              <span className="truncate">/it/{page.slugIt}</span>
              {live ? <span className="admin-chip admin-chip-live">online</span> : <span className="admin-chip admin-chip-draft">bozza</span>}
              {dirty && live && <span className="admin-chip admin-chip-draft">modifiche non pubblicate</span>}
              {page.routeKey && !page.managed && <span className="admin-chip">renderizzata dal codice</span>}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`/it/anteprima/${page.id}`}
              target="_blank"
              rel="noreferrer"
              className="admin-btn admin-btn-secondary !min-h-11"
            >
              Anteprima ↗
            </a>
            <button
              type="button"
              disabled={pending}
              onClick={() => run(publishPageAction)}
              className="admin-btn !min-h-11"
            >
              {dirty || !live ? 'Pubblica' : 'Ripubblica'}
            </button>
          </div>
        </div>

        {dirty && (
          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
            Le modifiche sono salvate ma <strong className="font-semibold">non sono ancora sul sito</strong>. Guardale
            con l’anteprima e poi premi Pubblica.
          </p>
        )}
      </header>

      <div className="flex gap-1 overflow-x-auto rounded-lg bg-stone-200/60 p-1">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            aria-pressed={tab === item.id}
            className={[
              'min-h-11 whitespace-nowrap rounded-md px-4 text-sm font-medium transition-colors',
              tab === item.id ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900',
            ].join(' ')}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'build' && (
        <div className="space-y-4">
          {page.routeKey && !page.managed && (
            <div className="admin-card border-indigo-200 bg-indigo-50/60 p-4">
              <h2 className="text-sm font-semibold text-indigo-950">Questa pagina è ancora quella del codice</h2>
              <p className="mt-1 text-sm leading-relaxed text-indigo-900">
                Le sezioni che aggiungi qui non compaiono sul sito finché non affidi la pagina al Page Builder. Puoi
                prepararla con calma, guardarla in anteprima e cambiare idea in qualsiasi momento: il codice originale
                resta al suo posto.
              </p>
              <button
                type="button"
                disabled={pending}
                onClick={() => run(setPageManagedAction, { managed: 'true' })}
                className="admin-btn !min-h-11 mt-3"
              >
                Affida questa pagina al Page Builder
              </button>
            </div>
          )}

          {page.routeKey && page.managed && (
            <div className="admin-card p-4">
              <p className="text-sm text-stone-600">
                Questa pagina è gestita dal Page Builder. Puoi tornare alla versione originale del codice quando vuoi.
              </p>
              <button
                type="button"
                disabled={pending}
                onClick={() => run(setPageManagedAction, { managed: 'false' })}
                className="admin-btn admin-btn-secondary !min-h-11 mt-3"
              >
                Torna alla versione del codice
              </button>
            </div>
          )}

          <SectionList pageId={page.id} sections={sections} catalogues={catalogues} />

          <AddSection pageId={page.id} templates={templates} />

          {versions.length > 0 && <VersionHistory pageId={page.id} versions={versions} />}
        </div>
      )}

      {tab === 'seo' && <SeoForm page={page} />}

      {tab === 'preview' && <PreviewPane src={`/it/anteprima/${page.id}`} />}

      {tab === 'seo' && !page.routeKey && <DangerZone pageId={page.id} live={live} />}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function SeoForm({ page }: { page: PageInfo }) {
  const [state, formAction] = useActionState<CmsState, FormData>(savePageSettingsAction, {});
  const [ogImage, setOgImage] = useState(page.ogImagePath);
  const [picking, setPicking] = useState(false);
  useActionToast(state);

  const locked = Boolean(page.routeKey);

  return (
    <form action={formAction} className="admin-card space-y-5 p-4 sm:p-5">
      <input type="hidden" name="pageId" value={page.id} />
      <input type="hidden" name="ogImagePath" value={ogImage} />

      {state.error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p>
      )}

      <Pair name="title" label="Titolo della pagina" defaults={page.title} required />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="slugIt" className="admin-label">
            Indirizzo italiano
          </label>
          <div className="flex items-center gap-1.5">
            <span className="shrink-0 text-sm text-stone-500">/it/</span>
            <input
              id="slugIt"
              name="slugIt"
              type="text"
              defaultValue={page.slugIt}
              disabled={locked}
              className="admin-field disabled:bg-stone-100 disabled:text-stone-500"
            />
          </div>
        </div>
        <div>
          <label htmlFor="slugEn" className="admin-label">
            Indirizzo inglese
          </label>
          <div className="flex items-center gap-1.5">
            <span className="shrink-0 text-sm text-stone-500">/en/</span>
            <input
              id="slugEn"
              name="slugEn"
              type="text"
              defaultValue={page.slugEn}
              disabled={locked}
              className="admin-field disabled:bg-stone-100 disabled:text-stone-500"
            />
          </div>
        </div>
      </div>
      {locked && (
        <p className="-mt-2 text-xs text-stone-500">
          L’indirizzo di una pagina che esiste nel codice non è modificabile da qui: cambiarlo romperebbe i link
          esistenti.
        </p>
      )}

      <hr className="border-stone-200" />

      <Pair
        name="seoTitle"
        label="Titolo per Google"
        defaults={page.seoTitle}
        hint="Circa 60 caratteri. Se lo lasci vuoto viene usato il titolo della pagina."
      />
      <Pair
        name="seoDescription"
        label="Descrizione per Google"
        defaults={page.seoDescription}
        multiline
        hint="Circa 155 caratteri. È la riga che si legge sotto il titolo nei risultati di ricerca."
      />

      <hr className="border-stone-200" />

      <Pair name="ogTitle" label="Titolo quando il link viene condiviso" defaults={page.ogTitle} hint="Opzionale: se vuoto viene usato il titolo per Google." />
      <Pair name="ogDescription" label="Descrizione quando il link viene condiviso" defaults={page.ogDescription} multiline />

      <div>
        <span className="admin-label">Immagine di condivisione</span>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setPicking(true)} className="admin-btn admin-btn-secondary !min-h-11">
            {ogImage ? 'Sostituisci' : 'Scegli dalla libreria'}
          </button>
          {ogImage && (
            <>
              <span className="truncate text-xs text-stone-500">{ogImage}</span>
              <button
                type="button"
                onClick={() => setOgImage('')}
                className="min-h-11 px-1 text-sm text-red-700 hover:underline"
              >
                Togli
              </button>
            </>
          )}
        </div>
        <p className="mt-1 text-xs text-stone-500">
          Se la lasci vuota viene usata l’immagine predefinita del sito.
        </p>
      </div>

      <div>
        <label htmlFor="canonicalUrl" className="admin-label">
          Canonical personalizzato
        </label>
        <input
          id="canonicalUrl"
          name="canonicalUrl"
          type="url"
          defaultValue={page.canonicalUrl}
          placeholder="Lascia vuoto: quasi sempre è la scelta giusta"
          className="admin-field"
        />
        <p className="mt-1 text-xs text-stone-500">
          Serve solo se questa pagina duplica il contenuto di un’altra e vuoi dire a Google quale è l’originale.
        </p>
      </div>

      <div className="space-y-2">
        <label className="flex min-h-11 cursor-pointer items-start gap-2.5">
          <input type="checkbox" name="noIndex" defaultChecked={page.noIndex} className="mt-1 h-4 w-4 accent-stone-900" />
          <span className="text-sm text-stone-800">
            Escludi dai motori di ricerca
            <span className="block text-xs text-stone-500">
              La pagina resta raggiungibile da chi ha il link, ma sparisce da Google e dalla sitemap.
            </span>
          </span>
        </label>
        <label className="flex min-h-11 cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            name="inNavigation"
            defaultChecked={page.inNavigation}
            className="mt-1 h-4 w-4 accent-stone-900"
          />
          <span className="text-sm text-stone-800">
            Mostra nel menu “Eventi” del sito
            <span className="block text-xs text-stone-500">Vale solo per le pagine pubblicate.</span>
          </span>
        </label>
      </div>

      <div className="flex justify-end pt-1">
        <SubmitButton className="!min-h-11">Salva bozza</SubmitButton>
      </div>

      <MediaPicker
        open={picking}
        onClose={() => setPicking(false)}
        onSelect={(item) => setOgImage(item.path)}
        title="Immagine di condivisione"
      />
    </form>
  );
}

function Pair({
  name,
  label,
  defaults,
  hint,
  multiline,
  required,
}: {
  name: string;
  label: string;
  defaults: { it: string; en: string };
  hint?: string;
  multiline?: boolean;
  required?: boolean;
}) {
  const Field = multiline ? 'textarea' : 'input';
  // Same shape as the builder's localised field: a fieldset for the pair and a
  // per-language name on each input, so neither is announced as unlabelled.
  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend className="admin-label">{label}</legend>
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <label htmlFor={`${name}-it`} className="mt-2 w-7 shrink-0 text-[0.65rem] font-semibold uppercase tracking-wider text-stone-600">
            it
          </label>
          <Field
            id={`${name}-it`}
            name={`${name}.it`}
            aria-label={`${label} — italiano`}
            defaultValue={defaults.it}
            required={required}
            {...(multiline ? { rows: 2 } : { type: 'text' })}
            className="admin-field"
          />
        </div>
        <div className="flex items-start gap-2">
          <label htmlFor={`${name}-en`} className="mt-2 w-7 shrink-0 text-[0.65rem] font-semibold uppercase tracking-wider text-stone-600">
            en
          </label>
          <Field
            id={`${name}-en`}
            name={`${name}.en`}
            aria-label={`${label} — inglese`}
            defaultValue={defaults.en}
            placeholder="Se vuoto viene usato l’italiano"
            {...(multiline ? { rows: 2 } : { type: 'text' })}
            className="admin-field"
          />
        </div>
      </div>
      {hint && <p className="mt-1 text-xs text-stone-600">{hint}</p>}
    </fieldset>
  );
}

function VersionHistory({ pageId, versions }: { pageId: number; versions: VersionInfo[] }) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState<number | null>(null);
  const toast = useToast();

  const restore = (versionId: number) => {
    const form = new FormData();
    form.set('pageId', String(pageId));
    form.set('versionId', String(versionId));
    startTransition(async () => {
      const result = await restoreVersionAction(form);
      if (result?.error) toast('error', result.error);
      else if (result?.message) toast('ok', result.message);
      setConfirming(null);
    });
  };

  return (
    <details className="admin-card p-4">
      <summary className="min-h-11 cursor-pointer text-sm font-semibold text-stone-800">
        Versioni pubblicate ({versions.length})
      </summary>
      <p className="mt-2 text-xs leading-relaxed text-stone-500">
        Ogni pubblicazione salva una copia. Ripristinandone una la ritrovi come bozza: il sito non cambia finché non
        pubblichi di nuovo.
      </p>
      <ul className="mt-3 space-y-1.5">
        {versions.map((version) => (
          <li key={version.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-stone-200 p-2.5">
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-stone-900">
                Versione {version.version}
                {version.label ? ` — ${version.label}` : ''}
              </span>
              <span className="block text-xs text-stone-500">
                {new Date(version.createdAt).toLocaleString('it-IT')} · {version.createdBy || 'sconosciuto'}
              </span>
            </span>
            {confirming === version.id ? (
              <span className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setConfirming(null)}
                  className="min-h-9 px-1 text-xs text-stone-600 hover:underline"
                >
                  Annulla
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => restore(version.id)}
                  className="admin-btn !min-h-9 !px-3 !py-1 !text-xs"
                >
                  Conferma
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setConfirming(version.id)}
                className="admin-btn admin-btn-secondary !min-h-9 !px-3 !py-1 !text-xs"
              >
                Ripristina
              </button>
            )}
          </li>
        ))}
      </ul>
    </details>
  );
}

function DangerZone({ pageId, live }: { pageId: number; live: boolean }) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const toast = useToast();

  return (
    <div className="admin-card border-red-200 p-4 sm:p-5">
      <h2 className="text-sm font-semibold text-stone-900">Altre azioni</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        <form action={duplicatePageAction}>
          <input type="hidden" name="pageId" value={pageId} />
          <SubmitButton variant="secondary" className="!min-h-11" pendingLabel="Duplicazione…">
            Duplica la pagina
          </SubmitButton>
        </form>

        {live && (
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              const form = new FormData();
              form.set('pageId', String(pageId));
              startTransition(async () => {
                const result = await unpublishPageAction(form);
                if (result?.error) toast('error', result.error);
                else if (result?.message) toast('ok', result.message);
              });
            }}
            className="admin-btn admin-btn-secondary !min-h-11"
          >
            Ritira dal sito
          </button>
        )}
      </div>

      <hr className="my-4 border-stone-200" />

      {confirming ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-900">
            Eliminare questa pagina e tutte le sue sezioni? L’operazione non si può annullare.
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="admin-btn admin-btn-secondary !min-h-11"
            >
              Annulla
            </button>
            <form action={deletePageAction}>
              <input type="hidden" name="pageId" value={pageId} />
              <SubmitButton variant="danger" className="!min-h-11">
                Sì, elimina
              </SubmitButton>
            </form>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="min-h-11 text-sm text-red-700 hover:underline"
        >
          Elimina questa pagina
        </button>
      )}
    </div>
  );
}
