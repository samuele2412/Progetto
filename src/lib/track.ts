/**
 * Conversion events, sent to the self-hosted, cookieless analytics when it is
 * configured (see docs/10-analytics.md) and a no-op otherwise.
 *
 * The events say what someone tried to do — open the form, tap WhatsApp — not
 * who they are: no names, numbers or addresses are ever attached. The source
 * of truth for requests stays the database; an ad blocker can stop an event,
 * it cannot stop a saved request.
 */
type Umami = { track: (event: string, data?: Record<string, string | number>) => void };

export function track(event: string, data?: Record<string, string | number>): void {
  if (typeof window === 'undefined') return;
  const umami = (window as unknown as { umami?: Umami }).umami;
  try {
    umami?.track(event, data);
  } catch {
    // Analytics must never break the page it is measuring.
  }
}
