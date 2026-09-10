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

/** Requests from the public form: N per IP per hour. */
export function limitEventRequest(ipHash: string): RateLimitResult {
  return rateLimit(`req:${ipHash}`, env.RATE_LIMIT_PER_HOUR, 3600);
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

  // X-Forwarded-For is a chain: the client-most entry is the first one, and it
  // is only meaningful because the trusted proxy is the one appending to it.
  const first = value.split(',')[0]?.trim();
  return first && first.length <= 45 ? first : 'unknown';
}
