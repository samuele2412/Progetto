'use client';

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useState, useTransition } from 'react';
import {
  deleteSectionAction,
  duplicateSectionAction,
  reorderSectionsAction,
  toggleSectionAction,
} from '@/app/admin/cms-actions';
import { getBlockDefinition } from '@/lib/blocks';
import { useToast } from '../Toasts';
import type { Catalogues } from './FieldRenderer';
import { SectionEditor } from './SectionEditor';

/**
 * The page as a stack of blocks.
 *
 * dnd-kit rather than the HTML5 drag events because the panel has to work on a
 * phone: native drag and drop does not fire on touch at all. Its pointer sensor
 * also needs a small activation distance, otherwise every tap on a card starts
 * a drag and the buttons inside become unusable. A keyboard sensor comes with
 * it, which means the order can be changed without a mouse.
 */
export type BuilderSection = {
  id: number;
  type: string;
  visible: boolean;
  config: Record<string, unknown>;
  templateId: number | null;
  templateName: string | null;
};

/** A one-line summary so a collapsed card says what is in it. */
function summarise(section: BuilderSection): string {
  const config = section.config;
  const pick = (key: string) => {
    const value = config[key] as { it?: string } | undefined;
    return typeof value?.it === 'string' ? value.it.trim() : '';
  };
  const title = pick('title') || pick('eyebrow') || pick('intro') || pick('body');
  if (title) return title.replace(/[#*_`]/g, '').slice(0, 90);

  const images = config.images;
  if (Array.isArray(images) && images.length) return `${images.length} immagini`;
  const slugs = config.slugs;
  if (Array.isArray(slugs) && slugs.length) return `${slugs.length} elementi scelti`;
  const items = config.items;
  if (Array.isArray(items) && items.length) return `${items.length} voci`;
  return 'Senza titolo';
}

function Row({
  section,
  index,
  total,
  pageId,
  onEdit,
  busy,
}: {
  section: BuilderSection;
  index: number;
  total: number;
  pageId: number;
  onEdit: () => void;
  busy: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const definition = getBlockDefinition(section.type);
  const [confirming, setConfirming] = useState(false);
  const [, startTransition] = useTransition();
  const toast = useToast();

  const run = (action: (form: FormData) => Promise<{ ok?: boolean; error?: string; message?: string }>) => {
    const form = new FormData();
    form.set('pageId', String(pageId));
    form.set('sectionId', String(section.id));
    startTransition(async () => {
      const result = await action(form);
      if (result?.error) toast('error', result.error);
      else if (result?.message) toast('ok', result.message);
    });
  };

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      data-dragging={isDragging}
      data-hidden={!section.visible}
      className="builder-row"
    >
      <div className="flex items-start gap-2 p-2.5 sm:gap-3 sm:p-3">
        <button
          type="button"
          className="builder-handle flex h-11 w-8 shrink-0 items-center justify-center rounded-md"
          aria-label={`Trascina per riordinare: ${definition?.label ?? section.type}. Posizione ${index + 1} di ${total}.`}
          {...attributes}
          {...listeners}
        >
          <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor" aria-hidden>
            <circle cx="7" cy="5" r="1.4" /><circle cx="13" cy="5" r="1.4" />
            <circle cx="7" cy="10" r="1.4" /><circle cx="13" cy="10" r="1.4" />
            <circle cx="7" cy="15" r="1.4" /><circle cx="13" cy="15" r="1.4" />
          </svg>
        </button>

        {/* The main way a section is opened on a phone, so it carries the 44px
            minimum itself rather than inheriting whatever its text happens to
            be tall. */}
        <button type="button" onClick={onEdit} className="min-h-11 min-w-0 flex-1 py-1 text-left">
          <span className="flex flex-wrap items-center gap-1.5">
            <span className="builder-row-title text-sm font-semibold text-stone-900">
              {definition?.label ?? section.type}
            </span>
            {!section.visible && <span className="admin-chip admin-chip-hidden">nascosta</span>}
            {section.templateName && <span className="admin-chip admin-chip-global">globale</span>}
          </span>
          <span className="mt-0.5 block truncate text-xs text-stone-500">{summarise(section)}</span>
        </button>

        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            onClick={onEdit}
            aria-label="Modifica"
            title="Modifica"
            className="flex h-11 w-11 items-center justify-center rounded-md text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d="M13 3l4 4-9 9H4v-4z" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => run(toggleSectionAction)}
            aria-label={section.visible ? 'Nascondi' : 'Mostra'}
            title={section.visible ? 'Nascondi dal sito' : 'Mostra di nuovo'}
            className="flex h-11 w-11 items-center justify-center rounded-md text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900 disabled:opacity-40"
          >
            {section.visible ? (
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <path d="M1.5 10S4.5 4.5 10 4.5 18.5 10 18.5 10 15.5 15.5 10 15.5 1.5 10 1.5 10z" />
                <circle cx="10" cy="10" r="2.4" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <path d="M3 3l14 14M8 5.2A7.7 7.7 0 0 1 10 5c5.5 0 8.5 5 8.5 5a13 13 0 0 1-2.6 3.1M5.3 6.9A13 13 0 0 0 1.5 10S4.5 15 10 15c.9 0 1.7-.1 2.4-.4" strokeLinecap="round" />
              </svg>
            )}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => run(duplicateSectionAction)}
            aria-label="Duplica"
            title="Duplica"
            className="flex h-11 w-11 items-center justify-center rounded-md text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900 disabled:opacity-40"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d="M7 7h9v9H7zM4 13V4h9" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => setConfirming(true)}
            aria-label="Elimina"
            title="Elimina"
            className="flex h-11 w-11 items-center justify-center rounded-md text-stone-400 transition-colors hover:bg-red-50 hover:text-red-700 disabled:opacity-40"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d="M4 6h12M8 6V4h4v2M6 6l1 10h6l1-10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {confirming && (
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-red-200 bg-red-50 px-3 py-2">
          <p className="mr-auto text-xs text-red-800">Eliminare questa sezione?</p>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="min-h-9 px-2 text-xs text-stone-600 hover:underline"
          >
            Annulla
          </button>
          <button
            type="button"
            onClick={() => {
              setConfirming(false);
              run(deleteSectionAction);
            }}
            className="admin-btn admin-btn-danger !min-h-9 !px-3 !py-1 !text-xs"
          >
            Elimina
          </button>
        </div>
      )}
    </li>
  );
}

