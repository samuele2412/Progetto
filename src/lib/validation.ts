import { z } from 'zod';
import { areaOptions, cocktailPreferences, guestRanges, maxMessageLength, serviceModes } from './form-options';
import { locales } from './i18n';

/**
 * Server-side validation for the public request form.
 *
 * Error messages are keyed, not literal: the client maps the key to Italian or
 * English so the API never has to guess the visitor's language.
 */
const phonePattern = /^[+]?[\d\s().-]{7,20}$/;

export const eventRequestSchema = z.object({
  name: z.string().trim().min(2, 'name_short').max(160, 'name_long'),
  email: z.string().trim().toLowerCase().email('email_invalid').max(255),
  phone: z.string().trim().regex(phonePattern, 'phone_invalid'),
  prefersWhatsapp: z.boolean().default(true),

  eventDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'date_invalid')
    .refine((value) => {
      const date = new Date(`${value}T12:00:00Z`);
      if (Number.isNaN(date.getTime())) return false;
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      const twoYears = new Date(today);
      twoYears.setUTCFullYear(twoYears.getUTCFullYear() + 2);
      return date >= today && date <= twoYears;
    }, 'date_out_of_range')
    .optional()
    .or(z.literal('')),
  dateFlexible: z.boolean().default(false),

  eventTypeSlug: z.string().trim().min(1, 'event_type_required').max(80),
  area: z.enum(areaOptions, { message: 'area_required' }),
  venueNote: z.string().trim().max(200).default(''),
  guestsRange: z.enum(guestRanges, { message: 'guests_required' }),
  packageSlug: z.string().trim().max(80).default(''),
  serviceMode: z.enum(serviceModes).default('full_service'),
  preferences: z.array(z.enum(cocktailPreferences)).max(6).default([]),
  message: z.string().trim().max(maxMessageLength, 'message_long').default(''),

  locale: z.enum(locales).default('it'),
  consentPrivacy: z.literal(true, { message: 'consent_required' }),

  // Anti-spam, never persisted.
  company: z.string().max(0, 'spam_detected').optional(),
  elapsedMs: z.coerce.number().int().nonnegative().optional(),
  turnstileToken: z.string().optional(),

  source: z
    .object({
      utmSource: z.string().max(120).optional(),
      utmMedium: z.string().max(120).optional(),
      utmCampaign: z.string().max(160).optional(),
      utmTerm: z.string().max(160).optional(),
      utmContent: z.string().max(160).optional(),
      referrer: z.string().max(300).optional(),
      landingPath: z.string().max(300).optional(),
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
