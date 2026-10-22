/**
 * Brings the copy already in the database in line with the brand-voice rewrite
 * (docs/13-brand-voice.md) — without touching anything changed from the panel.
 *
 * The seed only ever inserts, so an install that was running before the rewrite
 * still holds the old formats, cocktails, FAQs, landing pages and articles, and
 * a settings group saved from the panel still holds the old copy word for word.
 * For every field this script compares three values: what the database holds,
 * what the previous version shipped (scripts/content/legacy-v1.json) and what
 * this version ships. Only a field still equal to the old default is moved to
 * the new one. Anything else was written by the owner: it is left alone, and
 * listed at the end so it can be reviewed by hand.
 *
 * Nothing is deleted. Retired formats, extras, cocktails and questions are
 * switched off, and every change — value before, value after — is written to
 * one row of the settings table, which also makes the script a no-op from the
 * second run onwards. `--restore` puts back the old value of every field that
 * still holds what this script wrote; a field edited since is kept.
 *
 *   npm run content:update              apply once (does nothing if already applied)
 *   npm run content:update -- --dry     list what would change, write nothing
 *   npm run content:restore             undo it (fields edited since are kept)
 *   npm run content:update -- --force   apply again after a restore
 */
import 'dotenv/config';
import { Pool, type PoolClient } from 'pg';
// Imported rather than read at runtime: esbuild inlines it into the bundle, so
// the script works inside the container without scripts/ having to be shipped.
import legacy from './content/legacy-v1.json';
import { cocktailSeeds, eventTypeSeeds } from '../src/content/catalog';
import { faqSeeds, landingPageSeeds, postSeeds } from '../src/content/editorial';
import { defaultSettings } from '../src/content/settings';

/** The settings row that holds the log. Not a settings group: the site ignores it. */
const LOG_KEY = 'content.update.v2';
/** Serialises two containers starting at once; any constant will do. */
const LOCK_ID = 7_420_002;

type Row = Record<string, unknown> & { id: number };

type Change =
  | {
      kind: 'field';
      table: string;
      /** Row id, or the group key for `settings`. */
      id: number | string;
      field: string;
      before: unknown;
      after: unknown;
      /** Settings only: the field was removed so the code default shows through. */
      afterAbsent?: boolean;
    }
  | { kind: 'insert'; table: string; id: number; after: Record<string, unknown> };

type Log = {
  revision: 2;
  appliedAt: string;
  restoredAt?: string;
  changes: Change[];
  /** Fields left alone because they no longer match the old default. */
  kept: string[];
};

/** Deep equality that ignores key order: jsonb does not keep it. */
function same(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((v, i) => same(v, b[i]));
  const ka = Object.keys(a as object);
  const kb = Object.keys(b as object);
  return (
    ka.length === kb.length &&
    ka.every((k) => same((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]))
  );
}

/** camelCase field name → snake_case column. Every name comes from this file, never from input. */
const column = (field: string) => field.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);

/** The jsonb columns among those the script writes; the rest are plain scalars. */
const jsonColumns: Record<string, Set<string>> = {
  packages: new Set(['name', 'kicker', 'description', 'priceNote', 'includes', 'excludes']),
  addons: new Set(['name', 'description', 'price']),
  cocktails: new Set(['ingredients', 'description']),
  event_types: new Set(['name', 'blurb']),
  faqs: new Set(['question', 'answer']),
  landing_pages: new Set(['heroTitle', 'heroSubtitle', 'body', 'highlights', 'seoTitle', 'seoDescription']),
  posts: new Set(['title', 'excerpt', 'body', 'seoTitle', 'seoDescription']),
  pages: new Set(['title']),
};

function placeholder(table: string, field: string): string {
  if (table === 'cocktails' && field === 'category') return '$1::cocktail_category';
  return jsonColumns[table]?.has(field) ? '$1::jsonb' : '$1';
}

async function rows(client: PoolClient, table: string): Promise<Row[]> {
  const result = await client.query(`select * from ${table} order by id`);
  return result.rows.map((row) => camelise(row) as Row);
}

function camelise(row: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(row).map(([k, v]) => [k.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase()), v]));
}

async function setField(client: PoolClient, table: string, id: number, field: string, value: unknown) {
  // pg would send a bare array as a Postgres array, so jsonb goes as text.
  const json = jsonColumns[table]?.has(field);
  await client.query(`update ${table} set ${column(field)} = ${placeholder(table, field)} where id = $2`, [
    json ? JSON.stringify(value) : value,
    id,
  ]);
}

async function readLog(client: PoolClient): Promise<Log | null> {
  const result = await client.query('select value from settings where key = $1', [LOG_KEY]);
  return (result.rows[0]?.value as Log | undefined) ?? null;
}

