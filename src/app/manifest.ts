import type { MetadataRoute } from 'next';
import { defaultSettings } from '@/content/settings';

/**
 * Web app manifest.
 *
 * Not a PWA — there is no service worker and nothing to install. It exists so
 * that a visitor who adds the site to a phone's home screen gets the wordmark,
 * the right name and the dark background instead of a screenshot and a URL, and
 * so Android uses the brand colour for the address bar.
 *
 * Deliberately reads the *default* brand name rather than the database: a
 * manifest is fetched once and cached hard by the OS, so it should not change
 * shape with every settings edit.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${defaultSettings.brand.name} — ${defaultSettings.brand.descriptor.it}`,
    short_name: defaultSettings.brand.name,
    description: defaultSettings.seo.defaultDescription.it,
    start_url: '/it',
    scope: '/',
    display: 'browser',
    background_color: '#0a0908',
    theme_color: '#0a0908',
    lang: 'it-IT',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
