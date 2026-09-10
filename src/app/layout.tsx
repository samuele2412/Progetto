import type { ReactNode } from 'react';

/**
 * Pass-through root layout.
 *
 * `<html>` and `<body>` are rendered by the two real roots — `[locale]/layout`
 * for the public site and `admin/layout` for the panel — because the public
 * site needs a per-locale `lang` attribute and the admin needs a completely
 * different colour scheme on `<body>`.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
