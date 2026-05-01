# CLAUDE.md — Backroom project guide

Backroom is an open-source operations platform for performance departments in sport. Single maintainer (Haresh Suppiah, sport-science academic at La Trobe; not a software developer day-to-day, so explain non-obvious technical choices in plain language when a decision is needed). AGPL-3.0, public on GitHub at `hareshsuppiah/backroom`.

## Read these first, every session

Before proposing any work, read in this order:

1. `PROGRESS.md` (repo root) — current phase status, what shipped, what's next, any pending maintainer sign-off.
2. `docs/build-prompt.md` — the authoritative contract. Phase ordering (§6), TDD discipline (§0, §8), data model (§4), permanent non-goals (§10), maintainer-review checkpoints (§15).
3. `docs/DESIGN_SYSTEM.md` — token pipeline, anti-patterns (§3), type scale, modes.
4. `docs/product-brief.md` — what this product is for and who uses it.

If `PROGRESS.md` and the spec disagree, trust the spec — `PROGRESS.md` may have drifted.

## Phase discipline

Phases land one PR at a time, in order, against `main`. Branch name: `phase/NN-slug`.

**Never skip a phase. Never start a phase before its predecessor has merged.**

These phases are maintainer-review checkpoints (the `:lock:` rows in `PROGRESS.md`):

> Phase 1, 3, 5, 8, 11, 14

Before starting a checkpoint phase, wait for explicit sign-off from Haresh. After merging a checkpoint phase, also pause — the next phase still needs the green light.

If a phase is *not* a checkpoint, the PR can self-merge once CI is green and Haresh has reviewed it.

## TDD discipline

Non-negotiable. From `docs/build-prompt.md` §0:

- Every line of production code is written to satisfy a failing test.
- Red commit first (`test: <what's being tested>`), green commit second (`feat:` or similar with the minimum code to pass), refactor commits separately if needed.
- Reviewers must be able to scrub the PR history and see the red→green pairs. Cite them explicitly in the PR body using a small table.
- Server Actions and route handlers are tested before they exist — write the failing test against `tests/integration/` (real local Supabase) or `tests/auth/` (unit + mocks) first.
- Never commit production code without a test demanding it.

Stub-and-fail is acceptable for the red commit when an unresolvable import would otherwise break the test loader: write a stub that returns the wrong value so assertions fail at the assertion line, not at module resolution. The Phase 2 commits use this pattern.

## Design discipline

- All colour, spacing, motion, radius decisions reference design tokens. No raw Tailwind palette classes (`bg-blue-500`, `text-gray-700`, etc.). The CI grep `pnpm check:antipatterns` enforces this against `app/` and `components/` (`scripts/check-antipatterns.mjs`).
- Reuse Phase 1 primitives in `components/ui/` (Button, Input, Label, FormField, Card, Dialog, Tabs, Select, Table, DropdownMenu, Toast). Do not invent new components when an existing one fits.
- Both dark and light modes must work. Default is dark; the three-state toggle (System / Light / Dark) is wired via `next-themes`.
- Empty / error / loading states are designed alongside the happy path, not after.

## Commit and PR conventions

- Conventional Commits, single imperative line. No multi-paragraph bodies, no diagnostic scalars in the message.
- **Never** add `Co-Authored-By` lines. Commits appear as Haresh's sole work.
- British English in any user-visible text, docs, and copy (`organisation`, `colour`, `analyse`).
- PR template lives at `.github/PULL_REQUEST_TEMPLATE.md` — its checklist is required for this project even though Haresh's global preferences avoid heavy structure elsewhere. The template explicitly asks for red→green evidence; cite the commit pairs in a small table.
- Husky pre-commit runs `lint-staged` (Biome) plus `gitleaks protect --staged`. Commit-msg runs `commitlint` (`@commitlint/config-conventional`).
- Direct pushes to `main` are blocked by the harness. Always go via PR. If `main` truly needs a hand-applied commit, ask Haresh to push it.

## Local development

