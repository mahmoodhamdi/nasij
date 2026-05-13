# Runbook — Deploy

This runbook walks through provisioning, secrets, and the first deploy. See
[ADR 0006](../adr/0006-deployment.md) for the decision context.

## Prerequisites

- A Vercel account in the `nasij` team.
- A Fly.io account with billing.
- A Neon project.
- An Upstash Redis database.
- A Cloudflare R2 bucket + access keys.
- A Resend API key.
- A Sentry project per app (storefront, admin, pos, gateway).
- A PostHog project.
- DNS access to `nasij.com` (Cloudflare or registrar).

## 1. Provision Postgres

```bash
neonctl projects create --name nasij
neonctl branches create --project-id <id> --name main
# Grab the pooler URL — that is the DATABASE_URL we use everywhere.
```

Apply schema:

```bash
DATABASE_URL=postgres://… pnpm --filter @nasij/db migrate
DATABASE_URL=postgres://… pnpm --filter @nasij/db seed
```

## 2. Provision Redis + R2

```bash
# Upstash console → create db → copy REST + native URL into Vercel/Fly secrets.
# Cloudflare R2 → create bucket → create API token → record S3 endpoint + keys.
```

## 3. Configure Vercel projects

For each of `storefront`, `admin`, `pos`:

```bash
vercel link --project nasij-<app>
vercel env add DATABASE_URL production
vercel env add REDIS_URL production
vercel env add AUTH_SECRET production
vercel env add S3_ENDPOINT production
vercel env add S3_ACCESS_KEY_ID production
vercel env add S3_SECRET_ACCESS_KEY production
vercel env add S3_BUCKET production
vercel env add RESEND_API_KEY production
vercel env add SENTRY_DSN production
vercel env add POSTHOG_KEY production
```

Project settings:

| App | Build cmd | Output |
| --- | --- | --- |
| storefront | `turbo run build --filter=storefront` | `.next` |
| admin | `turbo run build --filter=admin` | `.next` |
| pos | `turbo run build --filter=pos` | `apps/pos/dist` |

Custom domains:

- `nasij.com` (apex + www) → storefront
- `admin.nasij.com` → admin
- `pos.nasij.com` → pos

## 4. Deploy the gateway to Fly.io

```bash
cd apps/gateway
fly launch --copy-config --no-deploy --name nasij-gateway --region cdg
fly secrets set DATABASE_URL=… REDIS_URL=… SENTRY_DSN=…
fly deploy --remote-only
fly certs create gateway.nasij.com
```

Repeat for `nasij-workers` (the same image, different process group).

## 5. Connect observability

- Sentry: in each project, set release naming convention `nasij-<app>@<git-sha>`.
- PostHog: set the bootstrap config in `apps/storefront/src/lib/posthog.ts` (TBD).

## 6. Verify

Run the smoke flow on the live storefront:

```bash
gh workflow run smoke.yml --field env=staging
```

Manually:

1. Visit `https://nasij.com` and switch to Arabic. Verify RTL renders.
2. Add a product to cart. Verify the local storage key `nasij.cart.v1` is set.
3. Complete the checkout shell.
4. Log into `admin.nasij.com` with the seeded owner account.
5. Open `pos.nasij.com` on a tablet and complete a sample sale.

## 7. Rollback

| Surface | Command |
| --- | --- |
| Vercel | `vercel rollback` |
| Fly | `fly releases rollback <version>` |
| Neon | Point-in-time restore: `neonctl branches restore --pit <ts>` |

## 8. Postmortem template

After any incident in production, file a post-mortem under
`docs/postmortems/YYYY-MM-DD-slug.md` using
[the template](../postmortems/_TEMPLATE.md).
