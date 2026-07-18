# Local-dev image for the groov-db-ui React (CRA) dev server, used by the
# API repo's docker-compose stack. NOT used for production — prod deploys
# this app as a static build served elsewhere; this Dockerfile only runs
# `react-scripts start`.
FROM node:20-bullseye

WORKDIR /app

# File-change polling (CHOKIDAR_USEPOLLING / WATCHPACK_POLLING) used to be
# required here because Fast Refresh over a Docker bind mount can't rely on
# inotify events crossing the host<->container boundary (especially on
# macOS/Docker Desktop's virtualized filesystem). The stack now uses
# `docker compose watch` for container-side file sync instead of a raw bind
# mount, which delivers real filesystem events inside the container, so
# polling is no longer needed and has been removed.
#
# WDS_SOCKET_PORT=0 tells the webpack-dev-server client to infer the HMR
# websocket port from window.location instead of hardcoding one — correct
# here since the container's port 3000 is published as host 3000:3000.
ENV WDS_SOCKET_PORT=0

# Install deps at build/image time so `npm ci` doesn't need to run on every
# container start. The compose stack bind-mounts this repo over /app at
# runtime AND declares node_modules as an anonymous volume
# (`- /app/node_modules`), so the Linux-built node_modules baked into this
# image (not the host's, e.g. macOS, node_modules) is what actually gets
# used inside the container.
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the source so the image is also runnable standalone
# (`docker run`) without the compose bind mount, e.g. for a quick
# `docker build` smoke test. In the compose flow this is immediately
# shadowed by the bind mount at runtime.
COPY . .

RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["npm", "start"]
