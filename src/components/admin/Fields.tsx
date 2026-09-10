'use client';

import { useState } from 'react';
import type { FieldDef } from '@/lib/admin/collections';
import { listToText } from '@/lib/admin/form';
import { cn } from '@/lib/utils';

function toDateInput(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') return value.slice(0, 10);
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return '';
}

function toDateTimeInput(value: unknown): string {
  if (!value) return new Date().toISOString().slice(0, 16);
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 16);
}

/** One field of the generic collection editor. */
export function Field({ field, value, idPrefix }: { field: FieldDef; value: unknown; idPrefix: string }) {
  const id = `${idPrefix}-${field.name}`;
  const localized = (value ?? { it: '', en: '' }) as { it?: string; en?: string } | { it?: string[]; en?: string[] };

  const wrapper = (children: React.ReactNode) => (
    <div className={cn(field.half ? 'sm:col-span-1' : 'sm:col-span-2')}>
      <label htmlFor={id} className="admin-label">
        {field.label}
        {field.required && <span className="ml-1 text-red-600">*</span>}
      </label>
      {children}
      {field.hint && <p className="mt-1 text-xs text-stone-500">{field.hint}</p>}
    </div>
  );

  switch (field.type) {
    case 'boolean':
      return (
        <div className={cn('flex items-center gap-2.5', field.half ? 'sm:col-span-1' : 'sm:col-span-2')}>
          <input
            id={id}
            type="checkbox"
            name={field.name}
            defaultChecked={Boolean(value)}
            className="h-4 w-4 accent-stone-900"
          />
          <label htmlFor={id} className="text-sm text-stone-700">
            {field.label}
          </label>
        </div>
      );

    case 'number':
      return wrapper(
        <input
          id={id}
          type="number"
          name={field.name}
          defaultValue={value === null || value === undefined ? '' : String(value)}
          className="admin-field"
        />,
      );

    case 'date':
      return wrapper(<input id={id} type="date" name={field.name} defaultValue={toDateInput(value)} className="admin-field" />);

    case 'datetime':
      return wrapper(
        <input id={id} type="datetime-local" name={field.name} defaultValue={toDateTimeInput(value)} className="admin-field" />,
      );

    case 'select':
      return wrapper(
        <select id={id} name={field.name} defaultValue={String(value ?? '')} className="admin-field">
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>,
      );

    case 'textarea':
      return wrapper(
        <textarea id={id} name={field.name} rows={3} defaultValue={String(value ?? '')} className="admin-field" />,
      );

    case 'image':
      return wrapper(
        <>
          <input
            id={id}
            type="text"
            name={field.name}
            defaultValue={String(value ?? '')}
            placeholder="/images/… oppure /uploads/…"
            className="admin-field font-mono text-xs"
          />
          <ImagePreview src={typeof value === 'string' ? value : ''} />
        </>,
      );

    case 'localized':
      return (
        <div className="sm:col-span-2">
          <span className="admin-label">
            {field.label}
            {field.required && <span className="ml-1 text-red-600">*</span>}
          </span>
          <div className="grid gap-2 sm:grid-cols-2">
            <LocaleInput name={`${field.name}.it`} flag="IT" value={String((localized as { it?: string }).it ?? '')} />
            <LocaleInput name={`${field.name}.en`} flag="EN" value={String((localized as { en?: string }).en ?? '')} />
          </div>
          {field.hint && <p className="mt-1 text-xs text-stone-500">{field.hint}</p>}
        </div>
      );

    case 'localizedText':
    case 'localizedBody':
    case 'localizedList': {
      const rows = field.type === 'localizedBody' ? 16 : field.type === 'localizedList' ? 6 : 3;
      const asText = (locale: 'it' | 'en') =>
        field.type === 'localizedList'
          ? listToText((localized as { it?: string[]; en?: string[] })[locale])
          : String((localized as { it?: string; en?: string })[locale] ?? '');

      return (
        <div className="sm:col-span-2">
          <span className="admin-label">
            {field.label}
            {field.required && <span className="ml-1 text-red-600">*</span>}
          </span>
          <div className="grid gap-2 lg:grid-cols-2">
            <LocaleTextarea name={`${field.name}.it`} flag="IT" rows={rows} value={asText('it')} />
            <LocaleTextarea name={`${field.name}.en`} flag="EN" rows={rows} value={asText('en')} />
          </div>
          {field.hint && <p className="mt-1 text-xs text-stone-500">{field.hint}</p>}
        </div>
      );
    }

    default:
      return wrapper(<input id={id} type="text" name={field.name} defaultValue={String(value ?? '')} className="admin-field" />);
  }
}

/**
 * Preview that tells the truth: a path pointing at a file that is not there yet
 * says so instead of showing a broken image. Most image fields are still
 * placeholders on day one, and knowing which is genuinely useful.
 */
function ImagePreview({ src }: { src: string }) {
  const [missing, setMissing] = useState(false);
  if (!src) return null;

  if (missing) {
    return (
      <p className="mt-2 rounded border border-dashed border-stone-300 bg-stone-50 px-3 py-2 text-xs text-stone-500">
        Il file non è ancora presente su questo percorso — il sito mostrerà un segnaposto grafico.
      </p>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      onError={() => setMissing(true)}
      className="mt-2 h-20 w-32 rounded border border-stone-200 object-cover"
    />
  );
}

function LocaleInput({ name, flag, value }: { name: string; flag: string; value: string }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 rounded bg-stone-100 px-1.5 py-0.5 text-[0.65rem] font-semibold text-stone-500">
        {flag}
      </span>
      <input type="text" name={name} defaultValue={value} className="admin-field pl-11" />
    </div>
  );
}

function LocaleTextarea({ name, flag, rows, value }: { name: string; flag: string; rows: number; value: string }) {
  return (
    <div>
      <span className="mb-1 inline-block rounded bg-stone-100 px-1.5 py-0.5 text-[0.65rem] font-semibold text-stone-500">
        {flag}
      </span>
      <textarea name={name} rows={rows} defaultValue={value} className="admin-field font-mono text-[0.8rem] leading-relaxed" />
    </div>
  );
}
