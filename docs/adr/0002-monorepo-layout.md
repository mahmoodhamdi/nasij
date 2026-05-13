# ADR 0002 — Monorepo layout and module boundaries

- Status: Accepted
- Date: 2026-05-13

## Decision

```
apps/
  storefront/        Next.js 15 — customers
  admin/             Next.js 15 — owner/admin
  pos/               Vite + React PWA — in-store sales
  gateway/           Node WebSocket + BullMQ workers
packages/
  db/                Drizzle schema, migrations, seed, repos
  api/               tRPC routers; REST adapters for webhooks
  auth/              Sessions, RBAC, password/TOTP/PIN helpers
  ui/                Design system; Storybook lives here
  emails/            React Email templates
  i18n/              Catalogs + helpers
tooling/
  config-eslint/     Shared ESLint flat config
  config-tsconfig/   Shared tsconfig presets
  config-tailwind/   Shared Tailwind + design tokens
infra/
  docker-compose.yml Local dev infra (Postgres, Redis, Meilisearch, Mailpit, MinIO)
docs/
  architecture.md
  adr/
```

## Module boundary rules

- Apps depend on packages. Packages do not depend on apps.
- `packages/api` is the only package that imports `packages/db`. Apps import `packages/api` types/clients, not `packages/db` directly.
- `packages/ui` has no runtime dependency on `packages/api`. UI components receive data via props.
- `packages/auth` exposes framework-agnostic helpers plus thin Next.js / Vite adapters under sub-paths.
- ESLint rule (`@nasij/eslint-config`) enforces these import graphs.

## Naming

- Packages publish under the `@nasij/` scope (private). Examples: `@nasij/db`, `@nasij/api`, `@nasij/ui`.
- Apps are not published; their `name` field uses the unscoped form: `storefront`, `admin`, `pos`, `gateway`.

## Consequences

- A single `pnpm i` at the root produces a coherent install across all apps and packages.
- Turborepo `globalDependencies` includes `tsconfig.base.json` so any base config change re-triggers downstream builds.
- Cross-package imports go through `package.json#exports`; nothing imports across `src/` boundaries directly.
