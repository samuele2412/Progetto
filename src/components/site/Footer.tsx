import { Fragment } from 'react';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import { isPlaceholder, typeset } from '@/lib/utils';

export type FooterProps = {
  locale: Locale;
  brandName: string;
  descriptor: string;
  claim: string;
  serviceArea: string;
  availability: string;
  email: string;
  phone: string;
  phoneHref: string;
  whatsappHref: string;
  instagram: string;
  tiktok: string;
  columns: { title: string; links: { label: string; href: string }[] }[];
  /** Always present, so the contact column is never empty before the numbers are set. */
  quoteLabel: string;
  quoteHref: string;
  legalLinks: { label: string; href: string }[];
  legalName: string;
  vatNumber: string;
  labels: { contact: string; follow: string; rights: string; backToTop: string };
};

const linkClass = 'tap-target link-line text-sm text-ink-2 transition-colors hover:text-ink';

/**
 * The back cover: a dark band in either theme, the wordmark set large as on a
 * menu, then the links. Only contacts and profiles that exist are shown — a
 * placeholder number or an empty profile is simply left out, never invented.
 */
export function Footer(props: FooterProps) {
  const year = new Date().getFullYear();
  const socials = [
    { label: 'Instagram', href: props.instagram },
    { label: 'TikTok', href: props.tiktok },
  ].filter((social) => !isPlaceholder(social.href));
  // "Tu pensa alla festa, ai drink penso io": two halves of one sentence, set
  // one under the other. Left to the width, the line broke inside the second
  // half ("ai drink / penso io").
  const comma = props.claim.indexOf(', ');
  const claimLines = comma > 0 ? [props.claim.slice(0, comma + 1), props.claim.slice(comma + 2)] : [props.claim];

  return (
    <footer className="tone-night mt-auto border-t border-[var(--hairline)] bg-paper">
      {/* pb-28 on small screens keeps the last rows clear of the fixed
          mobile CTA bar, which otherwise covers the legal links. */}
      <div className="container-page pb-28 pt-16 md:pb-20 md:pt-24 lg:pb-12">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="font-[family-name:var(--font-display)] text-[clamp(3.6rem,2.2rem+5.6vw,7.25rem)] font-medium leading-[0.86] tracking-[-0.025em] text-ink">
              {props.brandName}
            </p>
            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-accent">{props.descriptor}</p>
            <div aria-hidden className="rule-brass mt-8" />
            {/* Roman, not italic: the footer is on every page, and the italic
                face would then be downloaded by every landing page for this
                one line. */}
            <p className="mt-8 max-w-sm font-[family-name:var(--font-display)] text-[1.7rem] leading-snug text-ink">
              {claimLines.map((line, index) => (
                <Fragment key={index}>
                  {index > 0 && ' '}
                  <span className="block">{typeset(line)}</span>
                </Fragment>
              ))}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-3">{props.serviceArea}</p>
          </div>

          {/* Two link columns side by side on a phone: stacked, the footer was
              a second, longer menu. */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:col-span-7 lg:pt-4">
            {props.columns
              .filter((column) => column.links.length > 0)
              .map((column) => (
                <nav key={column.title} aria-label={column.title}>
                  <p className="eyebrow">{column.title}</p>
                  <ul className="mt-5 space-y-1">
                    {column.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className={linkClass}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}

            <div className="col-span-2 sm:col-span-1">
              <p className="eyebrow">{props.labels.contact}</p>
              <ul className="mt-5 space-y-1">
                <li>
                  <Link href={props.quoteHref} className={linkClass} data-track="quote" data-track-location="footer">
                    {props.quoteLabel}
                  </Link>
                </li>
                {!isPlaceholder(props.phone) && (
                  <li>
                    <a href={props.phoneHref} className={linkClass} data-track-location="footer">
                      {props.phone}
                    </a>
                  </li>
                )}
                {props.whatsappHref && (
                  <li>
                    <a
                      href={props.whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                      data-track-location="footer"
                    >
                      WhatsApp
                    </a>
                  </li>
                )}
                {!isPlaceholder(props.email) && (
                  <li>
                    <a href={`mailto:${props.email}`} className={`${linkClass} break-all`} data-track-location="footer">
                      {props.email}
                    </a>
                  </li>
                )}
              </ul>
              <p className="mt-4 max-w-[16rem] text-xs leading-relaxed text-ink-3">{props.availability}</p>

              {socials.length > 0 && (
                <>
                  <p className="eyebrow mt-10">{props.labels.follow}</p>
                  <ul className="mt-5 flex gap-6">
                    {socials.map((social) => (
                      <li key={social.label}>
                        <a href={social.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                          {social.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-5 border-t border-[var(--hairline)] pt-6 text-xs text-ink-3 md:mt-24 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {isPlaceholder(props.legalName) ? props.brandName : props.legalName}
            {isPlaceholder(props.vatNumber) ? '' : ` · P.IVA ${props.vatNumber}`} — {props.labels.rights}
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-1">
            {props.legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="tap-target link-line transition-colors hover:text-ink">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              {/* The skip link's target, so it lands on the content and moves focus there too. */}
              <a href="#main" className="tap-target group inline-flex items-center gap-2 transition-colors hover:text-ink">
                {props.labels.backToTop}
                <span aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5">
                  ↑
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
