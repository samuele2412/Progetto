import type { ReactNode } from 'react';
import { Reveal } from '@/components/Reveal';
import { d } from '@/lib/dictionary';
import { t, type Locale } from '@/lib/i18n';
import { getLandingPages, getNavigationLandings, getPosts } from '@/lib/queries';
import { landingPath, path } from '@/lib/routes';
import { getSettings } from '@/lib/settings';
import { telLink, whatsappLink } from '@/lib/utils';
import { Footer } from './Footer';
import { Header } from './Header';
import { MobileActionBar } from './MobileActionBar';
import type { SlugPair } from './LanguageSwitcher';

/**
 * Assembles the chrome around every public page: header, footer, the persistent
 * mobile CTA and the scroll-reveal observer. Doing it here (rather than in the
 * layout) keeps all the settings and navigation reads in one place.
 */
export async function SiteShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  // Two different lists on purpose: the menu shows only the landings marked for
  // navigation, but the language switcher needs the slug pair of *every* page,
  // otherwise switching language on a PPC-only landing dropped you on the home.
  const [settings, allLandings, navLandings, posts] = await Promise.all([
    getSettings(),
    getLandingPages(),
    getNavigationLandings(),
    getPosts(),
  ]);
  const copy = d(locale);

  const slugPairs: SlugPair[] = [
    ...allLandings.map((l) => ({ it: l.slugIt, en: l.slugEn })),
    ...posts.map((p) => ({ it: p.slugIt, en: p.slugEn })),
  ];

  const eventLinks = navLandings.map((landing) => ({
    label: t(landing.heroTitle, locale).replace(/ — .*$/, ''),
    href: landingPath(locale === 'en' ? landing.slugEn : landing.slugIt, locale),
  }));

  const whatsappHref = whatsappLink(settings.contact.whatsapp, t(settings.contact.whatsappMessage, locale));
  const quoteHref = path('request', locale);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brass-500 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-ink-950"
      >
        {locale === 'en' ? 'Skip to content' : 'Vai al contenuto'}
      </a>

      <Header
        locale={locale}
        brandName={settings.brand.name}
        descriptor={t(settings.brand.descriptor, locale)}
        homeHref={path('home', locale)}
        links={[
          { label: copy.nav.packages, href: path('packages', locale) },
          { label: copy.nav.cocktails, href: path('cocktails', locale) },
          { label: copy.nav.about, href: path('about', locale) },
          { label: copy.nav.journal, href: path('journal', locale) },
        ]}
        eventLinks={eventLinks}
        eventsLabel={copy.nav.events}
        ctaLabel={copy.cta.quote}
        ctaHref={quoteHref}
        slugPairs={slugPairs}
        menuLabel={copy.nav.menu}
        closeLabel={copy.nav.close}
      />

      {/* tabIndex={-1} is what makes the skip link actually work: without it the
          browser scrolls to the anchor but leaves focus on <body>, so the next
          Tab goes back to the navigation the visitor just asked to skip. */}
      <main id="main" tabIndex={-1} className="flex min-h-screen flex-col pt-16 outline-none md:pt-20">
        {children}
      </main>

      <Footer
        locale={locale}
        brandName={settings.brand.name}
        descriptor={t(settings.brand.descriptor, locale)}
        claim={t(settings.brand.claim, locale)}
        serviceArea={t(settings.contact.serviceArea, locale)}
        availability={t(settings.contact.availability, locale)}
        email={settings.contact.email}
        phone={settings.contact.phone}
        phoneHref={telLink(settings.contact.phone)}
        whatsappHref={whatsappHref}
        instagram={settings.social.instagram}
        tiktok={settings.social.tiktok}
        legalName={settings.brand.legalName}
        vatNumber={settings.brand.vatNumber}
        columns={[
          {
            title: copy.footer.explore,
            links: [
              { label: copy.nav.packages, href: path('packages', locale) },
              { label: copy.nav.cocktails, href: path('cocktails', locale) },
              { label: copy.nav.gallery, href: path('gallery', locale) },
              { label: copy.nav.faq, href: path('faq', locale) },
              { label: copy.nav.partners, href: path('partners', locale) },
            ],
          },
          { title: copy.footer.events, links: eventLinks.slice(0, 6) },
        ]}
        legalLinks={[
          { label: copy.footer.privacy, href: path('privacy', locale) },
          { label: copy.footer.cookies, href: path('cookies', locale) },
        ]}
        labels={{ contact: copy.footer.contact, follow: copy.footer.follow, rights: copy.footer.rights }}
      />

      <MobileActionBar
        quoteHref={quoteHref}
        quoteLabel={copy.cta.quote}
        whatsappHref={whatsappHref}
        whatsappLabel={copy.cta.whatsapp}
        hideOnPaths={[path('request', locale), path('thanks', locale)]}
      />

      <Reveal />
    </>
  );
}
