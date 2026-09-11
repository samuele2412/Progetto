import { NextResponse } from 'next/server';
import { desc, ilike, or, sql } from 'drizzle-orm';
import { db } from '@/db';
import { mediaAssets } from '@/db/schema';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Feeds the media picker inside the page builder.
 *
 * A read endpoint rather than a server action because the picker searches as
 * you type and a server action would mean a full re-render of the builder for
 * every keystroke. Behind the same session check as everything else under
 * /api/admin — there is nothing public here.
 */
const PAGE_SIZE = 48;

export async function GET(request: Request) {
  if (!(await getSession())) {
    return NextResponse.json({ ok: false, error: 'Non autorizzato.' }, { status: 401 });
  }

  const url = new URL(request.url);
  const query = (url.searchParams.get('q') ?? '').trim().slice(0, 120);
  const offset = Math.max(0, Math.min(5000, Number(url.searchParams.get('offset')) || 0));

  try {
    const rows = await db
      .select({
        id: mediaAssets.id,
        path: mediaAssets.path,
        originalName: mediaAssets.originalName,
        alt: mediaAssets.alt,
        sizeBytes: mediaAssets.sizeBytes,
        mimeType: mediaAssets.mimeType,
        createdAt: mediaAssets.createdAt,
      })
      .from(mediaAssets)
      .where(
        query
          // ILIKE with the wildcards bound as part of the parameter, so a `%`
          // typed in the search box is a literal percent, not a wildcard.
          ? or(ilike(mediaAssets.originalName, `%${query}%`), ilike(mediaAssets.path, `%${query}%`), sql`${mediaAssets.alt}->>'it' ilike ${`%${query}%`}`)
          : undefined,
      )
      .orderBy(desc(mediaAssets.createdAt), desc(mediaAssets.id))
      .limit(PAGE_SIZE + 1)
      .offset(offset);

    const hasMore = rows.length > PAGE_SIZE;
    return NextResponse.json({ ok: true, items: rows.slice(0, PAGE_SIZE), hasMore });
  } catch (error) {
    console.error(`[media] list failed: ${error instanceof Error ? error.name : 'unknown error'}`);
    return NextResponse.json({ ok: false, error: 'Impossibile leggere la libreria.' }, { status: 500 });
  }
}
