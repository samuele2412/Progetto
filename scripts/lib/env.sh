#!/usr/bin/env bash
# Reads values out of .env without letting the shell interpret the file.
#
# The scripts used to `source` it, which *runs* it: a password containing a
# space, a `$`, a backtick or a `#` was either mangled or executed. This reads
# the last assignment for a key and strips one layer of surrounding quotes,
# and nothing else.
env_get() {
  local key="$1" file="${2:-.env}" line
  [ -f "$file" ] || return 0
  line="$(grep -E "^[[:space:]]*${key}=" "$file" | tail -n 1)" || return 0
  [ -n "$line" ] || return 0
  line="${line#*=}"
  case "$line" in
    \"*\") line="${line#\"}"; line="${line%\"}" ;;
    \'*\') line="${line#\'}"; line="${line%\'}" ;;
  esac
  printf '%s' "$line"
}

# The address the app is actually published on, as install/update should probe.
app_health_url() {
  local bind port
  bind="$(env_get APP_BIND)"; [ -n "$bind" ] || bind="127.0.0.1"
  port="$(env_get APP_PORT)"; [ -n "$port" ] || port="3000"
  # 0.0.0.0 is a bind address, not something you can connect to.
  [ "$bind" = "0.0.0.0" ] && bind="127.0.0.1"
  printf 'http://%s:%s' "$bind" "$port"
}

# This compose project's own volume — not "the first one containing 'uploads'",
# which on a host running other stacks could be someone else's data.
uploads_volume() {
  local project
  project="$(env_get COMPOSE_PROJECT_NAME)"
  [ -n "$project" ] || project="$(basename "$(pwd)" | tr '[:upper:]' '[:lower:]' | tr -cd 'a-z0-9_-')"
  docker volume ls -q --filter "name=^${project}_uploads$" | head -n 1
}
