# Submission

## What I Did

- Refactored domain logic into a clean service layer with repository pattern in `libs/engine`, fully separated from the presentation layer.
- Added SQLite persistence via Prisma 7 ORM with the libsql driver adapter.
- Implemented robust URL validation (protocol whitelist for http/https, length check at 2048 chars, URL normalization via the native URL API).
- Built a unique code generator using base62 charset and 7-character codes (3.5 trillion possibilities, up from the original 9) with `crypto.getRandomValues` and collision retry.
- Redesigned the UI with a clean violet SaaS aesthetic in Tailwind CSS v4 — hero section, URL form with loading states, result card with copy-to-clipboard, stats page, fully responsive and accessible.
- Added click tracking on redirects using a fire-and-forget pattern so the counter increment never blocks the redirect response.
- Implemented rate limiting with an in-memory sliding window for basic abuse prevention.
- Added unit tests with Vitest covering the validator, code generator, rate limiter, and service layer (service tests use an in-memory mock repository).
- Updated the Dockerfile to a multi-stage build compatible with Prisma 7 and the libsql adapter.

**Priorities:** architecture & persistence first, then validation and error handling, then UI polish, then testing, and finally security and Docker. The reasoning was that without a solid domain layer and persistence, nothing else matters.

## What I Would Do With More Time

- Swap SQLite for PostgreSQL to match a production stack.
- Add E2E tests with Playwright to cover the redirect and stats flows end-to-end.
- URL expiration and support for user-defined custom short codes.
- Analytics dashboard with click-over-time charts and referrer tracking.
- Authentication so users can manage and delete their own URLs.
- Redis-backed rate limiting to make it work across multiple server instances.
- CI/CD pipeline with GitHub Actions (typecheck, test, build, docker build on every PR).
- Public REST API with OpenAPI documentation for programmatic access.
- Observability: structured logging, metrics, and error tracking (Sentry).

## AI Usage

I used Claude Code as a pair programming assistant throughout the challenge. My workflow was:

1. First I read the challenge description and the existing codebase myself to understand the scope and the deliberate problems in the starter code.
2. I planned the architecture (service layer, repository pattern, validation strategy) before writing any code.
3. I used Claude Code to scaffold boilerplate faster: Prisma setup, repository implementation, Vitest test files, Docker configuration. For each generated piece I reviewed the code, adjusted it to match the project conventions, and made sure I understood every decision.
4. Claude Code was especially useful for Prisma 7 migration gotchas (the breaking changes vs Prisma 6 around the driver adapter approach) and for resolving Docker multi-stage build issues with pnpm's strict isolation.

Example prompts I used:
- "Create a PrismaUrlRepository that implements IUrlRepository using the libsql driver adapter, with atomic increment for clicks and findAll ordered by createdAt desc."
- "Write Vitest tests for the URL validator covering valid http/https, empty input, invalid protocols (ftp, javascript), and the 2048 char length limit."
- "The Docker build fails with '.prisma/client/default invalid package name' — what's the fix for Prisma 7 with adapter mode?"

All generated code was reviewed, understood, and manually integrated. Commits and commit messages reflect the real development flow.

## Feedback

Clear and well-structured challenge. A few thoughts:

- The intentionally broken starting code is a smart evaluation technique — it makes the delta between the initial state and the submission very tangible, and forces candidates to demonstrate real refactoring judgment rather than building from scratch.
- The ~2 hour time box forces pragmatic prioritization, which is realistic for startup work.
- Having the monorepo structure (`libs/engine` vs `applications/web`) already in place was a nice touch — it signals that you care about domain separation without dictating how candidates should implement it.
- One suggestion: a short note about the Prisma 7 migration could help candidates avoid spending time on breaking changes around the driver adapter, since that's not really what the challenge is evaluating.

Thanks for the opportunity.