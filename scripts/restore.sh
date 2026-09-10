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
ARCHIVE="${1:-}"

die() { printf '\n\033[31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

[ -n "$ARCHIVE" ] || die "Usage: ./scripts/restore.sh <archive.tar.gz>"
[ -f "$ARCHIVE" ] || die "Archive not found: $ARCHIVE"
[ -f .env ] || die ".env is missing."

# shellcheck disable=SC1091
set -a; . ./.env; set +a

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
tar -xzf "$ARCHIVE" -C "$WORK"
[ -f "$WORK/database.sql" ] || die "The archive does not contain database.sql — is it a Cordiale backup?"

cat <<EOF

  About to restore:  $ARCHIVE
  Into database:     ${POSTGRES_DB:-cordiale}

  Everything currently in that database will be REPLACED.

EOF
read -r -p "  Type RESTORE to continue: " CONFIRM
[ "$CONFIRM" = "RESTORE" ] || die "Cancelled."

echo "[restore] taking a safety dump of the current database…"
mkdir -p ./backups
SAFETY="./backups/pre-restore-$(date +%Y%m%d-%H%M%S).sql"
docker compose exec -T db pg_dump \
  --username "${POSTGRES_USER:-cordiale}" --dbname "${POSTGRES_DB:-cordiale}" \
  --no-owner --no-privileges --clean --if-exists > "$SAFETY"
echo "[restore] safety dump written to $SAFETY"

echo "[restore] stopping the application…"
docker compose stop app >/dev/null

echo "[restore] restoring the database…"
docker compose exec -T db psql \
  --username "${POSTGRES_USER:-cordiale}" --dbname "${POSTGRES_DB:-cordiale}" \
  --quiet --set ON_ERROR_STOP=on < "$WORK/database.sql"

if [ -d "$WORK/uploads" ]; then
  echo "[restore] restoring the uploaded images…"
  VOLUME="$(docker volume ls -q --filter name=uploads | head -n1)"
  docker run --rm \
    -v "$VOLUME:/to" \
    -v "$WORK/uploads:/from" \
    alpine:3 sh -c 'cp -a /from/. /to/ 2>/dev/null || true'
fi

echo "[restore] restarting the application…"
docker compose up -d app

echo "[restore] done. The .env inside the archive was NOT applied — compare it by hand if needed:"
echo "          tar -xzOf $ARCHIVE ./env.backup | diff - .env || true"
