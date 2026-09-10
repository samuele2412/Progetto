import Link from 'next/link';
import { notFound } from 'next/navigation';
import { deleteRequestAction, setRequestStatusAction } from '@/app/admin/actions';
import { RequestNotesForm } from '@/components/admin/RequestNotesForm';
import { ConfirmSubmit } from '@/components/admin/ConfirmSubmit';
import { SubmitButton } from '@/components/admin/SubmitButton';
import {
  areaLabels,
  cocktailPreferenceLabels,
  guestRangeLabels,
  serviceModeLabels,
  type AreaOption,
  type CocktailPreference,
  type GuestRange,
} from '@/lib/form-options';
import { getRequest, requestStatuses, statusLabels, statusStyles } from '@/lib/requests';
import { getSettings } from '@/lib/settings';
import { whatsappLink } from '@/lib/utils';
import { SITE_TIME_ZONE } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

function fullDate(value: string | Date | null) {
  if (!value) return '—';
  const date = typeof value === 'string' ? new Date(`${value}T00:00:00`) : value;
  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat('it-IT', { timeZone: SITE_TIME_ZONE, dateStyle: 'full' }).format(date);
}

function dateTime(value: Date) {
  return new Intl.DateTimeFormat('it-IT', { timeZone: SITE_TIME_ZONE, dateStyle: 'short', timeStyle: 'short' }).format(value);
}

