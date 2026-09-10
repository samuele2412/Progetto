'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { LanguageSwitcher, type SlugPair } from './LanguageSwitcher';

export type NavLink = { label: string; href: string };

export type HeaderProps = {
  locale: Locale;
  brandName: string;
  descriptor: string;
  links: NavLink[];
  /** Grouped under "Eventi" — the hand-written SEO landing pages. */
  eventLinks: NavLink[];
  eventsLabel: string;
  ctaLabel: string;
  ctaHref: string;
  homeHref: string;
  slugPairs: SlugPair[];
  menuLabel: string;
  closeLabel: string;
};

export function Header(props: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the drawer on navigation and lock the body while it is open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const allLinks = [...props.links, ...props.eventLinks];

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled || open
          ? 'border-b border-[var(--hairline)] bg-ink-950/92 backdrop-blur-md'
          : 'border-b border-transparent',
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 md:h-20">
        <Link href={props.homeHref} className="group flex flex-col leading-none" aria-label={props.brandName}>
          <span className="font-[family-name:var(--font-display)] text-xl tracking-tight text-bone-50 transition-colors group-hover:text-brass-300 md:text-[1.4rem]">
            {props.brandName}
          </span>
          <span className="mt-0.5 hidden text-[0.62rem] uppercase tracking-[0.2em] text-bone-500 sm:block">
            {props.descriptor}
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {props.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-bone-400 transition-colors hover:text-bone-50"
            >
              {link.label}
            </Link>
          ))}

          {props.eventLinks.length > 0 && (
            <div className="group relative">
              <button
                type="button"
                className="flex items-center gap-1 text-sm text-bone-400 transition-colors hover:text-bone-50"
                aria-haspopup="true"
              >
                {props.eventsLabel}
                <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M2.5 4.5 6 8l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="invisible absolute left-1/2 top-full w-72 -translate-x-1/2 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <ul className="card overflow-hidden p-1.5 shadow-[var(--shadow-lift)]">
                  {props.eventLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="block rounded-lg px-3 py-2.5 text-sm text-bone-200 transition-colors hover:bg-ink-800 hover:text-brass-300"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher locale={props.locale} slugPairs={props.slugPairs} className="hidden sm:flex" />
          <Link href={props.ctaHref} className="btn btn-primary hidden !min-h-0 !px-5 !py-2.5 text-sm lg:inline-flex">
            {props.ctaLabel}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? props.closeLabel : props.menuLabel}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--hairline-strong)] text-bone-100 transition-colors hover:border-brass-500 lg:hidden"
          >
            <span className="sr-only">{open ? props.closeLabel : props.menuLabel}</span>
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              {open ? (
                <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
              ) : (
                <>
                  <path d="M3 6h14" strokeLinecap="round" />
                  <path d="M3 12h14" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-[var(--hairline)] bg-ink-950 lg:hidden"
      >
        <nav aria-label="Mobile" className="container-page flex flex-col gap-1 py-6">
          {allLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border-b border-[var(--hairline)] py-4 font-[family-name:var(--font-display)] text-2xl text-bone-100"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-6 flex items-center justify-between">
            <LanguageSwitcher locale={props.locale} slugPairs={props.slugPairs} />
          </div>
          <Link href={props.ctaHref} className="btn btn-primary mt-4 w-full">
            {props.ctaLabel}
          </Link>
        </nav>
      </div>
    </header>
  );
}
