import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import '@/app/globals.css';
import { JsonLd } from '@/components/JsonLd';
import { SiteShell } from '@/components/site/SiteShell';
import { Analytics } from '@/components/site/Analytics';
import { htmlLang, isLocale, locales, t } from '@/lib/i18n';
import { buildMetadata, localBusinessJsonLd, webSiteJsonLd } from '@/lib/seo';
import { getSettings } from '@/lib/settings';
import { THEME_COOKIE, parseTheme, themeColor } from '@/lib/theme';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

async function readTheme() {
  return parseTheme((await cookies()).get(THEME_COOKIE)?.value);
}

/** The browser bar and the canvas behind the page follow the visitor's theme. */
export async function generateViewport(): Promise<Viewport> {
  const theme = await readTheme();
  return {
    themeColor: themeColor[theme],
    colorScheme: theme,
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
  };
}

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

  const [settings, theme] = await Promise.all([getSettings(), readTheme()]);

  return (
    <html lang={htmlLang[locale]} data-theme={theme}>
      <head>
        {/* The two subsets every page uses above the fold. The italic is
            preloaded by the home page only, where the headline needs it. */}
        <link rel="preload" href="/fonts/cormorant-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/dmsans-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <SiteShell locale={locale} theme={theme}>
          {children}
        </SiteShell>
        <JsonLd data={localBusinessJsonLd(settings, locale)} />
        <JsonLd data={webSiteJsonLd(settings)} />
        <Analytics />
      </body>
    </html>
  );
}
