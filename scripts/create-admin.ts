/**
 * Creates (or resets) an administrator.
 *
 * Usage:
 *   npm run admin:create -- you@example.com "a long password" "Your name"
 *
 * With no arguments it falls back to ADMIN_EMAIL / ADMIN_PASSWORD from the
 * environment, which is what the first-run installer uses. Existing accounts
 * have their password reset and every open session invalidated.
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
