import type { ReactNode } from 'react';
import { createElement, Fragment } from 'react';
import { isSafeHref } from '@/lib/blocks/common';

/**
 * The "custom HTML" escape hatch, made safe by construction rather than by
 * cleaning.
 *
 * The usual approach — take a string, run a sanitiser over it, hand the result
 * to `dangerouslySetInnerHTML` — puts the whole weight of the defence on the
 * sanitiser being right about every parser quirk in every browser. This does
 * the opposite: the input is parsed into a small tree of our own, anything not
 * on the allow-list never becomes a node, and the output is React elements.
 * There is no path from the stored string to raw markup, so a construct we
 * failed to think of cannot execute — at worst it renders as text or vanishes.
 *
 * Consequences worth knowing:
 *  - `<script>`, `<style>`, `<iframe>` and friends are dropped with their
 *    contents. Nothing of them reaches the page.
 *  - An unknown wrapper (`<div>`, `<span>`, `<section>`) is unwrapped: the tag
 *    goes, the text inside survives, which is what someone pasting from a word
 *    processor actually wants.
 *  - `href` is the only attribute that survives at all, and only if it passes
 *    the same check the page builder's link fields use. No `style`, no `class`,
 *    no `on*` — so pasted HTML cannot fight the design system either.
 */

/** Tags that keep their meaning. Everything else is unwrapped or dropped. */
const ALLOWED = new Set([
  'p', 'br', 'hr',
  'h2', 'h3', 'h4',
  'strong', 'b', 'em', 'i', 'u', 's', 'code',
  'ul', 'ol', 'li',
  'blockquote',
  'a',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
]);

/** Tags whose *contents* are thrown away too, not just the tag. */
const DROP_WITH_CONTENT = new Set([
  'script', 'style', 'iframe', 'object', 'embed', 'noscript', 'template', 'svg', 'math', 'head',
]);

/** Tags that never have a closing partner. */
const VOID_TAGS = new Set(['br', 'hr', 'img', 'input', 'meta', 'link', 'source']);

/** Normalised to the semantic tag so the design system styles one thing. */
const TAG_ALIASES: Record<string, string> = { b: 'strong', i: 'em' };

type HtmlNode =
  | { kind: 'text'; text: string }
  | { kind: 'element'; tag: string; href?: string; children: HtmlNode[] };

/* -------------------------------------------------------------------------- */
/* Entities                                                                   */
/* -------------------------------------------------------------------------- */

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  laquo: '«', raquo: '»', hellip: '…', mdash: '—', ndash: '–',
  eacute: 'é', egrave: 'è', agrave: 'à', igrave: 'ì', ograve: 'ò', ugrave: 'ù',
  euro: '€', copy: '©', deg: '°',
};

/**
 * Decoded here rather than left to React, which would print `&amp;` literally.
 * Decoding is safe precisely because the result becomes a text node: a decoded
 * `<` is a character, never the start of a tag.
 */
function decodeEntities(input: string): string {
  return input.replace(/&(#x?[0-9a-f]+|[a-z][a-z0-9]*);/gi, (whole, body: string) => {
    if (body[0] === '#') {
      const code = body[1] === 'x' || body[1] === 'X'
        ? Number.parseInt(body.slice(2), 16)
        : Number.parseInt(body.slice(1), 10);
      if (!Number.isFinite(code) || code < 0x20 || code > 0x10ffff) return whole;
      try {
        return String.fromCodePoint(code);
      } catch {
        return whole;
      }
    }
    const named = NAMED_ENTITIES[body.toLowerCase()];
    return named ?? whole;
  });
}

/** Pulls `href` out of an attribute string; every other attribute is ignored. */
function readHref(attributes: string): string | undefined {
  const match = /\bhref\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'`=<>]+))/i.exec(attributes);
  if (!match) return undefined;
  const raw = decodeEntities(match[2] ?? match[3] ?? match[4] ?? '').trim();
  return isSafeHref(raw) && raw ? raw : undefined;
}

/* -------------------------------------------------------------------------- */
/* Parser                                                                     */
/* -------------------------------------------------------------------------- */

