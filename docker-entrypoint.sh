#!/bin/sh
# Entrypoint for the UI service in the local docker-compose Floci stack.
#
# The V2 API base + Cognito pool/client ids are generated dynamically at
# container startup by the API repo's floci-init provisioner and written
# into /shared/ui.env (a shared `floci_shared` docker volume). We source
# that file into this shell's environment BEFORE starting react-scripts, so
# CRA bakes REACT_APP_API_BASE / REACT_APP_COGNITO_USER_POOL_ID /
# REACT_APP_COGNITO_CLIENT_ID into process.env at serve time.
#
# Equivalent one-liner, if a compose `command:` override is preferred over
# this script:
#   set -a; [ -f /shared/ui.env ] && . /shared/ui.env; set +a; exec npm start
set -e

SHARED_ENV=/shared/ui.env
WAIT_SECONDS=60

# Defend against the cold-start race with floci-init: on a fresh
# `docker compose up`, this container can start before floci-init has
# finished provisioning and written the file. Wait (bounded) rather than
# silently booting with the DYNAMIC vars unset, which would fall back to
# the prod API base and break local dev without any obvious error.
i=0
while [ ! -f "$SHARED_ENV" ] && [ "$i" -lt "$WAIT_SECONDS" ]; do
  echo "docker-entrypoint: waiting for $SHARED_ENV (floci-init)... (${i}/${WAIT_SECONDS}s)"
  sleep 1
  i=$((i + 1))
done

if [ -f "$SHARED_ENV" ]; then
  echo "docker-entrypoint: sourcing $SHARED_ENV"
  set -a
  # shellcheck disable=SC1090
  . "$SHARED_ENV"
  set +a
else
  echo "docker-entrypoint: WARNING $SHARED_ENV not found after ${WAIT_SECONDS}s — starting with prod API base fallback"
fi

exec "$@"
