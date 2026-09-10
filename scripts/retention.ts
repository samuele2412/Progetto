/**
 * GDPR retention clean-up.
 *
 * Deletes requests that never became events and have not been touched for the
 * retention window, and clears the IP hash on everything older than a year.
 * Meant to run monthly from cron — see README § Backup and maintenance.
 *
 *   npm run db:retention -- 24
 */
import 'dotenv/config';
import { and, lt, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eventRequests } from '../src/db/schema';

async function main() {
  const months = Number(process.argv[2] ?? process.env.RETENTION_MONTHS ?? 24);
  if (!Number.isFinite(months) || months < 1) throw new Error('Retention must be a positive number of months');

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is not set');

  const pool = new Pool({ connectionString, max: 1 });
  const db = drizzle(pool);

  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - months);

  const deleted = await db
    .delete(eventRequests)
    .where(
      and(
        lt(eventRequests.updatedAt, cutoff),
        sql`${eventRequests.status} in ('new','contacted','quoted','lost')`,
      ),
    )
    .returning({ reference: eventRequests.reference });

  /**
   * Confirmed and completed events are kept far longer — there is a contract
   * and there are tax documents behind them — but "far longer" is not "for
   * ever". After RETENTION_MONTHS_COMPLETED (ten years by default, the Italian
   * bookkeeping term) they go too, otherwise the personal data of every client
   * accumulates with no end date at all.
   */
  const completedMonths = Number(process.env.RETENTION_MONTHS_COMPLETED ?? 120);
  const completedCutoff = new Date();
  completedCutoff.setMonth(completedCutoff.getMonth() - completedMonths);

  const deletedCompleted = await db
    .delete(eventRequests)
    .where(
      and(
        lt(eventRequests.updatedAt, completedCutoff),
        sql`${eventRequests.status} in ('confirmed','completed')`,
      ),
    )
    .returning({ reference: eventRequests.reference });

  const ipCutoff = new Date();
  ipCutoff.setFullYear(ipCutoff.getFullYear() - 1);
  const cleared = await db
    .update(eventRequests)
    .set({ ipHash: '' })
    .where(and(lt(eventRequests.createdAt, ipCutoff), sql`${eventRequests.ipHash} <> ''`))
    .returning({ reference: eventRequests.reference });

  console.log(`[retention] deleted ${deleted.length} unconverted request(s) older than ${months} months`);
  console.log(
    `[retention] deleted ${deletedCompleted.length} converted request(s) older than ${completedMonths} months`,
  );
  console.log(`[retention] cleared the IP hash on ${cleared.length} older request(s)`);

  await pool.end();
}

main().catch((error) => {
  console.error('[retention]', error instanceof Error ? error.message : error);
  process.exit(1);
});