const TOKEN = /<!--[\s\S]*?-->|<\/?([a-zA-Z][a-zA-Z0-9-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g;

export function parseSafeHtml(source: string): HtmlNode[] {
  const root: HtmlNode = { kind: 'element', tag: '#root', children: [] };
  const stack: { tag: string; node: HtmlNode & { kind: 'element' } }[] = [{ tag: '#root', node: root }];
  /** Set while inside a dropped subtree, so its text is skipped as well. */
  let skipUntil: string | null = null;
  let depthInSkip = 0;

  const top = () => stack[stack.length - 1].node;
  const pushText = (text: string) => {
    if (skipUntil || !text) return;
    const decoded = decodeEntities(text);
    if (decoded) top().children.push({ kind: 'text', text: decoded });
  };

  let last = 0;
  let match: RegExpExecArray | null;
  TOKEN.lastIndex = 0;

  while ((match = TOKEN.exec(source)) !== null) {
    pushText(source.slice(last, match.index));
    last = match.index + match[0].length;

    // Comments carry nothing we want.
    if (match[0].startsWith('<!--')) continue;

    const raw = match[1];
    if (!raw) continue;
    const tag = raw.toLowerCase();
    const isClosing = match[0][1] === '/';
    const selfClosing = match[0].endsWith('/>');

    if (skipUntil) {
      // Inside a dropped element: count nesting so an inner <script> does not
      // end the skip early.
      if (tag === skipUntil) {
        if (isClosing) {
          depthInSkip -= 1;
          if (depthInSkip <= 0) skipUntil = null;
        } else if (!selfClosing) {
          depthInSkip += 1;
        }
      }
      continue;
    }

    if (DROP_WITH_CONTENT.has(tag)) {
      if (!isClosing && !selfClosing) {
        skipUntil = tag;
        depthInSkip = 1;
      }
      continue;
    }

    if (isClosing) {
      // Close the nearest matching open tag; a stray </div> closes nothing.
      for (let i = stack.length - 1; i > 0; i -= 1) {
        if (stack[i].tag === tag) {
          stack.length = i;
          break;
        }
      }
      continue;
    }

    if (!ALLOWED.has(tag)) {
      // Unknown wrapper: keep the children, lose the tag. Nothing is pushed on
      // the stack, so its closing tag is simply ignored above.
      continue;
    }

    const resolved = TAG_ALIASES[tag] ?? tag;

    if (VOID_TAGS.has(tag) || selfClosing) {
      top().children.push({ kind: 'element', tag: resolved, children: [] });
      continue;
    }

    const node: HtmlNode & { kind: 'element' } = {
      kind: 'element',
      tag: resolved,
      children: [],
      ...(resolved === 'a' ? { href: readHref(match[2] ?? '') } : {}),
    };
    top().children.push(node);
    stack.push({ tag, node });
  }

  pushText(source.slice(last));
  return normalise(root.children);
}

/**
 * Browsers insert a `<tbody>` for you; React only complains about the missing
 * one. Someone pasting `<table><tr>…` is doing something perfectly ordinary, so
 * the tree is fixed up rather than the paste rejected.
 */
function normalise(nodes: HtmlNode[]): HtmlNode[] {
  return nodes.map((node) => {
    if (node.kind !== 'element') return node;
    const children = normalise(node.children);
    if (node.tag !== 'table') return { ...node, children };

    const out: HtmlNode[] = [];
    let body: (HtmlNode & { kind: 'element' }) | null = null;
    for (const child of children) {
      if (child.kind === 'element' && child.tag === 'tr') {
        if (!body) {
          body = { kind: 'element', tag: 'tbody', children: [] };
          out.push(body);
        }
        body.children.push(child);
      } else {
        body = null;
        out.push(child);
      }
    }
    return { ...node, children: out };
  });
}

/* -------------------------------------------------------------------------- */
/* Renderer                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Class names come from here, never from the input, so pasted HTML inherits the
 * site's typography instead of bringing its own.
 */
const CLASSES: Record<string, string> = {
  p: 'mt-4 leading-relaxed text-bone-300 first:mt-0',
  h2: 'display-3 mt-10 text-bone-50 first:mt-0',
  h3: 'mt-8 font-[family-name:var(--font-display)] text-xl text-bone-50 first:mt-0',
  h4: 'mt-6 font-[family-name:var(--font-display)] text-lg text-bone-50 first:mt-0',
  ul: 'mt-4 list-disc space-y-2 pl-5 text-bone-300 marker:text-brass-500',
  ol: 'mt-4 list-decimal space-y-2 pl-5 text-bone-300 marker:text-brass-500',
  li: 'leading-relaxed',
  blockquote: 'mt-6 border-l-2 border-brass-500/60 pl-5 text-bone-200 italic',
  code: 'rounded bg-ink-800 px-1.5 py-0.5 text-[0.9em] text-brass-300',
  strong: 'font-semibold text-bone-100',
  a: 'underline underline-offset-4 transition-colors hover:text-brass-300',
  table: 'mt-6 w-full border-collapse text-left text-sm',
  th: 'border-b border-[var(--hairline-strong)] px-3 py-2 font-medium text-bone-100',
  td: 'border-b border-[var(--hairline)] px-3 py-2 text-bone-300',
  hr: 'my-8 border-[var(--hairline)]',
};

function toReact(nodes: HtmlNode[], keyPrefix: string): ReactNode[] {
  return nodes.map((node, index) => {
    const key = `${keyPrefix}-${index}`;
    if (node.kind === 'text') return node.text;

    const props: Record<string, unknown> = { key, className: CLASSES[node.tag] };
    if (node.tag === 'a') {
      // A link whose href did not pass the check renders as plain emphasis
      // rather than a dead <a> the visitor can click for nothing.
      if (!node.href) return createElement('span', { key }, ...toReact(node.children, key));
      props.href = node.href;
      if (/^https?:/i.test(node.href)) {
        props.target = '_blank';
        props.rel = 'noreferrer noopener';
      }
    }

    if (node.tag === 'br' || node.tag === 'hr') return createElement(node.tag, props);
    return createElement(node.tag, props, ...toReact(node.children, key));
  });
}

/** Parse and render in one step. Safe to call with anything at all. */
export function renderSafeHtml(source: string): ReactNode {
  if (!source.trim()) return null;
  return createElement(Fragment, null, ...toReact(parseSafeHtml(source), 'html'));
}

/**
 * A preview of what will actually survive, shown in the panel next to the
 * editor so "my script disappeared" is never a surprise at publish time.
 */
export function describeStrippedTags(source: string): string[] {
  const found = new Set<string>();
  let match: RegExpExecArray | null;
  const pattern = /<\/?([a-zA-Z][a-zA-Z0-9-]*)/g;
  while ((match = pattern.exec(source)) !== null) {
    const tag = match[1].toLowerCase();
    if (!ALLOWED.has(tag)) found.add(tag);
  }
  return [...found].sort();
}
