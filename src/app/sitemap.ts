import type { MetadataRoute } from 'next';
import { getPublishedPages } from '@/lib/cms';
import { locales } from '@/lib/i18n';
import { getLandingPages, getPosts } from '@/lib/queries';
import { path, routeSlugs, type RouteKey } from '@/lib/routes';
import { absoluteUrl } from '@/lib/seo';

/** Pages that exist but should not be in the index. */
const excluded: RouteKey[] = ['thanks', 'privacy', 'cookies'];

const priorities: Partial<Record<RouteKey, number>> = {
  home: 1,
  request: 0.9,
  packages: 0.9,
  cocktails: 0.8,
  about: 0.6,
  faq: 0.6,
  gallery: 0.5,
  journal: 0.5,
  partners: 0.4,
};

/**
 * A stable "last changed" for pages that carry no timestamp of their own.
 *
 * This module is evaluated once per server process, so the value stays put for
 * the whole life of a deployment and moves when the container is replaced —
 * which is exactly when those pages can have changed. It used to be
 * `new Date(process.env.BUILD_DATE ?? now)`, but BUILD_DATE was set nowhere in
 * the project, so every request advertised "modified just now" and crawlers
 * learn to ignore a lastmod that always says that. Setting BUILD_DATE (an
 * ISO-8601 instant) still overrides it for deployments that know their real
 * build time.
 */
const deployedAt = (() => {
  const configured = process.env.BUILD_DATE;
  if (configured) {
    const parsed = new Date(configured);
    if (!Number.isNaN(parsed.getTime())) return parsed;
    console.warn(`[config] BUILD_DATE is not a valid date ("${configured}"), using process start time`);
  }
  return new Date();
})();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [landings, posts, cmsPages] = await Promise.all([getLandingPages(), getPosts(), getPublishedPages()]);
  const buildDate = deployedAt;
  const entries: MetadataRoute.Sitemap = [];

  for (const key of Object.keys(routeSlugs) as RouteKey[]) {
    if (excluded.includes(key)) continue;
    for (const locale of locales) {
      entries.push({
        url: absoluteUrl(path(key, locale)),
        lastModified: buildDate,
        changeFrequency: key === 'home' ? 'weekly' : 'monthly',
        priority: priorities[key] ?? 0.5,
        alternates: {
          languages: Object.fromEntries(locales.map((l) => [l, absoluteUrl(path(key, l))])),
        },
      });
    }
  }

  for (const landing of landings) {
    for (const locale of locales) {
      entries.push({
        url: absoluteUrl(`/${locale}/${locale === 'en' ? landing.slugEn : landing.slugIt}`),
        // Landing pages carry no timestamp of their own, so the build date is
        // the most honest thing available — better than "changed just now",
        // which teaches crawlers to ignore the field entirely.
        lastModified: buildDate,
        changeFrequency: 'monthly',
        priority: 0.85,
        alternates: {
          languages: { it: absoluteUrl(`/it/${landing.slugIt}`), en: absoluteUrl(`/en/${landing.slugEn}`) },
        },
      });
    }
  }

  // Pages built in the panel. A page marked noindex is left out entirely rather
  // than listed with a noindex tag, which is a contradictory signal.
  for (const page of cmsPages) {
    if (page.noIndex) continue;
    for (const locale of locales) {
      entries.push({
        url: absoluteUrl(`/${locale}/${locale === 'en' ? page.slugEn : page.slugIt}`),
        lastModified: page.publishedAt ?? deployedAt,
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: { it: absoluteUrl(`/it/${page.slugIt}`), en: absoluteUrl(`/en/${page.slugEn}`) },
        },
      });
    }
  }

  for (const post of posts) {
    for (const locale of locales) {
      entries.push({
        url: absoluteUrl(`/${locale}/${routeSlugs.journal[locale]}/${locale === 'en' ? post.slugEn : post.slugIt}`),
        lastModified: new Date(post.publishedAt),
        changeFrequency: 'yearly',
        priority: 0.6,
        alternates: {
          languages: {
            it: absoluteUrl(`/it/${routeSlugs.journal.it}/${post.slugIt}`),
            en: absoluteUrl(`/en/${routeSlugs.journal.en}/${post.slugEn}`),
          },
        },
      });
    }
  }

  return entries;
}

export const dynamic = 'force-dynamic';
