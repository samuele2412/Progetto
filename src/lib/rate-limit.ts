import 'server-only';
import { createHash } from 'node:crypto';
import { env } from './env';

/**
 * In-memory fixed-window limiter.
 *
 * Deliberately not Redis: the app runs as a single container behind Cloudflare,
 * so a per-process counter is both sufficient and one less thing to operate.
 * If the deployment ever scales to several replicas, swap the Map for a shared
 * store — the interface below is the only thing that would change.
 */
type Bucket = { count: number; resetAt: number };

const globalForLimiter = globalThis as unknown as { __cordialeBuckets?: Map<string, Bucket> };
const buckets = globalForLimiter.__cordialeBuckets ?? new Map<string, Bucket>();
globalForLimiter.__cordialeBuckets = buckets;

function sweep(now: number) {
  if (buckets.size < 5_000) return;
  for (const [key, bucket] of buckets) if (bucket.resetAt <= now) buckets.delete(key);
}

export type RateLimitResult = { allowed: boolean; remaining: number; retryAfterSeconds: number };

function describe(bucket: Bucket | undefined, limit: number, now: number): RateLimitResult {
  const count = bucket && bucket.resetAt > now ? bucket.count : 0;
  const allowed = count < limit;
  return {
    allowed,
    remaining: Math.max(0, limit - count),
    retryAfterSeconds: allowed || !bucket ? 0 : Math.ceil((bucket.resetAt - now) / 1000),
  };
}

/** Reads the budget without spending any of it. */
export function peekLimit(key: string, limit: number): RateLimitResult {
  const now = Date.now();
  return describe(buckets.get(key), limit, now);
}

/** Spends one unit of the budget and reports what is left. */
export function rateLimit(key: string, limit: number, windowSeconds: number): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  bucket.count += 1;
  const allowed = bucket.count <= limit;
  return {
    allowed,
    remaining: Math.max(0, limit - bucket.count),
    retryAfterSeconds: allowed ? 0 : Math.ceil((bucket.resetAt - now) / 1000),
  };
}

/**
 * The public form has two budgets, because they protect different things.
 *
 * The *attempt* budget is spent by every call, valid or not, and exists to keep
 * the endpoint from being hammered. Charging only successful submissions — as
 * this did briefly — left malformed traffic completely unthrottled.
 *
 * The *success* budget is spent only once a request has been stored, and is the
 * one the visitor feels: a typo in an email address must not cost somebody one
 * of five attempts in an hour.
 */
const ATTEMPTS_PER_HOUR = 60;

export function chargeAttempt(ipHash: string): RateLimitResult {
  return rateLimit(`attempt:${ipHash}`, ATTEMPTS_PER_HOUR, 3600);
}

export function checkEventRequest(ipHash: string): RateLimitResult {
  return peekLimit(`req:${ipHash}`, env.RATE_LIMIT_PER_HOUR);
}

export function consumeEventRequest(ipHash: string): RateLimitResult {
  return rateLimit(`req:${ipHash}`, env.RATE_LIMIT_PER_HOUR, 3600);
}

/**
 * The acknowledgement email goes to an address the sender chose, so the form is
 * a way to make our server mail a stranger. The content carries no attacker
 * text beyond a sanitised first name, and this caps how often any one address
 * can be mailed regardless of which IP asked for it.
 */
export function limitAcknowledgement(emailHash: string): RateLimitResult {
  return rateLimit(`ack:${emailHash}`, 3, 86_400);
}

/** Admin login: slow enough to make guessing pointless, fast enough to not annoy. */
export function limitLogin(ipHash: string): RateLimitResult {
  return rateLimit(`login:${ipHash}`, 10, 900);
}

/**
 * One-way, salted hash of the caller's IP. We never store the address itself —
 * only something stable enough to throttle with (see docs/09-gdpr.md).
 */
export function hashIp(ip: string): string {
  return createHash('sha256').update(`${env.IP_HASH_SALT}:${ip}`).digest('hex');
}

/**
 * Resolves the caller's IP from exactly one header, named by TRUSTED_IP_HEADER.
 *
 * Reading whichever forwarding header happens to be present is a hole, not a
 * convenience: any client can send `X-Forwarded-For: <random>` and get a fresh
 * rate-limit bucket on every request, which defeats both the anti-spam throttle
 * and the login throttle. Only a header written by a proxy we actually sit
 * behind can be trusted, so the deployment has to say which one that is.
 *
 * The default (`cf-connecting-ip`) matches the documented Cloudflare Tunnel
 * setup. Set TRUSTED_IP_HEADER=none when nothing sits in front: every caller
 * then shares one bucket, which throttles too much rather than not at all.
 */
export function clientIp(headers: Headers): string {
  const header = env.TRUSTED_IP_HEADER;
  if (header === 'none') return 'direct';

  const value = headers.get(header);
  if (!value) return 'unknown';

  /**
   * X-Forwarded-For is a chain and the client writes the left-hand end of it:
   * anything a request arrives with was, by definition, supplied by the caller.
   * The only entry we can stand behind is the one *our* proxy appended, which
   * is the rightmost. Taking the first meant a made-up header handed out a
   * fresh counter on every request and the throttle did nothing.
   *
   * Single-value headers (cf-connecting-ip, x-real-ip) have one entry, so the
   * same rule reads them correctly too.
   */
  const parts = value.split(',');
  const last = parts[parts.length - 1]?.trim();
  return last && last.length <= 45 ? last : 'unknown';
}
