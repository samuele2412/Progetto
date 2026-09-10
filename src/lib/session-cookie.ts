/**
 * Name and flags of the session cookie, shared by the middleware gate (edge
 * runtime) and the auth module (node runtime).
 *
 * The policy follows the scheme declared in SITE_URL rather than NODE_ENV:
 *
 *   https://…  → Secure + the `__Host-` prefix, which browsers only accept on a
 *                cookie that is Secure, Path=/ and has no Domain. A look-alike
 *                or compromised subdomain then cannot overwrite the session.
 *   http://…   → a plain cookie, because a browser silently discards a Secure
 *                one over plain HTTP and the panel would loop on the login page
 *                forever. This is what makes the app usable on a LAN address.
 *
 * Deliberately dependency-free: middleware imports this, and pulling the zod
 * schema from lib/env into the edge bundle for one string is not worth it.
 */
const BASE_NAME = 'cordiale_session';
const HOST_PREFIXED = `__Host-${BASE_NAME}`;

/** True when the public origin is https, so Secure cookies actually arrive. */
export function usesSecureCookies(): boolean {
  return (process.env.SITE_URL ?? '').startsWith('https://');
}

export function sessionCookieName(): string {
  return usesSecureCookies() ? HOST_PREFIXED : BASE_NAME;
}

/**
 * Both possible names. The middleware only needs to know whether *some* session
 * cookie is present before letting a request through to the real check, so it
 * looks for either instead of having to resolve the environment identically in
 * two runtimes.
 */
export const SESSION_COOKIE_NAMES = [HOST_PREFIXED, BASE_NAME] as const;
