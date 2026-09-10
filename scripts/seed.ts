/**
 * Seeds the catalogue and editorial content.
 *
 * Idempotent by design: rows are matched on their natural key and skipped if
 * they already exist, so running it again after an update only adds what is
 * new and never overwrites anything edited from the admin panel.
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
} from '../src/db/schema';
import { addonSeeds, cocktailSeeds, eventTypeSeeds, packageSeeds } from '../src/content/catalog';
import { faqSeeds, landingPageSeeds, postSeeds } from '../src/content/editorial';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is not set');

  const pool = new Pool({ connectionString, max: 1 });
  const db = drizzle(pool);
  let added = 0;

  for (const seed of packageSeeds) {
    const [existing] = await db.select({ id: packages.id }).from(packages).where(eq(packages.slug, seed.slug)).limit(1);
    if (existing) continue;
    await db.insert(packages).values(seed);
    added += 1;
  }

  for (const seed of addonSeeds) {
    const [existing] = await db.select({ id: addons.id }).from(addons).where(eq(addons.slug, seed.slug)).limit(1);
    if (existing) continue;
    await db.insert(addons).values(seed);
    added += 1;
  }

  for (const [index, seed] of cocktailSeeds.entries()) {
    const [existing] = await db.select({ id: cocktails.id }).from(cocktails).where(eq(cocktails.slug, seed.slug)).limit(1);
    if (existing) continue;
    await db.insert(cocktails).values({
      ...seed,
      position: index + 1,
      imagePath: `/images/cocktails/${seed.slug}.jpg`,
    });
    added += 1;
  }

  for (const seed of eventTypeSeeds) {
    const [existing] = await db.select({ id: eventTypes.id }).from(eventTypes).where(eq(eventTypes.slug, seed.slug)).limit(1);
    if (existing) continue;
    await db.insert(eventTypes).values(seed);
    added += 1;
  }

  // FAQs have no natural key; a matching Italian question is close enough.
  const existingQuestions = new Set(
    (await db.select({ question: faqs.question }).from(faqs)).map((row) => row.question.it),
  );
  for (const seed of faqSeeds) {
    if (existingQuestions.has(seed.question.it)) continue;
    await db.insert(faqs).values(seed);
    added += 1;
  }

  for (const seed of landingPageSeeds) {
    const [existing] = await db
      .select({ id: landingPages.id })
      .from(landingPages)
      .where(eq(landingPages.key, seed.key))
      .limit(1);
    if (existing) continue;
    await db.insert(landingPages).values(seed);
    added += 1;
  }

  for (const seed of postSeeds) {
    const [existing] = await db.select({ id: posts.id }).from(posts).where(eq(posts.slugIt, seed.slugIt)).limit(1);
    if (existing) continue;
    await db.insert(posts).values(seed);
    added += 1;
  }

  console.log(`[seed] inserted ${added} new row(s); existing content left untouched`);
  await pool.end();
}

main().catch((error) => {
  console.error('[seed] failed:', error);
  process.exit(1);
});
