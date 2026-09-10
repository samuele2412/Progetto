import type { ReactNode } from 'react';
import { createElement, Fragment } from 'react';

/**
 * A deliberately tiny markdown subset — `## heading`, `### subheading`,
 * `- bullets`, `1. numbered`, paragraphs, `**bold**`, `*italic*`.
 *
 * Written by hand rather than pulled from npm because the input comes from the
 * admin panel only: no HTML passthrough means no sanitiser to get wrong, and
 * the render output is React elements, never `dangerouslySetInnerHTML`.
 */

type Block =
  | { kind: 'h2' | 'h3' | 'p'; text: string }
  | { kind: 'ul' | 'ol'; items: string[] };

export function parseMarkdown(source: string): Block[] {
  const blocks: Block[] = [];
  const chunks = source.replace(/\r\n/g, '\n').split(/\n{2,}/);

  for (const raw of chunks) {
    const chunk = raw.trim();
    if (!chunk) continue;

    const lines = chunk.split('\n').map((l) => l.trim());

    if (lines.every((l) => /^[-*]\s+/.test(l))) {
      blocks.push({ kind: 'ul', items: lines.map((l) => l.replace(/^[-*]\s+/, '')) });
      continue;
    }
    if (lines.every((l) => /^\d+\.\s+/.test(l))) {
      blocks.push({ kind: 'ol', items: lines.map((l) => l.replace(/^\d+\.\s+/, '')) });
      continue;
    }
    if (chunk.startsWith('### ')) {
      blocks.push({ kind: 'h3', text: chunk.slice(4) });
      continue;
    }
    if (chunk.startsWith('## ')) {
      blocks.push({ kind: 'h2', text: chunk.slice(3) });
      continue;
    }
    blocks.push({ kind: 'p', text: lines.join(' ') });
  }

  return blocks;
}

/** Renders `**bold**` and `*italic*` inside a line of text. */
function inline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    if (token.startsWith('**')) {
      nodes.push(createElement('strong', { key: `${keyPrefix}-b${i}` }, token.slice(2, -2)));
    } else {
      nodes.push(createElement('em', { key: `${keyPrefix}-i${i}` }, token.slice(1, -1)));
    }
    last = match.index + token.length;
    i += 1;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

/** Render a markdown string as React elements. Class names are opt-in. */
export function renderMarkdown(source: string, classes?: Partial<Record<Block['kind'], string>>): ReactNode {
  const blocks = parseMarkdown(source);
  return createElement(
    Fragment,
    null,
    ...blocks.map((block, index) => {
      const key = `md-${index}`;
      if ('items' in block) {
        return createElement(
          block.kind,
          { key, className: classes?.[block.kind] },
          ...block.items.map((item, i) =>
            createElement('li', { key: `${key}-${i}` }, ...inline(item, `${key}-${i}`)),
          ),
        );
      }
      return createElement(
        block.kind,
        { key, className: classes?.[block.kind] },
        ...inline(block.text, key),
      );
    }),
  );
}

/** Plain-text version, used for meta descriptions and JSON-LD. */
export function markdownToPlainText(source: string, maxLength = 300): string {
  const text = source
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[-*]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/\*\*?/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).replace(/\s+\S*$/, '')}…`;
}
