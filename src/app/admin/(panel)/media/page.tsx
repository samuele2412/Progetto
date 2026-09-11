import { desc } from 'drizzle-orm';
import Image from 'next/image';
import { db } from '@/db';
import { mediaAssets } from '@/db/schema';
import { MediaUploader } from '@/components/admin/MediaUploader';
import { env } from '@/lib/env';

export const dynamic = 'force-dynamic';

export default async function MediaPage() {
  const assets = await db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt)).limit(120);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl">Immagini</h1>
        <p className="mt-1 max-w-2xl text-sm text-stone-600">
          Carica una foto, copia il percorso e incollalo nel campo immagine della sezione che ti interessa. I file
          restano sul tuo server, nella cartella <code className="rounded bg-stone-200 px-1">uploads</code>, e sono
          inclusi nei backup.
        </p>
      </header>

      <MediaUploader maxMb={env.MAX_UPLOAD_MB} />

      <section>
        <h2 className="mb-3 text-lg">Caricate di recente</h2>
        {assets.length === 0 ? (
          <p className="text-sm text-stone-500">Ancora nessuna immagine.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {assets.map((asset) => (
              <li key={asset.id} className="admin-card overflow-hidden">
                {/* A plain <img> here downloaded every original at full size:
                    120 thumbnails of 2–5 MB photos each. next/image asks the
                    optimiser for a thumbnail-sized AVIF instead. */}
                <div className="relative h-32 w-full bg-stone-100">
                  <Image
                    src={asset.path}
                    alt={asset.alt.it}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="truncate text-xs text-stone-500">{asset.originalName}</p>
                  <code className="mt-1 block break-all text-[0.7rem] text-stone-800">{asset.path}</code>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
