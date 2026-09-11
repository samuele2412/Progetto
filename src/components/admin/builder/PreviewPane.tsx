'use client';

import { useState } from 'react';

/**
 * The draft preview, framed at the three widths the site is tested at.
 *
 * An iframe pointed at the real preview route rather than a re-implementation
 * of the page inside the panel: a preview that renders through different code
 * than the site is a preview of nothing. The widths match the responsive audit
 * (390 / 768 / full), so "it looks right here" and "it passes the audit" mean
 * the same thing.
 */
const DEVICES = [
  { id: 'mobile', label: 'Telefono', width: 390 },
  { id: 'tablet', label: 'Tablet', width: 768 },
  { id: 'desktop', label: 'Desktop', width: 0 },
] as const;

export function PreviewPane({ src }: { src: string }) {
  const [device, setDevice] = useState<(typeof DEVICES)[number]['id']>('desktop');
  const [nonce, setNonce] = useState(0);
  const active = DEVICES.find((item) => item.id === device) ?? DEVICES[2];

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex gap-1 rounded-lg bg-stone-200/60 p-1">
          {DEVICES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setDevice(item.id)}
              aria-pressed={device === item.id}
              className={[
                'min-h-10 rounded-md px-3 text-sm font-medium transition-colors',
                device === item.id ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900',
              ].join(' ')}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setNonce((value) => value + 1)}
          className="admin-btn admin-btn-secondary !min-h-10 text-sm"
        >
          Aggiorna
        </button>
        <a href={src} target="_blank" rel="noreferrer" className="admin-btn admin-btn-secondary !min-h-10 text-sm">
          Apri in una scheda ↗
        </a>
      </div>

      <div className="admin-preview-frame" style={{ maxWidth: active.width ? `${active.width}px` : '100%' }}>
        <iframe
          key={nonce}
          src={src}
          title="Anteprima della pagina"
          className="h-[70vh] min-h-[420px] w-full"
          // The preview renders our own draft, but it is still content someone
          // typed: the sandbox keeps it from navigating the panel away or
          // opening anything, while same-origin lets the session cookie through
          // so the preview route can authenticate.
          sandbox="allow-same-origin allow-scripts"
        />
      </div>
    </div>
  );
}
