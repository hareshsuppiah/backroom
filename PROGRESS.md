# Backroom — Build Progress

> **TDD discipline acknowledged:** no production code ships without a failing test first.
>
> **Design discipline acknowledged:** every UI decision traces to `docs/DESIGN_SYSTEM.md`; no anti-patterns (§3) will ship.

Phase ordering comes from `docs/build-prompt.md` §6. Each phase ships as its own PR against `main`. Maintainer review gates are marked with :lock:.

---

## Phase 1 — Project scaffold :lock:

**Status:** in progress · branch `phase/01-scaffold`

### Shipped

- Next.js 15 + TypeScript strict, pnpm workspace
- Tailwind with design tokens (dark + light CSS vars per `docs/DESIGN_SYSTEM.md` §4, §7, §8)
- Semantic type scale (`display-lg` → `mono-sm`), 14px default body
- Geist Sans + Geist Mono via `next/font`
- `next-themes` with three-state toggle (System / Light / Dark), dark default, SSR-safe
- shadcn-style baseline components: `Button`, `Input`, `Card`, `Dialog`, `Table`, `Tabs`, `Select`, `DropdownMenu`, `Toast`, `Label`, `FormField` — restyled to tokens
- Landing page with "Backroom — coming soon", volt accent, mode toggle
- Dev-only `/dev/tokens` page rendering all tokens; 404 in production
- Vitest with 85% coverage gate on `lib/`
- Testing Library setup
- Playwright config (`retries: 0`) + smoke test
- Stryker mutation config (nightly CI)
- Supabase CLI `init` (config only, no migrations)
- Biome lint + format
- Husky pre-commit (`lint-staged`) + commit-msg (`commitlint`)
- Conventional commits enforced
- GitHub Actions CI: lint + anti-pattern check + typecheck + unit tests + e2e + build
- Nightly mutation-testing workflow
- Design-system anti-pattern grep guard (`scripts/check-antipatterns.mjs`)
- Red-green evidence commits (failing test → minimum green)
- Repo hygiene: AGPL-3.0 licence, PR template, `.env.example`, `.gitignore`, `.nvmrc`

### Blocked / pending

- Screenshot of `/dev/tokens` attached to the Phase 1 PR (pending maintainer review)
- Maintainer sign-off on `docs/DESIGN_SYSTEM.md` fidelity before proceeding to Phase 2

---

## Phase checklist (for future phases)

- [x] Phase 1 — Project scaffold :lock:
- [ ] Phase 2 — Supabase project & auth (magic link)
- [ ] Phase 3 — Organisations, memberships, department model :lock:
- [ ] Phase 4 — Items core with status transitions and audit log
- [ ] Phase 5 — Public intake form :lock:
- [ ] Phase 6 — Task queue views
- [ ] Phase 7 — Item detail, comments, attachments
- [ ] Phase 8 — Time tracking :lock:
- [ ] Phase 9 — Working calendars & business-hours math
- [ ] Phase 10 — SLA targets & breach flagging
- [ ] Phase 11 — Analytics dashboards :lock:
- [ ] Phase 12 — Notifications, email, weekly digest
- [ ] Phase 13 — Search, export, polish
- [ ] Phase 14 — Self-host packaging :lock: (= 1.0)
- [ ] Phase 15 — Simulation service scaffold (v2 foundation)
