import { desc } from 'drizzle-orm';
import { MediaLibrary } from '@/components/admin/MediaLibrary';
import { db } from '@/db';
import { mediaAssets } from '@/db/schema';
import { env } from '@/lib/env';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Media' };

export default async function MediaPage() {
  const assets = await db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt)).limit(200);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl">Media</h1>
        <p className="mt-1 max-w-2xl text-sm text-stone-600">
          Tutte le immagini del sito. I file restano sul tuo server nella cartella{' '}
          <code className="rounded bg-stone-200 px-1">uploads</code> e sono inclusi nei backup. Puoi sceglierle
          direttamente mentre modifichi una sezione, senza passare da qui.
        </p>
      </header>

      <MediaLibrary
        maxMb={env.MAX_UPLOAD_MB}
        assets={assets.map((asset) => ({
          id: asset.id,
          path: asset.path,
          originalName: asset.originalName,
          alt: asset.alt,
          sizeBytes: asset.sizeBytes,
          mimeType: asset.mimeType,
          isTemporary: asset.isTemporary,
          sourceNote: asset.sourceNote,
          createdAt: asset.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
