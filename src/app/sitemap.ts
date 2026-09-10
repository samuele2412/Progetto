import type { MetadataRoute } from 'next';
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [landings, posts] = await Promise.all([getLandingPages(), getPosts()]);
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const key of Object.keys(routeSlugs) as RouteKey[]) {
    if (excluded.includes(key)) continue;
    for (const locale of locales) {
      entries.push({
        url: absoluteUrl(path(key, locale)),
        lastModified: now,
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
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.85,
        alternates: {
          languages: { it: absoluteUrl(`/it/${landing.slugIt}`), en: absoluteUrl(`/en/${landing.slugEn}`) },
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
