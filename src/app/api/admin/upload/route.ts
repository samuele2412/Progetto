import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { db } from '@/db';
import { mediaAssets } from '@/db/schema';
import { getSession, isSameOrigin } from '@/lib/auth';
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

export async function POST(request: Request) {
  const headerList = await headers();
  if (!isSameOrigin(headerList.get('origin'), headerList.get('host'))) {
    return NextResponse.json({ ok: false, error: 'Richiesta non valida.' }, { status: 403 });
  }
  if (!(await getSession())) {
    return NextResponse.json({ ok: false, error: 'Non autorizzato.' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: 'Nessun file ricevuto.' }, { status: 400 });
  }

  const extension = allowed[file.type];
  if (!extension) {
    return NextResponse.json(
      { ok: false, error: 'Formato non supportato. Usa JPG, PNG, WebP, AVIF o GIF.' },
      { status: 415 },
    );
  }

  const maxBytes = env.MAX_UPLOAD_MB * 1024 * 1024;
  if (file.size > maxBytes) {
    return NextResponse.json(
      { ok: false, error: `Il file supera ${env.MAX_UPLOAD_MB} MB.` },
      { status: 413 },
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
    await writeFile(targetPath, Buffer.from(await file.arrayBuffer()));
  } catch (error) {
    console.error('[upload] write failed:', error);
    return NextResponse.json({ ok: false, error: 'Impossibile salvare il file sul server.' }, { status: 500 });
  }

  const alt = String(formData.get('alt') ?? '').slice(0, 200);
  await db.insert(mediaAssets).values({
    path: publicPath,
    originalName: file.name.slice(0, 255),
    mimeType: file.type,
    sizeBytes: file.size,
    alt: { it: alt, en: alt },
  });

  return NextResponse.json({ ok: true, path: publicPath }, { status: 201 });
}
