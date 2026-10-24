/**
 * Light and dark.
 *
 * The visitor chooses with the sun and moon in the header, and the choice is
 * remembered in a first-party cookie that holds only the word "light" or
 * "dark" (listed in the cookie policy, src/content/legal.ts). The server reads
 * it and renders <html data-theme="…">, so the page arrives already in the
 * right colours: no flash of the other theme, and no inline script to clear
 * with the nonce CSP.
 *
 * Shared by the layout (server) and the switch (client), so nothing here may
 * import server-only code.
 */
export type Theme = 'light' | 'dark';

export const THEME_COOKIE = 'cordiale_theme';

/** The house style: the bar at night. */
export const defaultTheme: Theme = 'dark';

/** The browser bar for each theme: the page colour, `--color-paper`. */
export const themeColor: Record<Theme, string> = {
  light: '#f5f0e6',
  dark: '#171612',
};

export function parseTheme(value: string | undefined): Theme {
  return value === 'light' || value === 'dark' ? value : defaultTheme;
}
