'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import type { Dictionary } from '@/lib/dictionary';
import { errorMessage } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n';
import {
  areaLabels,
  areaOptions,
  cocktailPreferenceLabels,
  cocktailPreferences,
  guestRangeLabels,
  guestRanges,
  maxMessageLength,
  serviceModeLabels,
  serviceModes,
  suggestedPackageFor,
  type AreaOption,
  type CocktailPreference,
  type GuestRange,
  type ServiceMode,
} from '@/lib/form-options';
import { cn } from '@/lib/utils';
import { captureSource } from './source';

export type RequestFormOption = { slug: string; label: string; hint?: string };

type Props = {
  locale: Locale;
  copy: Dictionary;
  eventTypes: RequestFormOption[];
  packages: RequestFormOption[];
  privacyHref: string;
  thanksHref: string;
  submitLabel: string;
  reassurance: string;
  turnstileSiteKey?: string;
  initialEventType?: string;
  initialPackage?: string;
};

type Values = {
  eventTypeSlug: string;
  eventDate: string;
  dateFlexible: boolean;
  area: AreaOption | '';
  guestsRange: GuestRange | '';
  venueNote: string;
  packageSlug: string;
  serviceMode: ServiceMode;
  preferences: CocktailPreference[];
  message: string;
  name: string;
  phone: string;
  email: string;
  prefersWhatsapp: boolean;
  consentPrivacy: boolean;
};

const emptyValues: Values = {
  eventTypeSlug: '',
  eventDate: '',
  dateFlexible: false,
  area: '',
  guestsRange: '',
  venueNote: '',
  packageSlug: '',
  serviceMode: 'full_service',
  preferences: [],
  message: '',
  name: '',
  phone: '',
  email: '',
  prefersWhatsapp: true,
  consentPrivacy: false,
};

const STEPS = 3;

/**
 * The request form.
 *
 * Three short steps rather than one long page: on a phone, a twenty-field form
 * reads as work and gets abandoned. Each step validates only its own fields, so
 * nobody is told off for something they have not reached yet, and the whole
 * thing degrades to a normal POST-shaped payload the server re-validates from
 * scratch.
 */
