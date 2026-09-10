import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    // Matches docker-compose.dev.yml, so `drizzle-kit` works out of the box
    // against the development database even without a .env file.
    url: process.env.DATABASE_URL ?? 'postgresql://cordiale:cordiale@localhost:5432/cordiale',
  },
  strict: true,
  verbose: true,
} satisfies Config;
