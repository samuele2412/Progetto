#!/usr/bin/env bash
# =============================================================================
# Updates a running installation.
#
#   ./scripts/update.sh
#
# Takes a database backup first, then pulls, rebuilds and restarts. Migrations
# are applied by the container entrypoint on start.
# =============================================================================
set -euo pipefail

cd "$(dirname "$0")/.."

say() { printf '\n\033[1m%s\033[0m\n' "$*"; }
ok()  { printf '  \033[32m✓\033[0m %s\n' "$*"; }
die() { printf '\n\033[31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

[ -f .env ] || die ".env is missing — run scripts/install.sh first."

say "1/4 — Backing up before touching anything"
./scripts/backup.sh
ok "Backup complete"

say "2/4 — Fetching the latest code"
if [ -d .git ]; then
  git pull --ff-only || die "git pull failed — resolve it by hand, nothing has been changed yet."
  ok "Repository updated"
else
  ok "Not a git checkout — skipping the pull"
fi

say "3/4 — Rebuilding"
docker compose build --pull
ok "Images rebuilt"

say "4/4 — Restarting"
docker compose up -d
for attempt in $(seq 1 40); do
  if curl -fsS "http://127.0.0.1:${APP_PORT:-3000}/api/health" >/dev/null 2>&1; then
    ok "The application is back up"
    break
  fi
  [ "$attempt" -eq 40 ] && die "The app did not come back. Check: docker compose logs -f app"
  sleep 3
done

docker image prune -f >/dev/null 2>&1 || true
printf '\n  Update finished.\n\n'
