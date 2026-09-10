import 'server-only';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { admins } from '@/db/schema';
import { env } from './env';

const COOKIE_NAME = 'cordiale_session';
const secret = new TextEncoder().encode(env.SESSION_SECRET);

export type SessionPayload = {
  sub: string;
  email: string;
  name: string;
  /** Matches `admins.session_version`; a password change invalidates old cookies. */
  v: number;
};

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function createSession(admin: { id: number; email: string; name: string; sessionVersion: number }) {
  const token = await new SignJWT({ email: admin.email, name: admin.name, v: admin.sessionVersion })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(admin.id))
    .setIssuedAt()
    .setExpirationTime(`${env.SESSION_TTL_HOURS}h`)
    .sign(secret);

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    path: '/',
    maxAge: env.SESSION_TTL_HOURS * 3600,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** Reads and verifies the session cookie. Returns null when absent or stale. */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ['HS256'] });
    const session = {
      sub: String(payload.sub ?? ''),
      email: String(payload.email ?? ''),
      name: String(payload.name ?? ''),
      v: Number(payload.v ?? 0),
    };
    if (!session.sub) return null;

    // Confirm the account still exists and the cookie generation is current.
    const [admin] = await db
      .select({ id: admins.id, sessionVersion: admins.sessionVersion })
      .from(admins)
      .where(eq(admins.id, Number(session.sub)))
      .limit(1);
    if (!admin || admin.sessionVersion !== session.v) return null;

    return session;
  } catch {
    return null;
  }
}

/** Session or bust — use at the top of every admin server action. */
export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new Error('UNAUTHORIZED');
  return session;
}

/**
 * A CSRF defence that does not need per-form tokens: reject any state-changing
 * request whose Origin is not our own. Combined with SameSite=Lax cookies this
 * covers the realistic attack surface of a single-origin admin panel.
 */
export function isSameOrigin(origin: string | null, host: string | null): boolean {
  if (!origin) return true; // Same-origin form posts from some clients omit it.
  try {
    const url = new URL(origin);
    if (host && url.host === host) return true;
    return url.origin === env.SITE_URL;
  } catch {
    return false;
  }
}
