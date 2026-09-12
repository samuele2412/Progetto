/**
 * Registers the temporary stock photographs and points the site's image fields
 * at them.
 *
 * These are stand-ins: they exist so the layout can be judged with real
 * photography in it, and every one is flagged `is_temporary` so the panel can
 * list exactly what has to be replaced before launch. See docs/photo-sources.md.
 *
 * Safe to run more than once: a field that already points somewhere else is
 * left alone, so re-running this after the owner has swapped in their own
 * photographs does not undo their work.
 *
 *   npx tsx scripts/seed-stock-photos.ts          only fills what is still empty
 *   npx tsx scripts/seed-stock-photos.ts --force  re-points every stock field
 */
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
// Imported rather than read at runtime: esbuild inlines it into the bundle, so
// the script works inside the container without docs/ having to be shipped.
import stockPhotos from '../src/content/stock-photos.json';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq, sql } from 'drizzle-orm';
import { cocktails, eventTypes, galleryItems, mediaAssets, settings } from '../src/db/schema';

type Rec = {
  name: string; slot: string; file: string; bytes: number; w: number; h: number;
  alt_it: string; alt_en: string;
  source: { provider: string; title: string; creator: string; creator_url: string;
            license: string; license_url: string; landing: string; original: string };
};

const PUBLIC_PREFIX = '/images/stock';

/**
 * Whether a stored image path actually resolves to a file.
 *
 * The original seed pointed every cocktail and event type at
 * `/images/cocktails/<slug>.jpg`, files that were deliberately never shipped —
 * so "has an image path" and "has an image" were two different things, and a
 * guard on the path being empty replaced nothing. Asking the filesystem is both
 * correct now and correct later: once the owner uploads a real photograph, its
 * file exists and this script steps around it.
 */
