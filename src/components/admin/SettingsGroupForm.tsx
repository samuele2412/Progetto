'use client';

import { useActionState } from 'react';
import { saveSettingsGroup, type ActionState } from '@/app/admin/actions';
import { labelForSettingsField, longFields } from '@/lib/admin/settings-groups';
import { SubmitButton } from './SubmitButton';

type Value = unknown;

function isLocalizedString(value: Value): value is { it: string; en: string } {
  return typeof value === 'object' && value !== null && 'it' in value && typeof (value as { it: unknown }).it === 'string';
}

function isLocalizedList(value: Value): value is { it: string[]; en: string[] } {
  if (typeof value !== 'object' || value === null || !('it' in value)) return false;
  const list = (value as { it: unknown }).it;
  return Array.isArray(list) && (list.length === 0 || typeof list[0] === 'string');
}

function isLocalizedPairs(value: Value): value is { it: { title: string; body: string }[]; en: { title: string; body: string }[] } {
  if (typeof value !== 'object' || value === null || !('it' in value)) return false;
  const list = (value as { it: unknown }).it;
  return Array.isArray(list) && list.length > 0 && typeof list[0] === 'object' && list[0] !== null;
}

function pairsToText(list: { title: string; body: string }[]): string {
  return list.map((pair) => `${pair.title} | ${pair.body}`).join('\n');
}

/**
 * Renders one settings group from its own shape — strings, {it,en} pairs, lists
 * and title|body blocks each get the editor that fits, so a new setting shows
 * up in the panel without any extra wiring.
 */
export function SettingsGroupForm({
  group,
  title,
  description,
  values,
}: {
  group: string;
  title: string;
  description: string;
  values: Record<string, unknown>;
}) {
  const [state, formAction] = useActionState(saveSettingsGroup, {} as ActionState);

  return (
    <details className="admin-card overflow-hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
        <span>
          <span className="block font-medium text-stone-900">{title}</span>
          <span className="block text-xs text-stone-500">{description}</span>
        </span>
        <span className="shrink-0 text-xs text-stone-500">modifica</span>
      </summary>

      <form action={formAction} className="space-y-5 border-t border-stone-200 p-5">
        <input type="hidden" name="__group" value={group} />

        {Object.entries(values).map(([key, value]) => {
          const label = labelForSettingsField(key);
          const id = `${group}-${key}`;
          const long = longFields.has(key);

          if (typeof value === 'string') {
            return (
              <div key={key}>
                <label htmlFor={id} className="admin-label">
                  {label}
                </label>
                <input id={id} type="text" name={key} defaultValue={value} className="admin-field" />
              </div>
            );
          }

          if (isLocalizedList(value)) {
            return (
              <LocalePair
                key={key}
                label={label}
                name={key}
                rows={5}
                it={value.it.join('\n')}
                en={value.en.join('\n')}
              />
            );
          }

          if (isLocalizedPairs(value)) {
            return (
              <LocalePair
                key={key}
                label={label}
                name={key}
                rows={6}
                it={pairsToText(value.it)}
                en={pairsToText(value.en)}
              />
            );
          }

          if (isLocalizedString(value)) {
            return (
              <LocalePair
                key={key}
                label={label}
                name={key}
                rows={long ? (key.endsWith('Body') ? 14 : 3) : 1}
                it={value.it}
                en={value.en}
              />
            );
          }

          return null;
        })}

        {state?.error && (
          <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {state.error}
          </p>
        )}
        {state?.ok && (
          <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            {state.message}
          </p>
        )}

        <SubmitButton>Salva</SubmitButton>
      </form>
    </details>
  );
}

function LocalePair({
  label,
  name,
  rows,
  it,
  en,
}: {
  label: string;
  name: string;
  rows: number;
  it: string;
  en: string;
}) {
  return (
    <div>
      <span className="admin-label">{label}</span>
      <div className="grid gap-2 lg:grid-cols-2">
        {(
          [
            ['IT', 'it', it],
            ['EN', 'en', en],
          ] as const
        ).map(([flag, locale, value]) => (
          <div key={locale}>
            <span className="mb-1 inline-block rounded bg-stone-100 px-1.5 py-0.5 text-[0.65rem] font-semibold text-stone-500">
              {flag}
            </span>
            {rows <= 1 ? (
              <input type="text" name={`${name}.${locale}`} defaultValue={value} className="admin-field" />
            ) : (
              <textarea
                name={`${name}.${locale}`}
                rows={rows}
                defaultValue={value}
                className="admin-field font-mono text-[0.8rem] leading-relaxed"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
