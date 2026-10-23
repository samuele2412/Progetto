'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WhatsAppIcon } from '@/components/icons';

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
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--hairline)] bg-paper/95 backdrop-blur-md shadow-[0_-8px_24px_-18px_rgb(28_26_23/0.35)] transition-transform duration-300 lg:hidden"
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
          <WhatsAppIcon />
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
