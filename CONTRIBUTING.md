# Contributing

## Workflow

1. Cut a branch from `main`:
   ```bash
   git checkout -b <type>/<scope>-<short-desc>
   ```
   `type` ∈ { `feat`, `fix`, `chore`, `docs`, `test`, `refactor`, `perf`, `a11y`, `ci`, `security`, `build`, `style`, `revert` }.
2. Make a small focused change. Target ≤ 300 changed lines per PR; if larger, split.
3. Commit using [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   <type>(<scope>): <subject>
   ```
   One commit per logical change. If a message contains "and also", split it.
4. Push the branch and open a PR via `gh pr create`.
5. Wait for **all** CI checks to be green. Do not merge yellow or red.
6. Self-merge. Squash for tiny atomic changes, merge commit for stacked features — pick one and stay consistent.
7. Delete the branch.

## Local quality gates

Before pushing, locally:

```bash
pnpm lint
pnpm typecheck
pnpm test:coverage
```

Pre-commit hooks (Husky + lint-staged) auto-format and lint staged files. A `commit-msg` hook enforces Conventional Commits.

## Tests

Every change adds tests for new code and keeps coverage at 100% (statements / branches / functions / lines).

| Layer | Tool |
| --- | --- |
| Unit | Vitest |
| Component | Vitest + Testing Library |
| Integration | Vitest with a real Postgres in a CI service container |
| E2E | Playwright (desktop + mobile viewports, 360/414/768/1024/1440/1920) |
| Accessibility | axe-core via Playwright + Storybook addon |
| Visual | Playwright screenshot diff |
| Performance | size-limit + Lighthouse CI |
| Security | CodeQL, npm audit, secret scanning |

Banned in committed test code: `.only`, `.skip` without a tracked ticket reference, `.todo`, `console.log`.

## Architectural decisions

Every meaningful technical decision lives as an ADR under [docs/adr/](docs/adr/). Number them sequentially. State the decision, the alternatives, and why.

## Style

- TypeScript strict, no `any`. Use `unknown` + narrowing.
- ESLint clean (warnings fail CI).
- Prettier formats. EditorConfig keeps indentation honest.
- No `TODO`/`FIXME`/`XXX` in committed code — open an issue instead.
- No dead exports — `pnpm knip` runs in CI.
- No `console.log` outside of dev-only debug guards.

## Issues and PRs

Use the templates under `.github/ISSUE_TEMPLATE/` and `.github/PULL_REQUEST_TEMPLATE.md`. Link the PR to its issue with `Closes #N`.
