#!/usr/bin/env bash
set -euo pipefail

readonly START_PORT="${START_PORT:-8080}"
readonly MAX_PORT=65535

if ! [[ "${START_PORT}" =~ ^[0-9]+$ ]] || ((START_PORT < 1 || START_PORT > MAX_PORT)); then
  echo "START_PORT must be an integer between 1 and ${MAX_PORT}." >&2
  exit 1
fi

port_in_use() {
  local port="$1"

  if command -v ss >/dev/null 2>&1; then
    ss -H -ltn "sport = :${port}" | grep -q .
  elif command -v lsof >/dev/null 2>&1; then
    lsof -nP -iTCP:"${port}" -sTCP:LISTEN >/dev/null 2>&1
  elif command -v nc >/dev/null 2>&1; then
    nc -z 127.0.0.1 "${port}" >/dev/null 2>&1
  else
    (exec 3<>"/dev/tcp/127.0.0.1/${port}") >/dev/null 2>&1
  fi
}

next_port="${START_PORT}"

assign_port() {
  local variable_name="$1"

  while port_in_use "${next_port}"; do
    ((next_port += 1))
  done

  if ((next_port > MAX_PORT)); then
    echo "No free TCP ports are available at or above ${START_PORT}." >&2
    exit 1
  fi

  printf -v "${variable_name}" '%d' "${next_port}"
  export "${variable_name}"
  ((next_port += 1))
}

if [[ -n "$(docker compose ps --status running -q caddy 2>/dev/null)" ]]; then
  index_address="$(docker compose port caddy 8080 | head -n 1)"
  index_port="${index_address##*:}"
  echo "Dashboard stack is already running."
  echo "Index: http://localhost:${index_port}"
  exit 0
fi

assign_port INDEX_PORT
assign_port HOMEPAGE_PORT
assign_port DASHY_PORT
assign_port FLAME_PORT
assign_port GLANCE_PORT
assign_port JUMP_PORT
assign_port LINKDING_PORT
assign_port HOMARR_PORT
assign_port HOMER_PORT

docker compose up -d

echo
echo "Dashboard stack started:"
printf '  Index:    http://localhost:%s\n' "${INDEX_PORT}"
printf '  Homepage: http://localhost:%s\n' "${HOMEPAGE_PORT}"
printf '  Dashy:    http://localhost:%s\n' "${DASHY_PORT}"
printf '  Flame:    http://localhost:%s\n' "${FLAME_PORT}"
printf '  Glance:   http://localhost:%s\n' "${GLANCE_PORT}"
printf '  Jump:     http://localhost:%s\n' "${JUMP_PORT}"
printf '  linkding: http://localhost:%s\n' "${LINKDING_PORT}"
printf '  Homarr:   http://localhost:%s\n' "${HOMARR_PORT}"
printf '  Homer:    http://localhost:%s\n' "${HOMER_PORT}"
