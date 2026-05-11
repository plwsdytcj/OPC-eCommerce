# syntax=docker/dockerfile:1.20
#
# Marketplace (Next.js 16 standalone) container.
# Build context = repo root.  Marketplace 是独立 npm 应用，不在 pnpm workspace 内。

FROM node:22-trixie-slim AS deps
WORKDIR /app
COPY apps/marketplace/package.json ./
# 没有 lockfile, 用 npm install 直接装
RUN npm install --no-audit --no-fund

FROM node:22-trixie-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY apps/marketplace/ ./
RUN npm run build

FROM node:22-trixie-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3200 \
    NEXT_TELEMETRY_DISABLED=1

# Next.js standalone bundle 自带必要的 node_modules 子集
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

EXPOSE 3200
CMD ["node", "server.js"]
