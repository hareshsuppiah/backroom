# Backroom — Build Prompt for Claude Code

This is the canonical build document for Backroom, an open-source operations platform for performance departments in sport. Work through this document phase by phase. Do not skip phases. Do not expand scope.

---

## 0. How to work on this project

### Red-Green-Refactor is mandatory (TDD)

**Every piece of production code is written to satisfy a failing test.** This is not a style preference for this project. It is the working discipline. Violating it is a bug, not a shortcut.

The loop:

1. **Red**: write one failing test that describes the next small increment of behaviour. Run the test. Confirm it fails for the right reason (not a syntax error, not a missing import). Commit the failing test with message `test: <what's being tested>` or stage it for the same commit as the green.
2. **Green**: write the minimum production code needed to make that test pass. Nothing more. Run the full suite. Confirm the target test is now green and nothing else broke. Commit with `feat:` / `fix:`.
3. **Refactor**: improve the code while keeping every test green. Run the suite after each meaningful change. Commit with `refactor:`.

Repeat. Keep the red-green cycle short. A minute or two in red, a minute or two in green, then refactor. If you're in red for more than twenty minutes, the test is too big. Split it.

**Rules that follow from this:**

- **No untested production code ships.** If you write a line of production code without a test demanding it, delete the line and start over
- **No test is written after the code it tests.** Test-after is banned. If you catch yourself having written code with no red test behind it, the fix is to revert and restart, not to backfill
- **The PR must show evidence of the red-green cadence.** CI must contain a step that runs the full test suite and fails the PR if any test fails. Reviewers (including you, self-reviewing) should be able to see tests in the diff paired with the code that satisfies them
- **RLS policies are tested before they're written.** Write a test that proves user A cannot see org B's data. Watch it fail (no policy). Add the policy. Watch it pass. This is the only acceptable way to add RLS
- **Business logic is tested before it's coded.** Business-hours calculator, SLA breach detector, time-in-status computer, permission resolvers: all of these land via TDD
- **Server Actions are tested before they're implemented.** The integration test for an action is written first, against a local Supabase test database, and watched to fail
- **UI components get component tests for interactive behaviour.** Presentational styling does not need tests, but anything with state, callbacks, conditional rendering, or keyboard handlers does
- **End-to-end tests are added at the start of each user-facing phase, not at the end.** Write the Playwright test for the happy path first. Watch it fail. Implement until it passes

When Claude is reviewing its own work, the question is never "does the code work" — it is "does every line of code exist because a test demanded it". If the answer is no anywhere, revert and redo that section.

### Ground rules
- Read this entire document before touching code
- Maintain a running `PROGRESS.md` in the repo root. Update it at the end of every phase with what shipped, what's blocked, what's next
- Commit frequently with Conventional Commits style: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`
- Red commits (failing tests) are fine to push to a feature branch. They must not merge to `main`. Main is always green
- Open a pull request for each phase against `main`. Self-review before merging
- Never commit secrets. Use `.env.local` locally and GitHub Actions secrets for CI
- When in doubt, keep it simple. Backroom's reputation is staked on being lightweight

### Definition of done for each phase
- **TDD evidence visible in the PR**: tests appear in the diff alongside the code that satisfies them, and commit history shows red-then-green cadence
- Acceptance criteria met (listed per phase below)
- Every Server Action has an integration test. Every piece of non-trivial logic in `lib/` has a unit test. Every user-facing journey listed in the phase has a Playwright test
- Coverage on `lib/` and `app/**/actions.ts` is at least 85%. Coverage is a floor, not a target. Low coverage blocks merge; high coverage alone does not pass the phase
- Full test suite passes on CI with no skipped tests. `it.skip`, `test.skip`, `describe.skip` are banned except with a linked GitHub issue and a tracked deadline
- Types pass (`tsc --noEmit`)
- Lint passes
- Mutation testing or equivalent rigour: at least the business-hours calculator and SLA breach detector pass Stryker mutation testing with ≥ 70% mutation score (other modules are optional but encouraged)
- Documentation updated
- `PROGRESS.md` updated
- Pull request merged to `main`

### If a test is painful to write, the design is wrong
When a test becomes awkward, the instinct is to relax the test. Do not do this. The awkwardness is signal that the code under test has a design problem. Refactor the production code (while keeping tests green via seams) until the test becomes natural. Only then move on.

### If you get stuck
Stop. Write the blocker into `PROGRESS.md` with specifics (what you tried, what failed, what you need). Do not improvise around fundamental issues. Architectural decisions in this document are not negotiable without explicit discussion. A stuck TDD cycle (can't figure out how to test something) is usually a design problem, not a tooling problem — step back and reconsider the shape of the code before reaching for workarounds.

---

## 1. Product summary

Backroom is an internal tool with an external submission layer. Staff (performance directors, heads of department, practitioners) work inside the application. Coaches and athletes only interact with a public request submission form and a status page, with no account.

Three pillars, all shipped in v1:
1. **Request intake** — public submission form, no login, auto-routed to the right department
2. **Task management** — clean queue with time tracking
3. **Oversight** — dashboards for department heads and performance directors

Cross-cutting analytics layer in v1: Time to First Response, Time to Resolution, Time in Status, Utilisation, SLA breach flagging.

v2 adds a **simulation layer** (discrete event simulation for workload forecasting). v1 data model must capture enough event history to support this later.

Full product context lives in `Backroom_Brief_v02.md`. This document is the build contract.

**Explicit non-goals (do not build):**
- Athlete wellness, training load, RPE, GPS, medical, or clinical data
- Contracts, finance, transfer market, scouting, video
- Native mobile apps (PWA only)
- Messaging or chat beyond task comments
- Any feature that turns this into Smartabase or Iterpro

---

## 2. Tech stack (final, non-negotiable)

### Core application
- **Next.js 15** (App Router) with TypeScript strict mode
- **Supabase**: Postgres, Auth (magic link), Storage, Realtime
- **Tailwind CSS** + **shadcn/ui** for components
- **React Hook Form** + **Zod** for forms and validation
- **TanStack Query** for client-side data fetching where SSR/RSC isn't enough
- **Lucide icons**
- Node 20 LTS

### Email
- **Resend** for hosted version
- **Nodemailer** + SMTP for self-host

### Auth
- Supabase Auth with magic links only. No passwords. Ever.

### Testing
- **Vitest** for unit tests
- **Playwright** for end-to-end tests
- **@testing-library/react** for component tests

### Tooling
- **pnpm** as package manager
- **Biome** or **ESLint + Prettier** (pick Biome if greenfield)
- **Husky** + **lint-staged** for pre-commit hooks
- **Conventional Commits** via commitlint

### Deployment
- **Vercel** for hosted version
- **Docker Compose** for self-host (Next.js + Supabase self-hosted)

### v2 simulation service (scaffolded in v1, built in v2)
- **Python 3.12** + **FastAPI** + **SimPy** + **SciPy**
- Runs as a separate service. Reads from a Postgres read-replica. No direct DB writes.
- Not built in v1. Scaffold the directory and docker-compose entry only.

---

## 3. Architecture overview

### High-level
```
Browser (staff UI, internal)
Browser (public intake form, unauthenticated)
    │
    ▼