export function RequestForm(props: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>({
    ...emptyValues,
    eventTypeSlug: props.initialEventType ?? '',
    packageSlug: props.initialPackage ?? '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [touchedPackage, setTouchedPackage] = useState(Boolean(props.initialPackage));

  const startedAt = useRef(Date.now());
  const headingRef = useRef<HTMLHeadingElement>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const [turnstileToken, setTurnstileToken] = useState('');

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const maxDate = useMemo(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 2);
    return date.toISOString().slice(0, 10);
  }, []);

  useEffect(() => {
    captureSource();
  }, []);

  // Move focus to the new step so screen readers and keyboards keep up.
  useEffect(() => {
    if (step > 0) headingRef.current?.focus();
  }, [step]);

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  /** Auto-suggests a package from the guest count until the user picks one. */
  function chooseGuests(range: GuestRange) {
    set('guestsRange', range);
    if (!touchedPackage) {
      setValues((current) => ({ ...current, guestsRange: range, packageSlug: suggestedPackageFor[range] }));
    }
  }

  function validateStep(index: number): boolean {
    const next: Record<string, string> = {};

    if (index === 0) {
      if (!values.eventTypeSlug) next.eventTypeSlug = errorMessage('event_type_required', props.locale);
      if (!values.dateFlexible && !values.eventDate) next.eventDate = errorMessage('date_invalid', props.locale);
      if (values.eventDate && (values.eventDate < today || values.eventDate > maxDate)) {
        next.eventDate = errorMessage('date_out_of_range', props.locale);
      }
      if (!values.area) next.area = errorMessage('area_required', props.locale);
      if (!values.guestsRange) next.guestsRange = errorMessage('guests_required', props.locale);
    }

    if (index === 2) {
      if (values.name.trim().length < 2) next.name = errorMessage('name_short', props.locale);
      if (!/^[+]?[\d\s().-]{7,20}$/.test(values.phone.trim())) next.phone = errorMessage('phone_invalid', props.locale);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
        next.email = errorMessage('email_invalid', props.locale);
      }
      if (!values.consentPrivacy) next.consentPrivacy = errorMessage('consent_required', props.locale);
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    if (!validateStep(step)) return;
    setFormError(null);
    setStep((current) => Math.min(current + 1, STEPS - 1));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting) return;
    if (!validateStep(2)) return;

    setSubmitting(true);
    setFormError(null);

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          area: values.area || undefined,
          guestsRange: values.guestsRange || undefined,
          eventDate: values.dateFlexible ? '' : values.eventDate,
          locale: props.locale,
          company: honeypot.current?.value ?? '',
          elapsedMs: Date.now() - startedAt.current,
          turnstileToken: turnstileToken || undefined,
          source: captureSource(),
        }),
      });

      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        reference?: string;
        error?: string;
        fields?: Record<string, string>;
      };

      if (!response.ok || !result.ok) {
        if (result.fields) {
          setErrors(
            Object.fromEntries(
              Object.entries(result.fields).map(([field, key]) => [field, errorMessage(key, props.locale)]),
            ),
          );
          // Send the visitor back to the step that actually holds the problem.
          const contactFields = ['name', 'phone', 'email', 'consentPrivacy'];
          const firstStepFields = ['eventTypeSlug', 'eventDate', 'area', 'guestsRange'];
          const bad = Object.keys(result.fields);
          if (bad.some((field) => firstStepFields.includes(field))) setStep(0);
          else if (bad.some((field) => contactFields.includes(field))) setStep(2);
        }
        setFormError(errorMessage(result.error ?? 'server', props.locale));
        setSubmitting(false);
        return;
      }

      router.push(`${props.thanksHref}?ref=${encodeURIComponent(result.reference ?? '')}`);
    } catch {
      setFormError(errorMessage('network', props.locale));
      setSubmitting(false);
    }
  }

  const stepTitles = [props.copy.form.stepEvent, props.copy.form.stepDetails, props.copy.form.stepContact];

  return (
    <form onSubmit={handleSubmit} noValidate className="card p-6 md:p-9">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-bone-500">
          <span>
            {props.copy.form.step} {step + 1} {props.copy.form.of} {STEPS}
          </span>
          <span className="text-brass-400">{stepTitles[step]}</span>
        </div>
        <div className="mt-3 flex gap-1.5" role="progressbar" aria-valuemin={1} aria-valuemax={STEPS} aria-valuenow={step + 1}>
          {Array.from({ length: STEPS }, (_, index) => (
            <span
              key={index}
              className={cn(
                'h-1 flex-1 rounded-full transition-colors duration-300',
                index <= step ? 'bg-brass-500' : 'bg-ink-700',
              )}
            />
          ))}
        </div>
      </div>

      <h2 ref={headingRef} tabIndex={-1} className="sr-only">
        {stepTitles[step]}
      </h2>

      {/* Honeypot: hidden from people, irresistible to naive bots. */}
      <div aria-hidden className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor="company">Company</label>
        <input ref={honeypot} id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* ---------------- STEP 1 ---------------- */}
      {step === 0 && (
        <div className="space-y-7">
          <fieldset>
            <legend className="field-label">{props.copy.form.eventType}</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {props.eventTypes.map((option) => (
                <label key={option.slug} className="relative block cursor-pointer">
                  <input
                    type="radio"
                    name="eventTypeSlug"
                    value={option.slug}
                    checked={values.eventTypeSlug === option.slug}
                    onChange={() => set('eventTypeSlug', option.slug)}
                    className="peer sr-only"
                  />
                  <span className="chip">{option.label}</span>
                </label>
              ))}
            </div>
            {errors.eventTypeSlug && <p className="field-error">{errors.eventTypeSlug}</p>}
          </fieldset>

          <div>
            <label htmlFor="eventDate" className="field-label">
              {props.copy.form.eventDate}
            </label>
            <input
              id="eventDate"
              name="eventDate"
              type="date"
              className="field"
              value={values.eventDate}
              min={today}
              max={maxDate}
              disabled={values.dateFlexible}
              aria-invalid={Boolean(errors.eventDate)}
              aria-describedby="date-note"
              onChange={(event) => set('eventDate', event.target.value)}
            />
            <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-sm text-bone-400">
              <input
                type="checkbox"
                checked={values.dateFlexible}
                onChange={(event) => {
                  set('dateFlexible', event.target.checked);
                  if (event.target.checked) set('eventDate', '');
                }}
                className="h-4 w-4 accent-[var(--color-brass-500)]"
              />
              {props.copy.form.dateFlexible}
            </label>
            {errors.eventDate && <p className="field-error">{errors.eventDate}</p>}
            <p id="date-note" className="mt-2 text-xs text-bone-500">
              {props.copy.form.dateNote}
            </p>
          </div>

          <div>
            <label htmlFor="area" className="field-label">
              {props.copy.form.area}
            </label>
            <select
              id="area"
              name="area"
              className="field"
              value={values.area}
              aria-invalid={Boolean(errors.area)}
              onChange={(event) => set('area', event.target.value as AreaOption)}
            >
              <option value="">—</option>
              {areaOptions.map((option) => (
                <option key={option} value={option}>
                  {areaLabels[option][props.locale]}
                </option>
              ))}
            </select>
            {errors.area && <p className="field-error">{errors.area}</p>}
          </div>

          <fieldset>
            <legend className="field-label">{props.copy.form.guests}</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {guestRanges.map((range) => (
                <label key={range} className="relative block cursor-pointer">
                  <input
                    type="radio"
                    name="guestsRange"
                    value={range}
                    checked={values.guestsRange === range}
                    onChange={() => chooseGuests(range)}
                    className="peer sr-only"
                  />
                  <span className="chip">{guestRangeLabels[range][props.locale]}</span>
                </label>
              ))}
            </div>
            {errors.guestsRange && <p className="field-error">{errors.guestsRange}</p>}
          </fieldset>
        </div>
      )}

      {/* ---------------- STEP 2 ---------------- */}
      {step === 1 && (
        <div className="space-y-7">
          <fieldset>
            <legend className="field-label">{props.copy.form.package}</legend>
            <p className="-mt-1 mb-3 text-xs text-bone-500">{props.copy.form.packageHint}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {props.packages.map((option) => (
                <label key={option.slug} className="relative block cursor-pointer">
                  <input
                    type="radio"
                    name="packageSlug"
                    value={option.slug}
                    checked={values.packageSlug === option.slug}
                    onChange={() => {
                      setTouchedPackage(true);
                      set('packageSlug', option.slug);
                    }}
                    className="peer sr-only"
                  />
                  <span className="chip !flex-col !items-start !gap-0.5 !py-3 text-left">
                    <span className="font-medium">{option.label}</span>
                    {option.hint && <span className="text-xs text-bone-500">{option.hint}</span>}
                  </span>
                </label>
              ))}
              <label className="relative block cursor-pointer">
                <input
                  type="radio"
                  name="packageSlug"
                  value=""
                  checked={values.packageSlug === ''}
                  onChange={() => {
                    setTouchedPackage(true);
                    set('packageSlug', '');
                  }}
                  className="peer sr-only"
                />
                <span className="chip !flex-col !items-start !gap-0.5 !py-3 text-left">
                  <span className="font-medium">{props.copy.form.packageUndecided}</span>
                </span>
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend className="field-label">{props.copy.form.serviceMode}</legend>
            <div className="space-y-2">
              {serviceModes.map((mode) => (
                <label key={mode} className="relative block cursor-pointer">
                  <input
                    type="radio"
                    name="serviceMode"
                    value={mode}
                    checked={values.serviceMode === mode}
                    onChange={() => set('serviceMode', mode)}
                    className="peer sr-only"
                  />
                  <span className="chip !justify-start text-left">{serviceModeLabels[mode][props.locale]}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="field-label">{props.copy.form.preferences}</legend>
            <p className="-mt-1 mb-3 text-xs text-bone-500">{props.copy.form.preferencesHint}</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {cocktailPreferences.map((preference) => (
                <label key={preference} className="relative block cursor-pointer">
                  <input
                    type="checkbox"
                    name="preferences"
                    value={preference}
                    checked={values.preferences.includes(preference)}
                    onChange={(event) =>
                      set(
                        'preferences',
                        event.target.checked
                          ? [...values.preferences, preference]
                          : values.preferences.filter((item) => item !== preference),
                      )
                    }
                    className="peer sr-only"
                  />
                  <span className="chip">{cocktailPreferenceLabels[preference][props.locale]}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="venueNote" className="field-label">
              {props.copy.form.venueNote}
            </label>
            <input
              id="venueNote"
              name="venueNote"
              type="text"
              className="field"
              maxLength={200}
              value={values.venueNote}
              onChange={(event) => set('venueNote', event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="message" className="field-label">
              {props.copy.form.message} <span className="text-bone-500">({props.copy.form.optional})</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className="field resize-y"
              maxLength={maxMessageLength}
              placeholder={props.copy.form.messagePlaceholder}
              value={values.message}
              onChange={(event) => set('message', event.target.value)}
            />
            <p className="mt-1 text-right text-xs text-bone-500">
              {values.message.length}/{maxMessageLength}
            </p>
          </div>
        </div>
      )}

      {/* ---------------- STEP 3 ---------------- */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="field-label">
              {props.copy.form.name}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              className="field"
              value={values.name}
              aria-invalid={Boolean(errors.name)}
              onChange={(event) => set('name', event.target.value)}
            />
            {errors.name && <p className="field-error">{errors.name}</p>}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="phone" className="field-label">
                {props.copy.form.phone}
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                className="field"
                placeholder="+39 …"
                value={values.phone}
                aria-invalid={Boolean(errors.phone)}
                onChange={(event) => set('phone', event.target.value)}
              />
              {errors.phone && <p className="field-error">{errors.phone}</p>}
            </div>
            <div>
              <label htmlFor="email" className="field-label">
                {props.copy.form.email}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                className="field"
                value={values.email}
                aria-invalid={Boolean(errors.email)}
                onChange={(event) => set('email', event.target.value)}
              />
              {errors.email && <p className="field-error">{errors.email}</p>}
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-bone-300">
            <input
              type="checkbox"
              checked={values.prefersWhatsapp}
              onChange={(event) => set('prefersWhatsapp', event.target.checked)}
              className="h-4 w-4 accent-[var(--color-brass-500)]"
            />
            {props.copy.form.prefersWhatsapp}
          </label>

          <label className="flex cursor-pointer items-start gap-2.5 text-sm text-bone-300">
            <input
              type="checkbox"
              checked={values.consentPrivacy}
              onChange={(event) => set('consentPrivacy', event.target.checked)}
              aria-invalid={Boolean(errors.consentPrivacy)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-brass-500)]"
            />
            <span>
              {props.copy.form.consent.replace(props.copy.form.consentLink, '')}
              <a
                href={props.privacyHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brass-300 underline underline-offset-2"
              >
                {props.copy.form.consentLink}
              </a>
            </span>
          </label>
          {errors.consentPrivacy && <p className="field-error">{errors.consentPrivacy}</p>}

          {props.turnstileSiteKey && (
            <>
              <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
              <div
                className="cf-turnstile"
                data-sitekey={props.turnstileSiteKey}
                data-theme="dark"
                data-callback="onTurnstileSuccess"
                ref={(node) => {
                  if (!node) return;
                  (window as unknown as Record<string, unknown>).onTurnstileSuccess = (token: string) =>
                    setTurnstileToken(token);
                }}
              />
            </>
          )}

          <p className="text-xs leading-relaxed text-bone-500">{props.reassurance}</p>
        </div>
      )}

      {formError && (
        <p role="alert" className="mt-6 rounded-lg border border-bitter-500/40 bg-bitter-500/10 p-3 text-sm text-bone-200">
          {formError}
        </p>
      )}

      {/* Navigation */}
      <div className="mt-9 flex flex-col-reverse gap-3 sm:flex-row">
        {step > 0 && (
          <button type="button" onClick={() => setStep((current) => current - 1)} className="btn btn-ghost sm:w-auto">
            {props.copy.form.previous}
          </button>
        )}
        {step < STEPS - 1 ? (
          <button type="button" onClick={goNext} className="btn btn-primary flex-1">
            {props.copy.form.next}
          </button>
        ) : (
          <button type="submit" disabled={submitting} className="btn btn-primary flex-1">
            {submitting ? props.copy.form.sending : props.submitLabel}
          </button>
        )}
      </div>
    </form>
  );
}
