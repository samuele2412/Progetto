/**
 * Renders a JSON-LD block. The payload is built server-side from our own data
 * (never from user input), and `JSON.stringify` output has `<` escaped so the
 * script tag cannot be broken out of.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | null }) {
  if (!data) return null;
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
