FROM node:22 AS backend-build

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@8 --activate

COPY backend /app/backend

WORKDIR /app/backend

RUN pnpm install && pnpm run build

FROM oven/bun:latest

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends unzip && rm -rf /var/lib/apt/lists/*

COPY package.json bun.lockb ./
COPY --from=backend-build /app/backend /app/backend

RUN bun install --frozen-lockfile --prod --cwd /app/backend

# Only generate Prisma client during build (doesn't need database connection)
ENV DATABASE_URL=${DATABASE_URL}
RUN cd /app/backend && bun run prisma:generate

ENV NODE_ENV=production
ENV FRONTEND_URL=${FRONTEND_URL}

EXPOSE 4000

CMD cd /app/backend && bun run start:prod