Next.js 15 (App Router)
    │  RSC for reads, Server Actions for writes
    ▼
Supabase (Postgres + Auth + Storage + Realtime)
    │
    └─ Triggers ──► audit_log (append-only)
    └─ Row Level Security (RLS) on every PII table
    └─ Cron jobs (Supabase Edge Functions) ──► weekly digest, SLA breach checks

Separate service (v2, not v1):
Python FastAPI + SimPy  ←  reads from Postgres read-replica
```

### Rendering strategy
- **Public routes** (intake form, status page): Server Components, cacheable where possible
- **Authenticated routes**: Server Components for initial render, Server Actions for mutations, Client Components only where interactivity demands
- **Realtime updates**: Supabase Realtime subscriptions on task queue and dashboard views

### Multi-tenancy
- Every user belongs to one or more `organisations` via `memberships`
- Every data row is scoped by `organisation_id`
- Row Level Security enforces tenant isolation at the database level
- Never rely on application-level filtering alone for security

### Public submission flow
1. Each organisation has one or more public intake URLs. Format: `backroom.app/submit/{org_slug}` or custom domain
2. Submission form loads without auth. Request type list and custom fields come from the organisation's configuration
3. On submit, a Server Action creates an `item` row tagged `origin='public'` with `submitter_email` and `submitter_name` captured
4. A signed status link is returned: `backroom.app/status/{item_id}?token={signed_jwt}`
5. The submitter can view status via the link. No login, no account, no history across requests

---

## 4. Data model

Create Supabase migrations in `supabase/migrations/`. Use one migration file per phase below.

### Core tables (v1)

```sql
-- Organisations (tenants)
organisations (
  id uuid PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  settings jsonb DEFAULT '{}'::jsonb,  -- timezone, default calendar, etc
  template_used text  -- which starter template seeded this org
)

-- User profiles, one per auth user
profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text,
  avatar_url text,
  default_organisation_id uuid REFERENCES organisations(id),
  created_at timestamptz DEFAULT now()
)

-- Memberships link users to organisations with organisation-wide role
memberships (
  id uuid PRIMARY KEY,
  organisation_id uuid NOT NULL REFERENCES organisations(id),
  profile_id uuid NOT NULL REFERENCES profiles(id),
  org_role text NOT NULL CHECK (org_role IN ('admin', 'member')),
  created_at timestamptz DEFAULT now(),
  UNIQUE (organisation_id, profile_id)
)

-- Departments are user-defined
departments (
  id uuid PRIMARY KEY,
  organisation_id uuid NOT NULL REFERENCES organisations(id),
  slug text NOT NULL,
  name text NOT NULL,
  description text,
  colour text DEFAULT '#0D9488',
  position integer NOT NULL DEFAULT 0,
  archived_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE (organisation_id, slug)
)

-- Per-department membership with role
department_memberships (
  id uuid PRIMARY KEY,
  department_id uuid NOT NULL REFERENCES departments(id),
  profile_id uuid NOT NULL REFERENCES profiles(id),
  dept_role text NOT NULL CHECK (dept_role IN ('head', 'practitioner', 'viewer')),
  created_at timestamptz DEFAULT now(),
  UNIQUE (department_id, profile_id)
)

-- Item types are templates for tasks and requests (per department)
item_types (
  id uuid PRIMARY KEY,
  organisation_id uuid NOT NULL REFERENCES organisations(id),
  department_id uuid REFERENCES departments(id),
  slug text NOT NULL,
  name text NOT NULL,
  description text,
  icon text,
  is_public boolean DEFAULT false,  -- exposed on public intake form
  custom_fields jsonb DEFAULT '[]'::jsonb,  -- schema for extra fields
  workflow_id uuid REFERENCES workflows(id),
  default_priority text DEFAULT 'medium',
  position integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE (organisation_id, slug)
)