async function writeLog(client: PoolClient, log: Log) {
  await client.query(
    `insert into settings (key, value, updated_at) values ($1, $2::jsonb, now())
     on conflict (key) do update set value = excluded.value, updated_at = now()`,
    [LOG_KEY, JSON.stringify(log)],
  );
}

/* -------------------------------------------------------------------------- */
/* Update                                                                     */
/* -------------------------------------------------------------------------- */

async function update(client: PoolClient): Promise<Log> {
  const changes: Change[] = [];
  const kept: string[] = [];

  /**
   * The three-way rule for one field: move it only if it still holds exactly
   * what the previous version shipped, and only if this version ships
   * something different.
   */
  const threeWay = async (table: string, row: Row, field: string, oldValue: unknown, newValue: unknown, label: string) => {
    if (oldValue === undefined || same(oldValue, newValue)) return;
    const current = row[field];
    if (same(current, newValue)) return;
    if (!same(current, oldValue)) {
      kept.push(`${label} · ${field}`);
      return;
    }
    await setField(client, table, row.id, field, newValue);
    changes.push({ kind: 'field', table, id: row.id, field, before: current, after: newValue });
  };

  /** Switches a retired row off, but only if its copy is still the shipped one. */
  const retire = async (table: string, row: Row, original: Record<string, unknown>, fields: string[], label: string) => {
    if (!row.active) return;
    const untouched = fields.every((field) => same(row[field], original[field]));
    if (!untouched) {
      kept.push(`${label} (modificato da te: lasciato attivo)`);
      return;
    }
    await setField(client, table, row.id, 'active', false);
    changes.push({ kind: 'field', table, id: row.id, field: 'active', before: true, after: false });
  };

  /* ---- settings ---------------------------------------------------------- */
  // A group is stored only once it has been saved from the panel (or touched
  // by the stock-photo seed). A stored field still equal to the old default is
  // removed, so the new default in src/content/settings.ts shows through.
  const settingsResult = await client.query('select key, value from settings');
  const defaults = defaultSettings as unknown as Record<string, Record<string, unknown>>;
  const oldDefaults = legacy.settings as unknown as Record<string, Record<string, unknown>>;
  for (const { key, value } of settingsResult.rows as { key: string; value: Record<string, unknown> }[]) {
    if (!(key in defaults) || !oldDefaults[key] || !value || typeof value !== 'object') continue;
    const next = { ...value };
    let touched = false;
    for (const field of Object.keys(defaults[key])) {
      if (!(field in value)) continue;
      const oldValue = oldDefaults[key][field];
      const newValue = defaults[key][field];
      if (oldValue === undefined || same(oldValue, newValue) || same(value[field], newValue)) continue;
      if (!same(value[field], oldValue)) {
        // Image paths are pointed at the stock photos by their own seed; they
        // are not copy, and listing them would bury the fields that matter.
        if (!/(image|video)Path$/i.test(field)) kept.push(`Testi e contatti · ${key}.${field}`);
        continue;
      }
      delete next[field];
      touched = true;
      changes.push({ kind: 'field', table: 'settings', id: key, field, before: value[field], after: null, afterAbsent: true });
    }
    if (touched) {
      await client.query('update settings set value = $1::jsonb, updated_at = now() where key = $2', [JSON.stringify(next), key]);
    }
  }

  /* ---- formats and extras: switched off ---------------------------------- */
  const packageRows = await rows(client, 'packages');
  for (const original of legacy.packages) {
    const row = packageRows.find((r) => r.slug === original.slug);
    if (!row) continue;
    await retire(
      'packages',
      row,
      original,
      ['name', 'kicker', 'description', 'guestsMin', 'guestsMax', 'pricePerGuestFrom', 'minimumTotal', 'priceNote', 'includes', 'excludes'],
      `Formula «${original.name.it}»`,
    );
  }
  const addonRows = await rows(client, 'addons');
  for (const original of legacy.addons) {
    const row = addonRows.find((r) => r.slug === original.slug);
    if (!row) continue;
    await retire('addons', row, original, ['name', 'description', 'price'], `Extra «${original.name.it}»`);
  }

  /* ---- cocktails ---------------------------------------------------------- */
  // Never re-inserted: a cocktail missing from the table was deleted from the
  // panel, and the seed's whole design is that deleted content stays deleted.
  const cocktailRows = await rows(client, 'cocktails');
  const oldPosition = new Map(legacy.cocktails.map((c, index) => [c.slug, index + 1]));
  for (const [index, seed] of cocktailSeeds.entries()) {
    const row = cocktailRows.find((r) => r.slug === seed.slug);
    const original = legacy.cocktails.find((c) => c.slug === seed.slug) as Record<string, unknown> | undefined;
    if (!row || !original) continue;
    const label = `Cocktail «${seed.name}»`;
    for (const field of ['name', 'category', 'featured', 'ingredients', 'description']) {
      await threeWay('cocktails', row, field, original[field], (seed as Record<string, unknown>)[field], label);
    }
    await threeWay('cocktails', row, 'position', oldPosition.get(seed.slug), index + 1, label);
  }
  for (const original of legacy.cocktails) {
    if (cocktailSeeds.some((seed) => seed.slug === original.slug)) continue;
    const row = cocktailRows.find((r) => r.slug === original.slug);
    if (!row) continue;
    await retire('cocktails', row, original, ['name', 'ingredients', 'description'], `Cocktail «${original.name}»`);
  }

  /* ---- event types --------------------------------------------------------- */
  const eventRows = await rows(client, 'event_types');
  for (const seed of eventTypeSeeds) {
    const row = eventRows.find((r) => r.slug === seed.slug);
    const original = legacy.eventTypes.find((e) => e.slug === seed.slug);
    if (!row || !original) continue;
    const label = `Tipo di evento «${seed.name.it}»`;
    await threeWay('event_types', row, 'name', original.name, seed.name, label);
    await threeWay('event_types', row, 'blurb', original.blurb, seed.blurb, label);
  }

  /* ---- FAQ ------------------------------------------------------------------ */
  // No natural key: the Italian question is the identity, as in the seed. The
  // old questions are switched off and the new ones added, because the set was
  // rewritten rather than reworded one by one.
  const faqRows = await rows(client, 'faqs');
  for (const original of legacy.faqs) {
    const matches = faqRows.filter((r) => (r.question as { it: string }).it === original.question.it);
    const label = `Domanda «${original.question.it}»`;
    // A question asked in the same words by both versions is updated in place.
    const kept = faqSeeds.find((seed) => seed.question.it === original.question.it) as Record<string, unknown> | undefined;
    for (const row of matches) {
      if (!kept) {
        await retire('faqs', row, original, ['question', 'answer', 'topic'], label);
        continue;
      }
      for (const field of ['question', 'answer', 'topic', 'position']) {
        await threeWay('faqs', row, field, (original as Record<string, unknown>)[field], kept[field], label);
      }
    }
  }
  const existingQuestions = new Set(faqRows.map((r) => (r.question as { it: string }).it));
  for (const seed of faqSeeds) {
    if (existingQuestions.has(seed.question.it)) continue;
    const result = await client.query(
      'insert into faqs (position, active, topic, question, answer) values ($1, true, $2, $3::jsonb, $4::jsonb) returning id',
      [seed.position, seed.topic, JSON.stringify(seed.question), JSON.stringify(seed.answer)],
    );
    changes.push({
      kind: 'insert',
      table: 'faqs',
      id: result.rows[0].id as number,
      after: { question: seed.question, answer: seed.answer },
    });
  }

  /* ---- landing pages ---------------------------------------------------------- */
  const landingRows = await rows(client, 'landing_pages');
  for (const seed of landingPageSeeds) {
    const row = landingRows.find((r) => r.key === seed.key);
    const original = legacy.landingPages.find((l) => l.key === seed.key) as Record<string, unknown> | undefined;
    if (!row || !original) continue;
    const label = `Pagina evento «${seed.key}»`;
    for (const field of ['heroTitle', 'heroSubtitle', 'body', 'highlights', 'seoTitle', 'seoDescription', 'recommendedPackage', 'faqTopic']) {
      await threeWay('landing_pages', row, field, original[field], (seed as Record<string, unknown>)[field], label);
    }
  }

  /* ---- journal ------------------------------------------------------------------ */
  const postRows = await rows(client, 'posts');
  for (const seed of postSeeds) {
    const row = postRows.find((r) => r.slugIt === seed.slugIt);
    const original = legacy.posts.find((p) => p.slugIt === seed.slugIt) as Record<string, unknown> | undefined;
    if (!row || !original) continue;
    const label = `Articolo «${seed.title.it}»`;
    for (const field of ['title', 'excerpt', 'body', 'seoTitle', 'seoDescription']) {
      await threeWay('posts', row, field, original[field], (seed as Record<string, unknown>)[field], label);
    }
  }

  /* ---- the panel's names for two built-in pages --------------------------------- */
  const pageRows = await rows(client, 'pages');
  const renamed: Record<string, [unknown, unknown]> = {
    packages: [{ it: 'Pacchetti', en: 'Packages' }, { it: 'Il servizio', en: 'The service' }],
    about: [{ it: 'Chi siamo', en: 'About' }, { it: 'Chi sono', en: 'About me' }],
  };
  for (const [routeKey, [oldTitle, newTitle]] of Object.entries(renamed)) {
    const row = pageRows.find((r) => r.routeKey === routeKey);
    if (row) await threeWay('pages', row, 'title', oldTitle, newTitle, `Pagina «${routeKey}»`);
  }

  return { revision: 2, appliedAt: new Date().toISOString(), changes, kept };
}

