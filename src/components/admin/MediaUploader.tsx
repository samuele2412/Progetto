'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function MediaUploader() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const file = data.get('file');
    if (!(file instanceof File) || file.size === 0) {
      setError('Scegli un file.');
      return;
    }

    setBusy(true);
    setError(null);
    setUploaded(null);

    try {
      const response = await fetch('/api/admin/upload', { method: 'POST', body: data });
      const result = (await response.json()) as { ok?: boolean; path?: string; error?: string };
      if (!response.ok || !result.ok) {
        setError(result.error ?? 'Caricamento non riuscito.');
      } else {
        setUploaded(result.path ?? null);
        form.reset();
        router.refresh();
      }
    } catch {
      setError('Connessione interrotta durante il caricamento.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="admin-card p-5">
      <label htmlFor="file" className="admin-label">
        Nuova immagine (max 6 MB — JPG, PNG, WebP, AVIF)
      </label>
      <input
        id="file"
        name="file"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        className="admin-field !py-2"
      />

      <label htmlFor="alt" className="admin-label mt-4">
        Descrizione per l’accessibilità
      </label>
      <input id="alt" name="alt" type="text" placeholder="Es. bancone montato in terrazza" className="admin-field" />

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </p>
      )}
      {uploaded && (
        <p role="status" className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          Caricata. Percorso da incollare: <code className="font-mono">{uploaded}</code>
        </p>
      )}

      <button type="submit" disabled={busy} className="admin-btn mt-5">
        {busy ? 'Caricamento…' : 'Carica'}
      </button>
    </form>
  );
}