-- Workflows define status transitions
workflows (
  id uuid PRIMARY KEY,
  organisation_id uuid NOT NULL REFERENCES organisations(id),
  name text NOT NULL,
  states jsonb NOT NULL,  -- ordered array: [{slug, name, type: 'open'|'active'|'waiting'|'done'}]
  default_state_slug text NOT NULL,
  created_at timestamptz DEFAULT now()
)

-- Items are the universal task/request entity
items (
  id uuid PRIMARY KEY,
  organisation_id uuid NOT NULL REFERENCES organisations(id),
  department_id uuid NOT NULL REFERENCES departments(id),
  item_type_id uuid REFERENCES item_types(id),
  workflow_id uuid REFERENCES workflows(id),
  title text NOT NULL,
  description text,
  status_slug text NOT NULL,  -- current workflow state
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  origin text NOT NULL CHECK (origin IN ('public', 'internal')) DEFAULT 'internal',
  submitter_profile_id uuid REFERENCES profiles(id),  -- if origin='internal'
  submitter_name text,   -- if origin='public'
  submitter_email text,  -- if origin='public'
  submitter_meta jsonb DEFAULT '{}'::jsonb,  -- e.g. sport, squad, athlete name for tagging
  assignee_profile_id uuid REFERENCES profiles(id),
  due_at timestamptz,
  estimate_minutes integer,
  custom_field_values jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  accepted_at timestamptz,      -- first status change to 'active' or similar
  started_at timestamptz,       -- first status change to 'in progress'
  resolved_at timestamptz,      -- moved to a 'done' type state
  created_by uuid REFERENCES profiles(id)
)

-- Status transitions: the audit backbone for time-in-status and SLA analytics
status_transitions (
  id uuid PRIMARY KEY,
  item_id uuid NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  from_status_slug text,
  to_status_slug text NOT NULL,
  changed_by uuid REFERENCES profiles(id),
  changed_at timestamptz DEFAULT now() NOT NULL,
  note text
)
-- Insert trigger on items.status_slug change writes a row here.

-- Comments on items
comments (
  id uuid PRIMARY KEY,
  item_id uuid NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  author_profile_id uuid REFERENCES profiles(id),
  body text NOT NULL,
  created_at timestamptz DEFAULT now(),
  edited_at timestamptz
)

-- Attachments
attachments (
  id uuid PRIMARY KEY,
  item_id uuid NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  filename text NOT NULL,
  mime_type text,
  size_bytes bigint,
  uploaded_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
)

-- Time tracking: explicit logs (manual and timer)
time_logs (
  id uuid PRIMARY KEY,
  item_id uuid NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES profiles(id),
  started_at timestamptz NOT NULL,
  ended_at timestamptz,
  duration_minutes integer,  -- nullable while timer running
  source text NOT NULL CHECK (source IN ('timer', 'manual')),
  note text,
  created_at timestamptz DEFAULT now()
)

-- Working calendars for business-hours calculations
working_calendars (
  id uuid PRIMARY KEY,
  organisation_id uuid NOT NULL REFERENCES organisations(id),
  name text NOT NULL,
  timezone text NOT NULL,
  weekly_schedule jsonb NOT NULL,  -- {monday: [{start: '09:00', end: '17:00'}], ...}
  holidays jsonb DEFAULT '[]'::jsonb,  -- array of dates
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
)

-- SLA targets per (item_type, priority)
sla_targets (
  id uuid PRIMARY KEY,
  organisation_id uuid NOT NULL REFERENCES organisations(id),
  item_type_id uuid REFERENCES item_types(id),
  priority text NOT NULL,
  metric text NOT NULL CHECK (metric IN ('first_response', 'resolution')),
  target_minutes integer NOT NULL,
  working_calendar_id uuid REFERENCES working_calendars(id),
  created_at timestamptz DEFAULT now()
)

-- Append-only audit log (critical for v2 simulation data quality)
audit_log (
  id bigserial PRIMARY KEY,
  organisation_id uuid NOT NULL,
  entity_type text NOT NULL,  -- 'item', 'comment', 'department', ...
  entity_id uuid NOT NULL,
  action text NOT NULL,  -- 'create', 'update', 'delete', 'status_change', ...
  actor_profile_id uuid REFERENCES profiles(id),
  actor_origin text,  -- 'user', 'public', 'system'
  diff jsonb,
  occurred_at timestamptz DEFAULT now() NOT NULL
)

-- Notifications for in-app feed and email digest aggregation
notifications (
  id uuid PRIMARY KEY,
  organisation_id uuid NOT NULL REFERENCES organisations(id),
  recipient_profile_id uuid NOT NULL REFERENCES profiles(id),
  kind text NOT NULL,  -- 'assigned', 'status_changed', 'commented', 'overdue', 'sla_breach'
  item_id uuid REFERENCES items(id) ON DELETE CASCADE,
  payload jsonb DEFAULT '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
)

