# Backroom — Build Progress

> **TDD discipline acknowledged:** no production code ships without a failing test first.
>
> **Design discipline acknowledged:** every UI decision traces to `docs/DESIGN_SYSTEM.md`; no anti-patterns (§3) will ship.

Phase ordering comes from `docs/build-prompt.md` §6. Each phase ships as its own PR against `main`. Maintainer review gates are marked with :lock:.

---

## Next session — pick up here

Phase 2 PR is open: **https://github.com/hareshsuppiah/backroom/pull/3**

Before merging:

1. **Confirm or change the security disclosure email** in `SECURITY.md` (currently defaults to `haresh@humanperformance.sg`).
2. **Manual smoke test** (5 min). After restart, restart Docker, then:
   - `supabase start` (re-pulls keys; `.env.local` already has the well-known local-dev defaults)
   - `pnpm dev`
   - Visit http://localhost:3000/app → expect bounce to `/login`
   - Submit your email → expect "Check your inbox"
   - Open Inbucket http://127.0.0.1:54324 → click magic link → expect landing on `/app` showing your email
   - Click "Sign out" → expect redirect to `/login`
3. **Optional: `/codex review`** on the branch (it caught two real Tailwind bugs in Phase 1).
4. **Watch CI** finish all 8 jobs (lint, typecheck, audit, secrets-scan, unit, integration, e2e, build), then squash-merge.

Optional out-of-PR security-gate evidence (one-off): pin a vulnerable dep on a throwaway branch and confirm the `audit` job blocks it; commit a fake `AKIAIOSFODNN7EXAMPLE` AWS key on another throwaway branch and confirm the gitleaks pre-commit hook blocks it. Screenshot both and attach to the PR.

After Phase 2 merges: **stop**. Phase 3 is a maintainer-review checkpoint (:lock:) — wait for explicit go-ahead before starting.

---

## Phase 1 — Project scaffold :lock:

**Status:** shipped · merged as `469c726`

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

### Notes

- Two real Tailwind wiring bugs in the original draft were caught by `/codex review` and fixed in `26f540f` (semantic text colours) before merge.

---

## Phase 2 — Supabase auth + security baseline

**Status:** shipped · branch `phase/02-auth-and-security-baseline`

### Shipped

- `@supabase/ssr` browser, server (cookies-aware), and middleware clients in `lib/supabase/`
- First migration `20260423114802_orgs_profiles_memberships.sql`: `organisations`, `profiles`, `memberships` with RLS. Two `security definer` helpers (`user_organisation_ids`, `user_admin_organisation_ids`) avoid recursive RLS on `memberships` policies.
- Magic-link sign-in: `/login` Server Component + Client Component form, `sendMagicLink` Server Action with zod validation
- `/auth/callback` route handler: `exchangeCodeForSession` → `ensureProfileExists` (idempotent upsert) → redirect to `/app` (or preserved `next` path)
- `middleware.ts` at repo root + `app/(protected)/layout.tsx` defence-in-depth: unauthenticated `/app/*` requests redirect to `/login`
- Sign-out Server Action and ghost button on `/app`
- Integration test infrastructure: `vitest.integration.config.ts`, `tests/integration/setup.ts` (loads `.env.local`), `tests/integration/helpers/supabase-test-client.ts` (service-role + per-user anon clients, seed/teardown)
- RLS cross-tenant suite (7 assertions across `organisations`, `memberships`, `profiles`)
- Profile-upsert idempotency suite (3 assertions)
- Security baseline:
  - `.github/dependabot.yml` covering npm + github-actions + docker (weekly Mondays, grouped minor/patch, `chore(deps)` prefix)
  - `pnpm audit --audit-level=high --prod` CI job, wired into `build.needs`
  - `.gitleaks.toml` extending defaults; gitleaks pre-commit hook in `.husky/pre-commit`; `secrets-scan` CI job using `gitleaks/gitleaks-action@v2`
  - New `integration` CI job that boots local Supabase via `supabase/setup-cli@v1`, applies migrations, runs `pnpm test:integration`
  - `SECURITY.md` at repo root with disclosure email, response SLAs, scope
- `vitest.config.ts` excludes `lib/supabase/**` and `lib/auth/**` from the unit coverage gate (these are exercised by the integration suite at higher fidelity)

### Notes

- Local-dev Supabase keys are well-known public defaults baked into the local stack — they are NOT secrets. `.env.local` is gitignored.
- Defaults applied (override before broad release):
  - Disclosure email: `haresh@humanperformance.sg`
  - Dependabot timezone: Australia/Sydney
  - `pnpm audit --prod` (skips dev-only CVEs that don't ship)
- Phase 3 is a maintainer-review checkpoint (:lock:). Do not start until sign-off.

---

## Phase checklist (for future phases)

- [x] Phase 1 — Project scaffold :lock:
- [x] Phase 2 — Supabase auth (magic link) + security baseline (Dependabot, `pnpm audit`, gitleaks, `SECURITY.md`)
- [ ] Phase 3 — Organisations, memberships, department model :lock:
- [ ] Phase 4 — Items core with status transitions and audit log
- [ ] Phase 5 — Public intake form :lock:
- [ ] Phase 6 — Task queue views
- [ ] Phase 7 — Item detail, comments, attachments
- [ ] Phase 8 — Time tracking :lock:
- [ ] Phase 9 — Working calendars & business-hours math
- [ ] Phase 10 — SLA targets & breach flagging
- [ ] Phase 11 — Analytics dashboards :lock:
- [ ] Phase 12 — Notifications, email, weekly digest + per-user rate limiting
- [ ] Phase 13 — Search, export, polish + security headers (CSP, HSTS, etc.)
- [ ] Phase 14 — Self-host packaging :lock: (= 1.0) + SBOM + TLS guide
- [ ] Phase 15 — Simulation service scaffold + v2 webhook design note
- [ ] Phase 16+ (post-1.0, parked) — Public REST API, PATs, webhook implementation
