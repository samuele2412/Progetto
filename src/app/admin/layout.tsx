import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Pannello — Cordiale',
  // The panel must never be indexed, whatever robots.txt says.
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light',
  themeColor: '#f6f5f3',
};

/**
 * The admin gets its own document root: a light colour scheme and no site
 * chrome. Authentication is enforced one level down, in the (panel) layout, so
 * that /admin/login can share this shell without being behind the gate.
 */
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <body className="admin-shell">{children}</body>
    </html>
  );
}
