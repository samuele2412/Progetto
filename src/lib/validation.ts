import { z } from 'zod';
import { areaOptions, cocktailPreferences, guestRanges, maxMessageLength, serviceModes } from './form-options';
import { locales, todayInSiteZone } from './i18n';

/**
 * Server-side validation for the public request form.
 *
 * Error messages are keyed, not literal: the client maps the key to Italian or
 * English so the API never has to guess the visitor's language.
 */
const phonePattern = /^[+]?[\d\s().-]{7,20}$/;

/**
 * An optional string clipped to a maximum instead of rejected for length.
 * `.optional()` comes last so the key itself stays optional in the output type.
 */
const trimmedTo = (max: number) =>
  z
    .string()
    .transform((value) => value.trim().slice(0, max) || undefined)
    .optional();

export const eventRequestSchema = z.object({
  name: z.string().trim().min(2, 'name_short').max(160, 'name_long'),
  email: z.string().trim().toLowerCase().email('email_invalid').max(255),
  phone: z.string().trim().regex(phonePattern, 'phone_invalid'),
  prefersWhatsapp: z.boolean().default(true),

  /**
   * An empty string means "not given" and is accepted; anything else has to be
   * a plausible date. Written as one chain with an early return rather than
   * `.or(z.literal(''))`, because a union reports its own "Invalid input"
   * instead of the branch's message — so `date_out_of_range` never reached the
   * client and the visitor was told to "check the highlighted fields".
   */
  eventDate: z
    .string()
    .trim()
    .default('')
    .superRefine((value, ctx) => {
      if (value === '') return;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        ctx.addIssue({ code: 'custom', message: 'date_invalid' });
        return;
      }
      const date = new Date(`${value}T12:00:00Z`);
      if (Number.isNaN(date.getTime())) {
        ctx.addIssue({ code: 'custom', message: 'date_invalid' });
        return;
      }
      // Compared as calendar days in the site's timezone, so the boundary is
      // the same one the visitor's date picker enforced.
      const today = todayInSiteZone();
      const [year, month, day] = today.split('-').map(Number);
      const maxDate = `${year + 2}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      if (value < today || value > maxDate) {
        ctx.addIssue({ code: 'custom', message: 'date_out_of_range' });
      }
    }),
  dateFlexible: z.boolean().default(false),

  eventTypeSlug: z.string().trim().min(1, 'event_type_required').max(80),
  area: z.enum(areaOptions, { message: 'area_required' }),
  venueNote: z.string().trim().max(200).default(''),
  guestsRange: z.enum(guestRanges, { message: 'guests_required' }),
  packageSlug: z.string().trim().max(80).default(''),
  serviceMode: z.enum(serviceModes).default('full_service'),
  isPartner: z.boolean().default(false),
  preferences: z.array(z.enum(cocktailPreferences)).max(6).default([]),
  message: z.string().trim().max(maxMessageLength, 'message_long').default(''),

  locale: z.enum(locales).default('it'),
  consentPrivacy: z.literal(true, { message: 'consent_required' }),

  // Anti-spam, never persisted. The name is deliberately obscure so browser
  // autofill leaves it alone (see the honeypot comment in RequestForm).
  cordialeHp: z.string().max(0, 'spam_detected').optional(),
  elapsedMs: z.coerce.number().int().nonnegative().optional(),
  turnstileToken: z.string().optional(),

  /**
   * Attribution is best-effort: over-long values are truncated, never rejected.
   * Failing a submission because a campaign name was too long loses a lead over
   * a field the visitor cannot see or fix.
   */
  source: z
    .object({
      utmSource: trimmedTo(120),
      utmMedium: trimmedTo(120),
      utmCampaign: trimmedTo(160),
      utmTerm: trimmedTo(160),
      utmContent: trimmedTo(160),
      referrer: trimmedTo(300),
      landingPath: trimmedTo(300),
    })
    .default({}),
});

export type EventRequestInput = z.infer<typeof eventRequestSchema>;

/** Refuses a submission completed impossibly fast — a bot signature. */
export const minimumFillMs = 3000;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('email_invalid'),
  password: z.string().min(8, 'password_short').max(200),
});
