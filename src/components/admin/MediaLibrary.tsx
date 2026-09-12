'use client';

import { AssetImage } from './AssetImage';
import { useActionState, useMemo, useRef, useState, useTransition } from 'react';
import { deleteMediaAction, updateMediaAction, type CmsState } from '@/app/admin/cms-actions';
import { Drawer } from './Drawer';
import { SubmitButton } from './SubmitButton';
import { useActionToast, useToast } from './Toasts';

/**
 * The media library screen.
 *
 * Filtering happens in the browser rather than on the server: the panel already
 * has the rows, the library is bounded by what one bar uploads, and typing that
 * costs a round trip per character would be slower and worse on a phone. The
 * picker inside the builder queries the server instead, because it has to see
 * uploads made since the page was rendered.
 */
type Asset = {
  id: number;
  path: string;
  originalName: string;
  alt: { it: string; en: string };
  sizeBytes: number;
  mimeType: string;
  /** A stand-in to be replaced with the owner's own photograph before launch. */
  isTemporary: boolean;
  sourceNote: string;
  createdAt: string;
};

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

export function MediaLibrary({ assets, maxMb }: { assets: Asset[]; maxMb: number }) {
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Asset | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const temporaryCount = useMemo(() => assets.filter((a) => a.isTemporary).length, [assets]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return assets;
    return assets.filter(
      (asset) =>
        asset.originalName.toLowerCase().includes(needle) ||
        asset.path.toLowerCase().includes(needle) ||
        asset.alt.it.toLowerCase().includes(needle),
    );
  }, [assets, query]);

  async function upload(files: FileList) {
    setUploading(true);
    let ok = 0;
    for (const file of Array.from(files)) {
      const data = new FormData();
      data.set('file', file);
      data.set('alt', file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '));
      try {
        const response = await fetch('/api/admin/upload', { method: 'POST', body: data });
        const result = (await response.json()) as { ok?: boolean; error?: string };
        if (response.ok && result.ok) ok += 1;
        else toast('error', `${file.name}: ${result.error ?? 'caricamento non riuscito'}`);
      } catch {
        toast('error', `${file.name}: connessione interrotta`);
      }
    }
    setUploading(false);
    if (fileInput.current) fileInput.current.value = '';
    if (ok) {
      toast('ok', ok === 1 ? 'Immagine caricata.' : `${ok} immagini caricate.`);
      // A full reload so the server component re-reads the list.
      window.location.reload();
    }
  }

  return (
    <div className="space-y-5">
      <div className="admin-card flex flex-wrap items-center gap-3 p-4">
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          disabled={uploading}
          className="admin-btn !min-h-11"
        >
          {uploading ? 'Caricamento…' : 'Carica immagini'}
        </button>
        {/* Visually hidden but still a real form control, so it needs a name
            of its own — the button above is a separate element. */}
        <input
          ref={fileInput}
          id="media-upload-input"
          aria-label="Scegli le immagini da caricare"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          className="sr-only"
          onChange={(event) => {
            if (event.target.files?.length) void upload(event.target.files);
          }}
        />
        <p className="text-xs text-stone-500">Max {maxMb} MB per file · JPG, PNG, WebP, AVIF, GIF</p>

        <div className="ml-auto w-full sm:w-56">
          <label htmlFor="media-filter" className="sr-only">
            Cerca fra le immagini
          </label>
          <input
            id="media-filter"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cerca…"
            className="admin-field"
          />
        </div>
      </div>

      {temporaryCount > 0 && (
        <div className="admin-card border-amber-300 bg-amber-100/70 p-4">
          <h2 className="text-sm font-semibold text-amber-900">
            {temporaryCount} {temporaryCount === 1 ? 'immagine temporanea' : 'immagini temporanee'}
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-amber-900">
            Sono fotografie di repertorio: servono solo a far vedere come viene il sito con delle foto vere. Prima di
            andare online sostituiscile con le tue — carica la foto e poi selezionala dove serve. Le riconosci
            dall’etichetta <strong className="font-semibold">temporanea</strong>.
          </p>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="admin-card px-5 py-12 text-center">
          <p className="text-sm font-medium text-stone-700">
            {query ? 'Nessuna immagine trovata.' : 'La libreria è vuota.'}
          </p>
          <p className="mx-auto mt-1 max-w-md text-sm text-stone-500">
            {query
              ? 'Prova con un’altra parola, o con una parte del nome del file.'
              : 'Carica le prime foto: serviranno per gli hero, la galleria e le schede dei cocktail.'}
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((asset) => (
            <li key={asset.id}>
              <button
                type="button"
                onClick={() => setEditing(asset)}
                className="admin-card block w-full overflow-hidden text-left transition-colors hover:border-stone-400"
              >
                <span className="relative block aspect-square bg-stone-100">
                  <AssetImage
                    src={asset.path}
                    alt={asset.alt.it || asset.originalName}
                    sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover"
                  />
                </span>
                <span className="block p-2.5">
                  <span className="block truncate text-xs font-medium text-stone-800">{asset.originalName}</span>
                  <span className="mt-0.5 flex flex-wrap items-center gap-1.5">
                    <span className="text-[0.68rem] text-stone-600">{formatSize(asset.sizeBytes)}</span>
                    {asset.isTemporary && <span className="admin-chip admin-chip-draft">temporanea</span>}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {editing && <AssetDrawer asset={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

function AssetDrawer({ asset, onClose }: { asset: Asset; onClose: () => void }) {
  const [state, formAction] = useActionState<CmsState, FormData>(updateMediaAction, {});
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const toast = useToast();
  useActionToast(state);

  return (
    <Drawer open onClose={onClose} title={asset.originalName} description={`${formatSize(asset.sizeBytes)} · ${asset.mimeType}`}>
      <div className="relative mb-4 aspect-video overflow-hidden rounded-lg bg-stone-100">
        <AssetImage src={asset.path} alt={asset.alt.it || asset.originalName} sizes="480px" className="object-contain" />
      </div>

      {asset.isTemporary && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
          <p className="text-sm font-semibold text-amber-900">Immagine temporanea</p>
          <p className="mt-0.5 text-xs leading-relaxed text-amber-900">
            Da sostituire con una tua fotografia prima del lancio.
            {asset.sourceNote ? ` Origine: ${asset.sourceNote}.` : ''}
          </p>
        </div>
      )}

      <div className="mb-4">
        <span className="admin-label">Percorso</span>
        <div className="flex items-center gap-2">
          <code className="min-w-0 flex-1 truncate rounded bg-stone-100 px-2 py-1.5 text-xs">{asset.path}</code>
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard?.writeText(asset.path).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              });
            }}
            className="admin-btn admin-btn-secondary !min-h-10 !px-3 text-xs"
          >
            {copied ? 'Copiato' : 'Copia'}
          </button>
        </div>
      </div>

      <form action={formAction} className="space-y-3">
        <input type="hidden" name="mediaId" value={asset.id} />
        <div>
          <label htmlFor="alt-it" className="admin-label">
            Descrizione (italiano)
          </label>
          <input id="alt-it" name="alt.it" type="text" defaultValue={asset.alt.it} className="admin-field" />
        </div>
        <div>
          <label htmlFor="alt-en" className="admin-label">
            Descrizione (inglese)
          </label>
          <input id="alt-en" name="alt.en" type="text" defaultValue={asset.alt.en} className="admin-field" />
        </div>
        <p className="text-xs text-stone-500">
          È quello che legge chi non può vedere la foto, e che Google usa per capirla. Descrivi cosa si vede, non
          ripetere il nome del file.
        </p>
        <SubmitButton className="!min-h-11 w-full">Salva descrizione</SubmitButton>
      </form>

      <hr className="my-5 border-stone-200" />

      {confirming ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-900">
            Eliminare questa immagine? Se è usata in qualche sezione, lì resterà un buco.
          </p>
          <div className="mt-2.5 flex gap-2">
            <button type="button" onClick={() => setConfirming(false)} className="admin-btn admin-btn-secondary !min-h-11">
              Annulla
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                const form = new FormData();
                form.set('mediaId', String(asset.id));
                startTransition(async () => {
                  const result = await deleteMediaAction(form);
                  if (result?.error) toast('error', result.error);
                  else {
                    toast('ok', result?.message ?? 'Immagine eliminata.');
                    onClose();
                    window.location.reload();
                  }
                });
              }}
              className="admin-btn admin-btn-danger !min-h-11 flex-1"
            >
              Sì, elimina
            </button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setConfirming(true)} className="min-h-11 text-sm text-red-700 hover:underline">
          Elimina questa immagine
        </button>
      )}
    </Drawer>
  );
}
