import 'server-only';
import { env, turnstileEnabled } from './env';

/**
 * Cloudflare Turnstile verification. Optional: with no keys configured the
 * form still relies on the honeypot, the timing check and the rate limiter,
 * which is a reasonable posture for a low-traffic site that must not annoy
 * genuine visitors. Turn it on if the spam ever becomes real.
 */
export async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  if (!turnstileEnabled) return true;
  if (!token) return false;

  try {
    const body = new URLSearchParams({
      secret: env.TURNSTILE_SECRET_KEY!,
      response: token,
      remoteip: ip,
    });
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(8000),
    });
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch (error) {
    console.error('[turnstile] verification failed:', error);
    // Fail open: a Cloudflare outage must not stop people asking for a quote.
    return true;
  }
}
