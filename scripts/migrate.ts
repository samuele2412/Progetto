/**
 * Applies the SQL migrations in ./drizzle.
 *
 * Uses the runtime migrator rather than the drizzle-kit CLI so the production
 * image does not need any dev dependency: the container entrypoint runs this
 * on every start, and it is a no-op when the schema is already current.
 */
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is not set');

  const pool = new Pool({ connectionString, max: 1 });
  const db = drizzle(pool);

  console.log('[migrate] applying migrations…');
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('[migrate] done');

  await pool.end();
}

main().catch((error) => {
  console.error('[migrate] failed:', error);
  process.exit(1);
});
