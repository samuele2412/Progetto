import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import { isPlaceholder } from '@/lib/utils';

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
  labels: { contact: string; follow: string; rights: string };
};

export function Footer(props: FooterProps) {
  const year = new Date().getFullYear();
  const socials = [
    { label: 'Instagram', href: props.instagram },
    { label: 'TikTok', href: props.tiktok },
  ].filter((social) => !isPlaceholder(social.href));

  return (
    <footer className="hairline mt-auto">
      {/* pb-28 on small screens keeps the last rows clear of the fixed
          mobile CTA bar, which otherwise covers the legal links. */}
      <div className="container-page pb-28 pt-14 md:pb-20 md:pt-20 lg:pb-14">
        {/* Two link columns side by side on a phone: stacked, the footer was
            a second, longer menu. */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <p className="font-[family-name:var(--font-display)] text-2xl text-ink">{props.brandName}</p>
            <p className="mt-1 text-[0.65rem] uppercase tracking-[0.2em] text-ink-3">{props.descriptor}</p>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-2">{props.claim}</p>
            <p className="mt-3 text-sm text-ink-3">{props.serviceArea}</p>
          </div>

          {props.columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="eyebrow">{column.title}</p>
              <ul className="mt-4 space-y-1">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="tap-target text-sm text-ink-2 transition-colors hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="col-span-2 md:col-span-1">
            <p className="eyebrow">{props.labels.contact}</p>
            <ul className="mt-4 space-y-1 text-sm">
              <li>
                <Link href={props.quoteHref} className="tap-target text-ink-2 transition-colors hover:text-ink">
                  {props.quoteLabel}
                </Link>
              </li>
              {!isPlaceholder(props.phone) && (
                <li>
                  <a href={props.phoneHref} className="tap-target text-ink-2 transition-colors hover:text-ink">
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
                    className="tap-target text-ink-2 transition-colors hover:text-ink"
                  >
                    WhatsApp
                  </a>
                </li>
              )}
              {!isPlaceholder(props.email) && (
                <li>
                  <a href={`mailto:${props.email}`} className="tap-target break-all text-ink-2 transition-colors hover:text-ink">
                    {props.email}
                  </a>
                </li>
              )}
              <li className="pt-1 text-xs text-ink-3">{props.availability}</li>
            </ul>

            {socials.length > 0 && (
              <>
                <p className="eyebrow mt-8">{props.labels.follow}</p>
                <ul className="mt-4 flex gap-5 text-sm">
                  {socials.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tap-target text-ink-2 transition-colors hover:text-ink"
                      >
                        {social.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        <div className="hairline mt-14 flex flex-col gap-4 pt-6 text-xs text-ink-3 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {isPlaceholder(props.legalName) ? props.brandName : props.legalName}
            {isPlaceholder(props.vatNumber) ? '' : ` · P.IVA ${props.vatNumber}`} — {props.labels.rights}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {props.legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="tap-target transition-colors hover:text-ink">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
