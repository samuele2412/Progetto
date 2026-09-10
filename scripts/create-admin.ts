/**
 * Creates an administrator, and resets one only when that is clearly intended.
 *
 * Usage:
 *   npm run admin:create -- you@example.com "a long password" "Your name"
 *
 * Passing arguments is the "I forgot my password" path: it always resets the
 * account and invalidates every session.
 *
 * With no arguments it reads ADMIN_EMAIL / ADMIN_PASSWORD from the environment,
 * which is how the container entrypoint runs it on every boot — and there it
 * only *creates* a missing account. It used to reset the password too, so as
 * long as ADMIN_PASSWORD stayed in .env every restart silently undid a password
 * changed from the panel and logged the owner out. Set ADMIN_RESET_PASSWORD=true
 * to force a reset from the environment as well.
 */
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { admins } from '../src/db/schema';

async function main() {
  const [emailArg, passwordArg, nameArg] = process.argv.slice(2);
  const email = (emailArg ?? process.env.ADMIN_EMAIL ?? '').trim().toLowerCase();
  const password = passwordArg ?? process.env.ADMIN_PASSWORD ?? '';
  const name = nameArg ?? process.env.ADMIN_NAME ?? '';

  if (!email || !email.includes('@')) throw new Error('A valid email is required');
  if (password.length < 12) throw new Error('The password must be at least 12 characters long');

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is not set');

  const pool = new Pool({ connectionString, max: 1 });
  const db = drizzle(pool);

  const passwordHash = await bcrypt.hash(password, 12);
  const [existing] = await db.select().from(admins).where(eq(admins.email, email)).limit(1);

  if (existing) {
    const explicitReset = passwordArg !== undefined || process.env.ADMIN_RESET_PASSWORD === 'true';
    if (!explicitReset) {
      console.log(`[admin] ${email} already exists — password left untouched`);
      await pool.end();
      return;
    }
    await db
      .update(admins)
      .set({ passwordHash, name: name || existing.name, sessionVersion: existing.sessionVersion + 1 })
      .where(eq(admins.id, existing.id));
    console.log(`[admin] password reset for ${email} (all sessions invalidated)`);
  } else {
    await db.insert(admins).values({ email, name, passwordHash });
    console.log(`[admin] created ${email}`);
  }

  await pool.end();
}

main().catch((error) => {
  console.error('[admin]', error instanceof Error ? error.message : error);
  process.exit(1);
});
