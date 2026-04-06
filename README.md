# URL Shortener

Production-quality URL shortener built as a technical challenge. Monorepo architecture with clean domain separation between the engine library and web application.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Monorepo | pnpm workspaces + Turborepo |
| Frontend | React 19, React Router v7 (SSR) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Bundler | Vite 7 |
| ORM | Prisma 7 |
| Database | SQLite via libsql adapter |
| Testing | Vitest |
| Container | Docker (multi-stage) |

## Architecture

```
libs/engine/          # @url-shortener/engine — domain logic
  src/
    types.ts          # Interfaces: ShortenedUrl, IUrlRepository, CreateUrlResult
    errors.ts         # Domain errors: UrlValidationError, UrlNotFoundError, RateLimitError
    url-validator.ts  # Protocol whitelist, length check, URL normalization
    code-generator.ts # Base62 code generation (crypto.getRandomValues)
    rate-limiter.ts   # Sliding-window in-memory rate limiter
    url-shortener.service.ts  # Core service — create, resolve, stats
    prisma.repository.ts      # Prisma implementation of IUrlRepository
    db.ts             # PrismaClient singleton (import.meta.url-based path resolution)

applications/web/     # React Router v7 SSR application
  app/
    routes/
      _index.tsx      # Home: shorten form + results + recent links
      s.$code.tsx     # Redirect route with click tracking
      urls.tsx        # Stats page
    components/       # UrlForm, UrlResult, UrlList, ErrorMessage
```

**Layered architecture:** Routes → `UrlShortenerService` → `IUrlRepository` → Database

The service depends only on the `IUrlRepository` interface, making it fully testable without a real database.

## Getting Started

### Local Development

```bash
# Install dependencies
pnpm install

# Copy env and configure
cp .env.example .env

# Generate Prisma client and create database
cd libs/engine && DATABASE_URL="file:./dev.db" npx prisma generate
cd libs/engine && DATABASE_URL="file:./dev.db" npx prisma db push

# Start dev server
pnpm dev
```

App runs at http://localhost:5173

### Docker

```bash
docker compose up --build
```

App runs at http://localhost:3000

## Testing

```bash
pnpm test
```

Runs unit tests for all domain logic via Vitest:
- `url-validator.test.ts` — 9 tests
- `code-generator.test.ts` — 4 tests
- `rate-limiter.test.ts` — 4 tests
- `url-shortener.service.test.ts` — 6 tests (uses `InMemoryUrlRepository`, no database)

## Technical Decisions

**SQLite for simplicity** — Zero-config, file-based persistence appropriate for this scale. Prisma 7 with `@prisma/adapter-libsql` provides the connection. Switching to PostgreSQL in production would only require changing the adapter and schema provider.

**Repository pattern** — `IUrlRepository` interface decouples the service from Prisma. Tests use `InMemoryUrlRepository` — no database, no mocking framework needed.

**Rate limiting** — Sliding-window in-memory `RateLimiter` prevents abuse on the shorten endpoint. Keyed by `x-forwarded-for` header.

**CWD-independent DB path** — `db.ts` resolves the SQLite file path using `import.meta.url` rather than `process.cwd()`, so the path is correct regardless of which directory Turborepo launches the process from.

**Fire-and-forget click tracking** — `resolveCode` increments the click counter without awaiting it, keeping redirect latency minimal.
