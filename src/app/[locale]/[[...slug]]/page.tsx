import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AboutPage } from '@/components/pages/AboutPage';
import { CocktailsPage } from '@/components/pages/CocktailsPage';
import { FaqPage } from '@/components/pages/FaqPage';
import { GalleryPage } from '@/components/pages/GalleryPage';
import { HomePage } from '@/components/pages/HomePage';
import { JournalIndexPage, JournalPostPage } from '@/components/pages/JournalPages';
import { LandingPageView } from '@/components/pages/LandingPageView';
import { LegalPage } from '@/components/pages/LegalPage';
import { PackagesPage } from '@/components/pages/PackagesPage';
import { PartnersPage } from '@/components/pages/PartnersPage';
import { RequestPage } from '@/components/pages/RequestPage';
import { ThanksPage } from '@/components/pages/ThanksPage';
import { d } from '@/lib/dictionary';
import { isLocale, t, type Locale } from '@/lib/i18n';
import { getLandingBySlug, getPostBySlug } from '@/lib/queries';
import { path, routeKeyForSlug, routeSlugs, type RouteKey } from '@/lib/routes';
import { buildMetadata } from '@/lib/seo';
import { getSettings } from '@/lib/settings';

type PageParams = { locale: string; slug?: string[] };
type SearchParams = Record<string, string | string[] | undefined>;

/**
 * One catch-all instead of a folder per page.
 *
 * Localised slugs (/it/pacchetti vs /en/packages) cannot be expressed as
 * folders for two languages at once, and the hand-written SEO landing pages
 * live in the database — so a single resolver handles both, and every URL the
 * site can produce is decided in exactly one place.
 */
type Resolved =
  | { kind: 'route'; key: RouteKey }
  | { kind: 'landing'; slugIt: string; slugEn: string; id: number }
  | { kind: 'post'; slugIt: string; slugEn: string; id: number }
  | null;

