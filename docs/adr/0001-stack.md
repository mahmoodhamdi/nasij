# ADR 0001 — Stack choices

- Status: Accepted
- Date: 2026-05-13
- Deciders: Mahmoud Hamdy

## Context

We are building a three-app retail platform (storefront, admin dashboard, in-store POS) backed by a single data layer. The platform must be production-grade, type-safe end-to-end, accessible, performant, and deployable on managed infrastructure with reasonable cost.

## Decision

| Concern | Choice | Alternatives considered |
| --- | --- | --- |
| Language | TypeScript with `strict` + `noUncheckedIndexedAccess` | JavaScript-only (rejected: type safety is non-negotiable), Effect-TS (rejected: learning curve dwarfs benefit for a product like this) |
| Repo layout | pnpm workspaces + Turborepo | Nx (rejected: heavier, slower to adopt, opinionated configs are hard to drop), Bun workspaces (rejected: edge cases in Next.js + Drizzle still hit) |
| Storefront / Admin framework | Next.js 15 (App Router, PPR) | Remix (rejected: React Router 7 migration churn, server-action ergonomics weaker for our shape), Astro (rejected: admin needs heavy interactivity) |
| POS framework | Vite + React + Workbox PWA | Tauri (overkill for a browser-first POS), Next.js (poor fit for IndexedDB-heavy offline-first) |
| Styling | Tailwind v4 + custom tokens, shadcn/ui as customized primitives | Panda CSS (rejected: smaller ecosystem), vanilla-extract (rejected: less ergonomic for product-design churn) |
| Database | Postgres on Neon (dev: local Docker) | MySQL (rejected: weaker JSON + full-text), SQLite (rejected: multi-app concurrency + Neon offers branching) |
| ORM | Drizzle | Prisma (rejected: heavier runtime, schema-language indirection, edge runtime caveats), Kysely (close runner-up; Drizzle's relations API + migrations win for our shape) |
| Auth | Better-Auth | Lucia v3 (close second; chose Better-Auth for built-in multi-factor + admin plugins), NextAuth/Auth.js (rejected: server-only assumptions and POS-app fit) |
| Validation | Zod | Valibot (close runner-up; Zod's ecosystem + tRPC integration win for now) |
| Internal API | tRPC | GraphQL (rejected: not enough cross-client benefit; over-engineering), REST (used only for webhooks) |
| File storage | Cloudflare R2 (S3 SDK) | AWS S3 (more expensive), Supabase storage (rejected: don't want Supabase lock-in) |
| Search | Meilisearch | Typesense (close), Algolia (managed but expensive at scale), pg_trgm (insufficient for faceted search) |
| Payments | Stripe + Paymob | Adyen (overkill), Tap (Egypt option; secondary to Paymob) |
| Email | Resend + React Email | Postmark (great deliverability, less developer ergonomics), SES (operational overhead) |
| Cache / queue | Redis (Upstash) + BullMQ | Cloudflare Queues (rejected: BullMQ DX), pg-boss (works but Redis already needed for cache) |
| Realtime | Custom WebSocket gateway + Redis pub/sub | Pusher (managed but costly), Ably (same), Supabase realtime (don't want Supabase) |
| Testing | Vitest, Testing Library, Playwright, axe-core, MSW, Storybook | Jest (rejected: slower, ESM friction), Cypress (rejected: Playwright is faster + multi-browser native) |
| Lint / format | ESLint flat config + Prettier + commitlint + Husky + lint-staged | Biome (impressive but ecosystem coverage still trailing for our plugins) |
| CI | GitHub Actions | CircleCI / Buildkite (rejected: in-org-repo simplicity wins) |
| CD | Vercel (Next apps), Fly.io (gateway/workers) | Cloudflare Pages (Next App Router gaps), Railway (acceptable fallback for workers) |
| Observability | Sentry + OpenTelemetry, PostHog | Datadog (cost), LogRocket (cost), Mixpanel (PostHog combines product + feature flags) |
| i18n | Custom catalogs under `packages/i18n` driven by `next-intl` for the Next apps and Lingo.dev-style key helpers shared with POS | react-i18next (heavier runtime), Lingui (great but smaller ecosystem) |

## Consequences

- Type safety is end-to-end: schema → DB → API → UI.
- Drizzle migrations live under `packages/db/drizzle`; we commit generated SQL files.
- Vercel is the deploy target for Next.js; the gateway and BullMQ workers are separated because Vercel does not host long-lived processes well.
- POS is a separate app, not a Next.js route, because offline-first + IndexedDB + Workbox is fundamentally a client-shell concern and we want a tighter PWA build.
- We reach for managed services where cost ≪ engineering hours (Neon, Upstash, Resend), and self-host where the managed option is expensive at scale (Meilisearch).
- We accept Better-Auth being the youngest dependency in the stack; rollback to Lucia is documented as a contingency in [0002-auth-plan.md](0002-auth-plan.md).

## Rollback / open questions

- If Better-Auth blocks us, switch to Lucia v3 with a dedicated session abstraction layer; the shared `packages/auth` interface is designed to keep that swap mechanical.
- If Meilisearch self-host operationally bites, fall back to Typesense Cloud.
