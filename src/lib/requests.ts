import 'server-only';
import { and, count, desc, eq, gte, isNotNull, sql } from 'drizzle-orm';
import { db } from '@/db';
import { eventRequests, type RequestStatus, type StatusChange } from '@/db/schema';

export const requestStatuses: RequestStatus[] = [
  'new',
  'contacted',
  'quoted',
  'confirmed',
  'completed',
  'lost',
];

export const statusLabels: Record<RequestStatus, string> = {
  new: 'Nuova',
  contacted: 'Contattato',
  quoted: 'Preventivo',
  confirmed: 'Confermato',
  completed: 'Completato',
  lost: 'Perso',
};

/** Tailwind-ish colour pairs for the admin badges. */
export const statusStyles: Record<RequestStatus, string> = {
  new: 'bg-amber-100 text-amber-900 border-amber-200',
  contacted: 'bg-sky-100 text-sky-900 border-sky-200',
  quoted: 'bg-violet-100 text-violet-900 border-violet-200',
  confirmed: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  completed: 'bg-stone-200 text-stone-800 border-stone-300',
  lost: 'bg-rose-100 text-rose-900 border-rose-200',
};

export type RequestFilters = {
  status?: RequestStatus | 'all';
  search?: string;
  page?: number;
  perPage?: number;
};

export async function listRequests(filters: RequestFilters = {}) {
  const perPage = filters.perPage ?? 25;
  const page = Math.max(1, filters.page ?? 1);

  const conditions = [];
  if (filters.status && filters.status !== 'all') {
    conditions.push(eq(eventRequests.status, filters.status));
  }
  if (filters.search?.trim()) {
    const term = `%${filters.search.trim().toLowerCase()}%`;
    conditions.push(
      sql`(lower(${eventRequests.name}) like ${term} or lower(${eventRequests.email}) like ${term} or lower(${eventRequests.reference}) like ${term} or ${eventRequests.phone} like ${term})`,
    );
  }
  const where = conditions.length ? and(...conditions) : undefined;

  const [rows, [{ total }]] = await Promise.all([
    db
      .select()
      .from(eventRequests)
      .where(where)
      .orderBy(desc(eventRequests.createdAt))
      .limit(perPage)
      .offset((page - 1) * perPage),
    db.select({ total: count() }).from(eventRequests).where(where),
  ]);

  return { rows, total: Number(total), page, perPage, pages: Math.max(1, Math.ceil(Number(total) / perPage)) };
}

export async function getRequest(id: number) {
  const [row] = await db.select().from(eventRequests).where(eq(eventRequests.id, id)).limit(1);
  return row ?? null;
}

export async function updateRequestStatus(id: number, status: RequestStatus, by: string) {
  const current = await getRequest(id);
  if (!current) return null;

  const history: StatusChange[] = [
    ...current.statusHistory,
    { status, at: new Date().toISOString(), by },
  ];

  const [row] = await db
    .update(eventRequests)
    .set({ status, statusHistory: history, updatedAt: new Date() })
    .where(eq(eventRequests.id, id))
    .returning();
  return row;
}

export async function updateRequestNotes(id: number, adminNotes: string, estimatedValue: number | null) {
  const [row] = await db
    .update(eventRequests)
    .set({ adminNotes, estimatedValue, updatedAt: new Date() })
    .where(eq(eventRequests.id, id))
    .returning();
  return row;
}

export async function deleteRequest(id: number) {
  await db.delete(eventRequests).where(eq(eventRequests.id, id));
}

/**
 * Numbers for the dashboard. Kept to what actually changes a decision:
 * what needs answering today, what is booked, and whether the site converts.
 */
export async function getDashboardStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const todayIso = today.toISOString().slice(0, 10);

  const [byStatus, recent, upcoming, pipeline, conversion] = await Promise.all([
    db
      .select({ status: eventRequests.status, total: count() })
      .from(eventRequests)
      .groupBy(eventRequests.status),

    db.select().from(eventRequests).orderBy(desc(eventRequests.createdAt)).limit(8),

    db
      .select()
      .from(eventRequests)
      .where(
        and(
          isNotNull(eventRequests.eventDate),
          gte(eventRequests.eventDate, todayIso),
          sql`${eventRequests.status} in ('confirmed','quoted')`,
        ),
      )
      .orderBy(eventRequests.eventDate)
      .limit(8),

    db
      .select({ total: sql<number>`coalesce(sum(${eventRequests.estimatedValue}), 0)` })
      .from(eventRequests)
      .where(sql`${eventRequests.status} in ('quoted','confirmed')`),

    db
      .select({
        total: count(),
        won: sql<number>`count(*) filter (where ${eventRequests.status} in ('confirmed','completed'))`,
      })
      .from(eventRequests)
      .where(gte(eventRequests.createdAt, thirtyDaysAgo)),
  ]);

  const counts = Object.fromEntries(requestStatuses.map((status) => [status, 0])) as Record<RequestStatus, number>;
  for (const row of byStatus) counts[row.status] = Number(row.total);

  const last30 = conversion[0] ?? { total: 0, won: 0 };
  const conversionRate = Number(last30.total) > 0 ? Number(last30.won) / Number(last30.total) : null;

  return {
    counts,
    recent,
    upcoming,
    pipelineValue: Number(pipeline[0]?.total ?? 0),
    last30Days: Number(last30.total),
    conversionRate,
  };
}
