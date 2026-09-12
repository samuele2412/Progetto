import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

/**
 * Flat config, run directly by the `eslint` CLI (`npm run lint`).
 *
 * `next lint` used to be the entry point; it is deprecated and goes away in
 * Next 16, and it quietly applied its own ignore list. Calling eslint straight
 * means that list has to be written down — without it the run linted the
 * esbuild bundles in dist-scripts/ and reported hundreds of problems in
 * vendored code nobody wrote or can fix.
 */
const config = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      // Generated: drizzle migrations, esbuild bundles, and Next's own types.
      'drizzle/**',
      'dist-scripts/**',
      'next-env.d.ts',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
];

export default config;
