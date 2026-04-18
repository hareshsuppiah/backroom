# Changelog

All notable changes to Backroom are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
