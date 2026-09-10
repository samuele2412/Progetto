/**
 * The session cookie's name, shared by the middleware gate and the auth module.
 *
 * In production it carries the `__Host-` prefix, which browsers only accept on
 * a cookie that is Secure, Path=/ and has no Domain — so a compromised or
 * look-alike subdomain cannot overwrite the panel's session cookie. The prefix
 * is dropped in development because it also requires HTTPS, which localhost
 * does not have.
 *
 * Kept in its own module so both runtimes (node and edge) can import it
 * without pulling in bcrypt, jose or the database client.
 */
export const SESSION_COOKIE =
  process.env.NODE_ENV === 'production' ? '__Host-cordiale_session' : 'cordiale_session';
