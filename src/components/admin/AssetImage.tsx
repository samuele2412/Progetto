'use client';

import { useState } from 'react';
import Image from 'next/image';

/**
 * A media thumbnail that says so when the file is gone.
 *
 * The library lists database rows, and a row can outlive its file: a volume
 * restored from an older backup, a file removed by hand on the server, an
 * upload that was truncated. Next's image optimiser then answers 400 and the
 * browser drew a broken-image icon with no explanation — leaving an orphan the
 * owner could see but not understand. This turns that into a plain label, and
 * the row stays deletable from the drawer.
 */
export function AssetImage({
  src,
  alt,
  sizes,
  className,
}: {
  src: string;
  alt: string;
  sizes: string;
  /** object-fit class; the wrapper supplies the box. */
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-2 text-center">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-stone-500" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
          <path d="M3 3l18 18M21 15l-5-5-3.5 3.5M3 5.5A1.5 1.5 0 014.5 4H18M21 6v12a1.5 1.5 0 01-1.5 1.5H5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-[0.68rem] leading-tight text-stone-600">File mancante sul server</span>
      </span>
    );
  }

  return (
    <Image src={src} alt={alt} fill sizes={sizes} className={className} onError={() => setFailed(true)} />
  );
}
