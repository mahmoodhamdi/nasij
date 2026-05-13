# Architecture

## High-level

```
                                     ┌──────────────────────┐
                                     │     Postgres (Neon)  │
                                     │  ┌───────────────┐   │
                                     │  │ users, orders │   │
                                     │  │ products, ... │   │
                                     │  └───────────────┘   │
                                     └──────────┬───────────┘
                                                │
                          ┌─────────────────────┴─────────────────────┐
                          │           packages/db (Drizzle)            │
                          └─────────────────────┬─────────────────────┘
                                                │
                          ┌─────────────────────┴─────────────────────┐
                          │     packages/api (tRPC routers + REST)    │
                          └───┬──────────────────┬───────────────┬────┘
                              │                  │               │
              ┌───────────────┴───┐  ┌───────────┴────┐  ┌───────┴────┐
              │ apps/storefront   │  │ apps/admin     │  │ apps/pos   │
              │ Next.js 15        │  │ Next.js 15     │  │ Vite + PWA │
              └───────────────────┘  └────────────────┘  └────────────┘

                                ┌──────────────────────┐
                                │    apps/gateway      │  ◄── Redis (pub/sub)
                                │ WebSocket + Workers  │  ◄── BullMQ jobs
                                └──────────────────────┘
```

## Apps

### Storefront (`apps/storefront`)

Public-facing Next.js 15 (App Router). Server components by default, client components where state lives. PPR enabled for product detail and listing pages. PWA installable with offline shell. Locales: `ar` (RTL), `en` (LTR).

### Admin (`apps/admin`)

Internal Next.js 15 dashboard. RBAC-gated routes via shared `packages/auth`. Server actions for mutations. Audit log writes to a dedicated table on every admin action.

### POS (`apps/pos`)

Vite + React PWA. Offline-first via Workbox + IndexedDB. Sync queue replays mutations through `packages/api` when connectivity returns. Conflict resolution: server-wins with operator notification when local optimistic writes are rejected.

### Gateway (`apps/gateway`)

Node WebSocket gateway and BullMQ worker. Hosts:

- Live chat WebSocket (storefront + admin).
- Admin "real-time visitors" stream.
- Order event broadcast to admin dashboards.
- Background jobs: email/SMS sending, search re-indexing, payment reconciliation, scheduled discounts.

## Shared packages

| Package | Responsibility |
| --- | --- |
| `packages/db` | Drizzle schema, migrations (Drizzle Kit), seed scripts, repository helpers. |
| `packages/api` | tRPC routers consumed by the three apps. REST adapters for webhooks (Stripe, Paymob, Resend). |
| `packages/auth` | Sessions, password policy, TOTP, PIN, RBAC middleware, GDPR helpers. |
| `packages/ui` | Design system primitives, tokens, Storybook. Tailwind-driven, theme-aware. |
| `packages/emails` | React Email templates (transactional + marketing) with text fallbacks. |
| `packages/i18n` | Translation catalogs, type-safe key helpers, RTL/LTR utilities, number/date formatting. |

## Data flow

- **Storefront / admin** call `packages/api` directly via tRPC server actions (no public REST surface).
- **POS** calls `packages/api` over an authenticated HTTP transport, queuing writes when offline.
- **Webhooks** (Stripe, Paymob, Resend) hit thin REST routes inside Next API handlers, which delegate to `packages/api`.
- **Search** is fed by an outbox table → BullMQ → Meilisearch index. Storefront reads Meilisearch directly with a public search-only key.

## Auth & RBAC

- Roles: `owner`, `admin`, `manager`, `staff`, `support`, `customer`.
- Sessions: opaque tokens stored in Redis, 30-day rolling expiry, HTTP-only cookies, CSRF-protected via double-submit.
- Admin and manager roles require TOTP 2FA.
- POS staff sign in with PIN bound to a paired device + register.
- Customers authenticate via email/password, magic link, or Google OAuth.

## Observability

- **Sentry** for errors and performance (all four apps + gateway).
- **PostHog** for product analytics and feature flags.
- **OpenTelemetry** traces for the API layer, fed to a chosen backend per environment (default: Grafana Tempo in self-hosted).

## Local development

`pnpm dev:infra` brings up:

- Postgres (port 5432)
- Redis (port 6379)
- Meilisearch (port 7700)
- Mailpit (SMTP 1025, UI 8025)
- MinIO (S3-compatible, ports 9000 / 9001)

All apps point at these by default via the `.env.example` files committed in each app directory.

## Deployment

| Surface | Target |
| --- | --- |
| Storefront, Admin | Vercel |
| POS (PWA build) | Vercel static |
| Gateway, Workers | Fly.io or Railway |
| Postgres | Neon |
| Redis | Upstash |
| Object storage | Cloudflare R2 |
| Search | Self-hosted Meilisearch (or Algolia for managed) |
| Email | Resend |
| SMS | Twilio (international), local provider TBD for Egypt |
