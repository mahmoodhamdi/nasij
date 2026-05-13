# ADR 0004 — Quality gates and CI policy

- Status: Accepted
- Date: 2026-05-13

## Decision

CI pipeline runs the following stages, in order, on every PR and every push to `main`:

```
install → lint → typecheck → unit → component → integration → build →
e2e → a11y → bundle-size → coverage-gate → lighthouse-ci → security
```

Each stage is a separate GitHub Actions job; later stages depend on earlier ones via `needs:` to fail fast. Cache restores on a hit of pnpm-lock.yaml.

### Coverage

- 100% on statements, branches, functions, lines.
- Per-package Vitest configs enforce thresholds; CI fails below.
- `/* istanbul ignore */` and `c8 ignore` annotations are banned by ESLint rule. If a line is truly untestable, refactor it out.

### Type safety

- `tsc --noEmit` clean across the workspace.
- ESLint rule `@typescript-eslint/no-explicit-any: error`. Use `unknown` + narrowing.

### Accessibility

- axe-core run as part of Playwright suite — zero violations at WCAG 2.2 AA.
- Keyboard-only flows tested for the storefront's checkout, the admin's product editor, and POS' sale flow.
- Both Arabic (RTL) and English (LTR) tested for every page that has a corresponding test.

### Performance

- `size-limit` budgets per app, failing CI on regression.
- Lighthouse CI runs on every PR for the storefront against a list of representative URLs (home, PLP, PDP, cart, checkout). Mobile budget: ≥ 95 in all four categories.

### Security

- CodeQL on every PR.
- `pnpm audit --audit-level=moderate` in CI.
- Dependabot weekly for npm and GitHub Actions.
- Repo-level secret scanning enabled.

## Consequences

- Every feature PR is also a test PR; we never ship feature code without raising tests with it.
- Coverage gate forces small, testable units. Encourages refactor-as-you-add.
- A11y is verified mechanically *and* manually; reviewers should still keyboard-walk a feature before merging.
