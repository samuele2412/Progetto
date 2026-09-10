/**
 * Content-Security-Policy built per request around a fresh nonce.
 *
 * Runs in the edge runtime (middleware), so it may only use Web APIs.
 *
 * The policy is nonce + `strict-dynamic` rather than a host allow-list: Next
 * loads its chunks from script tags it injects at runtime, and `strict-dynamic`
 * extends trust from the nonced bootstrap to whatever it loads — which also
 * covers the two optional third-party scripts (Turnstile, analytics) without
 * having to widen the policy for everyone who does not use them.
 */
export function generateNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...bytes));
}

export function buildCsp(
  nonce: string,
  options: { upgradeInsecureRequests: boolean; analyticsOrigin?: string },
): string {
  const turnstile = 'https://challenges.cloudflare.com';

  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    // 'unsafe-inline' is ignored by browsers that honour the nonce; it is kept
    // only so older ones still load the app rather than showing a blank page.
    'script-src': ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'", "'unsafe-inline'", 'https:'],
    // React writes real inline style attributes (gradients, transforms), which
    // cannot carry a nonce. Style injection is not a meaningful escalation path.
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'blob:'],
    'font-src': ["'self'"],
    'connect-src': ["'self'", turnstile, ...(options.analyticsOrigin ? [options.analyticsOrigin] : [])],
    'frame-src': [turnstile],
    'media-src': ["'self'"],
    'object-src': ["'none'"],
    'base-uri': ["'none'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'self'"],
    'manifest-src': ["'self'"],
  };

  const policy = Object.entries(directives)
    .map(([name, values]) => `${name} ${values.join(' ')}`)
    .join('; ');

  /**
   * `upgrade-insecure-requests` is tied to the scheme the site is actually
   * served on, not to NODE_ENV. On a plain-http origin it rewrites every
   * subresource — and the login form's action — to https, which the server does
   * not speak: the panel then fails with "Refused to send form data … violates
   * form-action 'self'". Harmless behind Cloudflare, fatal on a LAN address.
   */
  return options.upgradeInsecureRequests ? `${policy}; upgrade-insecure-requests` : policy;
}
