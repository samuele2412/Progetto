#!/usr/bin/env bash
# =============================================================================
# Backs up the database, the uploaded images and .env.
#
#   ./scripts/backup.sh [destination-directory]
#
# Produces one timestamped .tar.gz per run and keeps the last RETAIN_BACKUPS
# (default 14). Suitable for cron:
#   0 3 * * * cd /opt/cordiale && ./scripts/backup.sh >> /var/log/cordiale-backup.log 2>&1
# =============================================================================
set -euo pipefail

cd "$(dirname "$0")/.."
DEST="${1:-./backups}"
RETAIN="${RETAIN_BACKUPS:-14}"
STAMP="$(date +%Y%m%d-%H%M%S)"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

# shellcheck disable=SC1091
set -a; . ./.env; set +a

mkdir -p "$DEST"

echo "[backup] dumping the database…"
docker compose exec -T db pg_dump \
  --username "${POSTGRES_USER:-cordiale}" \
  --dbname "${POSTGRES_DB:-cordiale}" \
  --no-owner --no-privileges --clean --if-exists \
  > "$WORK/database.sql"

echo "[backup] copying the uploaded images…"
mkdir -p "$WORK/uploads"
# The app container may be stopped; a throwaway container can still read the volume.
docker run --rm \
  -v "$(docker volume ls -q --filter name=uploads | head -n1):/from" \
  -v "$WORK/uploads:/to" \
  alpine:3 sh -c 'cp -a /from/. /to/ 2>/dev/null || true'

echo "[backup] copying the configuration…"
cp .env "$WORK/env.backup"

ARCHIVE="$DEST/cordiale-$STAMP.tar.gz"
tar -czf "$ARCHIVE" -C "$WORK" .
chmod 600 "$ARCHIVE"

SIZE="$(du -h "$ARCHIVE" | cut -f1)"
echo "[backup] written $ARCHIVE ($SIZE)"

# Retention
COUNT="$(ls -1t "$DEST"/cordiale-*.tar.gz 2>/dev/null | wc -l)"
if [ "$COUNT" -gt "$RETAIN" ]; then
  ls -1t "$DEST"/cordiale-*.tar.gz | tail -n "+$((RETAIN + 1))" | while read -r old; do
    rm -f "$old"
    echo "[backup] removed old archive $(basename "$old")"
  done
fi

echo "[backup] done — $COUNT archive(s) kept in $DEST"
echo "[backup] REMINDER: copy these off this machine. A backup on the same disk is not a backup."