-- Organisation templates that seed defaults
org_templates (
  id text PRIMARY KEY,  -- 'institute', 'club_hp', 'university_lab', 'federation'
  name text NOT NULL,
  description text,
  default_departments jsonb NOT NULL,
  default_item_types jsonb NOT NULL,
  default_workflow jsonb NOT NULL
)
```

### Data model principles

1. **Append-only `audit_log`**. Never delete or update rows. Every state change writes a row. This is what feeds v2 simulation.
2. **`status_transitions` is the time-in-status source of truth.** Do not derive durations from `items.updated_at`; derive them from the transitions table.
3. **`items` is polymorphic.** A task and a request are the same row. `origin` distinguishes. `item_type` specifies shape.
4. **Soft-delete via `archived_at`, not row deletion.** Anywhere users can "delete", they archive.
5. **Custom fields as JSONB.** Validated by the `item_type.custom_fields` schema. Do not create column-per-custom-field.
6. **RLS from day one.** Every PII table must have a policy before any code reads it.

---

## 5. Row Level Security

### Pattern
Every authenticated query resolves the user's accessible organisations from `memberships`. RLS policies reference this.

### Example RLS policies (write these as SQL)

```sql
-- Only members of the org can read items
CREATE POLICY items_select ON items FOR SELECT
  USING (
    organisation_id IN (
      SELECT organisation_id FROM memberships WHERE profile_id = auth.uid()
    )
  );

-- Only members of the org can insert items into it
CREATE POLICY items_insert ON items FOR INSERT
  WITH CHECK (
    organisation_id IN (
      SELECT organisation_id FROM memberships WHERE profile_id = auth.uid()
    )
    AND created_by = auth.uid()
  );

-- Only admins or assignee or creator can update
CREATE POLICY items_update ON items FOR UPDATE
  USING (
    organisation_id IN (
      SELECT organisation_id FROM memberships
      WHERE profile_id = auth.uid()
      AND org_role = 'admin'
    )
    OR created_by = auth.uid()
    OR assignee_profile_id = auth.uid()
  );

-- Public submission has no auth. Handled via Server Action with service role,
-- NOT via direct client insert. Do not expose items table to anon role.
```

### Public submission security
- Public intake is handled by a Next.js Server Action that uses the **service role key** to write directly
- The action validates: organisation exists, item_type is marked `is_public=true`, payload matches the custom field schema
- Rate limiting on this action: 5 submissions per IP per hour, 20 per org per hour
- CAPTCHA (hCaptcha) on the public form to prevent abuse
- Signed status links: JWT with `item_id` and short TTL (24 hours default, extendable)

---

## 6. Phased build plan

### Phase 1 — Project scaffold (TDD infrastructure + design tokens first)

This phase exists to make TDD possible and to lay the design foundation. Do not write any feature code. Only testing infrastructure, design tokens, and the minimum scaffolding to prove both work.

**Deliverables:**
- Next.js 15 App Router initialised with TypeScript strict
- Tailwind configured with **custom colour, typography, spacing, radius, and motion tokens mapped from `DESIGN_SYSTEM.md`** (not Tailwind defaults)
- **`globals.css` defines CSS variables for both dark and light modes per `DESIGN_SYSTEM.md` sections 4, 7, and 8**
- **Geist Sans and Geist Mono loaded via `next/font/local` or `next/font/google`** with `font-display: swap`
- **`next-themes` installed and configured** for the mode toggle with SSR-safe rendering
- shadcn/ui installed and base components (Button, Input, Card, Dialog, Form, Table, Tabs, Select, DropdownMenu, Toast) restyled to match the design tokens (not out-of-the-box shadcn defaults)
- pnpm workspace with single `app/` directory (leave room for `simulation/` later)
- Biome or ESLint + Prettier set up
- Husky + lint-staged + commitlint (Conventional Commits)
- **Vitest configured with coverage thresholds enforced (85% lines, 85% branches on `lib/`)**
- **Playwright configured with retry=0 and a passing smoke test**
- **Testing Library configured for component tests**
- **Stryker mutation testing configured for `lib/` (runs nightly in CI, threshold 70% on `lib/business-hours/` and `lib/sla/` once those exist)**
- **A deliberately-failing example test (`tests/example.red.test.ts`) committed, then made to pass by the tiniest production code, to prove the red-green loop works**
- **Supabase local CLI set up so integration tests have a throwaway instance**
- `.env.example` with all required variables documented
- GitHub Actions CI workflow runs: install, lint, typecheck, unit tests (with coverage gate), component tests, e2e tests, build. Every job fails the PR on red
- **A single "design tokens" page at `/dev/tokens` (dev-only, not shipped to production) that renders all colours, type scales, spacing, shadows, and motion examples as a visual reference**

**Acceptance:**
- `pnpm dev` starts the app on localhost:3000
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e`, `pnpm build` all pass
- `pnpm test --coverage` enforces the coverage threshold and fails below it
- `pnpm test:mutation` runs Stryker and produces a report
- The red-green example commit is visible in git history, proving the workflow
- CI blocks merge on any red test
- Landing page shows "Backroom — coming soon" using the correct typography, colour, and mode-toggle behaviour
- Mode toggle (System / Light / Dark) works and persists
- `/dev/tokens` renders the design system visually; screenshot attached to the phase PR for maintainer review
- No `bg-slate-*`, `bg-gray-*`, `text-slate-*`, `text-gray-*`, or other raw Tailwind palette classes exist in any component (verified by a lint rule or grep-based CI check)

### Phase 2 — Supabase project & auth

**Deliverables:**
- Supabase local development via `supabase` CLI
- First migration: `organisations`, `profiles`, `memberships` tables with RLS
- Magic-link login flow: `/login` sends a magic link, `/auth/callback` handles the token and creates a profile row if missing
- Sign-out
- Protected `/app` route that redirects unauthenticated users to `/login`
- Session handling with Supabase SSR helper
- `.env.local` and `.env.example` updated with Supabase keys

**Acceptance:**
- User can sign up with email, receive magic link, click it, and land on `/app`
- Signed-out user hitting `/app` redirects to `/login`
- Profile row exists for the signed-in user
- RLS policies verified by an integration test

