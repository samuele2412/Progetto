import 'server-only';
import type { Cocktail, Faq, GalleryItem, Package, Testimonial } from '@/db/schema';
import type { ParsedBlock } from '@/lib/blocks';
import {
  getCocktails,
  getFaqs,
  getFeaturedCocktails,
  getGalleryItems,
  getPackages,
  getTestimonials,
} from '@/lib/queries';

/**
 * Catalogue rows a page's blocks need, fetched once for the whole page.
 *
 * Without this each block would query on its own: a page with a cocktail grid,
 * a packages block and three FAQ blocks is five round trips for data that
 * mostly overlaps. The underlying queries are already memoised per request, so
 * the real win is ordering — everything is asked for in parallel, before the
 * first block renders, instead of one query per block in sequence.
 */
export type BlockData = {
  cocktails: Cocktail[];
  featuredCocktails: Cocktail[];
  packages: Package[];
  testimonials: Testimonial[];
  gallery: GalleryItem[];
  faqsByTopic: Record<string, Faq[]>;
};

const EMPTY: BlockData = {
  cocktails: [],
  featuredCocktails: [],
  packages: [],
  testimonials: [],
  gallery: [],
  faqsByTopic: {},
};

export async function loadBlockData(blocks: ParsedBlock[]): Promise<BlockData> {
  const types = new Set(blocks.map((block) => block.type));
  if (types.size === 0) return EMPTY;

  // Only the topics actually referenced, so a page with one FAQ block does not
  // pull every topic in the catalogue.
  const topics = new Set<string>();
  for (const block of blocks) {
    if (block.type !== 'faq') continue;
    if (block.config.source === 'custom') continue;
    const topic = typeof block.config.topic === 'string' && block.config.topic ? block.config.topic : 'general';
    topics.add(topic);
  }

  const wantsCocktails = types.has('cocktails');
  const wantsPackages = types.has('packages');
  const wantsTestimonials = types.has('testimonials');
  const wantsGallery = types.has('gallery');

  const [cocktails, featuredCocktails, packages, testimonials, gallery, faqLists] = await Promise.all([
    wantsCocktails ? getCocktails() : Promise.resolve([]),
    wantsCocktails ? getFeaturedCocktails() : Promise.resolve([]),
    wantsPackages ? getPackages() : Promise.resolve([]),
    wantsTestimonials ? getTestimonials() : Promise.resolve([]),
    wantsGallery ? getGalleryItems() : Promise.resolve([]),
    Promise.all([...topics].map(async (topic) => [topic, await getFaqs(topic)] as const)),
  ]);

  return {
    cocktails,
    featuredCocktails,
    packages,
    testimonials,
    gallery,
    faqsByTopic: Object.fromEntries(faqLists),
  };
}

/**
 * Keeps the order the owner dragged things into, rather than the catalogue's
 * own order — picking four cocktails and getting them back sorted by category
 * is not what "scelgo io quali mostrare" means.
 */
export function pickBySlug<T extends { slug: string }>(rows: T[], slugs: string[]): T[] {
  if (!slugs.length) return [];
  const bySlug = new Map(rows.map((row) => [row.slug, row]));
  const picked: T[] = [];
  for (const slug of slugs) {
    const row = bySlug.get(slug);
    if (row) picked.push(row);
  }
  return picked;
}
