# Backroom

*Lightweight, open-source operations platform for performance departments in sport.*

Backroom tracks requests, measures turnaround, and — in v2 — simulates workload. User-defined departments. First-class time tracking. SLA analytics. Free to self-host.

> **Status:** Phase 1 — project scaffold. No feature code yet.

## What it is

- Operations platform for any department in a sport organisation
- User-defined departments, request types, and workflows
- Task and request management with first-class time tracking
- SLA-style analytics: response time, resolution time, time-in-status, utilisation
- Cross-department oversight for performance directors and department heads
- Open source, AGPL-3.0, self-hostable

## What it isn't

- An athlete management system. No wellness, training load, RPE, GPS, bloods.
- A medical or clinical records system. No injury notes, no screening results.
- A Teamworks / Smartabase / Kitman Labs / Iterpro replacement.

The full product brief is in [`docs/product-brief.md`](docs/product-brief.md).
The build contract is [`docs/build-prompt.md`](docs/build-prompt.md).
The design system is [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md). **Read it before writing UI.**

## Getting started

Prerequisites:

- Node **20+**
- pnpm **10+**
- Supabase CLI (for Phase 2 onwards)

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start Next.js dev server |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Biome check |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Vitest unit + component tests |
| `pnpm test:coverage` | Tests with coverage gate (fails below 85% on `lib/`) |
| `pnpm test:e2e` | Playwright end-to-end tests |
| `pnpm test:mutation` | Stryker mutation tests |
| `pnpm check:antipatterns` | Fail build on raw palette classes |

## Development discipline

Two rules, equally load-bearing:

1. **TDD is mandatory.** Red, green, refactor. No production code ships without a failing test first. See [`docs/build-prompt.md`](docs/build-prompt.md) §0.
2. **Design decisions trace to `docs/DESIGN_SYSTEM.md`.** No raw Tailwind palette classes. No anti-patterns from §3.

See [`PROGRESS.md`](PROGRESS.md) for phase tracking.

## Contributing

Issues and PRs welcome once Phase 1 merges. See [`docs/development.md`](docs/development.md).

## Licence

[AGPL-3.0-only](LICENSE). If you run a modified Backroom as a service, your modifications must be open-sourced.
