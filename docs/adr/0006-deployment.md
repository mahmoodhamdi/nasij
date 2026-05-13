# ADR 0006 — Deployment topology

- Status: Accepted
- Date: 2026-05-13

## Decision

| Surface | Target | Why |
| --- | --- | --- |
| `storefront` (Next.js) | Vercel | Server actions + ISR + edge middleware first-party support; cheap free tier; preview deploys per PR |
| `admin` (Next.js) | Vercel | Same as above, separate Vercel project under the same team |
| `pos` (Vite PWA) | Vercel static | Static export served from `apps/pos/dist`; SW + manifest at root |
| `gateway` (Node + ws + workers) | Fly.io | Long-lived process for WebSockets and BullMQ workers — Vercel cannot host these. Two app names: `nasij-gateway` and `nasij-workers` so we can scale each independently |
| Postgres | Neon | Branchable, generous free tier for preview environments. Connection pooling via Neon proxy |
| Redis | Upstash (REST + native) | Cheap, low-ops; used for sessions, pub/sub, BullMQ |
| Object storage | Cloudflare R2 | S3-compatible, egress-free, cheaper than S3 at scale |
| Search | Self-hosted Meilisearch on Fly | We accept the operational overhead in exchange for predictable cost |
| Email | Resend | Excellent deliverability + React Email integration |
| Observability | Sentry (errors/perf) + PostHog (product analytics + flags) | Two best-in-class tools rather than one mediocre one |

## DNS

- `nasij.com` → Vercel storefront (apex + `www`)
- `admin.nasij.com` → Vercel admin
- `pos.nasij.com` → Vercel POS (static)
- `gateway.nasij.com` → Fly.io gateway (WSS)
- `cdn.nasij.com` → Cloudflare R2 custom domain

## Environments

| Env | Branch | DB | Notes |
| --- | --- | --- | --- |
| `production` | `main` | Neon prod branch | Real customers; required protections on `main`; required Lighthouse + CI green |
| `staging` | `staging` | Neon `staging` branch | Internal smoke; same data shape as prod, scrubbed |
| `preview` | PR branches | Neon ephemeral branches | Auto-created via Vercel + Neon integration |
| `local` | local docker | Docker Postgres | Offset host ports (see `infra/docker-compose.yml`) |

## Secret management

- Vercel encrypted env vars per project + env.
- Fly secrets per app.
- A single `infra/secrets.example.env` enumerates every secret name (no values committed). Adding a new secret is a documented step in [docs/runbooks/deploy.md](../runbooks/deploy.md).

## Cost guard-rails

- Vercel: alert at $200/month per project; Lighthouse + size-limit budgets keep cold-start small.
- Neon: storage alert at 5 GB.
- Upstash: connection-count alert at 50.
- R2: egress is free; storage alert at 50 GB.

## Rollback

- Vercel: instant rollback to previous deployment.
- Fly: `fly releases rollback` to the prior tagged release.
- Neon: point-in-time restore on the prod branch.

## Consequences

- We do not lock into a single provider — every layer has a documented alternative.
- The gateway being on Fly while the rest is on Vercel means cross-region latency must be measured; we accept that the gateway can be moved to Vercel Functions if WebSocket support ever lands there.
