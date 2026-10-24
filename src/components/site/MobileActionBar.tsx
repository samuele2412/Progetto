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
 * For the same reason it steps aside wherever the page shows its own buttons
 * (any element marked `data-cta-zone`): two "Chiedimi un preventivo" one above
 * the other read as a mistake, and the bar covered the closing section's note.
 * The closing block is marked `data-cta-zone="end"`: once it has been reached
 * the bar stays away, since below it there is only the footer.
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
  const [scrolled, setScrolled] = useState(false);
  const [besideButtons, setBesideButtons] = useState(false);
  const pathname = usePathname() ?? '';
  const visible = scrolled && !besideButtons;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 560);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setBesideButtons(false);
    if (!('IntersectionObserver' in window)) return;
    const covering = new Set<Element>();
    const update = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.isIntersecting) covering.add(entry.target);
        else covering.delete(entry.target);
      }
      setBesideButtons(covering.size > 0);
    };
    // The closing block's observer reaches far above the screen, so the block
    // counts from the moment it comes into view until it is below the screen
    // again — a state an observer sees change even on the quickest fling,
    // which can carry a block past the screen between two frames.
    const onScreen = new IntersectionObserver(update);
    const reached = new IntersectionObserver(update, { rootMargin: '100000px 0px 0px 0px' });
    document.querySelectorAll('[data-cta-zone]').forEach((zone) => {
      (zone.getAttribute('data-cta-zone') === 'end' ? reached : onScreen).observe(zone);
    });
    return () => {
      onScreen.disconnect();
      reached.disconnect();
    };
  }, [pathname]);

  if (hideOnPaths.some((path) => pathname.startsWith(path))) return null;

  return (
    // A landmark rather than a bare <div>: this bar sits outside <main> and
    // <footer>, so as a plain div its two links were content belonging to no
    // region at all — a screen reader reached them with nothing to say about
    // where they were.
    <nav
      aria-label={regionLabel}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--hairline)] bg-paper transition-transform duration-300 lg:hidden"
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
          data-track="whatsapp"
          data-track-location="mobile-bar"
        >
          <WhatsAppIcon />
          {whatsappLabel}
        </a>
        )}
        <Link
          href={quoteHref}
          className="btn btn-primary flex-1 !px-3 text-sm"
          tabIndex={visible ? 0 : -1}
          data-track="quote"
          data-track-location="mobile-bar"
        >
          {quoteLabel}
        </Link>
      </div>
    </nav>
  );
}
