# Local-dev image for the groov-db-ui React (CRA) dev server, used by the
# API repo's docker-compose stack. NOT used for production — prod deploys
# this app as a static build served elsewhere; this Dockerfile only runs
# `react-scripts start`.
FROM node:20-bullseye

WORKDIR /app

# Fast Refresh over a Docker bind mount needs polling — inotify events from
# the host filesystem don't reliably cross into the container (especially
# on macOS/Docker Desktop's virtualized filesystem). .env.development also
# sets these for belt-and-suspenders; kept here too as an image-level
# default in case compose overrides env_file.
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true
ENV WDS_SOCKET_PORT=3000

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
