/**
 * Typed, validated environment. Import this instead of touching `process.env`
 * so a missing secret fails loudly at boot rather than silently at runtime.
 */
import { z } from 'zod';

const bool = (fallback: boolean) =>
  z
    .string()
    .optional()
    .transform((v) => (v === undefined || v === '' ? fallback : /^(1|true|yes|on)$/i.test(v)));

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  /** Canonical public origin, e.g. https://cordialeroma.it — no trailing slash. */
  SITE_URL: z
    .string()
    .url()
    .default('http://localhost:3000')
    .transform((v) => v.replace(/\/$/, '')),

  /** 32+ random bytes. Generate with: openssl rand -base64 48 */
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 characters'),
  SESSION_TTL_HOURS: z.coerce.number().int().positive().default(12),

  /** Salt for the one-way IP hash used by the anti-spam throttle. */
  IP_HASH_SALT: z.string().min(16).default('change-me-ip-salt-000000000000000'),

  /**
   * The single request header the rate limiter reads the client IP from.
   * Must name a header written by the proxy in front of the app — anything a
   * client can set itself turns the throttle off. 'none' shares one bucket.
   */
  TRUSTED_IP_HEADER: z
    .enum(['cf-connecting-ip', 'x-forwarded-for', 'x-real-ip', 'none'])
    .default('cf-connecting-ip'),

  // --- SMTP (optional: without it the site still records requests) ---
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_SECURE: bool(false),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  MAIL_FROM: z.string().optional(),
  /** Where new-request notifications are delivered. */
  NOTIFY_EMAIL: z.string().optional(),

  // --- Anti-spam (optional) ---
  TURNSTILE_SITE_KEY: z.string().optional(),
  TURNSTILE_SECRET_KEY: z.string().optional(),

  // --- Privacy-first analytics (optional) ---
  ANALYTICS_SCRIPT_URL: z.string().optional(),
  ANALYTICS_WEBSITE_ID: z.string().optional(),

  /** Absolute path of the uploads volume inside the container. */
  UPLOAD_DIR: z.string().default('./public/uploads'),
  MAX_UPLOAD_MB: z.coerce.number().positive().default(6),

  /** Requests accepted per IP per hour before the form starts refusing. */
  RATE_LIMIT_PER_HOUR: z.coerce.number().int().positive().default(5),
});

/**
 * During `next build` the modules that read this file are imported, but no real
 * configuration exists yet — the values come from the environment when the
 * container starts. Rather than baking placeholder secrets into the image (and
 * having Docker warn about them), the build phase gets throwaway values while
 * runtime stays strict: a missing secret still fails loudly on boot.
 */
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

const buildPlaceholders = {
  DATABASE_URL: 'postgresql://build:build@127.0.0.1:5432/build',
  SESSION_SECRET: 'build-phase-placeholder-value-not-used-at-runtime',
  IP_HASH_SALT: 'build-phase-placeholder-salt',
} as const;

function read() {
  const source = isBuildPhase ? { ...buildPlaceholders, ...process.env } : process.env;
  const parsed = schema.safeParse(source);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`);
    throw new Error(`Invalid environment configuration:\n${issues.join('\n')}`);
  }
  return parsed.data;
}

export const env = read();

export const mailEnabled = Boolean(env.SMTP_HOST && env.NOTIFY_EMAIL);
export const turnstileEnabled = Boolean(env.TURNSTILE_SITE_KEY && env.TURNSTILE_SECRET_KEY);
export const analyticsEnabled = Boolean(env.ANALYTICS_SCRIPT_URL);
