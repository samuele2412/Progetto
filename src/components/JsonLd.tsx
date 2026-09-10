import { headers } from 'next/headers';

/**
 * Renders a JSON-LD block.
 *
 * The payload is built server-side from our own data (never from user input),
 * and `JSON.stringify` output has `<` escaped so the script tag cannot be
 * broken out of. The nonce is required: the page's CSP allows no inline script
 * without one, and browsers apply `script-src` to data blocks too.
 */
export async function JsonLd({ data }: { data: Record<string, unknown> | null }) {
  if (!data) return null;
  const nonce = (await headers()).get('x-nonce') ?? undefined;
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{ __html: json }} />;
}