export function SectionList({
  pageId,
  sections,
  catalogues,
}: {
  pageId: number;
  sections: BuilderSection[];
  catalogues: Catalogues;
}) {
  const [order, setOrder] = useState(sections);
  const [editing, setEditing] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  // The server is the source of truth: after any action the page re-renders and
  // the new list arrives as props, so local state has to follow it.
  useEffect(() => setOrder(sections), [sections]);

  const sensors = useSensors(
    // 6px before a drag starts, so tapping the buttons inside a card still
    // works on a touchscreen.
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const from = order.findIndex((section) => section.id === active.id);
    const to = order.findIndex((section) => section.id === over.id);
    if (from < 0 || to < 0) return;

    const next = arrayMove(order, from, to);
    setOrder(next); // optimistic: the card must not spring back while saving

    const form = new FormData();
    form.set('pageId', String(pageId));
    form.set('order', JSON.stringify(next.map((section) => section.id)));
    startTransition(async () => {
      const result = await reorderSectionsAction(form);
      if (result?.error) {
        toast('error', result.error);
        setOrder(order); // put it back where it was
      }
    });
  }

  const current = order.find((section) => section.id === editing);

  if (!order.length) {
    return (
      <div className="admin-card px-5 py-12 text-center">
        <p className="text-sm font-medium text-stone-700">Questa pagina è ancora vuota.</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-stone-500">
          Aggiungi la prima sezione con il bottone qui sotto: di solito si parte da un Hero.
        </p>
      </div>
    );
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext items={order.map((section) => section.id)} strategy={verticalListSortingStrategy}>
          <ul className="space-y-2">
            {order.map((section, index) => (
              <Row
                key={section.id}
                section={section}
                index={index}
                total={order.length}
                pageId={pageId}
                busy={pending}
                onEdit={() => setEditing(section.id)}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      {current && (
        <SectionEditor
          key={current.id}
          pageId={pageId}
          section={current}
          catalogues={catalogues}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}
