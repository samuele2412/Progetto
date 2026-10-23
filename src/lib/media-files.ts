import 'server-only';
import { existsSync } from 'node:fs';
import path from 'node:path';

/**
 * Whether an image path points at a real file under public/ (or is an upload).
 *
 * The site ships before the photographs exist, so many stored paths name files
 * that are not there yet. Components use this to render a placeholder or to
 * leave an optional image out; metadata uses it so a social card never points
 * at a 404 — a shared link with a broken image shows no picture at all.
 */
const publicDir = path.join(process.cwd(), 'public');

/**
 * Memoised because `existsSync` is a blocking syscall and a page can ask about
 * a couple of dozen images: without this every render stats the disk on the
 * request thread. The answer only changes when files are added, which in this
 * deployment means a redeploy for /images and an upload for /uploads.
 */
const existsCache = new Map<string, boolean>();

export function mediaExists(src: string | null | undefined): boolean {
  if (!src || !src.startsWith('/')) return false;
  // Uploads live on a mounted volume that can change under a running process,
  // so they are assumed present and left to 404 if they are not.
  if (src.startsWith('/uploads/')) return true;

  const cached = existsCache.get(src);
  if (cached !== undefined) return cached;

  let present = false;
  try {
    present = existsSync(path.join(publicDir, src.replace(/^\//, '').split('?')[0]));
  } catch {
    present = false;
  }
  // Only cache in production: in development the point is to see a file appear
  // as soon as it is dropped into the folder.
  if (process.env.NODE_ENV === 'production') existsCache.set(src, present);
  return present;
}
