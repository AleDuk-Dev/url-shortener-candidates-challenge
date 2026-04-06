FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.20.0 --activate
WORKDIR /app

FROM base AS dependencies
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY libs/engine/package.json ./libs/engine/
COPY applications/web/package.json ./applications/web/
COPY libs/engine/prisma/ ./libs/engine/prisma/
COPY libs/engine/prisma.config.ts ./libs/engine/
RUN pnpm install --frozen-lockfile

FROM base AS build
COPY --from=dependencies /app ./
COPY . .
RUN cd libs/engine && DATABASE_URL="file:./dev.db" npx prisma generate
RUN pnpm build

FROM base AS production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/libs/engine/node_modules ./libs/engine/node_modules
COPY --from=build /app/applications/web/node_modules ./applications/web/node_modules
COPY --from=build /app/applications/web/build ./applications/web/build
COPY --from=build /app/applications/web/package.json ./applications/web/package.json
COPY --from=build /app/libs/engine/src ./libs/engine/src
COPY --from=build /app/libs/engine/prisma ./libs/engine/prisma
COPY --from=build /app/libs/engine/prisma.config.ts ./libs/engine/prisma.config.ts
COPY --from=build /app/libs/engine/package.json ./libs/engine/package.json
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

EXPOSE 3000
CMD ["sh", "-c", "cd /app/libs/engine && DATABASE_URL=\"file:./data.db\" npx prisma db push && cd /app/applications/web && pnpm start"]
