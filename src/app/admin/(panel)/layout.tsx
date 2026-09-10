import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { logoutAction } from '@/app/admin/actions';
import { getSession } from '@/lib/auth';
import { collectionList } from '@/lib/admin/collections';

export const dynamic = 'force-dynamic';

const mainLinks = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/richieste', label: 'Richieste' },
];

export default async function PanelLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1500px] flex-col lg:flex-row">
      <aside className="shrink-0 border-b border-stone-200 bg-white lg:w-60 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-4 lg:block">
          <Link href="/admin" className="block">
            <span className="font-[family-name:var(--font-display)] text-lg text-stone-900">Cordiale</span>
            <span className="block text-[0.65rem] uppercase tracking-[0.16em] text-stone-500">Pannello</span>
          </Link>
        </div>

        <nav aria-label="Sezioni" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:pb-6">
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100"
            >
              {link.label}
            </Link>
          ))}

          <p className="mt-3 hidden px-3 pb-1 pt-3 text-[0.65rem] font-semibold uppercase tracking-wider text-stone-400 lg:block">
            Contenuti
          </p>
          <Link
            href="/admin/contenuti"
            className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-stone-700 transition-colors hover:bg-stone-100"
          >
            Testi e contatti
          </Link>
          <Link
            href="/admin/media"
            className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-stone-700 transition-colors hover:bg-stone-100"
          >
            Immagini
          </Link>
          {collectionList.map((collection) => (
            <Link
              key={collection.slug}
              href={`/admin/${collection.slug}`}
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-stone-700 transition-colors hover:bg-stone-100"
            >
              {collection.title}
            </Link>
          ))}

          <p className="mt-3 hidden px-3 pb-1 pt-3 text-[0.65rem] font-semibold uppercase tracking-wider text-stone-400 lg:block">
            Account
          </p>
          <Link
            href="/admin/account"
            className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-stone-700 transition-colors hover:bg-stone-100"
          >
            Password
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-stone-700 transition-colors hover:bg-stone-100"
          >
            Vedi il sito ↗
          </a>
        </nav>

        <form action={logoutAction} className="border-t border-stone-200 px-5 py-4">
          <p className="truncate text-xs text-stone-500">{session.email}</p>
          <button type="submit" className="mt-2 text-sm text-stone-700 hover:underline">
            Esci
          </button>
        </form>
      </aside>

      <main className="min-w-0 flex-1 px-5 py-8 lg:px-10">{children}</main>
    </div>
  );
}
