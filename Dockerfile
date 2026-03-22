FROM node:24-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9 --activate || npm install -g pnpm@9

COPY package.json pnpm-lock.yaml* package-lock.json* ./
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else npm install; fi

COPY . .

ENV NODE_ENV=production
RUN if command -v pnpm >/dev/null 2>&1 && [ -f pnpm-lock.yaml ]; then pnpm build; else npm run build; fi

RUN test -d .next/standalone || (echo "ERROR: standalone output missing — add output: 'standalone' to next.config" && exit 1)
RUN cp -r .next/static .next/standalone/.next/static
RUN if [ -d public ]; then cp -r public .next/standalone/public; fi

FROM node:24-alpine
WORKDIR /app
RUN apk add --no-cache wget
COPY --from=builder /app/.next/standalone ./

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001 && chown -R nodejs:nodejs /app
USER nodejs

ENV PORT=3000 NODE_ENV=production HOSTNAME=0.0.0.0
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/ || exit 1

CMD ["node", "server.js"]
