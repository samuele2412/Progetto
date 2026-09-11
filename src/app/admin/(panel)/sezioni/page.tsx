import Link from 'next/link';
import { deleteSectionTemplateAction } from '@/app/admin/cms-actions';
import { ConfirmSubmit } from '@/components/admin/ConfirmSubmit';
import { blockRegistry } from '@/lib/blocks';
import { listSectionTemplates } from '@/lib/cms';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Sezioni salvate' };

export default async function SectionTemplatesPage() {
  const templates = await listSectionTemplates();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl">Sezioni salvate</h1>
        <p className="mt-1 max-w-2xl text-sm text-stone-600">
          Sezioni che puoi riusare su più pagine. Le salvi dal Page Builder, con il bottone “Salva come sezione
          riutilizzabile” dentro una sezione.
        </p>
      </header>

      <div className="admin-card p-4">
        <h2 className="text-sm font-semibold text-stone-900">Copia indipendente o sezione globale?</h2>
        <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-stone-600">
          <li>
            <strong className="font-semibold text-stone-800">Copia indipendente</strong> (predefinito): inserendola,
            ne ottieni un duplicato. Modificarla su una pagina non tocca le altre.
          </li>
          <li>
            <strong className="font-semibold text-stone-800">Globale</strong>: tutte le pagine che la usano mostrano la
            stessa cosa. Modificandola in un punto cambiano tutte insieme — comodo per la chiamata all’azione finale,
            rischioso per il resto.
          </li>
        </ul>
      </div>

      {templates.length === 0 ? (
        <div className="admin-card px-5 py-12 text-center">
          <p className="text-sm font-medium text-stone-700">Non hai ancora salvato nessuna sezione.</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-stone-500">
            Apri una <Link href="/admin/pagine" className="underline">pagina</Link>, modifica una sezione e salvala da
            lì per ritrovarla qui.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {templates.map((template) => (
            <li key={template.id} className="admin-card flex flex-wrap items-center gap-3 p-4">
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-stone-900">{template.name}</span>
                <span className="block text-xs text-stone-500">
                  {blockRegistry[template.type]?.label ?? template.type}
                </span>
              </span>
              {template.isGlobal ? (
                <span className="admin-chip admin-chip-global">globale</span>
              ) : (
                <span className="admin-chip">copia indipendente</span>
              )}
              <ConfirmSubmit
                action={deleteSectionTemplateAction}
                hidden={{ templateId: String(template.id) }}
                question="Eliminare questa sezione salvata?"
                confirmLabel="Elimina"
                triggerLabel="Elimina"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
