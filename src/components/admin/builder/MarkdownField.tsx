'use client';

import { useRef, useState } from 'react';

/**
 * The restricted rich-text editor.
 *
 * It writes markdown rather than HTML on purpose: the site renders markdown
 * through a parser that produces React elements and cannot emit arbitrary
 * markup, so there is no formatting here that could fight the design system or
 * carry a script. The toolbar is the whole vocabulary — bold, italic, headings,
 * lists, links — which is the set that was asked for and nothing that would let
 * a paste destroy a page.
 */
type Action = { label: string; title: string; wrap?: [string, string]; prefix?: string; link?: boolean };

const ACTIONS: Action[] = [
  { label: 'B', title: 'Grassetto', wrap: ['**', '**'] },
  { label: 'I', title: 'Corsivo', wrap: ['*', '*'] },
  { label: 'H2', title: 'Titolo', prefix: '## ' },
  { label: 'H3', title: 'Sottotitolo', prefix: '### ' },
  { label: '• Lista', title: 'Elenco puntato', prefix: '- ' },
  { label: '1. Lista', title: 'Elenco numerato', prefix: '1. ' },
  { label: 'Link', title: 'Inserisci un link', link: true },
];

export function MarkdownField({
  id,
  value,
  onChange,
  rows = 6,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (next: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  const area = useRef<HTMLTextAreaElement>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkHref, setLinkHref] = useState('');

  function apply(action: Action) {
    const element = area.current;
    if (!element) return;
    const start = element.selectionStart;
    const end = element.selectionEnd;
    const selected = value.slice(start, end);

    if (action.link) {
      setLinkOpen(true);
      return;
    }

    let next: string;
    let caret: number;

    if (action.wrap) {
      const [open, close] = action.wrap;
      const body = selected || 'testo';
      next = `${value.slice(0, start)}${open}${body}${close}${value.slice(end)}`;
      caret = start + open.length + body.length;
    } else {
      // A prefix applies to a whole line, so find where the line starts.
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      next = `${value.slice(0, lineStart)}${action.prefix}${value.slice(lineStart)}`;
      caret = end + (action.prefix?.length ?? 0);
    }

    onChange(next);
    requestAnimationFrame(() => {
      element.focus();
      element.setSelectionRange(caret, caret);
    });
  }

  function insertLink() {
    const element = area.current;
    const href = linkHref.trim();
    setLinkOpen(false);
    setLinkHref('');
    if (!element || !href) return;
    const start = element.selectionStart;
    const end = element.selectionEnd;
    const label = value.slice(start, end) || 'testo del link';
    onChange(`${value.slice(0, start)}[${label}](${href})${value.slice(end)}`);
    requestAnimationFrame(() => element.focus());
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1 rounded-t-lg border border-b-0 border-stone-300 bg-stone-50 p-1.5">
        {ACTIONS.map((action) => (
          <button
            key={action.label}
            type="button"
            title={action.title}
            onClick={() => apply(action)}
            className="min-h-9 rounded-md px-2.5 text-xs font-medium text-stone-700 transition-colors hover:bg-stone-200"
          >
            {action.label}
          </button>
        ))}
      </div>

      {linkOpen && (
        <div className="flex flex-wrap items-center gap-2 border-x border-stone-300 bg-stone-100 p-2">
          <input
            type="text"
            autoFocus
            value={linkHref}
            onChange={(event) => setLinkHref(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                insertLink();
              }
              if (event.key === 'Escape') setLinkOpen(false);
            }}
            placeholder="/it/pacchetti oppure https://…"
            className="admin-field !min-h-9 flex-1 !py-1 text-sm"
          />
          <button type="button" onClick={insertLink} className="admin-btn !min-h-9 !px-3 !py-1 text-xs">
            Inserisci
          </button>
        </div>
      )}

      <textarea
        ref={area}
        id={id}
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="admin-field !rounded-t-none font-[inherit] leading-relaxed"
      />
    </div>
  );
}
