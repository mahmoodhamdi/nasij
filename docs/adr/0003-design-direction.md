# ADR 0003 — Design direction

- Status: Accepted
- Date: 2026-05-13

## Context

The brief explicitly forbids the default "AI demo landing page" aesthetic: Inter/Geist with purple-blue gradients, stock shadcn defaults, or Linear-clone monochrome. We are dressing a clothing retailer, so the design should read editorial-fashion, not SaaS-dashboard.

## Decision

### Typography

- **Latin display:** Fraunces (variable, optical-size axis). Used for hero copy, editorial headings, product names on PDP.
- **Latin text:** General Sans (variable). Used for body, UI, navigation.
- **Arabic display:** 29LT Bukra (variable). Confident, contemporary, balanced with Fraunces' x-height.
- **Arabic text:** IBM Plex Sans Arabic. Excellent reading rhythm, harmonious with General Sans.
- Numerals tabulated in tables, oldstyle in body.
- All fonts self-hosted via `@fontsource-variable/*` where available; the rest as woff2 in `apps/*/public/fonts`.

### Color tokens

A two-mode token system with semantic roles. Brand accent is a warm terracotta (`--accent-500: #c46a4f`) paired with a stone neutral. Both light and dark modes generate from the same hue families; contrast is verified at every step (50, 100, 200, …, 950).

Semantic roles:

```
surface           page background
surface-raised    cards, dialogs
surface-sunken    inset panels (cart drawer, drawers)
text              primary text
text-muted        secondary text
text-subtle       tertiary text and metadata
border            default borders
border-strong     dividers
accent            primary CTAs, brand accents
success / warning / danger / info
```

### Layout

- Storefront grid: 12 columns, 80px outer gutter on desktop, asymmetric editorial sections, generous whitespace.
- Admin: 12-col with a denser 8px baseline grid; sidebar nav 240px collapsed → 64px.
- POS: 8-col grid optimized for 10–12" tablets; minimum touch target 48px.

### Motion

- Animation tokens for duration (`fast 120ms`, `base 240ms`, `slow 400ms`) and easing (`emphasized`, `standard`, `decelerate`, `accelerate`).
- All motion respects `prefers-reduced-motion` by collapsing to instant transitions.
- No splash-zooms on landing.

### Icons

- Lucide icons only. Stroke 1.5 throughout; never mix weights.

### Imagery

- Real-looking placeholders sourced from Unsplash in dev (with attribution recorded in the seed script).
- `next/image` with explicit `sizes` everywhere; the storefront's hero LCP image is `priority` and preloaded.

### Dark mode

- Token-driven, not "invert everything". Verified at every shade for AA contrast on text and AA-large for headings.

## Consequences

- Self-hosting commercial fonts (29LT Bukra) requires a license; tracked as an open item in [docs/architecture.md](../architecture.md) until license is procured. Until then, we ship `Cairo` as an open-source Arabic display fallback gated behind a CSS feature flag.
- All design tokens live in `tooling/config-tailwind`. UI components in `packages/ui` consume them via Tailwind theme. Apps never hardcode hex.