function imageExists(stored: string): boolean {
  if (!stored) return false;
  const uploadDir = process.env.UPLOAD_DIR || './public/uploads';
  const full = stored.startsWith('/uploads/')
    ? path.join(uploadDir, stored.slice('/uploads/'.length))
    : path.join(process.cwd(), 'public', stored.replace(/^\//, ''));
  try {
    return fs.statSync(full).isFile();
  } catch {
    return false;
  }
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is not set');
  const force = process.argv.includes('--force');

  const records = stockPhotos as unknown as Rec[];

  const pool = new Pool({ connectionString, max: 1 });
  const db = drizzle(pool);

  /* ---- 1. the library ---------------------------------------------------- */
  let registered = 0;
  const pathOf = new Map<string, string>();
  for (const r of records) {
    const publicPath = `${PUBLIC_PREFIX}/${r.name}.webp`;
    pathOf.set(r.name, publicPath);
    const note = `Openverse · ${r.source.provider} · ${r.source.license.toUpperCase()}`;
    await db
      .insert(mediaAssets)
      .values({
        path: publicPath,
        originalName: `${r.name}.webp`,
        mimeType: 'image/webp',
        sizeBytes: r.bytes,
        alt: { it: r.alt_it, en: r.alt_en },
        isTemporary: true,
        sourceNote: note.slice(0, 300),
      })
      .onConflictDoUpdate({
        target: mediaAssets.path,
        set: { isTemporary: true, sourceNote: note.slice(0, 300), sizeBytes: r.bytes },
      });
    registered++;
  }
  console.log(`[stock] ${registered} immagini nella libreria`);

  /* ---- 2. hero and portrait live in settings ----------------------------- */
  const patchGroup = async (key: string, patch: Record<string, unknown>) => {
    const [row] = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
    const current = (row?.value as Record<string, unknown>) ?? {};
    const next = { ...current };
    let changed = false;
    for (const [field, value] of Object.entries(patch)) {
      if (!force && typeof current[field] === 'string' && imageExists(current[field] as string)) continue;
      next[field] = value;
      changed = true;
    }
    if (!changed) return false;
    await db
      .insert(settings)
      .values({ key, value: next })
      .onConflictDoUpdate({ target: settings.key, set: { value: next, updatedAt: new Date() } });
    return true;
  };

  const hero = pathOf.get('hero-bancone')!;
  const portrait = pathOf.get('ritratto-bartender')!;
  if (await patchGroup('hero', { imagePath: hero })) console.log('[stock] hero collegato');
  if (await patchGroup('about', { imagePath: portrait })) console.log('[stock] ritratto collegato');
  if (await patchGroup('seo', { ogImagePath: hero })) console.log('[stock] immagine social collegata');

  /* ---- 3. cocktails ------------------------------------------------------ */
  const cocktailBySlug: Record<string, string> = {
    negroni: 'cocktail-negroni',
    'espresso-martini': 'cocktail-espresso-martini',
    margarita: 'cocktail-margarita',
    mojito: 'cocktail-mojito',
    'gin-tonic-dautore': 'cocktail-gin-tonic',
    ponentino: 'cocktail-ponentino',
    'sette-colli': 'cocktail-sette-colli',
  };
  let n = 0, kept = 0;
  const existing = await db.select({ slug: cocktails.slug, imagePath: cocktails.imagePath }).from(cocktails);
  const currentCocktail = new Map(existing.map((r) => [r.slug, r.imagePath]));
  for (const [slug, name] of Object.entries(cocktailBySlug)) {
    const target = pathOf.get(name);
    if (!target) continue;
    if (!force && imageExists(currentCocktail.get(slug) ?? '')) { kept++; continue; }
    await db.update(cocktails).set({ imagePath: target }).where(eq(cocktails.slug, slug));
    n += 1;
  }
  console.log(`[stock] ${n} cocktail collegati${kept ? `, ${kept} già con foto propria` : ''}`);

  /* ---- 4. event types ---------------------------------------------------- */
  const eventBySlug: Record<string, string> = {
    compleanno: 'evento-compleanno',
    'festa-privata': 'evento-festa-privata',
    diciottesimo: 'evento-diciottesimo',
    laurea: 'evento-laurea',
    matrimonio: 'evento-matrimonio',
    aziendale: 'evento-aziendale',
    'villa-piscina': 'evento-villa-piscina',
    altro: 'evento-altro',
  };
  n = 0; kept = 0;
  const existingEvents = await db.select({ slug: eventTypes.slug, imagePath: eventTypes.imagePath }).from(eventTypes);
  const currentEvent = new Map(existingEvents.map((r) => [r.slug, r.imagePath]));
  for (const [slug, name] of Object.entries(eventBySlug)) {
    const target = pathOf.get(name);
    if (!target) continue;
    if (!force && imageExists(currentEvent.get(slug) ?? '')) { kept++; continue; }
    await db.update(eventTypes).set({ imagePath: target }).where(eq(eventTypes.slug, slug));
    n += 1;
  }
  console.log(`[stock] ${n} tipi di evento collegati${kept ? `, ${kept} già con foto propria` : ''}`);

  /* ---- 5. the gallery has no rows yet ------------------------------------ */
  // The tag feeds the gallery filter, so the eight tiles are not just eight
  // pictures but eight answers to "what does this actually look like".
  const galleryTags: Record<string, string> = {
    'galleria-bancone': 'setup',
    'galleria-bottiglie': 'setup',
    'galleria-ghiaccio-fiamma': 'cocktail',
    'galleria-versata': 'servizio',
    'galleria-tavolo-sera': 'evento',
    'galleria-agrumi': 'cocktail',
    'galleria-coppa-rossa': 'cocktail',
    'galleria-atmosfera': 'evento',
  };
  const galleryPlan = records
    .filter((r) => r.slot === 'gallery')
    .map((r, index) => ({
      imagePath: pathOf.get(r.name)!,
      alt: { it: r.alt_it, en: r.alt_en },
      caption: { it: r.alt_it, en: r.alt_en },
      tag: galleryTags[r.name] ?? '',
      position: index,
      active: true,
    }));
  const [{ count: galleryCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(galleryItems);
  if (galleryCount === 0) {
    await db.insert(galleryItems).values(galleryPlan);
    console.log(`[stock] ${galleryPlan.length} immagini in galleria`);
  } else {
    console.log(`[stock] galleria già popolata (${galleryCount}): lasciata com'è`);
  }

  await pool.end();
  console.log('[stock] fatto');
}

main().catch((error) => {
  console.error('[stock] fallito:', error);
  process.exit(1);
});
