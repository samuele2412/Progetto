import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';
import { NextResponse } from 'next/server';
import { env } from '@/lib/env';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Serves the images uploaded from the admin panel.
 *
 * A route handler rather than the /public folder: in production Next only
 * serves what was in public/ when the process started, so a photo uploaded
 * today rendered as a broken image until the container was restarted. The files
 * live on a mounted volume (UPLOAD_DIR) and are read from disk on request.
 */
const CONTENT_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
};

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params;

  // The upload route only ever writes `<year>/<month>/<slug>-<id>.<ext>`, so
  // anything else is refused outright — no traversal, no dotfiles, no nesting.
  if (
    !segments?.length ||
    segments.length > 4 ||
    segments.some((segment) => !/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(segment) || segment.includes('..'))
  ) {
    return new NextResponse('Not found', { status: 404 });
  }

  const extension = path.extname(segments[segments.length - 1]).toLowerCase();
  const contentType = CONTENT_TYPES[extension];
  if (!contentType) return new NextResponse('Not found', { status: 404 });

  const root = path.resolve(env.UPLOAD_DIR);
  const target = path.resolve(root, ...segments);
  // Belt and braces: even with the pattern above, never read outside the root.
  if (target !== root && !target.startsWith(root + path.sep)) {
    return new NextResponse('Not found', { status: 404 });
  }

  let size: number;
  let modified: Date;
  try {
    const info = await stat(target);
    if (!info.isFile()) return new NextResponse('Not found', { status: 404 });
    size = info.size;
    modified = info.mtime;
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }

  const stream = Readable.toWeb(createReadStream(target)) as ReadableStream<Uint8Array>;
  return new NextResponse(stream, {
    headers: {
      'Content-Type': contentType,
      'Content-Length': String(size),
      'Last-Modified': modified.toUTCString(),
      // Filenames carry a timestamp, so a given path never changes content.
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
