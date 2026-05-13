# Nasij — نسيج

A production-grade retail platform for a clothing brand. Three apps share one backend:

| App | Purpose | Stack |
| --- | --- | --- |
| **Storefront** (`apps/storefront`) | Public e-commerce site for customers | Next.js 15 App Router |
| **Admin** (`apps/admin`) | Owner/admin dashboard — manages everything, creates staff | Next.js 15 App Router |
| **POS** (`apps/pos`) | In-store point of sale — offline-first PWA | Vite + React |
| **Gateway** (`apps/gateway`) | WebSocket + background workers | Node + BullMQ |

Shared packages under `packages/*`: `db`, `api`, `auth`, `ui`, `emails`, `i18n`. Shared tooling under `tooling/*`: `config-eslint`, `config-tsconfig`, `config-tailwind`.

## Quickstart

Prerequisites: Node 20.18+, pnpm 11+, Docker.

```bash
pnpm i
pnpm dev:infra           # spin up Postgres, Redis, Meilisearch, Mailpit, MinIO
pnpm db:migrate
pnpm db:seed
pnpm dev                 # run all apps in parallel
```

Apps default to:

- Storefront: <http://localhost:3000>
- Admin: <http://localhost:3001>
- POS: <http://localhost:5173>
- Gateway WS: `ws://localhost:4000`

## Scripts

| Script | What it does |
| --- | --- |
| `pnpm dev` | Run all apps in parallel via Turborepo |
| `pnpm build` | Build every app and package |
| `pnpm lint` | ESLint across the workspace |
| `pnpm typecheck` | `tsc --noEmit` across the workspace |
| `pnpm test` | Vitest unit/integration suites |
| `pnpm test:coverage` | Coverage report — 100% gate enforced in CI |
| `pnpm e2e` | Playwright end-to-end across desktop + mobile viewports |
| `pnpm a11y` | axe-core accessibility checks |
| `pnpm storybook` | Run the design system Storybook |
| `pnpm db:studio` | Drizzle Studio against local Postgres |
| `pnpm format` | Prettier across the workspace |
| `pnpm knip` | Find unused exports and dependencies |
| `pnpm audit` | Dependency vulnerability scan |

## Internationalization

Arabic (RTL) and English (LTR) are both first-class from day one. RTL is not bolted on — layouts are mirrored, typography is tuned per script, and every user-facing string is externalized in `packages/i18n`.

## Quality bar

- **TypeScript** end-to-end with `strict` + `noUncheckedIndexedAccess`. Zero `any`.
- **100% coverage** (statements, branches, functions, lines) — enforced in CI.
- **A11y** WCAG 2.2 AA — axe-clean, keyboard-only flows, screen-reader landmarks.
- **Performance** Lighthouse ≥ 95 on mobile for the storefront. LCP < 2.0 s, INP < 200 ms, CLS < 0.05.
- **Security** CodeQL + secret scanning + dependency review on every PR.

## Documentation

- [Architecture](docs/architecture.md)
- [ADRs](docs/adr/)
- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)

## License

UNLICENSED — proprietary.
