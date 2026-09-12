'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Persistent mobile CTA. Most of this site's traffic is expected to arrive from
 * Instagram and TikTok on a phone, so the two ways to start a conversation stay
 * one thumb-reach away — but only after the visitor has scrolled past the hero,
 * where the same two buttons are already on screen.
 *
 * It hides itself on the request form: nudging somebody to WhatsApp while they
 * are halfway through the form would cost the lead, not win it.
 */
export function MobileActionBar({
  quoteHref,
  quoteLabel,
  whatsappHref,
  whatsappLabel,
  regionLabel,
  hideOnPaths,
}: {
  quoteHref: string;
  quoteLabel: string;
  whatsappHref: string;
  whatsappLabel: string;
  /** Names the landmark for screen readers, e.g. "Azioni rapide". */
  regionLabel: string;
  hideOnPaths: string[];
}) {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname() ?? '';

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 560);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (hideOnPaths.some((path) => pathname.startsWith(path))) return null;

  return (
    // A landmark rather than a bare <div>: this bar sits outside <main> and
    // <footer>, so as a plain div its two links were content belonging to no
    // region at all — a screen reader reached them with nothing to say about
    // where they were.
    <nav
      aria-label={regionLabel}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--hairline)] bg-ink-950/95 backdrop-blur-md transition-transform duration-300 lg:hidden"
      style={{
        transform: visible ? 'translateY(0)' : 'translateY(110%)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
      aria-hidden={!visible}
    >
      <div className="flex gap-2 px-4 py-3">
        {/* Without a configured number the link would open WhatsApp with no
            recipient, so the quote button simply takes the whole bar. */}
        {whatsappHref && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-whatsapp flex-1 !px-3 text-sm"
          tabIndex={visible ? 0 : -1}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden>
            <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.1-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5v-.5c-.1-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1.1 2.8 1.2 3c.2.2 2.1 3.2 5 4.5.7.3 1.2.5 1.7.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.2-.3-.3-.5-.4zM12 2a10 10 0 0 0-8.6 15L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
          </svg>
          {whatsappLabel}
        </a>
        )}
        <Link href={quoteHref} className="btn btn-primary flex-1 !px-3 text-sm" tabIndex={visible ? 0 : -1}>
          {quoteLabel}
        </Link>
      </div>
    </nav>
  );
}
