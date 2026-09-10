#!/usr/bin/env bash
# =============================================================================
# First-run installer for an Ubuntu host.
#
#   ./scripts/install.sh
#
# Checks the prerequisites, creates .env with generated secrets if it is
# missing, builds the images and brings the stack up. Safe to re-run.
# =============================================================================
set -euo pipefail

cd "$(dirname "$0")/.."
ROOT="$(pwd)"
# shellcheck source=scripts/lib/env.sh
. ./scripts/lib/env.sh

say()  { printf '\n\033[1m%s\033[0m\n' "$*"; }
ok()   { printf '  \033[32m✓\033[0m %s\n' "$*"; }
warn() { printf '  \033[33m!\033[0m %s\n' "$*"; }
die()  { printf '\n\033[31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

say "1/5 — Prerequisites"

command -v docker >/dev/null 2>&1 || die "Docker is not installed. See: https://docs.docker.com/engine/install/ubuntu/"
docker compose version >/dev/null 2>&1 || die "The Docker Compose plugin is missing. Install docker-compose-plugin."
docker info >/dev/null 2>&1 || die "Cannot talk to the Docker daemon. Is it running, and is your user in the 'docker' group?"
ok "Docker $(docker --version | awk '{print $3}' | tr -d ,) and Compose are available"

command -v openssl >/dev/null 2>&1 || die "openssl is required to generate the secrets (apt install openssl)."

say "2/5 — Configuration"

if [ -f .env ]; then
  ok ".env already exists — leaving it untouched"
else
  [ -f .env.example ] || die ".env.example is missing; are you in the project root?"
  cp .env.example .env

  DB_PASSWORD="$(openssl rand -base64 30 | tr -d '/+=' | cut -c1-32)"
  SESSION_SECRET="$(openssl rand -base64 48 | tr -d '\n')"
  IP_SALT="$(openssl rand -hex 24)"

  # BSD/GNU-safe in-place edit.
  sed -i.bak \
    -e "s|^POSTGRES_PASSWORD=.*|POSTGRES_PASSWORD=${DB_PASSWORD}|" \
    -e "s|^DATABASE_URL=.*|DATABASE_URL=postgresql://cordiale:${DB_PASSWORD}@db:5432/cordiale|" \
    -e "s|^SESSION_SECRET=.*|SESSION_SECRET=${SESSION_SECRET}|" \
    -e "s|^IP_HASH_SALT=.*|IP_HASH_SALT=${IP_SALT}|" \
    .env
  rm -f .env.bak
  chmod 600 .env
  ok ".env created with freshly generated secrets"
  warn "Now open .env and set: SITE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, and the SMTP settings"
  printf '\n    nano %s/.env\n\n' "$ROOT"
  read -r -p "  Press Enter once you have finished editing .env… " _
fi

# Values are read, never executed: see scripts/lib/env.sh.
ADMIN_EMAIL="$(env_get ADMIN_EMAIL)"
ADMIN_PASSWORD="$(env_get ADMIN_PASSWORD)"
SESSION_SECRET="$(env_get SESSION_SECRET)"
SITE_URL="$(env_get SITE_URL)"
NOTIFY_EMAIL="$(env_get NOTIFY_EMAIL)"

# Every one of these ships with a plausible-looking example value, and the
# example password is long enough to pass a naive length check — so pressing
# Enter without editing .env created an administrator whose password is
# published in this repository.
[ -n "$ADMIN_EMAIL" ]    || die "ADMIN_EMAIL is not set in .env"
[ -n "$ADMIN_PASSWORD" ] || die "ADMIN_PASSWORD is not set in .env"
[ "${#ADMIN_PASSWORD}" -ge 12 ] || die "ADMIN_PASSWORD must be at least 12 characters"

reject_placeholder() {
  case "$2" in
    ""|*change-me*|*your-domain.example*|*choose-a-long-password*)
      die "$1 still holds its placeholder value - edit .env before continuing." ;;
  esac
}
reject_placeholder "SESSION_SECRET" "$SESSION_SECRET"
reject_placeholder "SITE_URL"       "$SITE_URL"
reject_placeholder "ADMIN_EMAIL"    "$ADMIN_EMAIL"
reject_placeholder "ADMIN_PASSWORD" "$ADMIN_PASSWORD"
case "$SITE_URL" in
  http://*|https://*) ;;
  *) die "SITE_URL must start with http:// or https://" ;;
esac
[ -n "$NOTIFY_EMAIL" ] || warn "NOTIFY_EMAIL is empty: new requests will only appear in the panel"
ok "Configuration looks complete"

say "3/5 — Building the images"
docker compose build
ok "Images built"

say "4/5 — Starting the stack"
docker compose up -d
ok "Containers started"

say "5/5 — Waiting for the application"
for attempt in $(seq 1 40); do
  if curl -fsS "$(app_health_url)/api/health" >/dev/null 2>&1; then
    ok "The application is answering on $(app_health_url)"
    break
  fi
  [ "$attempt" -eq 40 ] && die "The app did not come up. Check: docker compose logs -f app"
  sleep 3
done

cat <<EOF

  Done.

    Site           $(app_health_url)
    Admin panel    $(app_health_url)/admin
    Sign in as     ${ADMIN_EMAIL}

  Next steps
    1. Connect the domain through Cloudflare Tunnel (see README § Cloudflare Tunnel).
    2. Open the panel and replace every placeholder flagged on the dashboard.
    3. Remove ADMIN_PASSWORD from .env once you have signed in successfully.
    4. Schedule the backups:  crontab -e   (see README § Backup)

EOF