### Phase 3 — Organisations, memberships, department model

**Deliverables:**
- Migration for `departments`, `department_memberships`, `org_templates`
- Onboarding flow on first login: "Create your organisation" with slug, name, timezone selector
- Starter template picker: Institute / Club HP / University lab / Federation. Each seeds default departments, item types, and workflow
- Department CRUD UI under `/app/settings/departments`: list, create, rename, archive
- Member management under `/app/settings/members`: invite by email (sends magic link with membership pre-provisioned), list, change role, remove
- Per-department role assignment (head, practitioner, viewer)

**Acceptance:**
- A new user can create an org, pick a template, and see seeded departments
- They can invite another user who receives an email, clicks magic link, lands in the same org
- Roles control visibility: a viewer cannot edit items (test this with RLS)

### Phase 4 — Items core with status transitions and audit log

**Deliverables:**
- Migrations for `items`, `status_transitions`, `workflows`, `item_types`, `audit_log`
- Database trigger that writes to `status_transitions` on every `items.status_slug` change
- Database trigger that writes to `audit_log` on every write to `items`, `comments`, `departments`
- Server Actions for create/update/archive items
- Minimal task detail page at `/app/items/[id]` showing all fields
- Workflow editor UI under `/app/settings/workflows` (create, edit states, reorder)
- Item type editor UI under `/app/settings/item-types` (create, pick department, pick workflow, add custom fields)

**Acceptance:**
- Creating an item writes to `items`, `audit_log`, and `status_transitions`
- Changing status writes a new `status_transitions` row every time
- All audit rows include `diff` with before/after values
- A test verifies: 10 status changes yield 10 transitions rows

### Phase 5 — Public intake form

**Deliverables:**
- Public route at `/submit/[org_slug]` (no auth)
- Lists public item types for that org
- Submitter picks a type, fills a dynamic form (built from `item_type.custom_fields`)
- Server Action creates the item with `origin='public'` (using service role key, rate-limited, CAPTCHA-verified)
- Signed status link returned on confirmation page
- `/status/[item_id]?token=...` page shows current status, timeline of public status changes, without revealing staff comments
- Rate limiting middleware (5 submissions per IP per hour)

**Acceptance:**
- An unauthenticated user can submit via the public form end to end
- The submitted item appears in the staff queue
- Status link resolves to the status page, which updates in real-time
- Abuse test: 6 submissions from same IP in an hour → 6th is rejected with a clear error

### Phase 6 — Task queue views

**Deliverables:**
- `/app/queue` shows the signed-in user's assigned items (my queue)
- `/app/queue/team/[department_slug]` shows the whole department's items
- List view (default) with filters: status, priority, assignee, item type, date range
- Kanban view grouped by status
- "My day" view showing items due today plus in-progress
- Keyboard shortcuts: `c` create, `/` focus search, `j/k` navigate, `x` toggle select
- Realtime updates via Supabase Realtime: new items, status changes, assignments refresh the view
- Mobile-responsive (must be usable on a phone)

**Acceptance:**
- Switching views preserves filter state in URL
- Creating an item from one client appears in another client's view within 2 seconds (Realtime)
- Lighthouse mobile performance score ≥ 90 on the queue page

### Phase 7 — Item detail, comments, attachments

**Deliverables:**
- Full item detail page: title, description, status, priority, assignee, due date, custom fields, submitter details (for public-origin), comments, attachments, audit timeline
- Status change via dropdown, logs a transition
- Comment thread with markdown support (use `react-markdown` + `remark-gfm`)
- Attachment upload to Supabase Storage, with size limit (25 MB per file), type allowlist
- Attachment preview for images and PDFs
- Timeline component showing status changes, comments, assignments in chronological order

**Acceptance:**
- All item operations work without page reloads
- Comments support basic markdown (bold, italic, links, lists, code)
- Uploaded file appears inline for the submitter and any assignee

### Phase 8 — Time tracking

**Deliverables:**
- Migration for `time_logs`
- Timer component on item detail: start, pause, stop, discard. Displays current elapsed time
- Manual log: practitioners can add a retrospective entry with start time, duration, note
- Auto-pause when item status moves to a 'waiting' type state
- Auto-stop prompt when item moves to 'done'
- Estimate field on item (minutes), displayed alongside actual on item detail
- Time tracking widget in sidebar: "You're currently tracking X on [item]" with a quick stop button

**Acceptance:**
- Timer survives browser refresh (persisted in DB from start)
- Moving status to 'waiting' pauses the active timer and writes a `time_logs` row with the elapsed duration
- Daily and weekly totals visible on the user's profile page

### Phase 9 — Working calendars & business-hours math

**Deliverables:**
- Migration for `working_calendars`
- UI under `/app/settings/calendars`: create calendar with timezone, weekly schedule (day × hours), holidays
- Default calendar seeded per org on creation (Mon-Fri 09:00-17:00 in org timezone)
- Helper functions in TypeScript to compute business-minutes between two timestamps given a calendar
- Unit tests for the business-hours calculator with edge cases: weekends, holidays, overnight, timezone boundaries

**Acceptance:**
- Business-minutes calculator passes 20+ test cases including weekends, holidays, DST transitions, multi-day durations
- Time-to-first-response and time-to-resolution on item detail are shown in business hours, not wall-clock

### Phase 10 — SLA targets & breach flagging

