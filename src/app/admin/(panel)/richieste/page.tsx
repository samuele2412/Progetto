import Link from 'next/link';
import { listRequests, requestStatuses, statusLabels, statusStyles } from '@/lib/requests';
import type { RequestStatus } from '@/db/schema';

export const dynamic = 'force-dynamic';

function shortDate(value: string | Date | null) {
  if (!value) return '—';
  const date = typeof value === 'string' ? new Date(`${value}T00:00:00`) : value;
  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat('it-IT', { day: '2-digit', month: '2-digit', year: '2-digit' }).format(date);
}

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const status = (typeof query.status === 'string' ? query.status : 'all') as RequestStatus | 'all';
  const search = typeof query.q === 'string' ? query.q : '';
  const page = Number(typeof query.page === 'string' ? query.page : 1) || 1;

  const { rows, total, pages } = await listRequests({ status, search, page });

  const filters: { value: RequestStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'Tutte' },
    ...requestStatuses.map((value) => ({ value, label: statusLabels[value] })),
  ];

  function href(next: Record<string, string | number | undefined>) {
    const params = new URLSearchParams();
    if (status !== 'all') params.set('status', status);
    if (search) params.set('q', search);
    for (const [key, value] of Object.entries(next)) {
      if (value === undefined || value === '' || value === 'all') params.delete(key);
      else params.set(key, String(value));
    }
    const qs = params.toString();
    return `/admin/richieste${qs ? `?${qs}` : ''}`;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl">Richieste</h1>
          <p className="mt-1 text-sm text-stone-600">{total} in totale</p>
        </div>
        <form method="get" className="flex gap-2">
          {status !== 'all' && <input type="hidden" name="status" value={status} />}
          <input
            type="search"
            name="q"
            defaultValue={search}
            placeholder="Nome, email, telefono, riferimento"
            className="admin-field w-64"
            aria-label="Cerca fra le richieste"
          />
          <button type="submit" className="admin-btn admin-btn-secondary">
            Cerca
          </button>
        </form>
      </header>

      <nav aria-label="Filtra per stato" className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Link
            key={filter.value}
            href={href({ status: filter.value, page: undefined })}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
              status === filter.value
                ? 'border-stone-900 bg-stone-900 text-white'
                : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400'
            }`}
          >
            {filter.label}
          </Link>
        ))}
      </nav>

      <div className="admin-card overflow-x-auto">
        <table className="w-full min-w-[46rem] text-sm">
          <thead className="border-b border-stone-200 text-left text-xs uppercase tracking-wider text-stone-500">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">Cliente</th>
              <th scope="col" className="px-4 py-3 font-semibold">Evento</th>
              <th scope="col" className="px-4 py-3 font-semibold">Data</th>
              <th scope="col" className="px-4 py-3 font-semibold">Ospiti</th>
              <th scope="col" className="px-4 py-3 font-semibold">Pacchetto</th>
              <th scope="col" className="px-4 py-3 font-semibold">Stato</th>
              <th scope="col" className="px-4 py-3 font-semibold">Ricevuta</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-stone-500">
                  Nessuna richiesta con questi filtri.
                </td>
              </tr>
            )}
            {rows.map((request) => (
              <tr key={request.id} className="transition-colors hover:bg-stone-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/richieste/${request.id}`} className="font-medium text-stone-900 hover:underline">
                    {request.name}
                  </Link>
                  <span className="block text-xs text-stone-500">{request.reference}</span>
                </td>
                <td className="px-4 py-3 text-stone-700">{request.eventTypeSlug || '—'}</td>
                <td className="px-4 py-3 text-stone-700">
                  {request.dateFlexible ? <span className="text-stone-500">flessibile</span> : shortDate(request.eventDate)}
                </td>
                <td className="px-4 py-3 text-stone-700">{request.guestsRange || '—'}</td>
                <td className="px-4 py-3 text-stone-700">{request.packageSlug || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full border px-2.5 py-1 text-[0.7rem] font-medium ${statusStyles[request.status]}`}>
                    {statusLabels[request.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-stone-500">{shortDate(request.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <nav aria-label="Paginazione" className="flex items-center justify-between text-sm">
          {page > 1 ? (
            <Link href={href({ page: page - 1 })} className="text-stone-700 hover:underline">
              ← Precedente
            </Link>
          ) : (
            <span />
          )}
          <span className="text-stone-500">
            Pagina {page} di {pages}
          </span>
          {page < pages ? (
            <Link href={href({ page: page + 1 })} className="text-stone-700 hover:underline">
              Successiva →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  );
}
