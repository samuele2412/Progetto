import Link from 'next/link';
import { getContentStats, getRecentChanges } from '@/lib/admin/overview';
import { getDashboardStats, statusLabels, statusStyles } from '@/lib/requests';
import { getSettings } from '@/lib/settings';
import { isPlaceholder } from '@/lib/utils';
import { defaultPrivacyBody } from '@/content/legal';
import { SITE_TIME_ZONE } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

function euro(value: number) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
}

function shortDate(value: string | Date | null) {
  if (!value) return '—';
  const date = typeof value === 'string' ? new Date(`${value}T00:00:00`) : value;
  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat('it-IT', { timeZone: SITE_TIME_ZONE, day: '2-digit', month: 'short', year: '2-digit' }).format(date);
}

/** Lists the settings still holding their shipped placeholder value. */
function findPlaceholders(settings: Awaited<ReturnType<typeof getSettings>>) {
  const checks: [string, string][] = [
    ['Numero WhatsApp', settings.contact.whatsapp],
    ['Numero di telefono', settings.contact.phone],
    ['Email', settings.contact.email],
    ['Instagram', settings.social.instagram],
    ['TikTok', settings.social.tiktok],
    ['Ragione sociale', settings.brand.legalName],
    ['Partita IVA', settings.brand.vatNumber],
    ['Nome del titolare (sezione “Chi siamo”)', settings.about.signature],
    // These feed the privacy and cookie pages; leaving them unset is exactly
    // what keeps the "bozza" banner on the legal pages.
    ['Titolare del trattamento (privacy)', settings.legal.dataController],
    ['Indirizzo del titolare (privacy)', settings.legal.controllerAddress],
    ['Email per richieste privacy', settings.legal.privacyEmail],
  ];
  return checks.filter(([, value]) => isPlaceholder(value)).map(([label]) => label);
}

