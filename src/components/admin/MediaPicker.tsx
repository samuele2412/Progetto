'use client';

import { AssetImage } from './AssetImage';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Drawer } from './Drawer';
import { useToast } from './Toasts';

/**
 * "Scegli dalla libreria" — the thing that replaces typing a path by hand.
 *
 * Uploading from inside the picker matters more than it looks: the moment you
 * have to leave the section you are editing, go to the media page, upload, copy
 * a path and come back, the builder stops being usable from a phone. So the
 * same sheet does both, and a fresh upload is selected immediately.
 */
export type MediaItem = {
  id: number;
  path: string;
  originalName: string;
  alt: { it: string; en: string };
  sizeBytes: number;
  mimeType: string;
};

export function MediaPicker({
  open,
  onClose,
  onSelect,
  title = 'Scegli un’immagine',
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (item: MediaItem) => void;
  title?: string;
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const load = useCallback(async (search: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/media?q=${encodeURIComponent(search)}`);
      const result = (await response.json()) as { ok?: boolean; items?: MediaItem[]; error?: string };
      if (!response.ok || !result.ok) {
        setError(result.error ?? 'Impossibile leggere la libreria.');
        setItems([]);
        return;
      }
      setItems(result.items ?? []);
    } catch {
      setError('Connessione interrotta.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced so typing does not fire a request per character.
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => void load(query), query ? 250 : 0);
    return () => clearTimeout(timer);
  }, [open, query, load]);

  async function upload(file: File) {
    setUploading(true);
    setError(null);
    const data = new FormData();
    data.set('file', file);
    data.set('alt', file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '));
    try {
      const response = await fetch('/api/admin/upload', { method: 'POST', body: data });
      const result = (await response.json()) as { ok?: boolean; path?: string; error?: string };
      if (!response.ok || !result.ok || !result.path) {
        setError(result.error ?? 'Caricamento non riuscito.');
        return;
      }
      toast('ok', 'Immagine caricata.');
      // Pick it straight away: uploading here always means "I want this one".
      onSelect({
        id: 0,
        path: result.path,
        originalName: file.name,
        alt: { it: '', en: '' },
        sizeBytes: file.size,
        mimeType: file.type,
      });
      onClose();
    } catch {
      setError('Connessione interrotta durante il caricamento.');
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  }

  return (
    <Drawer open={open} onClose={onClose} title={title} description="Carica una nuova immagine oppure scegline una già presente.">
      <div className="space-y-4">
        <div>
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={uploading}
            className="admin-btn w-full"
          >
            {uploading ? 'Caricamento…' : 'Carica una nuova immagine'}
          </button>
          <input
            ref={fileInput}
            id="picker-upload-input"
            aria-label="Scegli un’immagine da caricare"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void upload(file);
            }}
          />
        </div>

        <div>
          <label htmlFor="media-search" className="admin-label">
            Cerca
          </label>
          <input
            id="media-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nome del file o descrizione"
            className="admin-field"
          />
        </div>

        {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}

        {loading ? (
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="aspect-square animate-pulse rounded-lg bg-stone-200" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-stone-300 px-4 py-10 text-center">
            <p className="text-sm text-stone-600">
              {query ? 'Nessuna immagine trovata.' : 'La libreria è vuota.'}
            </p>
            <p className="mt-1 text-xs text-stone-600">
              {query ? 'Prova con un’altra parola.' : 'Carica la prima immagine con il bottone qui sopra.'}
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className="group block w-full overflow-hidden rounded-lg border border-stone-200 bg-white text-left transition-colors hover:border-stone-900 focus-visible:border-stone-900"
                >
                  <span className="relative block aspect-square bg-stone-100">
                    <AssetImage
                      src={item.path}
                      alt={item.alt.it || item.originalName}
                      sizes="120px"
                      className="object-cover"
                    />
                  </span>
                  <span className="block truncate px-1.5 py-1 text-[0.68rem] text-stone-600">
                    {item.originalName}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Drawer>
  );
}