**Deliverables:**
- Migration for `sla_targets`
- UI under `/app/settings/sla` to configure targets per (item type, priority, metric)
- Background job (Supabase Edge Function on cron, every 15 minutes) that checks open items against SLA targets and writes `notifications` rows for breaches
- Breach indicator on item rows in queue views (red dot + hover tooltip with elapsed time vs target)
- SLA widget on item detail page showing: target, elapsed business-time, status (on track / at risk at >80% / breached)

**Acceptance:**
- Creating an SLA target and then an item that exceeds it flips the indicator within 15 minutes
- Dashboard breach count matches the actual number of breached items
- A departmental breach summary is visible on the department page

### Phase 11 — Analytics dashboards

**Deliverables:**
- `/app/dashboard` for department heads: open count, overdue count, workload by assignee, median Time to First Response, median Time to Resolution, SLA compliance percentage, service time distribution chart per top 5 item types
- `/app/dashboard/org` for performance directors: all of the above across all departments, side-by-side comparison, cross-department workload heatmap
- Charts rendered with **Recharts** (already in our React dependency set)
- Date range picker (default: last 4 weeks)
- Department filter
- CSV export of the underlying data behind any chart

**Acceptance:**
- All dashboard queries execute in under 500ms on a database with 10,000 items (test with a seed script)
- Performance director view on a 13-inch laptop shows everything without horizontal scroll
- Numbers match when cross-checked against manual SQL queries

### Phase 12 — Notifications, email, weekly digest

**Deliverables:**
- Migration for `notifications`
- In-app notification feed at `/app/inbox`
- Email notifications via Resend (hosted) or SMTP (self-host) for: assignment, status change on items you created or are assigned to, overdue items, SLA breaches
- Per-user notification preferences (UI + DB columns on `profiles`)
- Weekly digest email (Monday 08:00 org time) summarising: open items, closed last week, SLA compliance, top contributors. Sent to org admins by default, opt-in for others
- Email templates rendered with **React Email**

**Acceptance:**
- Assigning an item to another user triggers an email within 60 seconds
- A user can mute email notifications for a specific item
- The weekly digest renders correctly in Gmail, Outlook, and Apple Mail (test with Litmus or Email on Acid if available)

### Phase 13 — Search, export, polish

**Deliverables:**
- Full-text search across items (title, description, comments) using Postgres `tsvector`
- Global search UI triggered by `cmd-k` or `/`
- CSV export of any filtered item list
- PDF export of the weekly digest
- Loading states, empty states, error states for every route
- Accessibility audit: WCAG 2.1 AA (use axe-core)
- Performance audit: Lighthouse ≥ 90 on key routes

**Acceptance:**
- Search returns results in under 300ms for a 10,000-item org
- Lighthouse scores: Performance ≥ 90, Accessibility = 100, Best Practices ≥ 95, SEO ≥ 90 on public routes
- Zero axe-core critical or serious violations

### Phase 14 — Self-host packaging

**Deliverables:**
- `docker-compose.yml` that brings up: Next.js, Supabase (local stack), MailHog (for email capture in dev), optional Python simulation service stub
- Self-host guide at `docs/self-host.md` with prerequisites, setup steps, environment variables, backups, upgrade instructions
- Backup script (`scripts/backup.sh`) that runs `pg_dump` to a configurable location
- Health check endpoint at `/api/health`
- First-run setup wizard: on blank database, create an admin user via a one-time URL printed to server logs

**Acceptance:**
- A contributor can clone the repo, run `docker compose up`, and reach the app at localhost:3000 with a working database in under 10 minutes
- Self-host guide followed by someone with basic Linux skills leads to a working instance on a VPS
- `scripts/backup.sh | tar | scp` produces a restorable snapshot

### Phase 15 — Simulation service scaffold (v2 foundation, not the full build)

**Deliverables:**
- `simulation/` directory with Python 3.12 + FastAPI + SimPy + SciPy scaffold
- One endpoint: `GET /api/simulation/health` returns `{"status": "ok"}`
- Placeholder endpoints defined (not implemented): `POST /api/simulation/fit-distributions`, `POST /api/simulation/run-scenario`
- `Dockerfile` for the service
- `docker-compose.yml` extended to include the simulation service
- Read-only database role with access only to `items`, `status_transitions`, `time_logs`, `departments`, `item_types` used by the simulation service

**Acceptance:**
- The simulation service starts via docker-compose
- Health endpoint responds
- Service can connect to the database and run `SELECT 1`
- v2 build is explicitly noted as out of scope for this phase

---

## 7. Design discipline

The canonical design contract lives in `DESIGN_SYSTEM.md`. Read it before writing a single component. Follow it without exception. This section summarises the non-negotiables.

### The contract
- **Read `DESIGN_SYSTEM.md` before Phase 1.** Do not start styling without it
- Every visual decision traces to a token or rule in the design system
- No raw hex colours in components. Use CSS variables mapped through Tailwind config
- No Tailwind default colours (`bg-blue-500`, `text-gray-900`) in components. Use semantic tokens (`bg-accent`, `text-primary`)
- No `rounded-2xl` or higher on general UI. No `shadow-lg` on static surfaces. No hover-scale transforms

### The anti-pattern review
Every PR that ships UI is reviewed against the anti-pattern checklist in `DESIGN_SYSTEM.md` section 3. Any match is a blocker, not a nit. The goal is to never ship something that looks like a generic AI-startup template.

### Dark-mode first
Backroom is dark-mode-first. Light mode is supported via a user toggle and must render correctly, but the primary aesthetic is dark. Design components in dark first, then verify light.

### The accent colour is Volt (#C5F82A)
Used with restraint. One primary CTA per view. Status active indicators. Focus rings. The logomark. Never decorative.

