import { notFound } from 'next/navigation';
import { asc, desc } from 'drizzle-orm';
import { db } from '@/db';
import { CollectionEditor } from '@/components/admin/CollectionEditor';
import { getCollection } from '@/lib/admin/collections';

export const dynamic = 'force-dynamic';

/** Best-effort human label for a row, whatever shape its title column has. */
function labelFor(value: unknown, fallback: string): string {
  if (typeof value === 'string' && value.trim()) return value;
  if (value && typeof value === 'object' && 'it' in value) {
    const localized = (value as { it?: string; en?: string }).it ?? (value as { en?: string }).en;
    if (localized) return localized;
  }
  return fallback;
}

export default async function CollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection: slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const table = collection.table as unknown as Record<string, never>;
  const orderColumn = table[collection.orderBy];
  const rows = (await db
    .select()
    .from(collection.table as never)
    .orderBy(collection.orderBy === 'publishedAt' ? desc(orderColumn) : asc(orderColumn))) as unknown as Record<
    string,
    unknown
  >[];

  const labels = Object.fromEntries(
    rows.map((row) => [Number(row.id), labelFor(row[collection.titleField], `#${row.id}`)]),
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl">{collection.title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-stone-600">{collection.description}</p>
      </header>

      <CollectionEditor slug={collection.slug} fields={collection.fields} rows={rows} labelFor={labels} />
    </div>
  );
}
