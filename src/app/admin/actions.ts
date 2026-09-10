'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { admins, settings as settingsTable } from '@/db/schema';
import { getCollection } from '@/lib/admin/collections';
import { parseFormData, validateRecord } from '@/lib/admin/form';
import {
  createSession,
  destroySession,
  hashPassword,
  isSameOrigin,
  requireSession,
  verifyPassword,
} from '@/lib/auth';
import { clientIp, hashIp, limitLogin } from '@/lib/rate-limit';
import { deleteRequest, updateRequestNotes, updateRequestStatus } from '@/lib/requests';
import { defaultSettings } from '@/content/settings';
import type { RequestStatus } from '@/db/schema';
import { loginSchema } from '@/lib/validation';

/**
 * Every mutating action starts with the same two checks: a valid session and a
 * same-origin request. Server Actions already carry a framework-level CSRF
 * token, but the Origin check costs nothing and keeps the guarantee explicit.
 */
async function guard() {
  const headerList = await headers();
  if (!isSameOrigin(headerList.get('origin'), headerList.get('host'))) {
    throw new Error('CSRF');
  }
  return requireSession();
}

export type ActionState = { ok?: boolean; error?: string; message?: string };

/**
 * bcrypt hash (cost 12) of a random string discarded at generation time. It is
 * not a secret and unlocks nothing — its only job is to make a login attempt on
 * an unknown address take as long as one on a real account.
 */
const DECOY_HASH = '$2b$12$xUfsCEfM5ZAW70ml8ejVYutFiboSo/EOonL.YPP9bmuVpc.KocsJ.';

/* -------------------------------------------------------------------------- */
/* Auth                                                                       */
/* -------------------------------------------------------------------------- */

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const headerList = await headers();
  if (!isSameOrigin(headerList.get('origin'), headerList.get('host'))) {
    return { error: 'Richiesta non valida.' };
  }

  const ipHash = hashIp(clientIp(headerList));
  if (!limitLogin(ipHash).allowed) {
    return { error: 'Troppi tentativi. Riprova fra qualche minuto.' };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) return { error: 'Email o password non validi.' };

  const [admin] = await db.select().from(admins).where(eq(admins.email, parsed.data.email)).limit(1);
  // Burn the same CPU time whether or not the account exists, otherwise the
  // response time answers "is this email registered?" for anyone who asks.
  // DECOY_HASH must be a *valid* bcrypt hash: bcrypt rejects a malformed one
  // in microseconds, which is exactly the leak this is meant to close.
  const valid = await verifyPassword(parsed.data.password, admin?.passwordHash ?? DECOY_HASH);

  if (!admin || !valid) return { error: 'Email o password non validi.' };

  await db.update(admins).set({ lastLoginAt: new Date() }).where(eq(admins.id, admin.id));
  await createSession(admin);

  // Only ever a path inside the panel: no scheme, no host, no protocol-relative
  // "//evil.test" that a browser would read as an absolute URL.
  const requested = String(formData.get('next') ?? '');
  const safeNext = /^\/admin(?:\/[A-Za-z0-9\-_/]*)?$/.test(requested) ? requested : '/admin';
  redirect(safeNext);
}

export async function logoutAction() {
  await destroySession();
  redirect('/admin/login');
}

export async function changePasswordAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await guard();

  const current = String(formData.get('currentPassword') ?? '');
  const next = String(formData.get('newPassword') ?? '');
  const confirm = String(formData.get('confirmPassword') ?? '');

  if (next.length < 12) return { error: 'La nuova password deve avere almeno 12 caratteri.' };
  if (next !== confirm) return { error: 'Le due password non coincidono.' };

  const [admin] = await db.select().from(admins).where(eq(admins.id, Number(session.sub))).limit(1);
  if (!admin || !(await verifyPassword(current, admin.passwordHash))) {
    return { error: 'La password attuale non è corretta.' };
  }

  await db
    .update(admins)
    .set({ passwordHash: await hashPassword(next), sessionVersion: admin.sessionVersion + 1 })
    .where(eq(admins.id, admin.id));

  // Bumping sessionVersion invalidated this very cookie — sign back in.
  await destroySession();
  redirect('/admin/login?changed=1');
}

/* -------------------------------------------------------------------------- */
/* Collections (generic CRUD)                                                 */
/* -------------------------------------------------------------------------- */

export async function saveCollectionItem(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await guard();

  const slug = String(formData.get('__collection') ?? '');
  const collection = getCollection(slug);
  if (!collection) return { error: 'Sezione sconosciuta.' };

  const record = parseFormData(collection.fields, formData);
  const invalid = validateRecord(collection.fields, record);
  if (invalid) return { error: invalid };

  const rawId = String(formData.get('__id') ?? '');
  const table = collection.table as never;
  const idColumn = (collection.table as unknown as { id: never }).id;

  try {
    if (rawId) {
      await db
        .update(table)
        .set(record as never)
        .where(eq(idColumn, Number(rawId) as never));
    } else {
      await db.insert(table).values(record as never);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/duplicate key/i.test(message)) return { error: 'Esiste già un elemento con questo slug o chiave.' };
    console.error('[admin] save failed:', message);
    return { error: 'Salvataggio non riuscito. Controlla i campi e riprova.' };
  }

  revalidatePath('/', 'layout');
  return { ok: true, message: 'Salvato.' };
}

