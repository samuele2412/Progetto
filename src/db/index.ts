import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from '@/lib/env';
import * as schema from './schema';

/**
 * A single pool per process. Next.js re-evaluates modules on every hot reload in
 * development, so the pool is parked on `globalThis` to avoid leaking sockets.
 */
const globalForDb = globalThis as unknown as { __cordialePool?: Pool };

const pool =
  globalForDb.__cordialePool ??
  new Pool({
    connectionString: env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });

if (env.NODE_ENV !== 'production') globalForDb.__cordialePool = pool;

export const db = drizzle(pool, { schema });
export { pool, schema };
