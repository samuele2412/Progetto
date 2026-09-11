import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { count, eq } from 'drizzle-orm';
import { logoutAction } from '@/app/admin/actions';
import { NAV_ICONS, Sidebar, type NavGroup } from '@/components/admin/Sidebar';
import { ToastProvider } from '@/components/admin/Toasts';
import { db } from '@/db';
import { eventRequests } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { collectionList } from '@/lib/admin/collections';

export const dynamic = 'force-dynamic';

/** New requests, shown as a badge so the panel says what needs attention. */
async function newRequestCount(): Promise<number> {
  try {
    const [row] = await db
      .select({ value: count() })
      .from(eventRequests)
      .where(eq(eventRequests.status, 'new'));
    return row?.value ?? 0;
  } catch {
    return 0;
  }
}

export default async function PanelLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  const pending = await newRequestCount();

  // The catalogue screens keep working exactly as before; they are simply
  // grouped now instead of being one long undifferentiated list.
  const catalogue = collectionList.map((collection) => ({
    href: `/admin/${collection.slug}`,
    label: collection.title,
    icon:
      collection.slug === 'cocktail'
        ? NAV_ICONS.cocktails
        : collection.slug === 'pacchetti'
          ? NAV_ICONS.packages
          : collection.slug === 'faq'
            ? NAV_ICONS.faq
            : NAV_ICONS.sections,
  }));

  const groups: NavGroup[] = [
    {
      label: 'Sito',
      items: [
        { href: '/admin', label: 'Dashboard', icon: NAV_ICONS.dashboard },
        { href: '/admin/pagine', label: 'Pagine', icon: NAV_ICONS.pages },
        { href: '/admin/sezioni', label: 'Sezioni salvate', icon: NAV_ICONS.builder },
        { href: '/admin/media', label: 'Media', icon: NAV_ICONS.media },
      ],
    },
    { label: 'Catalogo', items: catalogue },
    {
      label: 'Attività',
      items: [
        { href: '/admin/richieste', label: 'Richieste evento', icon: NAV_ICONS.requests, badge: pending },
      ],
    },
    {
      label: 'Configurazione',
      items: [
        { href: '/admin/contenuti', label: 'Testi e contatti', icon: NAV_ICONS.settings },
        { href: '/admin/seo', label: 'SEO', icon: NAV_ICONS.seo },
        { href: '/admin/account', label: 'Account', icon: NAV_ICONS.site },
      ],
    },
  ];

  const brand = (
    <Link href="/admin" className="block leading-tight">
      <span className="font-[family-name:var(--font-display)] text-lg text-stone-900">Cordiale</span>
      <span className="block text-[0.65rem] uppercase tracking-[0.16em] text-stone-600">Pannello</span>
    </Link>
  );

  const footer = (
    <div className="px-3">
      <a
        href="/"
        target="_blank"
        rel="noreferrer"
        className="flex min-h-11 items-center gap-2.5 rounded-lg px-0 text-sm text-stone-700 hover:underline"
      >
        Vedi il sito ↗
      </a>
      <form action={logoutAction} className="mt-2 border-t border-stone-200 pt-3">
        <p className="truncate text-xs text-stone-600">{session.email}</p>
        <button type="submit" className="mt-1.5 flex min-h-11 items-center text-sm text-stone-700 hover:underline">
          Esci
        </button>
      </form>
    </div>
  );

  return (
    <ToastProvider>
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col lg:flex-row">
        <Sidebar groups={groups} brand={brand} footer={footer} />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-5 lg:px-9 lg:py-9">{children}</main>
      </div>
    </ToastProvider>
  );
}