/* -------------------------------------------------------------------------- */
/* Restore                                                                    */
/* -------------------------------------------------------------------------- */

async function restore(client: PoolClient, log: Log) {
  let restored = 0;
  const skipped: string[] = [];

  for (const change of [...log.changes].reverse()) {
    if (change.kind === 'insert') {
      // A question this script added is switched off again — unless it has
      // been edited since, in which case it is the owner's now.
      const result = await client.query(`select * from ${change.table} where id = $1`, [change.id]);
      const row = result.rows[0] ? camelise(result.rows[0]) : null;
      if (!row) continue;
      const untouched = Object.entries(change.after).every(([field, value]) => same(row[field], value));
      if (!untouched) {
        skipped.push(`${change.table} #${change.id}`);
        continue;
      }
      await setField(client, change.table, change.id, 'active', false);
      restored += 1;
      continue;
    }

    if (change.table === 'settings') {
      const result = await client.query('select value from settings where key = $1', [change.id]);
      const value = (result.rows[0]?.value ?? {}) as Record<string, unknown>;
      // The update removed the field; if it is back, it was saved from the panel since.
      if (change.field in value) {
        skipped.push(`settings ${change.id}.${change.field}`);
        continue;
      }
      value[change.field] = change.before;
      await client.query(
        `insert into settings (key, value, updated_at) values ($1, $2::jsonb, now())
         on conflict (key) do update set value = excluded.value, updated_at = now()`,
        [change.id, JSON.stringify(value)],
      );
      restored += 1;
      continue;
    }

    const result = await client.query(`select * from ${change.table} where id = $1`, [change.id]);
    const row = result.rows[0] ? camelise(result.rows[0]) : null;
    if (!row) continue;
    if (!same(row[change.field], change.after)) {
      skipped.push(`${change.table} #${change.id} · ${change.field}`);
      continue;
    }
    await setField(client, change.table, change.id as number, change.field, change.before);
    restored += 1;
  }

  await writeLog(client, { ...log, restoredAt: new Date().toISOString() });
  console.log(`[content] ripristinati ${restored} campi${skipped.length ? `; ${skipped.length} lasciati perché modificati dopo l'aggiornamento:` : ''}`);
  for (const line of skipped) console.log(`[content]   - ${line}`);
}

/* -------------------------------------------------------------------------- */

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is not set');
  const dry = process.argv.includes('--dry');
  const force = process.argv.includes('--force');
  const restoring = process.argv.includes('--restore');

  const pool = new Pool({ connectionString, max: 1 });
  const client = await pool.connect();
  try {
    await client.query('begin');
    await client.query('select pg_advisory_xact_lock($1)', [LOCK_ID]);
    const log = await readLog(client);

    if (restoring) {
      if (!log || log.restoredAt) {
        console.log('[content] niente da ripristinare');
        await client.query('rollback');
        return;
      }
      await restore(client, log);
      await client.query(dry ? 'rollback' : 'commit');
      return;
    }

    if (log && !force) {
      console.log(
        log.restoredAt
          ? '[content] aggiornamento annullato in precedenza — usa --force per riapplicarlo'
          : '[content] testi già aggiornati — niente da fare',
      );
      await client.query('rollback');
      return;
    }

    const result = await update(client);
    if (!dry) await writeLog(client, result);
    await client.query(dry ? 'rollback' : 'commit');

    const counts = new Map<string, number>();
    for (const change of result.changes) counts.set(change.table, (counts.get(change.table) ?? 0) + 1);
    const summary = [...counts].map(([table, n]) => `${table} ${n}`).join(', ') || 'nessuna modifica';
    console.log(`[content] ${dry ? '(prova, nulla scritto) ' : ''}testi aggiornati: ${summary}`);
    if (result.kept.length) {
      console.log(`[content] lasciati come sono, perché modificati da te (${result.kept.length}):`);
      for (const line of result.kept) console.log(`[content]   - ${line}`);
    }
  } catch (error) {
    await client.query('rollback').catch(() => undefined);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error('[content] fallito:', error);
  process.exit(1);
});
