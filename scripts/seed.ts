/**
 * Seeds the catalogue and editorial content — once.
 *
 * It used to run on every container start, which meant anything deleted from
 * the panel reappeared at the next restart, a reworded FAQ came back as a
 * duplicate, and a renamed key hit the unique index and aborted the whole seed
 * (so later updates never inserted anything again).
 *
 * Now a marker row in `settings` records that the initial content has been
 * planted, and the seed does nothing afterwards unless it is asked to. Each
 * insert is also isolated: one failure is reported and skipped instead of
 * taking the rest down with it.
 *
 *   npm run db:seed            insert the initial content once
 *   npm run db:seed -- --force insert anything missing again (never overwrites)
 */
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';
import {
  addons,
  cocktails,
  eventTypes,
  faqs,
  landingPages,
  packages,
  posts,
  settings,
} from '../src/db/schema';
import { addonSeeds, cocktailSeeds, eventTypeSeeds, packageSeeds } from '../src/content/catalog';
import { faqSeeds, landingPageSeeds, postSeeds } from '../src/content/editorial';

const SEED_MARKER = 'seed.initialContent';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is not set');
  const force = process.argv.includes('--force');

  const pool = new Pool({ connectionString, max: 1 });
  const db = drizzle(pool);

  const [marker] = await db.select().from(settings).where(eq(settings.key, SEED_MARKER)).limit(1);
  if (marker && !force) {
    console.log('[seed] initial content already planted — nothing to do (use --force to re-check)');
    await pool.end();
    return;
  }

  let added = 0;
  let skipped = 0;

  /** One row's failure must not abort the rest of the seed. */
  const insert = async (label: string, run: () => Promise<unknown>) => {
    try {
      await run();
      added += 1;
    } catch (error) {
      skipped += 1;
      console.warn(`[seed] skipped ${label}: ${error instanceof Error ? error.message.split('\n')[0] : error}`);
    }
  };

  for (const seed of packageSeeds) {
    const [existing] = await db.select({ id: packages.id }).from(packages).where(eq(packages.slug, seed.slug)).limit(1);
    if (existing) continue;
    await insert(`package ${seed.slug}`, () => db.insert(packages).values(seed));
  }

  for (const seed of addonSeeds) {
    const [existing] = await db.select({ id: addons.id }).from(addons).where(eq(addons.slug, seed.slug)).limit(1);
    if (existing) continue;
    await insert(`addon ${seed.slug}`, () => db.insert(addons).values(seed));
  }

  for (const [index, seed] of cocktailSeeds.entries()) {
    const [existing] = await db.select({ id: cocktails.id }).from(cocktails).where(eq(cocktails.slug, seed.slug)).limit(1);
    if (existing) continue;
    await insert(`cocktail ${seed.slug}`, () =>
      db.insert(cocktails).values({
        ...seed,
        position: index + 1,
        imagePath: `/images/cocktails/${seed.slug}.jpg`,
      }),
    );
  }

  for (const seed of eventTypeSeeds) {
    const [existing] = await db.select({ id: eventTypes.id }).from(eventTypes).where(eq(eventTypes.slug, seed.slug)).limit(1);
    if (existing) continue;
    await insert(`event type ${seed.slug}`, () => db.insert(eventTypes).values(seed));
  }

  // FAQs have no natural key; a matching Italian question is close enough.
  const existingQuestions = new Set(
    (await db.select({ question: faqs.question }).from(faqs)).map((row) => row.question.it),
  );
  for (const seed of faqSeeds) {
    if (existingQuestions.has(seed.question.it)) continue;
    await insert(`faq "${seed.question.it.slice(0, 30)}"`, () => db.insert(faqs).values(seed));
  }

  for (const seed of landingPageSeeds) {
    const [existing] = await db
      .select({ id: landingPages.id })
      .from(landingPages)
      .where(eq(landingPages.key, seed.key))
      .limit(1);
    if (existing) continue;
    await insert(`landing ${seed.key}`, () => db.insert(landingPages).values(seed));
  }

  for (const seed of postSeeds) {
    const [existing] = await db.select({ id: posts.id }).from(posts).where(eq(posts.slugIt, seed.slugIt)).limit(1);
    if (existing) continue;
    await insert(`post ${seed.slugIt}`, () => db.insert(posts).values(seed));
  }

  await db
    .insert(settings)
    .values({ key: SEED_MARKER, value: { at: new Date().toISOString() } })
    .onConflictDoUpdate({ target: settings.key, set: { value: { at: new Date().toISOString() } } });

  console.log(
    `[seed] inserted ${added} new row(s)${skipped ? `, skipped ${skipped}` : ''}; existing content left untouched`,
  );
  await pool.end();
}

main().catch((error) => {
  console.error('[seed] failed:', error);
  process.exit(1);
});
