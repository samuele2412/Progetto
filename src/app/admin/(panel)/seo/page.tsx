import Link from 'next/link';
import { listPages } from '@/lib/cms';
import { getSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'SEO' };

/** Rough guidance, not rules: these are the lengths Google usually shows. */
const TITLE_MAX = 60;
const DESCRIPTION_MAX = 155;

function lengthNote(value: string, max: number): { label: string; tone: 'ok' | 'warn' | 'empty' } {
  if (!value.trim()) return { label: 'da scrivere', tone: 'empty' };
  if (value.length > max) return { label: `${value.length} caratteri — verrà tagliata`, tone: 'warn' };
  return { label: `${value.length} caratteri`, tone: 'ok' };
}

export default async function SeoOverviewPage() {
  const [pages, settings] = await Promise.all([listPages(), getSettings()]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl">SEO</h1>
        <p className="mt-1 max-w-2xl text-sm text-stone-600">
          Come si presenta il sito su Google. I titoli e le descrizioni di ogni pagina si modificano dalla scheda della
          pagina; qui vedi a colpo d’occhio cosa manca.
        </p>
      </header>

      <section className="admin-card p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-stone-900">Impostazioni generali</h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex flex-wrap gap-x-2">
            <dt className="text-stone-600">Titolo predefinito:</dt>
            <dd className="text-stone-800">{settings.seo.defaultTitle.it}</dd>
          </div>
          <div className="flex flex-wrap gap-x-2">
            <dt className="text-stone-600">Descrizione predefinita:</dt>
            <dd className="text-stone-800">{settings.seo.defaultDescription.it}</dd>
          </div>
        </dl>
        <Link href="/admin/contenuti" className="mt-3 inline-flex min-h-11 items-center text-sm underline">
          Modifica in Testi e contatti
        </Link>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-stone-600">Pagina per pagina</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-xs uppercase tracking-wider text-stone-600">
                <th className="py-2 pr-3 font-semibold">Pagina</th>
                <th className="py-2 pr-3 font-semibold">Titolo per Google</th>
                <th className="py-2 pr-3 font-semibold">Descrizione</th>
                <th className="py-2 font-semibold">Indicizzata</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => {
                const title = lengthNote(page.seoTitle.it, TITLE_MAX);
                const description = lengthNote(page.seoDescription.it, DESCRIPTION_MAX);
                return (
                  <tr key={page.id} className="border-b border-stone-100 align-top">
                    <td className="py-2.5 pr-3">
                      <Link href={`/admin/pagine/${page.id}`} className="font-medium text-stone-900 underline">
                        {page.title.it}
                      </Link>
                      <span className="block text-xs text-stone-600">/it/{page.slugIt}</span>
                    </td>
                    <td className="py-2.5 pr-3">
                      <span
                        className={
                          title.tone === 'warn'
                            ? 'admin-chip admin-chip-draft'
                            : title.tone === 'empty'
                              ? 'admin-chip'
                              : 'admin-chip admin-chip-live'
                        }
                      >
                        {title.label}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3">
                      <span
                        className={
                          description.tone === 'warn'
                            ? 'admin-chip admin-chip-draft'
                            : description.tone === 'empty'
                              ? 'admin-chip'
                              : 'admin-chip admin-chip-live'
                        }
                      >
                        {description.label}
                      </span>
                    </td>
                    <td className="py-2.5">
                      {page.noIndex ? (
                        <span className="admin-chip admin-chip-hidden">no</span>
                      ) : page.status === 'published' || page.routeKey ? (
                        <span className="admin-chip admin-chip-live">sì</span>
                      ) : (
                        <span className="admin-chip admin-chip-draft">bozza</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-stone-600">
          “Da scrivere” non è un errore: le pagine del sito hanno già titoli generati dal contenuto. Compilare questi
          campi serve quando vuoi controllare tu esattamente cosa compare nei risultati di ricerca.
        </p>
      </section>
    </div>
  );
}