- Node 20+, pnpm 10+, Docker Desktop running (for Supabase).
- `pnpm install`. If `pnpm` warns about `onlyBuiltDependencies`, run `pnpm rebuild` once.
- `supabase start` boots the local stack (Postgres, Auth, Storage, Realtime, Studio on `:54323`, Inbucket email viewer on `:54324`).
- `supabase status -o env` prints the local-dev keys. They are well-known public defaults baked into the Supabase CLI — not secrets — but `.env.local` is gitignored anyway.
- `pnpm dev` runs Next on `:3000`.
- Magic-link emails in dev land in Inbucket (http://127.0.0.1:54324), not real inboxes.

Useful one-liners:

| Command | What it does |
| --- | --- |
| `pnpm dev` | Next dev server |
| `pnpm test` | Vitest unit + component (jsdom) |
| `pnpm test:integration` | Vitest integration against local Supabase (node) |
| `pnpm test:coverage` | Unit suite + coverage gate (85% on `lib/**` minus exclusions) |
| `pnpm test:e2e` | Playwright |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | Biome |
| `pnpm check:antipatterns` | Design-system grep guard |
| `pnpm db:reset` | `supabase db reset` (re-applies migrations + seed) |
| `pnpm build` | Next production build |

## Test layout

- `tests/**/*.test.{ts,tsx}` — unit + component, jsdom env, fast. Coverage gated at 85% on `lib/**` (excluding `lib/supabase/**` and `lib/auth/**` which are covered by the integration suite).
- `tests/integration/**/*.test.ts` — runs in node env via `vitest.integration.config.ts` against a real local Supabase. Helpers in `tests/integration/helpers/supabase-test-client.ts`. Setup at `tests/integration/setup.ts` loads `.env.local`.
- `e2e/**/*.spec.ts` — Playwright, retries 0.

When testing Server Actions or route handlers that need a Supabase client, mock at the module boundary (`vi.mock("@/lib/supabase/server", ...)`); never call real Supabase from a unit test.

When testing RLS policies or anything DB-shaped, use the integration suite. Mocked unit tests would only prove that the mocks work.

## Tech stack snapshot

- Next.js 15 App Router, TypeScript strict, React 19
- pnpm 10, Node 20
- Tailwind 3 with CSS-variable token pipeline (dark + light)
- shadcn-style primitives wrapped around Radix (Dialog, Tabs, Select, Toast, etc.) restyled to tokens
- `next-themes` for the three-state mode toggle
- Geist Sans + Geist Mono via `next/font`
- Supabase: Postgres 17, Auth (magic link only — never passwords), Storage, Realtime
- `@supabase/ssr` for browser/server/middleware clients (NOT `@supabase/auth-helpers-nextjs`, which is deprecated)
- zod for schema validation
- Vitest + Testing Library + Playwright + Stryker (mutation, nightly)
- Biome (lint + format), Husky + lint-staged + commitlint
- gitleaks (pre-commit + CI), Dependabot (npm + github-actions + docker), `pnpm audit --audit-level=high --prod`

## Permanent non-goals (build-prompt §10)

Backroom is **not** Smartabase, Iterpro, or a competing performance-data platform. The following will never be added:

- Athlete wellness, training load, RPE, GPS, medical, clinical, injury, screening, or doctor's-notes data of any kind
- Athlete accounts or portals beyond the read-only status-link page
- Contracts, finance, transfer market, scouting, video analysis, match event data, tactical tools
- Native iOS or Android apps (PWA only)
- Chat or messaging features beyond item comments
- Real-time collaboration on item descriptions
- Time-tracking billing, invoicing, client-side payroll
- Slack / Teams / Google Calendar integration in v1
- Custom workflow builder beyond the per-org workflow editor
- Multi-region deployment orchestration in v1

If a feature request would land any of the above, push back and reference §10.

## Repo layout

```
backroom/
  app/                      Next App Router
    (auth)/                 login, /auth/callback, sign-out action
    (protected)/            session-guarded routes (e.g. /app)
    dev/tokens/             dev-only design-token showcase (404 in prod)
  components/ui/            Phase 1 primitives (reuse, do not reinvent)
  lib/
    supabase/               browser, server, middleware clients
    auth/                   profile upsert helper
    cn.ts                   tailwind-merge + clsx with custom font-size group
  middleware.ts             Next middleware: session refresh + /app/* redirect
  supabase/
    config.toml             local stack config
    migrations/             SQL migrations (timestamp-prefixed)
  scripts/
    check-antipatterns.mjs  CI grep guard for design-system violations
  tests/                    unit + component (jsdom)
    integration/            integration tests (node + local Supabase)
    auth/                   auth Server Action + middleware unit tests
  e2e/                      Playwright
  docs/
    build-prompt.md         authoritative spec (current: v1.3)
    DESIGN_SYSTEM.md        tokens, anti-patterns, type scale, modes
    product-brief.md        product context
  .github/
    workflows/ci.yml        lint, typecheck, audit, secrets-scan, unit, integration, e2e, build
    dependabot.yml          weekly npm + github-actions + docker
    PULL_REQUEST_TEMPLATE.md
  .husky/                   pre-commit (lint-staged + gitleaks), commit-msg (commitlint)
  PROGRESS.md               phase status (read first every session)
  CHANGELOG.md              Keep-a-Changelog
  SECURITY.md               disclosure policy
  CLAUDE.md                 this file
```

## When in doubt

Ask Haresh. The cost of a clarifying question is low; the cost of building the wrong thing in a phased project is high.