export async function deleteCollectionItem(formData: FormData) {
  await guard();

  const slug = String(formData.get('__collection') ?? '');
  const collection = getCollection(slug);
  const id = Number(formData.get('__id'));
  if (!collection || !Number.isInteger(id)) return;

  const idColumn = (collection.table as unknown as { id: never }).id;
  await db.delete(collection.table as never).where(eq(idColumn, id as never));

  revalidatePath('/', 'layout');
  redirect(`/admin/${collection.slug}`);
}

/* -------------------------------------------------------------------------- */
/* Settings                                                                   */
/* -------------------------------------------------------------------------- */

export async function saveSettingsGroup(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await guard();

  const group = String(formData.get('__group') ?? '');
  const defaults = (defaultSettings as unknown as Record<string, Record<string, unknown>>)[group];
  if (!defaults) return { error: 'Gruppo di impostazioni sconosciuto.' };

  const value: Record<string, unknown> = {};

  for (const [key, fallback] of Object.entries(defaults)) {
    if (typeof fallback === 'string') {
      value[key] = String(formData.get(key) ?? '').trim();
      continue;
    }
    if (isLocalizedList(fallback)) {
      value[key] = {
        it: splitLines(String(formData.get(`${key}.it`) ?? '')),
        en: splitLines(String(formData.get(`${key}.en`) ?? '')),
      };
      continue;
    }
    if (isLocalizedPairs(fallback)) {
      value[key] = {
        it: parsePairs(String(formData.get(`${key}.it`) ?? '')),
        en: parsePairs(String(formData.get(`${key}.en`) ?? '')),
      };
      continue;
    }
    if (isLocalizedString(fallback)) {
      value[key] = {
        it: String(formData.get(`${key}.it`) ?? '').trim(),
        en: String(formData.get(`${key}.en`) ?? '').trim(),
      };
      continue;
    }
    // Anything we do not know how to edit is preserved as-is.
    value[key] = fallback;
  }

  await db
    .insert(settingsTable)
    .values({ key: group, value })
    .onConflictDoUpdate({ target: settingsTable.key, set: { value, updatedAt: new Date() } });

  revalidatePath('/', 'layout');
  return { ok: true, message: 'Impostazioni salvate.' };
}

function isLocalizedString(value: unknown): value is { it: string; en: string } {
  return (
    typeof value === 'object' && value !== null && 'it' in value && typeof (value as { it: unknown }).it === 'string'
  );
}

function isLocalizedList(value: unknown): value is { it: string[]; en: string[] } {
  if (typeof value !== 'object' || value === null || !('it' in value)) return false;
  const list = (value as { it: unknown }).it;
  return Array.isArray(list) && (list.length === 0 || typeof list[0] === 'string');
}

function isLocalizedPairs(
  value: unknown,
): value is { it: { title: string; body: string }[]; en: { title: string; body: string }[] } {
  if (typeof value !== 'object' || value === null || !('it' in value)) return false;
  const list = (value as { it: unknown }).it;
  return Array.isArray(list) && list.length > 0 && typeof list[0] === 'object' && list[0] !== null;
}

function splitLines(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean);
}

/**
 * Title/body pairs are edited as "Title | Body", one per line — the least
 * annoying plain-text format for four short blocks.
 */
function parsePairs(value: string): { title: string; body: string }[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, ...rest] = line.split('|');
      return { title: title.trim(), body: rest.join('|').trim() };
    })
    .filter((pair) => pair.title);
}

/* -------------------------------------------------------------------------- */
/* Requests pipeline                                                          */
/* -------------------------------------------------------------------------- */

export async function setRequestStatusAction(formData: FormData) {
  const session = await guard();
  const id = Number(formData.get('id'));
  const status = String(formData.get('status')) as RequestStatus;
  if (!Number.isInteger(id)) return;

  await updateRequestStatus(id, status, session.email);
  revalidatePath('/admin', 'layout');
}

export async function saveRequestNotesAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await guard();
  const id = Number(formData.get('id'));
  if (!Number.isInteger(id)) return { error: 'Richiesta non trovata.' };

  const rawValue = String(formData.get('estimatedValue') ?? '').trim();
  const estimated = rawValue === '' ? null : Math.max(0, Math.trunc(Number(rawValue) || 0));

  await updateRequestNotes(id, String(formData.get('adminNotes') ?? '').slice(0, 4000), estimated);
  revalidatePath('/admin', 'layout');
  return { ok: true, message: 'Note salvate.' };
}

export async function deleteRequestAction(formData: FormData) {
  await guard();
  const id = Number(formData.get('id'));
  if (!Number.isInteger(id)) return;

  await deleteRequest(id);
  revalidatePath('/admin', 'layout');
  redirect('/admin/richieste');
}
