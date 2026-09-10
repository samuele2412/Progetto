#!/bin/sh
# Runs before the web server on every container start.
#   1. wait for Postgres
#   2. apply any pending migration (no-op when up to date)
#   3. seed the catalogue the first time only
#   4. create the first administrator if ADMIN_EMAIL/ADMIN_PASSWORD are set
set -e

echo "[entrypoint] waiting for the database…"
attempt=0
until node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1, connectionTimeoutMillis: 3000 });
pool.query('select 1').then(() => pool.end()).then(() => process.exit(0)).catch(() => process.exit(1));
" 2>/dev/null; do
  attempt=$((attempt + 1))
  if [ "$attempt" -ge 40 ]; then
    echo "[entrypoint] database unreachable after 40 attempts — giving up" >&2
    exit 1
  fi
  sleep 2
done
echo "[entrypoint] database is up"

echo "[entrypoint] applying migrations…"
node dist-scripts/migrate.cjs

# Plants the initial content on the very first boot only. The script keeps its
# own marker in the database, so this is a no-op from the second start onwards
# and content deleted from the panel never comes back.
if [ "${SEED_ON_START:-true}" = "true" ]; then
  echo "[entrypoint] planting initial content if this is the first boot…"
  node dist-scripts/seed.cjs || echo "[entrypoint] seed skipped"
fi

# Creates the account if it is missing. It does NOT reset an existing password:
# that would undo a password changed from the panel on every restart. Use
# ADMIN_RESET_PASSWORD=true, or run the script by hand, to force one.
if [ -n "${ADMIN_EMAIL:-}" ] && [ -n "${ADMIN_PASSWORD:-}" ]; then
  echo "[entrypoint] ensuring the administrator account exists…"
  node dist-scripts/create-admin.cjs || echo "[entrypoint] admin creation skipped"
fi

echo "[entrypoint] starting the web server"
exec "$@"
