#!/bin/sh
# Amplify-parity local build+serve path.
#
# `docker compose watch` / `npm start` run the CRA dev server, which is
# great for iteration but does NOT exercise the things that only happen in
# a production build: REACT_APP_* env inlining at build time, minifier dead
# -code elimination around the REACT_APP_LOCAL_AUTH branches in
# src/utils/auth.js, and Amplify's SPA redirect-to-index.html behavior for
# client-side routes. This script builds the app the same way Amplify does
# and serves the static output locally so those build-only failure modes
# are catchable before a real Amplify deploy.
#
# This COMPLEMENTS `docker compose watch` — it does not replace it. Use the
# dev server for day-to-day iteration; run this before pushing when you
# want to sanity-check the production build artifact itself.
#
# Like the dev server, the served bundle points at "the local backend" —
# but NOT dynamically. react-scripts build bakes REACT_APP_* values into
# the bundle at build time (there is no runtime env sourcing like
# docker-entrypoint.sh does for `npm start`). If you want this build to
# point at the Floci-generated /shared/ui.env values (API base, Cognito
# pool/client ids) rather than whatever's in .env.production or the shell's
# ambient env, you must export them into this shell BEFORE running this
# script, e.g.:
#
#   set -a; . /shared/ui.env; set +a; ./scripts/serveBuild.sh
#
# Otherwise the build will fall back to whatever REACT_APP_* defaults are
# configured for a production build (see the prebuild guard in
# scripts/checkNoLocalAuth.js, which also runs here since `npm run build`
# triggers npm's `prebuild` hook).
set -e

PORT="${PORT:-5000}"

npm run build

echo "serveBuild: serving build/ as an SPA on http://localhost:${PORT} (unknown routes -> index.html)"
npx serve -s build -l "$PORT"
