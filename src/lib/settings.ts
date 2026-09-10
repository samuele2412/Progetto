import 'server-only';
import { db } from '@/db';
import { settings as settingsTable } from '@/db/schema';
import { defaultSettings, type SiteSettings } from '@/content/settings';

export type { SiteSettings };
export { defaultSettings };

/**
 * Settings live in the database so the owner can reword the site without a
 * deploy, but the defaults in `src/content/settings.ts` are always the base:
 * a key that was never edited (or a brand-new key added by an update) still
 * renders. Values are merged one level deep — a group is edited as a whole.
 */
export async function getSettings(): Promise<SiteSettings> {
  let rows: { key: string; value: unknown }[] = [];
  try {
    rows = await db.select({ key: settingsTable.key, value: settingsTable.value }).from(settingsTable);
  } catch {
    // The site must still render if the database is briefly unreachable.
    return defaultSettings;
  }

  const merged = structuredClone(defaultSettings) as Record<string, Record<string, unknown>>;
  for (const row of rows) {
    if (!(row.key in merged)) continue;
    merged[row.key] = { ...merged[row.key], ...(row.value as Record<string, unknown>) };
  }
  return merged as unknown as SiteSettings;
}

export async function getSettingsGroup<K extends keyof SiteSettings>(key: K): Promise<SiteSettings[K]> {
  const all = await getSettings();
  return all[key];
}