export default async function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const request = await getRequest(Number(id));
  if (!request) notFound();

  const settings = await getSettings();

  // Pre-fills WhatsApp with the client's own details so the reply takes seconds.
  const replyMessage =
    `Ciao ${request.name.split(' ')[0]}, ti scrivo da ${settings.brand.name} per la tua richiesta ` +
    `${request.reference}${request.eventDate ? ` del ${fullDate(request.eventDate)}` : ''}. `;
  // The client's own number, normalised: without a country code wa.me reads
  // "333 1234567" as France and opens a chat with a stranger.
  const whatsappHref = whatsappLink(request.phone, replyMessage, settings.contact.defaultCountryCode);

  const rows: [string, string][] = [
    ['Riferimento', request.reference],
    ['Telefono', request.phone],
    ['Email', request.email],
    ['Preferisce WhatsApp', request.prefersWhatsapp ? 'Sì' : 'No'],
    ['Data evento', request.dateFlexible ? 'Da definire' : fullDate(request.eventDate)],
    ['Tipo di evento', request.eventTypeSlug || '—'],
    ['Zona', request.area ? (areaLabels[request.area as AreaOption]?.it ?? request.area) : '—'],
    ['Location', request.venueNote || '—'],
    ['Ospiti', request.guestsRange ? guestRangeLabels[request.guestsRange as GuestRange]?.it ?? request.guestsRange : '—'],
    ['Pacchetto richiesto', request.packageSlug || 'Da consigliare'],
    ['Formula bevande', serviceModeLabels[request.serviceMode]?.it ?? request.serviceMode],
    [
      'Preferenze cocktail',
      request.preferences.length
        ? request.preferences.map((key) => cocktailPreferenceLabels[key as CocktailPreference]?.it ?? key).join(', ')
        : '—',
    ],
    ['Tipo di contatto', request.isPartner ? 'Professionista (da Collaboriamo)' : 'Cliente privato'],
    ['Lingua del sito', request.locale.toUpperCase()],
    ['Ricevuta il', dateTime(request.createdAt)],
  ];

  const source = request.source ?? {};
  const sourceRows = Object.entries({
    Campagna: source.utmCampaign,
    Sorgente: source.utmSource,
    Mezzo: source.utmMedium,
    Termine: source.utmTerm,
    Contenuto: source.utmContent,
    'Pagina di arrivo': source.landingPath,
    Referrer: source.referrer,
  }).filter(([, value]) => Boolean(value)) as [string, string][];

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/richieste" className="text-sm text-stone-600 hover:underline">
          ← Tutte le richieste
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl">{request.name}</h1>
          <span className={`rounded-full border px-2.5 py-1 text-[0.72rem] font-medium ${statusStyles[request.status]}`}>
            {statusLabels[request.status]}
          </span>
        </div>
      </div>

      {/* Pipeline */}
      <section className="admin-card p-5">
        <h2 className="admin-label !mb-3">Stato</h2>
        <div className="flex flex-wrap gap-2">
          {requestStatuses.map((status) => (
            <form key={status} action={setRequestStatusAction}>
              <input type="hidden" name="id" value={request.id} />
              <input type="hidden" name="status" value={status} />
              <SubmitButton
                variant={status === request.status ? 'primary' : 'secondary'}
                pendingLabel="…"
                className="!min-h-0 !px-3 !py-1.5 !text-xs"
              >
                {statusLabels[status]}
              </SubmitButton>
            </form>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <section className="admin-card p-5">
            <h2 className="mb-4 text-lg">Dettagli</h2>
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {rows.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs uppercase tracking-wider text-stone-500">{label}</dt>
                  <dd className="mt-0.5 break-words text-sm text-stone-900">{value}</dd>
                </div>
              ))}
            </dl>

            {request.message && (
              <>
                <h3 className="admin-label mt-6">Note del cliente</h3>
                <p className="whitespace-pre-wrap rounded-lg bg-stone-100 p-4 text-sm text-stone-800">
                  {request.message}
                </p>
              </>
            )}
          </section>

          <RequestNotesForm
            id={request.id}
            adminNotes={request.adminNotes}
            estimatedValue={request.estimatedValue}
          />

          {request.statusHistory.length > 0 && (
            <section className="admin-card p-5">
              <h2 className="admin-label !mb-3">Cronologia</h2>
              <ol className="space-y-1.5 text-sm text-stone-600">
                {request.statusHistory.map((entry, index) => (
                  <li key={`${entry.at}-${index}`}>
                    {dateTime(new Date(entry.at))} — {statusLabels[entry.status as keyof typeof statusLabels] ?? entry.status}{' '}
                    <span className="text-stone-400">({entry.by})</span>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <section className="admin-card p-5">
            <h2 className="admin-label !mb-3">Rispondi</h2>
            <div className="space-y-2">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="admin-btn w-full"
                style={{ background: '#1f6f4e' }}
              >
                WhatsApp
              </a>
              <a href={`tel:${request.phone.replace(/[^\d+]/g, '')}`} className="admin-btn admin-btn-secondary w-full">
                Chiama
              </a>
              <a
                href={`mailto:${request.email}?subject=${encodeURIComponent(`La tua richiesta ${request.reference}`)}`}
                className="admin-btn admin-btn-secondary w-full"
              >
                Email
              </a>
            </div>
          </section>

          {sourceRows.length > 0 && (
            <section className="admin-card p-5">
              <h2 className="admin-label !mb-3">Provenienza</h2>
              <dl className="space-y-2 text-sm">
                {sourceRows.map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs uppercase tracking-wider text-stone-500">{label}</dt>
                    <dd className="break-all text-stone-800">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <section className="admin-card border-red-200 p-5">
            <h2 className="admin-label !mb-2">Elimina</h2>
            <p className="mb-3 text-xs text-stone-600">
              Rimuove definitivamente i dati personali di questa richiesta. Usalo per le richieste di cancellazione
              GDPR.
            </p>
            <ConfirmSubmit
              action={deleteRequestAction}
              hidden={{ id: String(request.id) }}
              question="Eliminare i dati di questo cliente?"
              confirmLabel="Sì, elimina"
              triggerLabel="Elimina definitivamente"
              className="inline-flex min-h-11 items-center rounded-lg border border-red-300 px-3 text-sm font-medium text-red-700 hover:bg-red-50"
            />
          </section>
        </aside>
      </div>
    </div>
  );
}