### Typography is Geist Sans + Geist Mono
Not Inter. Install via `next/font/local` or `next/font/google` depending on availability. Use the semantic type scale from `DESIGN_SYSTEM.md` section 5, never raw pixel sizes.

### Density over spaciousness
Default body size is **14px**, not 16px. We follow Linear's density, not Notion's spaciousness. Users live in this app for hours.

### Empty states are designed
Every list, queue, and dashboard has a proper empty state with an illustration or icon, headline, body copy, and CTA. Never a blank area. Never "No data".

### Review checklist
Before merging any UI work, run through `DESIGN_SYSTEM.md` section 18. Every box must be ticked. Reviewers block the PR on unticked boxes.

---

## 7a. Brief UI vocabulary (quick reference)

Full detail in `DESIGN_SYSTEM.md`. This section exists so you don't have to cross-reference for small decisions.

- **Colour base**: `#0A0A0B` dark / `#FAFAF7` light
- **Accent**: `#C5F82A` (dark) / `#6B8F1A` (light)
- **Fonts**: Geist Sans (primary), Geist Mono (mono)
- **Default body**: 14px / 20px line-height / weight 400
- **Default card radius**: 8px
- **Default button radius**: 6px
- **Default motion duration**: 150ms, ease-in-out
- **Default page gutter**: 24px mobile, 48px desktop
- **Default sidebar**: 240px open, 64px collapsed
- **Components**: shadcn/ui, restyled to match tokens

---

## 8. Testing discipline

Testing is not a separate step after the feature is done. Testing is how the feature gets done. See section 0 for the Red-Green-Refactor contract. This section describes the specifics of each test type.

### The TDD loop in practice

For every unit of work (a Server Action, a helper, an RLS policy, a component, a user journey):

1. Identify the next small behaviour
2. Write the failing test. Run it. Confirm it fails for the right reason
3. Write the minimum code to pass. Run the full suite. Confirm green
4. Refactor. Run the full suite after every non-trivial change. Stay green
5. Commit. Move to the next behaviour

Tests are committed before or with the code they validate. Never after. If you realise you wrote untested code, revert it and start over from the test.

### Unit tests (Vitest)
- All business logic written via TDD: business-hours calculator, SLA breach checker, time-in-status computer, permission resolvers, payload validators, status transition reducers
- Pure functions, no network, no DB
- Coverage floor on `lib/`: 85% lines, 85% branches
- Mutation testing on `lib/business-hours/` and `lib/sla/` via Stryker. Target: ≥ 70% mutation score. If mutation testing reveals that assertions are weak (tests pass but mutants survive), strengthen assertions before moving on

### Integration tests (Vitest + local Supabase)
- Every Server Action has an integration test written before the action exists
- Every RLS policy has a test written before the policy. The test creates two users in two orgs, confirms user A cannot read/write user B's data, and fails until the policy is in place
- Every cron job (Supabase Edge Function) has an integration test
- Database triggers (audit log, status transitions) have tests that assert the trigger fired with the expected payload
- Integration tests run against a throwaway Supabase instance spun up by the CLI. CI spins a fresh one per job

### Component tests (Vitest + Testing Library)
- Any component with state, callbacks, conditional rendering, or keyboard handlers has tests
- Test behaviour, not implementation. Use accessible queries (`getByRole`, `getByLabelText`), not test IDs except as a last resort
- Purely presentational components (styled divs, icons, static layouts) do not require tests

### End-to-end tests (Playwright)
- The happy path for each user-facing phase is written as a Playwright test **at the start of the phase**, not the end. Watch it fail. Implement phase features. When the e2e test passes, the phase's core journey is done
- Critical journeys that must exist by end of build:
  1. Sign up → create org → invite member → submit public request → assign → resolve
  2. Configure SLA target → submit item that breaches → verify breach appears on dashboard
  3. Time-track a task from timer start to completion → verify `time_logs` row, time-in-status decomposition, and analytics all reflect it
  4. Coach submits public request → receives status link → sees status update after staff action in real-time
  5. Performance director views cross-department dashboard → drills into a department → reassigns a task → confirms the change in both queues
- E2E tests are allowed to be slow. They are not allowed to be flaky. If a test is flaky, fix it or delete it. Never retry-loop around flakiness
- E2E tests run against a seeded database (see below)

### Seed data
- `scripts/seed.ts` creates a fully populated test org: 50 members, 20 departments, 500 items across 3 months with realistic status transition histories, time logs, and comment threads
- Seed must be deterministic (fixed random seed) so test results are reproducible
- Use the same seed for Playwright, Lighthouse runs, and manual QA

### CI gates
- `pnpm lint` passes
- `pnpm typecheck` passes
- `pnpm test` passes with no skipped tests
- `pnpm test:e2e` passes
- Coverage thresholds met (enforced in `vitest.config.ts`)
- Mutation testing run on critical modules (nightly, not per-PR, but PRs that regress mutation score below threshold are flagged)

### What "done" looks like for a test
A test is done when:
- It expresses intent clearly in the test name (e.g. `it('pauses the timer when the item moves to waiting status')`, not `it('test pause 1')`)
- It fails for the right reason when the production code is missing
- It fails with a clear error message when an assertion breaks
- It is fast (unit: < 50ms, integration: < 1s, e2e: < 30s)
- It does not depend on test execution order
- It cleans up after itself