export default async function DashboardPage() {
  const [stats, settings, content, recent] = await Promise.all([
    getDashboardStats(),
    getSettings(),
    getContentStats(),
    getRecentChanges(),
  ]);
  const pending = findPlaceholders(settings);
  // The shipped text still contains [[…]] markers that are *not* backed by a
  // setting (retention period, processors), so the warning has to look at the
  // text as it will actually render rather than at the raw default.
  const legalText = settings.legal.privacyBody.it || defaultPrivacyBody.it;
  const legalIncomplete = /\[\[/.test(
    legalText
      .replace(/\[\[RAGIONE SOCIALE\]\]|\[\[LEGAL NAME\]\]/g, isPlaceholder(settings.legal.dataController) ? 'X' : '')
      .replace(/\[\[INDIRIZZO\]\]|\[\[ADDRESS\]\]/g, isPlaceholder(settings.legal.controllerAddress) ? 'X' : '')
      .replace(/\[\[EMAIL\]\]/g, isPlaceholder(settings.legal.privacyEmail) ? 'X' : '')
      .replace(/\[\[PARTITA IVA\]\]|\[\[VAT NUMBER\]\]/g, isPlaceholder(settings.brand.vatNumber) ? 'X' : ''),
  );

  const cards = [
    { label: 'Nuove da leggere', value: stats.counts.new, href: '/admin/richieste?status=new', accent: true },
    { label: 'Da ricontattare', value: stats.counts.contacted, href: '/admin/richieste?status=contacted' },
    { label: 'Preventivi aperti', value: stats.counts.quoted, href: '/admin/richieste?status=quoted' },
    { label: 'Eventi confermati', value: stats.counts.confirmed, href: '/admin/richieste?status=confirmed' },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl">Dashboard</h1>
        <p className="mt-1 text-sm text-stone-600">Cosa richiede attenzione oggi.</p>
      </header>

      {(pending.length > 0 || legalIncomplete) && (
        <section className="admin-card border-amber-300 bg-amber-100/70 p-5">
          <h2 className="text-base text-amber-900">Prima di andare online</h2>
          <ul className="mt-3 space-y-1.5 text-sm text-amber-900">
            {pending.map((label) => (
              <li key={label}>
                • <strong>{label}</strong> è ancora un segnaposto —{' '}
                <Link href="/admin/contenuti" className="underline">
                  completalo
                </Link>
              </li>
            ))}
            {legalIncomplete && (
              <li>
                • L’informativa privacy contiene ancora dei segnaposto <code>[[…]]</code> (periodo di
                conservazione, fornitori) e va fatta verificare da un professionista.
              </li>
            )}
          </ul>
        </section>
      )}

      <section aria-labelledby="dash-requests" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <h2 id="dash-requests" className="sr-only">
          Richieste evento
        </h2>
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`admin-card p-5 transition-colors hover:border-stone-400 ${
              card.accent && card.value > 0 ? 'border-amber-300 bg-amber-100/70' : ''
            }`}
          >
            <p className="text-3xl font-semibold text-stone-900">{card.value}</p>
            <p className="mt-1 text-sm text-stone-600">{card.label}</p>
          </Link>
        ))}
      </section>

      <section aria-labelledby="dash-content">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <h2 id="dash-content" className="text-sm font-semibold uppercase tracking-wider text-stone-500">
            Contenuti del sito
          </h2>
          <Link href="/admin/pagine" className="text-sm underline">
            Gestisci le pagine
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Stat label="Pagine tue" value={content.pagesTotal} href="/admin/pagine" />
          <Stat label="Pubblicate" value={content.pagesPublished} href="/admin/pagine" />
          <Stat label="Bozze" value={content.pagesDraft} href="/admin/pagine" />
          <Stat label="Immagini" value={content.media} href="/admin/media" />
          <Stat label="Cocktail" value={content.cocktails} href="/admin/cocktail" />
          <Stat label="Pacchetti" value={content.packages} href="/admin/pacchetti" />
        </div>
      </section>

      {recent.length > 0 && (
        <section aria-labelledby="dash-recent">
          <h2 id="dash-recent" className="mb-3 text-sm font-semibold uppercase tracking-wider text-stone-500">
            Modifiche recenti
          </h2>
          <ul className="admin-card divide-y divide-stone-100">
            {recent.map((change) => (
              <li key={change.id}>
                <Link
                  href={change.href}
                  className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 transition-colors hover:bg-stone-50"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-stone-900">{change.label}</span>
                    <span className="block text-xs text-stone-500">{change.detail}</span>
                  </span>
                  <span className="text-xs text-stone-600">
                    {new Intl.DateTimeFormat('it-IT', {
                      timeZone: SITE_TIME_ZONE,
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    }).format(new Date(change.at))}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="admin-card p-5">
          <p className="text-xs uppercase tracking-wider text-stone-500">Valore in pipeline</p>
          <p className="mt-1 text-2xl font-semibold text-stone-900">{euro(stats.pipelineValue)}</p>
          <p className="mt-1 text-xs text-stone-500">Somma delle tue stime su preventivi e conferme</p>
        </div>
        <div className="admin-card p-5">
          <p className="text-xs uppercase tracking-wider text-stone-500">Richieste (30 giorni)</p>
          <p className="mt-1 text-2xl font-semibold text-stone-900">{stats.last30Days}</p>
        </div>
        <div className="admin-card p-5">
          <p className="text-xs uppercase tracking-wider text-stone-500">Conversione (30 giorni)</p>
          <p className="mt-1 text-2xl font-semibold text-stone-900">
            {stats.conversionRate === null ? '—' : `${Math.round(stats.conversionRate * 100)}%`}
          </p>
          <p className="mt-1 text-xs text-stone-500">Richieste diventate eventi confermati</p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg">Ultime richieste</h2>
            <Link href="/admin/richieste" className="text-sm text-stone-600 hover:underline">
              Tutte →
            </Link>
          </div>
          <div className="admin-card divide-y divide-stone-200">
            {stats.recent.length === 0 && <p className="p-5 text-sm text-stone-500">Ancora nessuna richiesta.</p>}
            {stats.recent.map((request) => (
              <Link
                key={request.id}
                href={`/admin/richieste/${request.id}`}
                className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-stone-50"
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium text-stone-900">{request.name}</span>
                  <span className="block text-xs text-stone-500">
                    {request.reference} · {shortDate(request.eventDate)} · {request.guestsRange || '—'}
                  </span>
                </span>
                <span
                  className={`shrink-0 rounded-full border px-2.5 py-1 text-[0.7rem] font-medium ${statusStyles[request.status]}`}
                >
                  {statusLabels[request.status]}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg">Prossimi eventi</h2>
          <div className="admin-card divide-y divide-stone-200">
            {stats.upcoming.length === 0 && (
              <p className="p-5 text-sm text-stone-500">Nessun evento confermato o in preventivo in calendario.</p>
            )}
            {stats.upcoming.map((request) => (
              <Link
                key={request.id}
                href={`/admin/richieste/${request.id}`}
                className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-stone-50"
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium text-stone-900">{request.name}</span>
                  <span className="block text-xs text-stone-500">
                    {request.eventTypeSlug || '—'} · {request.area || '—'}
                  </span>
                </span>
                <span className="shrink-0 text-sm font-medium text-stone-700">{shortDate(request.eventDate)}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/** A counter that links where you would go to change it. */
function Stat({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href} className="admin-card p-4 transition-colors hover:border-stone-400">
      <p className="text-2xl font-semibold text-stone-900">{value}</p>
      <p className="mt-0.5 text-xs text-stone-600">{label}</p>
    </Link>
  );
}
