FROM oven/bun:latest AS frontend-build

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends unzip && rm -rf /var/lib/apt/lists/*

COPY package.json bun.lockb ./
COPY frontend /app/frontend

RUN bun install --frozen-lockfile --cwd /app/frontend
RUN cd frontend && bun run build

FROM node:22 AS backend-build

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@8 --activate

COPY backend /app/backend
COPY --from=frontend-build /app/frontend/dist /app/backend/public

WORKDIR /app/backend

RUN pnpm install && pnpm run build

FROM oven/bun:latest

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends unzip && rm -rf /var/lib/apt/lists/*

COPY package.json bun.lockb ./
COPY --from=backend-build /app/backend /app/backend
COPY --from=frontend-build /app/frontend/dist /app/backend/public
COPY frontend /app/frontend

RUN rm -rf /app/frontend/node_modules /app/backend/node_modules /root/.cache /root/.npm

RUN bun install --frozen-lockfile --prod --cwd /app/frontend
RUN bun install --frozen-lockfile --prod --cwd /app/backend

# Only generate Prisma client during build (doesn't need database connection)
RUN cd /app/backend && bun run prisma:generate

# Set environment variables for runtime
ENV NODE_ENV=production

EXPOSE 4000

# Create a startup script
RUN echo '#!/bin/sh\n\
    cd /app/backend\n\
    echo "Running database migrations..."\n\
    bun run prisma:migrate\n\
    echo "Starting application..."\n\
    bun run start:prod\n\
    ' > /app/startup.sh && chmod +x /app/startup.sh

# Use the startup script as the entrypoint
CMD ["/app/startup.sh"]