### Banned patterns
- `it.skip`, `test.skip`, `describe.skip` without a linked GitHub issue and a deadline
- `expect(true).toBe(true)` or equivalent non-assertions
- Commented-out tests
- Tests that exist only to inflate coverage without asserting behaviour
- Sleeping (`setTimeout`, `wait`) instead of proper waits for conditions
- Tests that require specific clock time or rely on `Date.now()` without fake timers

---

## 9. Documentation

Maintain these documents throughout the build. Do not leave them for "the end".

- `README.md`: keep up to date with features as they ship
- `CHANGELOG.md`: entry for every merged PR following Keep a Changelog format
- `docs/architecture.md`: high-level architecture with diagrams (Mermaid)
- `docs/data-model.md`: ER diagram and table descriptions
- `docs/self-host.md`: complete self-host guide
- `docs/development.md`: local dev setup, conventions, how to add a feature
- `docs/api.md`: if any public API endpoints exist, document them
- `PROGRESS.md`: phase-by-phase status. Update at end of every phase
- Inline code comments only for non-obvious logic. The code should read like prose otherwise

---

## 10. Things NOT to build (scope protection)

If the user asks for any of these, refuse and point to this section:

- Athlete wellness, training load, RPE, GPS, medical, or clinical data of any kind
- Injury notes, screening results, doctor's notes
- Athlete accounts or portals beyond the status-link page
- Contract management, finance, transfer market, scouting
- Video analysis, match event data, tactical tools
- Native iOS or Android apps (PWA only)
- Chat or messaging features beyond item comments
- Real-time collaboration on item descriptions (last-write-wins is fine)
- Time tracking billing, invoicing, or client-side payroll
- Integration with Teams, Slack, Google Calendar in v1 (noted for v2)
- Custom workflow builder beyond the per-org workflow editor (no "build your own state machine" UI)
- Any feature that requires storing health or clinical data
- Multi-region deployment orchestration in v1

If in doubt, the rule is: does this belong in a PM tool, or in an AMS? If AMS, refuse.

---

## 11. Code style & conventions

- TypeScript strict. `any` is banned except in third-party type shims
- Server Components by default. Client Components marked explicitly
- Server Actions in `app/**/actions.ts` files, co-located with the routes that use them
- Database queries in `lib/db/` layer, never inline in components
- Zod schemas in `lib/schemas/` for every Server Action input
- Error handling: use Result/Either style or thrown errors caught at the action layer, returning typed responses to the client
- No `console.log` in production code. Use `pino` for structured logs
- No raw SQL in application code. Use Supabase's query builder or SQL migrations only

---

## 12. Performance budgets

- First Contentful Paint: under 1.5s on a 13-inch laptop on cable
- Largest Contentful Paint: under 2.5s on the same
- Public intake form: FCP under 1.0s, no client-side JS for the initial render
- API/Server Action p95 latency: under 300ms for reads, under 500ms for writes
- Queue view scales to 10,000 items without noticeable lag (virtualised list)

---

## 13. Security checklist (review at each phase)

- [ ] RLS enabled and tested on every new table
- [ ] Service role key never exposed to the browser
- [ ] Public endpoints rate-limited
- [ ] Inputs validated with Zod before any DB write
- [ ] File uploads scanned for type (allowlist: images, PDFs, docx, xlsx, csv, txt)
- [ ] No PII in application logs
- [ ] Signed JWT tokens for status links have short TTLs and are cryptographically signed
- [ ] Dependencies checked for known vulnerabilities (Dependabot + `pnpm audit`)
- [ ] HTTPS enforced everywhere via Vercel (hosted) and documented for self-host
- [ ] CORS restricted to the org's configured origins for any public API

---

## 14. First actions

1. Read this document end to end, including section 0 on TDD discipline and section 7 on design discipline
2. Read `Backroom_Brief_v02.md` for product context
3. Read `DESIGN_SYSTEM.md` for the visual contract. This is not optional
4. Open `PROGRESS.md` and initialise it with a phase checklist derived from this document. Add two lines at the top:
   - "TDD discipline acknowledged: no production code ships without a failing test first"
   - "Design discipline acknowledged: every UI decision traces to DESIGN_SYSTEM.md; no anti-patterns (section 3) will ship"
5. Begin Phase 1. Start by setting up the test infrastructure (Vitest, Playwright, Testing Library, Stryker, Supabase local) AND the design tokens (CSS variables, Tailwind config mapped to them, Geist fonts loaded). Prove both the red-green loop and the design token pipeline work before writing anything else
6. When Phase 1 is merged, open a pull request for Phase 2. Write the integration test for magic-link auth first, watch it fail, then implement. Repeat the pattern for every subsequent phase

---

## 15. Checkpoints for human review

The maintainer (human) wants to review before proceeding past these phases:

- End of Phase 1: TDD infrastructure in place, design tokens in place, CI enforces coverage, Geist fonts load correctly, example red-green commit is in history
- End of Phase 3: org, departments, and memberships work end to end. Visual discipline holding.
- End of Phase 5: public intake working, first real pilot user can submit. Public intake form mobile-first design visibly matches DESIGN_SYSTEM.md.
- End of Phase 8: time tracking shipped, this is the point where Backroom has material value over ClickUp
- End of Phase 11: analytics dashboards shipped. Charts follow the data-viz rules. Performance director dashboard passes the 13-inch laptop test.
- End of Phase 14: self-host shipped, this is 1.0

Before proceeding past a checkpoint, post a summary in `PROGRESS.md` and wait for maintainer sign-off. Do not merge the next phase's PR until acknowledged.

---

*Build prompt version 1.2. Design discipline added; references `DESIGN_SYSTEM.md`.*
