# Changelog

All notable changes to Backroom are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.2] — Phase 2: Supabase auth + security baseline

### Added

- `@supabase/ssr` browser, server, and middleware clients in `lib/supabase/`
- First migration: `organisations`, `profiles`, `memberships` with row-level security; `security definer` helpers avoid recursive RLS on `memberships`
- Magic-link sign-in: `/login` form + `sendMagicLink` Server Action (zod-validated)
- `/auth/callback` route handler exchanges the code, upserts the profile (idempotent), redirects to `/app`
- Protected `/app` route via `middleware.ts` + `app/(protected)/layout.tsx` defence-in-depth check
- Sign-out Server Action and ghost button on `/app`
- Integration test stack: separate `vitest.integration.config.ts`, helpers for service-role and per-user anon clients, RLS cross-tenant assertions, profile-upsert idempotency assertions
- `.github/dependabot.yml` for npm, github-actions, and docker (weekly, grouped minor/patch)
- `pnpm audit --audit-level=high --prod` CI job, wired into `build.needs`
- gitleaks pre-commit hook (Husky) and `secrets-scan` CI job using `gitleaks/gitleaks-action@v2`
- `integration` CI job that boots a local Supabase stack via `supabase/setup-cli@v1`
- `SECURITY.md` with disclosure contact and response SLAs
- `.gitleaks.toml` allowlisting build artefacts and lockfiles

### Changed

- `vitest.config.ts` excludes `lib/supabase/**` and `lib/auth/**` from the 85% coverage gate — these are exercised by the integration suite
- `package.json` adds `test:integration` and `db:reset` scripts
- Build prompt previously bumped to v1.3 (security baseline folded into Phase 2; per-user rate limiting in Phase 12; security headers in Phase 13; SBOM/TLS in Phase 14; outbound webhook design note in Phase 15; post-1.0 parking lot for Public REST API, PATs, webhook implementation). No new phases; no non-goals compromised.

## [0.0.1] — Phase 1: project scaffold

### Added

- Next.js 15 App Router with TypeScript strict, pnpm as the package manager
- Tailwind token pipeline mapped to CSS variables for dark (primary) and light modes
- Semantic type scale (`display-lg` through `mono-sm`); 14px default body
- Geist Sans + Geist Mono loaded via `next/font`
- `next-themes` theme provider with three-state toggle (System / Light / Dark), dark default
- Baseline UI components restyled to tokens: Button, Input, Card, Dialog, Table, Tabs, Select, DropdownMenu, Toast, Label, FormField
- Placeholder 4×4 logomark (top-right cell in Volt)
- Landing page at `/` with "Backroom — coming soon"
- Dev-only `/dev/tokens` showcase (returns 404 in production)
- Vitest + `@testing-library/react` with 85% coverage gate on `lib/`
- Playwright config (`retries: 0`) with smoke test
- Stryker mutation testing configuration (nightly workflow)
- Supabase CLI scaffolding (`supabase init`)
- Biome lint and format
- Husky + `lint-staged` pre-commit + commitlint commit-msg
- GitHub Actions CI: lint, anti-pattern check, typecheck, unit tests, Playwright, build
- Nightly Stryker workflow
- AGPL-3.0 licence, PR template, `.env.example`, `.gitignore`, `.nvmrc`
- Red-green evidence commit proving the TDD loop
