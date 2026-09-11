'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

/**
 * Panel navigation.
 *
 * On a laptop it is a column that is always there. On a phone it is a drawer
 * behind a button, because the owner said they would be running the site from
 * an Android phone and a nav bar that eats a third of a 390px screen before any
 * content appears is not usable.
 */
export type NavItem = { href: string; label: string; icon: string; badge?: number };
export type NavGroup = { label: string; items: NavItem[] };

/** 24×24 stroke paths, drawn inline so the panel ships no icon font. */
export const NAV_ICONS = {
  dashboard: 'M4 13h7V4H4zM13 20h7v-9h-7zM4 20h7v-4H4zM13 8h7V4h-7z',
  pages: 'M6 3h8l4 4v14H6zM14 3v4h4',
  builder: 'M4 5h16M4 12h10M4 19h16M17 10l3 2-3 2',
  media: 'M4 5h16v14H4zM4 15l4-4 4 4 3-3 5 5',
  cocktails: 'M5 4h14l-7 8v7M8 19h8',
  packages: 'M4 7l8-3 8 3-8 3zM4 7v10l8 3 8-3V7',
  faq: 'M9 9a3 3 0 1 1 4 2.8V14M12 18h.01M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z',
  requests: 'M4 5h16v14H4zM4 9h16M9 13h7',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12l2-1-1-3-2 .5-2-1.5L15 4h-3l-1 2-2 1.5L7 7 5 8l1 3-2 1 2 1-1 3 2 .5 2 1.5 1 2h3l1-2 2-1.5 2 .5 1-3z',
  seo: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM16 16l4 4',
  sections: 'M4 5h16v5H4zM4 14h16v5H4z',
  site: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.4 3.8 5.4 3.8 9S14.5 18.6 12 21c-2.5-2.4-3.8-5.4-3.8-9S9.5 5.4 12 3z',
};

function Icon({ path }: { path: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[1.05rem] w-[1.05rem] shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={path} />
    </svg>
  );
}

function isActive(pathname: string, href: string): boolean {
  if (href === '/admin') return pathname === '/admin';
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Items({ groups, onNavigate }: { groups: NavGroup[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {groups.map((group) => (
        <div key={group.label} className="mt-5 first:mt-0">
          {/* stone-400 is 2.4:1 against the sidebar's #f6f5f3 — fine on white,
              not here. stone-600 clears AA on this background. */}
          <p className="px-3 pb-1.5 text-[0.65rem] font-semibold uppercase tracking-wider text-stone-600">
            {group.label}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? 'page' : undefined}
                    className={[
                      'flex min-h-11 items-center gap-2.5 rounded-lg px-3 text-sm transition-colors',
                      active
                        ? 'bg-stone-900 font-medium text-white'
                        : 'text-stone-700 hover:bg-stone-200/60',
                    ].join(' ')}
                  >
                    <Icon path={item.icon} />
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.badge ? (
                      <span
                        className={[
                          'rounded-full px-1.5 py-0.5 text-[0.65rem] font-semibold',
                          active ? 'bg-white/20 text-white' : 'bg-stone-900 text-white',
                        ].join(' ')}
                      >
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </>
  );
}

export function Sidebar({
  groups,
  footer,
  brand,
}: {
  groups: NavGroup[];
  footer: ReactNode;
  brand: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Closing on navigation is what makes the drawer feel like a menu rather than
  // something you have to dismiss twice.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      {/* Phone: a bar that stays put, so the menu is reachable from anywhere.
          A <header> rather than a <div> so its contents are inside a landmark —
          otherwise the brand link is content a screen reader cannot reach by
          jumping between regions. */}
      <header className="sticky top-0 z-50 flex items-center justify-between gap-3 border-b border-stone-200 bg-white/95 px-4 py-2.5 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="admin-nav"
          className="flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-medium text-stone-800"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          </svg>
          Menu
        </button>
        {brand}
      </header>

      {open && (
        <div
          className="fixed inset-0 z-[65] bg-stone-900/45 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <aside
        id="admin-nav"
        className={[
          'fixed inset-y-0 left-0 z-[66] w-[17rem] max-w-[85vw] shrink-0 overflow-y-auto border-r border-stone-200 bg-[#f6f5f3] px-3 py-4 transition-transform duration-200 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-60 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
        aria-label="Sezioni del pannello"
      >
        <div className="mb-4 hidden px-3 lg:block">{brand}</div>
        <div className="mb-4 flex items-center justify-end lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Chiudi il menu"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-stone-500 hover:bg-stone-200/60"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav>
          <Items groups={groups} onNavigate={() => setOpen(false)} />
        </nav>

        <div className="mt-6 border-t border-stone-200 pt-4">{footer}</div>
      </aside>
    </>
  );
}
