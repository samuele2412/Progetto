import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import '@/app/globals.css';
import { JsonLd } from '@/components/JsonLd';
import { SiteShell } from '@/components/site/SiteShell';
import { Analytics } from '@/components/site/Analytics';
import { htmlLang, isLocale, locales, t } from '@/lib/i18n';
import { buildMetadata, localBusinessJsonLd, webSiteJsonLd } from '@/lib/seo';
import { getSettings } from '@/lib/settings';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: '#0a0908',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const settings = await getSettings();

  return {
    metadataBase: new URL(process.env.SITE_URL ?? 'http://localhost:3000'),
    ...buildMetadata({
      title: t(settings.seo.defaultTitle, locale),
      description: t(settings.seo.defaultDescription, locale),
      locale,
      pathsByLocale: { it: '/it', en: '/en' },
      settings,
    }),
    title: {
      default: t(settings.seo.defaultTitle, locale),
      template: t(settings.seo.titleTemplate, locale),
    },
    applicationName: settings.seo.siteName,
    // Only `address`. Next writes "<key>=no" for every key *present* in this
    // object, whatever its value (see next/dist/lib/metadata/generate/basic),
    // so `{ telephone: true, email: true }` published "telephone=no, email=no"
    // and told iOS to stop linking the very phone number and address this
    // business wants tapped. Leaving them out is what enables them.
    formatDetection: { address: false },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const settings = await getSettings();

  return (
    <html lang={htmlLang[locale]}>
      <head>
        {/* The two subsets actually used above the fold. */}
        <link rel="preload" href="/fonts/fraunces-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        {/* The scroll-reveal animation is an enhancement, never a gate: without
            JavaScript the blocks would stay at opacity 0 and the page would
            look empty. A <noscript> stylesheet needs no inline script and so
            does not have to be reconciled with the CSP. */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}
.fade-in-up{animation:none !important;opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        <SiteShell locale={locale}>{children}</SiteShell>
        <JsonLd data={localBusinessJsonLd(settings, locale)} />
        <JsonLd data={webSiteJsonLd(settings)} />
        <Analytics />
      </body>
    </html>
  );
}
