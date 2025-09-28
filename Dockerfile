# --- Build (Astro -> /app/dist) ---
FROM node:20-bookworm-slim AS build
WORKDIR /app

# Use pnpm via Corepack and (optionally) pin via packageManager in package.json
RUN corepack enable

# Install deps (including devDeps for tsx/prebuild)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build (set prod mode only for this step so toggle-proxy can detect it)
COPY . .
RUN NODE_ENV=production pnpm build

# --- Serve with Nginx ---
FROM nginx:stable-alpine
ARG NGINX_CONF_VERSION=2025-09-28-1
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
