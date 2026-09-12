'use client';

import { AssetImage } from '../AssetImage';
import { useId, useState } from 'react';
import type { BlockField, CatalogueSource } from '@/lib/blocks';
import { describeStrippedTags } from '@/lib/safe-html';
import { MediaPicker, type MediaItem } from '../MediaPicker';
import { MarkdownField } from './MarkdownField';

/**
 * Renders one field of a block's form from its declaration in the registry.
 *
 * The registry is plain data, so this is the only file that knows what a field
 * *looks like* — which is what keeps a new block option from needing UI work,
 * and keeps every block's form consistent without anyone maintaining twelve
 * near-identical forms.
 */
export type CatalogueOption = { slug: string; label: string; hint?: string };
export type Catalogues = Partial<Record<CatalogueSource, CatalogueOption[]>>;

type Value = unknown;
type Setter = (name: string, value: Value) => void;

function asLocalized(value: Value): { it: string; en: string } {
  const loc = value as { it?: unknown; en?: unknown } | undefined;
  return {
    it: typeof loc?.it === 'string' ? loc.it : '',
    en: typeof loc?.en === 'string' ? loc.en : '',
  };
}

function asString(value: Value): string {
  return typeof value === 'string' ? value : '';
}

function Hint({ text }: { text?: string }) {
  if (!text) return null;
  // stone-600, not stone-500: the drawer's background is #f6f5f3 rather than
  // white, which costs enough contrast to put stone-500 under AA at this size.
  return <p className="mt-1 text-xs leading-relaxed text-stone-600">{text}</p>;
}

/**
 * Italian and English side by side, with English marked optional: the renderer
 * falls back to Italian for an empty English string, so the owner can add a
 * page now and translate it later without the page looking broken meanwhile.
 */
function LocalizedPair({
  label,
  hint,
  value,
  onChange,
  multiline,
  rows = 3,
}: {
  label: string;
  hint?: string;
  value: { it: string; en: string };
  onChange: (next: { it: string; en: string }) => void;
  multiline?: boolean;
  rows?: number;
}) {
  const id = useId();
  const Field = multiline ? 'textarea' : 'input';
  // A fieldset so the two inputs are announced as one thing with two languages,
  // and real <label>s on the "it"/"en" markers: the group heading alone left
  // both fields unnamed, which is unusable with a screen reader.
  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend className="admin-label">{label}</legend>
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <label
            htmlFor={`${id}-it`}
            className="mt-2 w-7 shrink-0 text-[0.65rem] font-semibold uppercase tracking-wider text-stone-600"
          >
            it
          </label>
          <Field
            id={`${id}-it`}
            aria-label={`${label} — italiano`}
            className="admin-field"
            {...(multiline ? { rows } : { type: 'text' })}
            value={value.it}
            onChange={(event: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) =>
              onChange({ ...value, it: event.target.value })
            }
          />
        </div>
        <div className="flex items-start gap-2">
          <label
            htmlFor={`${id}-en`}
            className="mt-2 w-7 shrink-0 text-[0.65rem] font-semibold uppercase tracking-wider text-stone-600"
          >
            en
          </label>
          <Field
            id={`${id}-en`}
            aria-label={`${label} — inglese`}
            className="admin-field"
            placeholder="Se lo lasci vuoto viene usato l’italiano"
            {...(multiline ? { rows } : { type: 'text' })}
            value={value.en}
            onChange={(event: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) =>
              onChange({ ...value, en: event.target.value })
            }
          />
        </div>
      </div>
      <Hint text={hint} />
    </fieldset>
  );
}

