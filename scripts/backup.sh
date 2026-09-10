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
# shellcheck source=scripts/lib/env.sh
. ./scripts/lib/env.sh
DEST="${1:-./backups}"
RETAIN="${RETAIN_BACKUPS:-14}"
STAMP="$(date +%Y%m%d-%H%M%S)"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

POSTGRES_USER="$(env_get POSTGRES_USER)"; [ -n "$POSTGRES_USER" ] || POSTGRES_USER=cordiale
POSTGRES_DB="$(env_get POSTGRES_DB)";     [ -n "$POSTGRES_DB" ]   || POSTGRES_DB=cordiale

mkdir -p "$DEST"

echo "[backup] dumping the database…"
docker compose exec -T db pg_dump \
  --username "$POSTGRES_USER" \
  --dbname "$POSTGRES_DB" \
  --no-owner --no-privileges --clean --if-exists \
  > "$WORK/database.sql"

echo "[backup] copying the uploaded images…"
mkdir -p "$WORK/uploads"
# The exact volume of THIS compose project. A substring match on "uploads" picks
# the first volume alphabetically, which on a host running other stacks can be
# a different application's data.
UPLOADS_VOLUME="$(uploads_volume)"
if [ -z "$UPLOADS_VOLUME" ]; then
  echo "[backup] no uploads volume found for this project - skipping images"
else
  # Runs as the invoking user so the copied files stay owned by them: as root
  # the temporary directory ended up owned by uid 1001, the final rm -rf failed,
  # and every run left a copy of the photos behind in /tmp.
  docker run --rm --user "$(id -u):$(id -g)" \
    -v "$UPLOADS_VOLUME:/from:ro" \
    -v "$WORK/uploads:/to" \
    alpine:3 sh -c 'cp -r /from/. /to/ 2>/dev/null || true'
fi

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

# Counted again: the figure printed before was the one from before the cleanup.
KEPT="$(ls -1t "$DEST"/cordiale-*.tar.gz 2>/dev/null | wc -l)"
echo "[backup] done — $KEPT archive(s) kept in $DEST"
echo "[backup] REMINDER: copy these off this machine. A backup on the same disk is not a backup."
