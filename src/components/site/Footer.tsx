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
    <footer className="hairline mt-auto bg-ink-900">
      {/* pb-28 on small screens keeps the last rows clear of the fixed
          mobile CTA bar, which otherwise covers the legal links. */}
      <div className="container-page pb-28 pt-14 md:pb-20 md:pt-20 lg:pb-14">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="font-[family-name:var(--font-display)] text-2xl text-bone-50">{props.brandName}</p>
            <p className="mt-1 text-[0.65rem] uppercase tracking-[0.2em] text-bone-500">{props.descriptor}</p>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-bone-400">{props.claim}</p>
            <p className="mt-5 text-sm text-bone-400">{props.serviceArea}</p>
          </div>

          {props.columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="text-[0.68rem] uppercase tracking-[0.16em] text-brass-500">{column.title}</p>
              <ul className="mt-4 space-y-1">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="tap-target text-sm text-bone-400 transition-colors hover:text-bone-50">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.16em] text-brass-500">{props.labels.contact}</p>
            <ul className="mt-4 space-y-1 text-sm">
              {!isPlaceholder(props.phone) && (
                <li>
                  <a href={props.phoneHref} className="tap-target text-bone-400 transition-colors hover:text-bone-50">
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
                    className="tap-target text-bone-400 transition-colors hover:text-bone-50"
                  >
                    WhatsApp
                  </a>
                </li>
              )}
              {!isPlaceholder(props.email) && (
                <li>
                  <a href={`mailto:${props.email}`} className="tap-target break-all text-bone-400 transition-colors hover:text-bone-50">
                    {props.email}
                  </a>
                </li>
              )}
              <li className="pt-1 text-xs text-bone-500">{props.availability}</li>
            </ul>

            {socials.length > 0 && (
              <>
                <p className="mt-8 text-[0.68rem] uppercase tracking-[0.16em] text-brass-500">{props.labels.follow}</p>
                <ul className="mt-4 flex gap-5 text-sm">
                  {socials.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tap-target text-bone-400 transition-colors hover:text-bone-50"
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

        <div className="hairline mt-14 flex flex-col gap-4 pt-6 text-xs text-bone-500 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {isPlaceholder(props.legalName) ? props.brandName : props.legalName}
            {isPlaceholder(props.vatNumber) ? '' : ` · P.IVA ${props.vatNumber}`} — {props.labels.rights}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {props.legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="tap-target transition-colors hover:text-bone-200">
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