async function resolve(locale: Locale, slug: string[] | undefined): Promise<Resolved> {
  const segments = slug ?? [];

  if (segments.length === 0) return { kind: 'route', key: 'home' };

  if (segments.length === 1) {
    const key = routeKeyForSlug(segments[0], locale);
    if (key && key !== 'home') return { kind: 'route', key };

    const landing = await getLandingBySlug(segments[0]);
    if (landing) return { kind: 'landing', slugIt: landing.slugIt, slugEn: landing.slugEn, id: landing.id };
    return null;
  }

  if (segments.length === 2 && segments[0] === routeSlugs.journal[locale]) {
    const post = await getPostBySlug(segments[1]);
    if (post) return { kind: 'post', slugIt: post.slugIt, slugEn: post.slugEn, id: post.id };
  }

  return null;
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) return {};
  const locale: Locale = rawLocale;

  const [settings, resolved] = await Promise.all([getSettings(), resolve(locale, slug)]);
  if (!resolved) return { title: d(locale).misc.notFoundTitle, robots: { index: false, follow: false } };

  if (resolved.kind === 'landing') {
    const landing = await getLandingBySlug(locale === 'en' ? resolved.slugEn : resolved.slugIt);
    if (!landing) return {};
    return buildMetadata({
      title: t(landing.seoTitle, locale),
      description: t(landing.seoDescription, locale),
      locale,
      pathsByLocale: { it: `/it/${landing.slugIt}`, en: `/en/${landing.slugEn}` },
      settings,
      imagePath: landing.heroImagePath,
    });
  }

  if (resolved.kind === 'post') {
    const post = await getPostBySlug(locale === 'en' ? resolved.slugEn : resolved.slugIt);
    if (!post) return {};
    return buildMetadata({
      title: t(post.seoTitle, locale) || t(post.title, locale),
      description: t(post.seoDescription, locale) || t(post.excerpt, locale),
      locale,
      pathsByLocale: {
        it: `/it/${routeSlugs.journal.it}/${post.slugIt}`,
        en: `/en/${routeSlugs.journal.en}/${post.slugEn}`,
      },
      settings,
      imagePath: post.coverImagePath,
      type: 'article',
      publishedTime: new Date(post.publishedAt).toISOString(),
    });
  }

  const key = resolved.key;
  const copy = d(locale);
  const pathsByLocale = { it: path(key, 'it'), en: path(key, 'en') };

  const titles: Record<RouteKey, { title: string; description: string; noIndex?: boolean }> = {
    home: {
      title: t(settings.seo.defaultTitle, locale),
      description: t(settings.seo.defaultDescription, locale),
    },
    packages: {
      title: `${t(settings.home.packagesTitle, locale)} — ${locale === 'en' ? 'prices and what is included' : 'prezzi e cosa comprendono'}`,
      description: t(settings.home.packagesIntro, locale),
    },
    cocktails: {
      title: `${t(settings.home.cocktailsTitle, locale)} — ${locale === 'en' ? 'our cocktail list' : 'la nostra carta dei cocktail'}`,
      description: t(settings.home.cocktailsIntro, locale),
    },
    gallery: {
      title: t(settings.home.galleryTitle, locale),
      description: t(settings.home.galleryIntro, locale),
    },
    about: {
      title: t(settings.about.title, locale),
      description: t(settings.about.body, locale).slice(0, 180),
    },
    partners: {
      title: t(settings.partners.title, locale),
      description: t(settings.partners.intro, locale),
    },
    faq: {
      title: t(settings.home.faqTitle, locale),
      description: t(settings.home.faqIntro, locale),
    },
    request: {
      title: t(settings.requestForm.title, locale),
      description: t(settings.requestForm.intro, locale),
    },
    thanks: {
      title: t(settings.requestForm.successTitle, locale),
      description: t(settings.requestForm.successBody, locale),
      noIndex: true,
    },
    journal: {
      title: 'Journal',
      description:
        locale === 'en'
          ? 'Practical notes on organising the bar for a party: costs, quantities and what actually goes wrong.'
          : 'Note pratiche su come si organizza il bar di una festa: costi, quantità e quello che va storto davvero.',
    },
    privacy: {
      title: locale === 'en' ? 'Privacy policy' : 'Informativa privacy',
      description: copy.footer.privacy,
      noIndex: true,
    },
    cookies: {
      title: 'Cookie policy',
      description: copy.footer.cookies,
      noIndex: true,
    },
  };

  const meta = titles[key];
  return buildMetadata({
    title: meta.title,
    description: meta.description,
    locale,
    pathsByLocale,
    settings,
    noIndex: meta.noIndex,
  });
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;

  const resolved = await resolve(locale, slug);
  if (!resolved) notFound();

  if (resolved.kind === 'landing') {
    const landing = await getLandingBySlug(locale === 'en' ? resolved.slugEn : resolved.slugIt);
    if (!landing) notFound();
    return <LandingPageView locale={locale} landing={landing} />;
  }

  if (resolved.kind === 'post') {
    const post = await getPostBySlug(locale === 'en' ? resolved.slugEn : resolved.slugIt);
    if (!post) notFound();
    return <JournalPostPage locale={locale} post={post} />;
  }

  const query = await searchParams;

  switch (resolved.key) {
    case 'home':
      return <HomePage locale={locale} />;
    case 'packages':
      return <PackagesPage locale={locale} />;
    case 'cocktails':
      return <CocktailsPage locale={locale} />;
    case 'gallery':
      return <GalleryPage locale={locale} />;
    case 'about':
      return <AboutPage locale={locale} />;
    case 'partners':
      return <PartnersPage locale={locale} />;
    case 'faq':
      return <FaqPage locale={locale} />;
    case 'journal':
      return <JournalIndexPage locale={locale} />;
    case 'request':
      return (
        <RequestPage
          locale={locale}
          initialEventType={first(query.evento) ?? first(query.event)}
          initialPackage={first(query.pacchetto) ?? first(query.package)}
        />
      );
    case 'thanks':
      return <ThanksPage locale={locale} reference={first(query.ref)} />;
    case 'privacy':
      return <LegalPage locale={locale} kind="privacy" />;
    case 'cookies':
      return <LegalPage locale={locale} kind="cookies" />;
    default:
      notFound();
  }
}
