#!/usr/bin/env bash
# =============================================================================
# Restores a backup produced by scripts/backup.sh.
#
#   ./scripts/restore.sh backups/cordiale-20260115-030000.tar.gz
#
# THIS OVERWRITES THE CURRENT DATABASE. It asks for confirmation first and
# takes a safety dump of the current state before doing anything.
# =============================================================================
set -euo pipefail

cd "$(dirname "$0")/.."
# shellcheck source=scripts/lib/env.sh
. ./scripts/lib/env.sh
ARCHIVE="${1:-}"

die() { printf '\n\033[31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

[ -n "$ARCHIVE" ] || die "Usage: ./scripts/restore.sh <archive.tar.gz>"
[ -f "$ARCHIVE" ] || die "Archive not found: $ARCHIVE"
[ -f .env ] || die ".env is missing."

POSTGRES_USER="$(env_get POSTGRES_USER)"; [ -n "$POSTGRES_USER" ] || POSTGRES_USER=cordiale
POSTGRES_DB="$(env_get POSTGRES_DB)";     [ -n "$POSTGRES_DB" ]   || POSTGRES_DB=cordiale

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
tar -xzf "$ARCHIVE" -C "$WORK"
[ -f "$WORK/database.sql" ] || die "The archive does not contain database.sql — is it a Cordiale backup?"

cat <<EOF

  About to restore:  $ARCHIVE
  Into database:     $POSTGRES_DB

  Everything currently in that database will be REPLACED.

EOF
read -r -p "  Type RESTORE to continue: " CONFIRM
[ "$CONFIRM" = "RESTORE" ] || die "Cancelled."

echo "[restore] taking a safety dump of the current database…"
mkdir -p ./backups
SAFETY="./backups/pre-restore-$(date +%Y%m%d-%H%M%S).sql"
docker compose exec -T db pg_dump \
  --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
  --no-owner --no-privileges --clean --if-exists > "$SAFETY"
echo "[restore] safety dump written to $SAFETY"

echo "[restore] stopping the application…"
docker compose stop app >/dev/null

echo "[restore] restoring the database…"
# --single-transaction: without it a dump that fails halfway leaves the database
# half-dropped, with the app stopped and no way back except another restore.
# With it, either the whole thing applies or nothing changes.
if ! docker compose exec -T db psql \
  --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
  --quiet --single-transaction --set ON_ERROR_STOP=on < "$WORK/database.sql"; then
  echo "[restore] the restore failed and was rolled back; the database is unchanged." >&2
  echo "[restore] restarting the application…" >&2
  docker compose up -d app >/dev/null
  exit 1
fi

if [ -d "$WORK/uploads" ]; then
  echo "[restore] restoring the uploaded images…"
  VOLUME="$(uploads_volume)"
  if [ -z "$VOLUME" ]; then
    echo "[restore] no uploads volume for this project - skipping images" >&2
  else
    # `cp -a` also copies ownership onto the destination root, which handed the
    # volume to the invoking user's uid; the app runs as uid 1001 and could no
    # longer write there, so uploads silently stopped working after a restore.
    # Copy without preserving ownership, then hand the volume back to the app.
    docker run --rm \
      -v "$VOLUME:/to" \
      -v "$WORK/uploads:/from:ro" \
      alpine:3 sh -c 'cp -r /from/. /to/ 2>/dev/null || true; chown -R 1001:1001 /to'
  fi
fi

echo "[restore] restarting the application…"
docker compose up -d app

echo "[restore] done. The .env inside the archive was NOT applied — compare it by hand if needed:"
echo "          tar -xzOf $ARCHIVE ./env.backup | diff - .env || true"
