import Link from 'next/link';
import { count } from 'drizzle-orm';
import { NewPageForm } from '@/components/admin/builder/NewPageForm';
import { db } from '@/db';
import { pageSections } from '@/db/schema';
import { listPages } from '@/lib/cms';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Pagine' };

/** How many sections each page has, in one query instead of one per page. */
async function sectionCounts(): Promise<Map<number, number>> {
  try {
    const rows = await db
      .select({ pageId: pageSections.pageId, value: count() })
      .from(pageSections)
      .groupBy(pageSections.pageId);
    return new Map(rows.map((row) => [row.pageId, row.value]));
  } catch {
    return new Map();
  }
}

export default async function PagesPage() {
  const [pages, counts] = await Promise.all([listPages(), sectionCounts()]);
  const builtIn = pages.filter((page) => page.routeKey);
  const custom = pages.filter((page) => !page.routeKey);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl">Pagine</h1>
          <p className="mt-1 max-w-2xl text-sm text-stone-600">
            Le pagine che crei qui vanno online quando premi <strong className="font-semibold">Pubblica</strong>. Fino
            ad allora restano bozze, visibili solo a te.
          </p>
        </div>
        <NewPageForm />
      </header>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-stone-500">
          Pagine create da te ({custom.length})
        </h2>
        {custom.length === 0 ? (
          <div className="admin-card px-5 py-12 text-center">
            <p className="text-sm font-medium text-stone-700">Non hai ancora creato nessuna pagina.</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-stone-500">
              Da qui puoi creare landing per il posizionamento su Google — per esempio “Cocktail bar per compleanni a
              Roma” — senza toccare il codice.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {custom.map((page) => (
              <li key={page.id}>
                <Link
                  href={`/admin/pagine/${page.id}`}
                  className="admin-card flex flex-wrap items-center gap-x-3 gap-y-1.5 p-4 transition-colors hover:border-stone-400"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-stone-900">{page.title.it || 'Senza titolo'}</span>
                    <span className="block truncate text-xs text-stone-500">
                      /it/{page.slugIt} · {counts.get(page.id) ?? 0} sezioni
                    </span>
                  </span>
                  {page.status === 'published' ? (
                    <span className="admin-chip admin-chip-live">online</span>
                  ) : (
                    <span className="admin-chip admin-chip-draft">bozza</span>
                  )}
                  {page.hasUnpublishedChanges && page.status === 'published' && (
                    <span className="admin-chip admin-chip-draft">modifiche da pubblicare</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-1 text-sm font-semibold uppercase tracking-wider text-stone-500">
          Pagine del sito ({builtIn.length})
        </h2>
        <p className="mb-3 max-w-2xl text-sm text-stone-600">
          Queste esistono già nel codice e continuano a funzionare esattamente come ora. Puoi modificarne la SEO, e se
          vuoi ricostruirne una con il Page Builder puoi farlo dalla sua scheda — restando sempre libero di tornare
          indietro.
        </p>
        <ul className="space-y-2">
          {builtIn.map((page) => (
            <li key={page.id}>
              <Link
                href={`/admin/pagine/${page.id}`}
                className="admin-card flex flex-wrap items-center gap-x-3 gap-y-1.5 p-4 transition-colors hover:border-stone-400"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-stone-900">{page.title.it}</span>
                  <span className="block truncate text-xs text-stone-500">/it/{page.slugIt || ''}</span>
                </span>
                {page.managed ? (
                  <span className="admin-chip admin-chip-global">Page Builder</span>
                ) : (
                  <span className="admin-chip">dal codice</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
