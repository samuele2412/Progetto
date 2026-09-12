import type { Metadata } from 'next';
import { env } from './env';
import { htmlLang, locales, ogLocale, type Locale } from './i18n';
import type { SiteSettings } from '@/content/settings';

/** Absolute URL for a root-relative path. */
export function absoluteUrl(path: string): string {
  return `${env.SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * hreflang map for a page that exists in both languages.
 * `pathsByLocale` maps each locale to its own (already localised) path.
 */
export function alternates(pathsByLocale: Record<Locale, string>, current: Locale) {
  const languages: Record<string, string> = {};
  for (const locale of locales) languages[htmlLang[locale]] = absoluteUrl(pathsByLocale[locale]);
  languages['x-default'] = absoluteUrl(pathsByLocale.it);
  return { canonical: absoluteUrl(pathsByLocale[current]), languages };
}

/** Media type of an image URL, by extension. Undefined when it is not obvious. */
function mimeForImage(url: string): string | undefined {
  const extension = url.split('?')[0].split('.').pop()?.toLowerCase();
  const types: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    avif: 'image/avif',
    gif: 'image/gif',
  };
  return extension ? types[extension] : undefined;
}

export function buildMetadata(options: {
  title: string;
  description: string;
  locale: Locale;
  pathsByLocale: Record<Locale, string>;
  settings: SiteSettings;
  imagePath?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  noIndex?: boolean;
  /**
   * What social cards say, when it should differ from the page title. A good
   * <title> is written for a search result and a good OG title for a shared
   * link; the page builder lets the owner separate them, and everything that
   * does not pass them keeps the previous behaviour of reusing the title.
   */
  ogTitle?: string;
  ogDescription?: string;
  /** Overrides the generated canonical. Empty means "use this page's URL". */
  canonicalUrl?: string;
}): Metadata {
  const image = absoluteUrl(options.imagePath || options.settings.seo.ogImagePath);
  const canonicalPath = options.pathsByLocale[options.locale];
  const social = {
    title: options.ogTitle?.trim() || options.title,
    description: options.ogDescription?.trim() || options.description,
  };
  const canonical = options.canonicalUrl?.trim();
  const base = alternates(options.pathsByLocale, options.locale);

  return {
    title: options.title,
    description: options.description,
    alternates: canonical ? { ...base, canonical } : base,
    robots: options.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: options.type ?? 'website',
      siteName: options.settings.seo.siteName,
      title: social.title,
      description: social.description,
      url: canonical || absoluteUrl(canonicalPath),
      locale: ogLocale[options.locale],
      // The type is declared because several scrapers decide whether to fetch
      // the image at all from this line. It is derived from the file rather
      // than assumed: the default card is a JPEG, but a page can point at a
      // photograph uploaded from the panel, which is usually WebP.
      images: [{ url: image, width: 1200, height: 630, type: mimeForImage(image), alt: social.title }],
      ...(options.publishedTime ? { publishedTime: options.publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: social.title,
      description: social.description,
      images: [image],
    },
  };
}

/* -------------------------------------------------------------------------- */
/* JSON-LD                                                                    */
/* -------------------------------------------------------------------------- */

type Json = Record<string, unknown>;

/**
 * LocalBusiness with `areaServed` rather than a street address: this is a
 * service that travels to the client, and publishing a home address would be
 * both wrong for Google and unnecessary exposure for the owner.
 * See docs/08-google-business-profile.md before claiming a GBP listing.
 */
export function localBusinessJsonLd(settings: SiteSettings, locale: Locale): Json {
  const contactPoints: Json[] = [];
  if (!settings.contact.phone.endsWith('_HERE')) {
    contactPoints.push({
      '@type': 'ContactPoint',
      telephone: settings.contact.phone,
      contactType: 'customer service',
      areaServed: 'IT',
      availableLanguage: ['Italian', 'English'],
    });
  }

  const sameAs = [settings.social.instagram, settings.social.tiktok, settings.social.facebook].filter(
    (url) => url && !url.endsWith('_HERE'),
  );

  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'BarOrPub'],
    '@id': `${env.SITE_URL}/#business`,
    name: settings.brand.name,
    description: settings.seo.defaultDescription[locale],
    url: env.SITE_URL,
    image: absoluteUrl(settings.seo.ogImagePath),
    ...(settings.contact.email.endsWith('_HERE') ? {} : { email: settings.contact.email }),
    ...(settings.contact.phone.endsWith('_HERE') ? {} : { telephone: settings.contact.phone }),
    priceRange: '€€–€€€',
    currenciesAccepted: 'EUR',
    areaServed: [
      { '@type': 'City', name: 'Roma' },
      { '@type': 'AdministrativeArea', name: 'Città metropolitana di Roma Capitale' },
    ],
    knowsAbout: settings.seo.focusKeywords[locale].split(',').map((k) => k.trim()),
    ...(contactPoints.length ? { contactPoint: contactPoints } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function serviceJsonLd(options: {
  name: string;
  description: string;
  url: string;
  settings: SiteSettings;
  offers?: { name: string; price: number; description: string }[];
}): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: options.name,
    description: options.description,
    url: options.url,
    serviceType: 'Cocktail catering',
    provider: { '@id': `${env.SITE_URL}/#business` },
    areaServed: { '@type': 'City', name: 'Roma' },
    ...(options.offers?.length
      ? {
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: options.name,
            itemListElement: options.offers.map((offer) => ({
              '@type': 'Offer',
              name: offer.name,
              description: offer.description,
              priceCurrency: 'EUR',
              ...(offer.price > 0 ? { price: String(offer.price), priceSpecification: {
                '@type': 'UnitPriceSpecification',
                price: String(offer.price),
                priceCurrency: 'EUR',
                unitText: 'per guest',
              } } : {}),
            })),
          },
        }
      : {}),
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]): Json | null {
  if (!items.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleJsonLd(options: {
  headline: string;
  description: string;
  url: string;
  imagePath: string;
  publishedTime: string;
  authorName: string;
}): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: options.headline,
    description: options.description,
    image: absoluteUrl(options.imagePath),
    datePublished: options.publishedTime,
    dateModified: options.publishedTime,
    author: { '@type': 'Organization', name: options.authorName },
    publisher: { '@id': `${env.SITE_URL}/#business` },
    mainEntityOfPage: options.url,
  };
}

export function webSiteJsonLd(settings: SiteSettings): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${env.SITE_URL}/#website`,
    name: settings.seo.siteName,
    url: env.SITE_URL,
    inLanguage: ['it-IT', 'en-GB'],
    publisher: { '@id': `${env.SITE_URL}/#business` },
  };
}
