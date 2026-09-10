# =============================================================================
# Cordiale — production image
#
# Multi-stage so the runtime image carries no build tools and no dev
# dependencies: it ships the Next.js standalone server, the SQL migrations and
# the two scripts the entrypoint needs. Final size is roughly 250 MB.
# =============================================================================

# --- 1. Dependencies ---------------------------------------------------------
FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci

# --- 2. Build ----------------------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# No secrets are needed to build: src/lib/env.ts recognises the build phase and
# substitutes throwaway values, then validates strictly again at runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# The maintenance scripts are bundled into plain CommonJS so the runtime image
# needs neither tsx nor a second copy of node_modules to run them.
RUN npm run build:scripts

# --- 3. Runtime --------------------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app

RUN apk add --no-cache curl tini \
  && addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV UPLOAD_DIR=/app/public/uploads

# The standalone output bundles only the dependencies the server actually uses.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Migrations, seed, admin creation and the GDPR clean-up: self-contained bundles
# plus the SQL migration files they apply.
COPY --from=builder --chown=nextjs:nodejs /app/drizzle ./drizzle
COPY --from=builder --chown=nextjs:nodejs /app/dist-scripts ./dist-scripts

COPY --chown=nextjs:nodejs docker/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh && mkdir -p /app/public/uploads && chown -R nextjs:nodejs /app/public/uploads

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD curl -fsS http://127.0.0.1:3000/api/health || exit 1

# tini reaps zombies and forwards signals, so `docker compose stop` is clean.
ENTRYPOINT ["/sbin/tini", "--", "/app/entrypoint.sh"]
CMD ["node", "server.js"]
