# Drizzle migrations

This folder holds SQL migrations produced by `drizzle-kit generate` from the
schema in `../src/schema/*.ts`.

`0000_initial.sql` is hand-authored to match the current schema so that a
fresh Postgres can be brought up before `pnpm install` is run for the first
time. Once dependencies are installed and Drizzle Kit is available, running
`pnpm --filter @nasij/db generate` should produce a byte-equivalent output —
if it doesn't, the schema drifted from this file and the generated output is
the source of truth; delete this file and accept the new one.

## Applying migrations

```bash
DATABASE_URL=postgres://nasij:nasij@localhost:55432/nasij \
  pnpm --filter @nasij/db migrate
```

## Generating new migrations

```bash
pnpm --filter @nasij/db generate
```

Each generated file is named `NNNN_descriptive_slug.sql` and gets an entry in
`meta/_journal.json`. Commit both files together; never edit a previously
shipped migration file — add a new one.
