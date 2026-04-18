# Development setup

## Prerequisites

- **Node 20+** (pinned via `.nvmrc`; `nvm use` if you have nvm)
- **pnpm 10+**
- **Supabase CLI 2+** (Homebrew: `brew install supabase/tap/supabase`) — used from Phase 2
- Optional: Docker Desktop for the self-host path in Phase 14

## First run

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

The app boots at `http://localhost:3000`. The landing page is all that exists in Phase 1.

## Dev-only routes

- `/dev/tokens` — visual showcase of the design system. Rendered when `NODE_ENV !== "production"`, or when `BACKROOM_SHOW_DEV_TOKENS=true`.

## Red-green-refactor loop

Every piece of production code is written to satisfy a failing test. The workflow:

1. Write a failing test. Run it. Confirm it fails for the right reason.
2. Write the minimum code to turn it green. Run the whole suite.
3. Refactor while keeping tests green.

Run `pnpm test:watch` while you work. CI gates on the full suite plus coverage on `lib/`.

Evidence of the cadence is required in every PR. See `docs/build-prompt.md` §0.

## Design discipline

Before writing a component, skim `docs/DESIGN_SYSTEM.md`. Key rules:

- Use semantic token classes (`bg-base`, `text-primary`, `accent`) — never Tailwind's default palette
- No `rounded-2xl` or higher on general UI
- No hover scale transforms
- Dark mode first; light is a considered translation
- Empty, error, and loading states are designed, not placeholders

`pnpm check:antipatterns` runs the same grep guard CI uses.

## Scripts reference

See [`README.md`](../README.md) for the full script list.

## Testing layers

| Layer | Tool | Where |
| --- | --- | --- |
| Unit | Vitest | `tests/**/*.test.ts` |
| Component | Vitest + Testing Library | `tests/**/*.test.tsx` |
| Integration | Vitest + local Supabase | `tests/integration/` (added Phase 2+) |
| End-to-end | Playwright | `e2e/**/*.spec.ts` |
| Mutation | Stryker (nightly only) | `lib/` |

## Commits

Conventional commits enforced via commitlint:

```
feat: add item type editor
fix(queue): preserve filters on refresh
test: add failing test for timer auto-pause
refactor(lib/business-hours): extract holiday lookup
```

Never skip hooks (`--no-verify`) unless the maintainer has asked you to.