function ImageField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: { path: string; alt: { it: string; en: string } };
  onChange: (next: { path: string; alt: { it: string; en: string } }) => void;
}) {
  const [picking, setPicking] = useState(false);

  return (
    <div>
      <span className="admin-label">{label}</span>
      <div className="flex items-start gap-3">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
          {value.path ? (
            <AssetImage src={value.path} alt="" sizes="80px" className="object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-[0.6rem] text-stone-600">vuota</span>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setPicking(true)} className="admin-btn admin-btn-secondary !min-h-10 !px-3 text-sm">
              {value.path ? 'Sostituisci' : 'Scegli dalla libreria'}
            </button>
            {value.path && (
              <button
                type="button"
                onClick={() => onChange({ ...value, path: '' })}
                className="admin-btn admin-btn-secondary !min-h-10 !px-3 text-sm text-red-700"
              >
                Togli
              </button>
            )}
          </div>
          {value.path && <p className="truncate text-[0.7rem] text-stone-500">{value.path}</p>}
        </div>
      </div>

      <div className="mt-3">
        <LocalizedPair
          label="Testo alternativo"
          hint="Descrive la foto a chi non la vede e a Google. Se la lasci vuota viene usato il titolo della sezione."
          value={value.alt}
          onChange={(alt) => onChange({ ...value, alt })}
        />
      </div>

      <Hint text={hint} />

      <MediaPicker
        open={picking}
        onClose={() => setPicking(false)}
        onSelect={(item: MediaItem) =>
          onChange({
            path: item.path,
            // Reuse the library's alt text if the field is still empty — one
            // less thing to retype, and a described image by default.
            alt: value.alt.it || value.alt.en ? value.alt : { it: item.alt.it, en: item.alt.en },
          })
        }
      />
    </div>
  );
}

function ImageListField({
  label,
  hint,
  max,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  max: number;
  value: { path: string; alt: { it: string; en: string } }[];
  onChange: (next: { path: string; alt: { it: string; en: string } }[]) => void;
}) {
  const [picking, setPicking] = useState(false);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div>
      <span className="admin-label">
        {label} <span className="font-normal normal-case tracking-normal text-stone-600">({value.length}/{max})</span>
      </span>

      {value.length > 0 && (
        <ul className="mb-3 space-y-2">
          {value.map((image, index) => (
            <li key={`${image.path}-${index}`} className="flex items-center gap-2.5 rounded-lg border border-stone-200 bg-white p-2">
              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-stone-100">
                {image.path && <AssetImage src={image.path} alt="" sizes="48px" className="object-cover" />}
              </span>
              <span className="min-w-0 flex-1 truncate text-xs text-stone-600">{image.path}</span>
              <span className="flex shrink-0 gap-0.5">
                <button
                  type="button"
                  onClick={() => move(index, index - 1)}
                  disabled={index === 0}
                  aria-label="Sposta su"
                  className="flex h-9 w-9 items-center justify-center rounded text-stone-500 hover:bg-stone-100 disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(index, index + 1)}
                  disabled={index === value.length - 1}
                  aria-label="Sposta giù"
                  className="flex h-9 w-9 items-center justify-center rounded text-stone-500 hover:bg-stone-100 disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => onChange(value.filter((_, i) => i !== index))}
                  aria-label="Rimuovi"
                  className="flex h-9 w-9 items-center justify-center rounded text-red-700 hover:bg-red-50"
                >
                  ✕
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => setPicking(true)}
        disabled={value.length >= max}
        className="admin-btn admin-btn-secondary !min-h-10 text-sm"
      >
        Aggiungi un’immagine
      </button>
      <Hint text={hint} />

      <MediaPicker
        open={picking}
        onClose={() => setPicking(false)}
        onSelect={(item) => onChange([...value, { path: item.path, alt: item.alt }])}
      />
    </div>
  );
}

function CatalogueField({
  label,
  hint,
  options,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  options: CatalogueOption[];
  value: string[];
  onChange: (next: string[]) => void;
}) {
  if (!options.length) {
    return (
      <div>
        <span className="admin-label">{label}</span>
        <p className="rounded-lg border border-dashed border-stone-300 px-3 py-4 text-sm text-stone-500">
          Il catalogo è vuoto: aggiungi prima qualche voce nella sezione corrispondente.
        </p>
      </div>
    );
  }

  const toggle = (slug: string) =>
    onChange(value.includes(slug) ? value.filter((item) => item !== slug) : [...value, slug]);

  return (
    <div>
      <span className="admin-label">
        {label} <span className="font-normal normal-case tracking-normal text-stone-600">({value.length} selezionati)</span>
      </span>
      <ul className="max-h-64 space-y-1 overflow-y-auto rounded-lg border border-stone-200 bg-white p-1.5">
        {options.map((option) => {
          const checked = value.includes(option.slug);
          const order = value.indexOf(option.slug);
          return (
            <li key={option.slug}>
              <label className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-md px-2 hover:bg-stone-50">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(option.slug)}
                  className="h-4 w-4 shrink-0 accent-stone-900"
                />
                <span className="min-w-0 flex-1 truncate text-sm text-stone-800">{option.label}</span>
                {/* The number is the order they will appear in, which is the
                    order they were ticked — not the catalogue's own order. */}
                {checked && <span className="admin-chip">{order + 1}</span>}
              </label>
            </li>
          );
        })}
      </ul>
      <Hint text={hint} />
    </div>
  );
}

function LinkField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: { label: { it: string; en: string }; href: string };
  onChange: (next: { label: { it: string; en: string }; href: string }) => void;
}) {
  const id = useId();
  const href = value.href.trim();
  // Mirrors isSafeHref, so the warning appears while typing instead of only
  // when the server refuses the save.
  const unsafe =
    href !== '' &&
    !(href.startsWith('/') && !href.startsWith('//')) &&
    !href.startsWith('#') &&
    !href.startsWith('?') &&
    !/^(https?:|mailto:|tel:)/i.test(href);

  return (
    <div className="rounded-lg border border-stone-200 bg-stone-50/60 p-3">
      <span className="admin-label">{label}</span>
      <LocalizedPair label="Testo del bottone" value={value.label} onChange={(next) => onChange({ ...value, label: next })} />
      <div className="mt-3">
        <label htmlFor={id} className="admin-label">
          Dove porta
        </label>
        <input
          id={id}
          type="text"
          value={value.href}
          onChange={(event) => onChange({ ...value, href: event.target.value })}
          placeholder="/it/richiedi-preventivo"
          aria-invalid={unsafe}
          className="admin-field"
        />
        {unsafe ? (
          <p className="mt-1 text-xs text-red-700">
            Indirizzo non ammesso. Usa un percorso del sito (/it/…), un indirizzo https://, mailto: o tel:.
          </p>
        ) : (
          <Hint text="Lascia vuoto per non mostrare il bottone." />
        )}
      </div>
      <Hint text={hint} />
    </div>
  );
}

function HtmlField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: { it: string; en: string };
  onChange: (next: { it: string; en: string }) => void;
}) {
  const stripped = describeStrippedTags(value.it);
  return (
    <div>
      <LocalizedPair label={label} value={value} onChange={onChange} multiline rows={8} />
      {stripped.length > 0 && (
        <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          <strong className="font-semibold">Questi tag verranno ignorati:</strong> {stripped.join(', ')}. Il resto del
          contenuto viene mostrato normalmente.
        </p>
      )}
      <Hint text={hint} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */

export function FieldRenderer({
  field,
  config,
  set,
  catalogues,
}: {
  field: BlockField;
  config: Record<string, unknown>;
  set: Setter;
  catalogues: Catalogues;
}) {
  const id = useId();
  const value = config[field.name];

  switch (field.kind) {
    case 'localizedText':
      return (
        <LocalizedPair
          label={field.label}
          hint={field.hint}
          value={asLocalized(value)}
          onChange={(next) => set(field.name, next)}
        />
      );

    case 'localizedTextarea':
      return (
        <LocalizedPair
          label={field.label}
          hint={field.hint}
          multiline
          rows={field.rows ?? 3}
          value={asLocalized(value)}
          onChange={(next) => set(field.name, next)}
        />
      );

    case 'text':
      return (
        <div>
          <label htmlFor={id} className="admin-label">
            {field.label}
          </label>
          <input
            id={id}
            type="text"
            className="admin-field"
            placeholder={field.placeholder}
            value={asString(value)}
            onChange={(event) => set(field.name, event.target.value)}
          />
          <Hint text={field.hint} />
        </div>
      );

    case 'markdown': {
      const localized = asLocalized(value);
      return (
        <div>
          <span className="admin-label">{field.label}</span>
          <div className="space-y-3">
            <div>
              <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-wider text-stone-400">Italiano</p>
              <MarkdownField id={`${id}-it`} value={localized.it} onChange={(next) => set(field.name, { ...localized, it: next })} />
            </div>
            <details className="rounded-lg border border-stone-200 bg-stone-50/60 p-2">
              <summary className="min-h-9 cursor-pointer px-1 text-xs font-medium text-stone-600">
                Versione inglese {localized.en ? '' : '(vuota: verrà usato l’italiano)'}
              </summary>
              <div className="mt-2">
                <MarkdownField id={`${id}-en`} value={localized.en} onChange={(next) => set(field.name, { ...localized, en: next })} />
              </div>
            </details>
          </div>
          <Hint text={field.hint} />
        </div>
      );
    }

    case 'safeHtml':
      return (
        <HtmlField label={field.label} hint={field.hint} value={asLocalized(value)} onChange={(next) => set(field.name, next)} />
      );

    case 'image':
      return (
        <ImageField
          label={field.label}
          hint={field.hint}
          value={{
            path: asString((value as { path?: unknown })?.path),
            alt: asLocalized((value as { alt?: unknown })?.alt),
          }}
          onChange={(next) => set(field.name, next)}
        />
      );

    case 'imageList':
      return (
        <ImageListField
          label={field.label}
          hint={field.hint}
          max={field.max ?? 20}
          value={(Array.isArray(value) ? value : []).map((item) => ({
            path: asString((item as { path?: unknown })?.path),
            alt: asLocalized((item as { alt?: unknown })?.alt),
          }))}
          onChange={(next) => set(field.name, next)}
        />
      );

    case 'link':
      return (
        <LinkField
          label={field.label}
          hint={field.hint}
          value={{
            label: asLocalized((value as { label?: unknown })?.label),
            href: asString((value as { href?: unknown })?.href),
          }}
          onChange={(next) => set(field.name, next)}
        />
      );

    case 'select': {
      const current = asString(value) || field.options[0]?.value;
      const active = field.options.find((option) => option.value === current);
      return (
        <div>
          <label htmlFor={id} className="admin-label">
            {field.label}
          </label>
          <select id={id} className="admin-field" value={current} onChange={(event) => set(field.name, event.target.value)}>
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Hint text={active?.hint ?? field.hint} />
        </div>
      );
    }

    case 'toggle':
      return (
        <div>
          <label className="flex min-h-11 cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={value === true}
              onChange={(event) => set(field.name, event.target.checked)}
              className="h-4 w-4 accent-stone-900"
            />
            <span className="text-sm text-stone-800">{field.label}</span>
          </label>
          <Hint text={field.hint} />
        </div>
      );

    case 'catalogue':
      return (
        <CatalogueField
          label={field.label}
          hint={field.hint}
          options={catalogues[field.source] ?? []}
          value={Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []}
          onChange={(next) => set(field.name, next)}
        />
      );

    case 'repeater': {
      const items = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
      return (
        <div>
          <span className="admin-label">
            {field.label}{' '}
            <span className="font-normal normal-case tracking-normal text-stone-600">
              ({items.length}/{field.max})
            </span>
          </span>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="rounded-lg border border-stone-200 bg-white p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold text-stone-500">
                    {field.itemLabel} {index + 1}
                  </p>
                  <span className="flex gap-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (index === 0) return;
                        const next = [...items];
                        [next[index - 1], next[index]] = [next[index], next[index - 1]];
                        set(field.name, next);
                      }}
                      disabled={index === 0}
                      aria-label="Sposta su"
                      className="flex h-9 w-9 items-center justify-center rounded text-stone-500 hover:bg-stone-100 disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (index === items.length - 1) return;
                        const next = [...items];
                        [next[index + 1], next[index]] = [next[index], next[index + 1]];
                        set(field.name, next);
                      }}
                      disabled={index === items.length - 1}
                      aria-label="Sposta giù"
                      className="flex h-9 w-9 items-center justify-center rounded text-stone-500 hover:bg-stone-100 disabled:opacity-30"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => set(field.name, items.filter((_, i) => i !== index))}
                      aria-label="Rimuovi"
                      className="flex h-9 w-9 items-center justify-center rounded text-red-700 hover:bg-red-50"
                    >
                      ✕
                    </button>
                  </span>
                </div>
                <div className="space-y-3">
                  {field.fields.map((sub) => (
                    <FieldRenderer
                      key={sub.name}
                      field={sub}
                      config={item}
                      catalogues={catalogues}
                      set={(name, next) => {
                        const updated = [...items];
                        updated[index] = { ...updated[index], [name]: next };
                        set(field.name, updated);
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => set(field.name, [...items, {}])}
            disabled={items.length >= field.max}
            className="admin-btn admin-btn-secondary mt-3 !min-h-10 text-sm"
          >
            Aggiungi {field.itemLabel.toLowerCase()}
          </button>
          <Hint text={field.hint} />
        </div>
      );
    }

    default:
      return null;
  }
}
