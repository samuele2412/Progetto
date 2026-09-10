import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { db } from '@/db';
import { mediaAssets } from '@/db/schema';
import { getSession, isSameOrigin } from '@/lib/auth';
import { describeDbError } from '@/lib/db-errors';
import { env } from '@/lib/env';
import { slugify } from '@/lib/utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Image upload for the admin panel.
 *
 * Files land on a mounted volume (UPLOAD_DIR) that is served at /uploads, so
 * they survive container rebuilds and are covered by the backup script. Only a
 * fixed list of image types is accepted and the extension is derived from the
 * MIME type, never from the filename — an upload can therefore never become an
 * executable path.
 */
const allowed: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
};

/**
 * `file.type` is whatever the client claimed, so the bytes get the final say.
 * Nothing is written unless the header on disk matches a format we accept —
 * which also means the stored extension can never disagree with the content.
 */
function sniffImageType(bytes: Uint8Array): string | null {
  const startsWith = (...sig: number[]) => sig.every((b, i) => bytes[i] === b);
  const ascii = (offset: number, text: string) =>
    [...text].every((c, i) => bytes[offset + i] === c.charCodeAt(0));

  if (startsWith(0xff, 0xd8, 0xff)) return 'image/jpeg';
  if (startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return 'image/png';
  if (startsWith(0x47, 0x49, 0x46, 0x38)) return 'image/gif';
  if (ascii(0, 'RIFF') && ascii(8, 'WEBP')) return 'image/webp';
  // AVIF and its relatives: an ISO-BMFF box whose major brand starts with "av".
  if (ascii(4, 'ftyp') && ascii(8, 'av')) return 'image/avif';
  return null;
}

export async function POST(request: Request) {
  const headerList = await headers();
  if (!isSameOrigin(headerList.get('origin'), headerList.get('host'))) {
    return NextResponse.json({ ok: false, error: 'Richiesta non valida.' }, { status: 403 });
  }
  if (!(await getSession())) {
    return NextResponse.json({ ok: false, error: 'Non autorizzato.' }, { status: 401 });
  }

  // Refuse the body *before* parsing it: request.formData() buffers the whole
  // upload into memory, so checking file.size afterwards is already too late to
  // stop someone posting a multi-gigabyte body at the process.
  const maxBytes = env.MAX_UPLOAD_MB * 1024 * 1024;
  const declaredLength = Number(request.headers.get('content-length') ?? 0);
  if (declaredLength > maxBytes + 8 * 1024) {
    return NextResponse.json(
      { ok: false, error: `Il file supera ${env.MAX_UPLOAD_MB} MB.` },
      { status: 413 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: 'Caricamento non valido.' }, { status: 400 });
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: 'Nessun file ricevuto.' }, { status: 400 });
  }

  // A chunked upload has no Content-Length, so the real size is checked here too.
  if (file.size > maxBytes) {
    return NextResponse.json(
      { ok: false, error: `Il file supera ${env.MAX_UPLOAD_MB} MB.` },
      { status: 413 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const sniffed = sniffImageType(buffer);
  const extension = sniffed === null ? undefined : allowed[sniffed];
  if (sniffed === null || !extension) {
    return NextResponse.json(
      { ok: false, error: 'Formato non supportato. Usa JPG, PNG, WebP, AVIF o GIF.' },
      { status: 415 },
    );
  }

  const now = new Date();
  const folder = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`;
  const base = slugify(file.name.replace(/\.[^.]+$/, '')) || 'immagine';
  const filename = `${base}-${now.getTime().toString(36)}.${extension}`;

  const targetDir = path.join(env.UPLOAD_DIR, folder);
  const targetPath = path.join(targetDir, filename);
  const publicPath = `/uploads/${folder}/${filename}`;

  try {
    await mkdir(targetDir, { recursive: true });
    await writeFile(targetPath, buffer);
  } catch (error) {
    console.error('[upload] write failed:', error);
    return NextResponse.json({ ok: false, error: 'Impossibile salvare il file sul server.' }, { status: 500 });
  }

  const alt = String(formData.get('alt') ?? '').slice(0, 200);
  try {
    await db.insert(mediaAssets).values({
      path: publicPath,
      originalName: file.name.slice(0, 255),
      mimeType: sniffed,
      sizeBytes: file.size,
      alt: { it: alt, en: alt },
    });
  } catch (error) {
    // Otherwise the bytes stay on the volume with nothing pointing at them,
    // and the owner has no way to find or remove them from the panel.
    await unlink(targetPath).catch(() => {});
    console.error('[upload] could not record the asset:', describeDbError(error));
    return NextResponse.json({ ok: false, error: 'Impossibile registrare il file.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, path: publicPath }, { status: 201 });
}
