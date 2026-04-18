# Backroom

*Working title. The operations platform for performance departments in sport.*

---

## One-liner

Backroom is a lightweight, open-source operations platform for performance departments in sport. Any organisation defines its own departments (sport science, medical, analytics, talent ID, front office, academy, whatever structure fits). Track the work, measure the turnaround, simulate the load. Free to self-host.

---

## The problem

Elite sport organisations run complex multidisciplinary "performance support teams" (Fletcher, Arnold & McEwan 2024) across sport science, medical, analytics, talent identification, academy, coaching, and front office functions. The peer-reviewed literature consistently names the same operational failures: cohesion, communication, integration, ineffective knowledge translation, role clarity, confusing language, and conflicting methodologies (Rothwell et al 2020; Alfano & Collins 2021; Fletcher et al 2024).

Day-to-day this shows up as:
- Requests from coaches and athletes disappear into inboxes
- Ownership is unclear, practitioners duplicate work or miss it
- Heads of department can't answer "what's my team actually doing this week"
- Performance directors have no cross-department visibility
- Weekly reports to senior leadership are written from memory
- No one can say "how long does a testing request actually take", let alone simulate what happens if staffing or demand changes

### Why existing tools don't fit

**Generic PM / ticketing platforms** (Monday, ClickUp, Asana, Linear, Jira Service Management): powerful, but every organisation has to invent its own taxonomy and workflows from scratch. Non-technical staff rarely adopt them. No sport vocabulary. Time tracking is a paid add-on. No simulation.

**Enterprise sport platforms** (Iterpro, Teamworks, Smartabase, Kitman Labs, CoachMePlus): heavy, expensive, built for professional football clubs and national institutes. Iterpro in particular covers departments across Technical, Performance, Medical, Talent Development, Scouting, Administration, and Finance, with integrated athlete health and contract management. Pricing and complexity put them out of reach for smaller institutes, academies, and federations.

Small-to-mid institutes, club academies, Olympic sport programmes on federation budgets, university sport science labs, and developing-nation performance programmes fall in the gap. They currently run on WhatsApp, email, and spreadsheets.

---

## Who it's for

### Persona 1: Amara, Performance Director
Oversees sport science, medical, analytics, and talent ID at a small national institute. Reports to CEO. Five to twenty direct and indirect reports across departments. Wants cross-department visibility, evidence-based staffing decisions, a weekly report that writes itself.

### Persona 2: Priya, Head of Sport Science
Runs one department of four practitioners. Reports to Amara. Responsible for team output, response times, and quality. Wants department-level oversight without nagging anyone.

### Persona 3: Marcus, Practitioner
S&C lead at a club academy. Covers three sports. In small orgs often wears the HoSS hat too. Wants a clean queue, clear ownership, and time tracking that feels like a tool rather than surveillance.

### Persona 4: Lena, Coach
Head coach of swimming. Submits a request, wants confirmation and status. Will abandon anything that takes more than 30 seconds or requires a login.

**Reality: roles are permissions, not people.** In small institutes one person is often HoSS, practitioner, and sometimes de facto performance director. In larger orgs department heads have pure management responsibilities. The product treats role as a per-department permission, not a per-user identity.

---

## What Backroom is, and what it isn't

**Backroom is**
- An operations platform for any department in a sport organisation
- User-defined departments, request types, and workflows
- Task and request management with proper time tracking
- SLA-style analytics: response time, resolution time, time-in-status, utilisation
- Cross-department oversight for performance directors and department heads
- A simulation engine (v2) for workload forecasting and staffing decisions
- Open source, AGPL-3.0, self-hostable

**Backroom is not**
- An athlete management system. No wellness, training load, RPE, GPS, bloods
- A medical or clinical records system. No injury notes, no screening results
- An all-in-one sports intelligence platform like Iterpro. No contracts, no finance, no scouting, no asset management
- A Teamworks, Smartabase, Kitman Labs, or AthleteMonitoring replacement

The boundary is structural. Athlete health and clinical data sit behind regulatory walls (Privacy Act, APP, PDPA, HIPAA, ESSA, TGA adjacency). Staying out of that space is what keeps Backroom light, open source, and deployable by a small team without a compliance function.

---

## The three operational pillars

### 1. Request intake
Coaches and athletes submit requests via a public form. No login. Request types are configurable per department ("testing request", "screening booking", "report request", "training load query", "data pull", "scout observation", "recruitment follow-up", whatever fits the org). Each type routes automatically to the right department and optionally to a specific person or triage queue. Submitter gets a confirmation with a link to check status.

### 2. Task management
Practitioners work a clean queue. List, kanban, or my-day view. Comments, attachments, due dates, status. **Time tracking is first-class**: timer + manual log, estimates vs actuals, with time-in-status captured automatically from status history so the system knows how much was active work versus waiting on the submitter versus blocked. Keyboard-friendly, mobile-responsive.

### 3. Oversight
One-screen dashboards for heads of department and performance directors. Open requests, overdue items, response times, utilisation, workload balance across practitioners. Drill-down on any number. Weekly digest emailed automatically.

---

## The analytics layer (cross-cutting)

Every task accumulates timestamps and status history. Out of that, Backroom computes the same family of metrics that Jira Service Management, Tempo, and Everhour expose, adapted for sport operations:

- **Time to First Response**: request submitted to practitioner accepted
- **Time to First Action**: accepted to in-progress
- **Time to Resolution**: submitted to done
- **Time in Status**: how long the task sat in each state (active, waiting, blocked)
- **Time with Assignee**: response time per person, surfaces bottlenecks
- **Utilisation**: hours logged vs available hours, per person, per department, per week
- **Service time distribution**: for each (department, request type) combination

Configurable SLA targets per (request type, priority, department). Breaches flagged in dashboards. Working calendars account for weekends, public holidays, and camp periods so durations reflect working hours rather than wall-clock time.

This is not an optional add-on. Time tracking and SLA analytics are v1 features. Without them the product is just another Trello.

---

## The simulation layer (v2 — the moat)

Once the system has a few months of real data, service time distributions and arrival patterns fit well enough to run **discrete event simulation (DES)** on the operations. This is the feature no other platform in sport ops offers, and it's directly defensible given the research background behind the project.

Example questions a performance director can ask Backroom:

- "S&C loses one practitioner for a three-week camp. What's the expected Time to Resolution for training load queries during that window?"
- "Pre-season starts in four weeks. Based on historical patterns, what does screening request load look like? Do we need locum physio cover?"
- "If we raise the testing request SLA target from 72h to 48h, what staffing level makes 90th-percentile compliance feasible?"
- "Which request types are the biggest bottleneck drivers? What's the throughput impact if we automate intake for the top three?"
- "What's the expected cross-department impact if analytics drops below two practitioners for six weeks?"

Academic precedent exists in healthcare (Saville et al 2019; Qureshi et al 2019 on DES for nurse-to-patient ratio), IT service desk operations (Bartsch et al 2012 on SLA estimation), and call centre staffing. None of this is applied to sport operations yet. That's the opening.

**Critical for v1**: the data model must capture enough event history from day one so that when simulation ships in v2, the back-data is already rich enough to fit distributions. This means `audit_log` with all state transitions, task tags for sport / athlete / squad / period, timestamps on every status change, and a materialised view that aggregates service durations by (department, request type, period).

---

## User journeys

### Amara, Performance Director, Monday morning
Opens Backroom. Cross-department dashboard shows: Sport Science has 14 open requests, 3 overdue. Analytics has 8 open, all on track. Medical has a flagged SLA breach on screening requests. She clicks through, sees Marcus carrying twice the workload of anyone else. Reassigns two tasks. Runs a quick what-if: "move the testing request type from Marcus to Jay for two weeks, project the queue." Sees the result in ten seconds. Four minutes, done.

### Priya, Head of Sport Science, Wednesday
Opens her department view. Weekly utilisation chart shows one practitioner at 95% and another at 50% across three weeks. Rebalances three upcoming tasks. Writes two lines of context in the weekly digest draft, hits send.

### Marcus, Practitioner, daily
Opens his queue on his phone on the train. Accepts two incoming requests. Arrives at work, opens laptop, starts a timer on the first task. Changes status to "waiting on coach" when he emails for clarification, timer auto-pauses. Coach replies, resumes timer. Closes out at 47 minutes actual, 60 minutes estimated. Moves to the next.

### Lena, Head Coach, mid-afternoon
Scans a QR code pinned in her office. Picks "Testing session", types her squad and preferred dates, submits. Confirmation on screen, email sent. Three hours later a notification: "Accepted, Tuesday 10am with Marcus." Moves on with her day.

---

## UI/UX principles

Users are not technical. Every interface decision is shaped by that.

1. **Three clicks to any action.** New request, complete task, view dashboard, all reachable in three taps from login
2. **No jargon.** Requests, tasks, people, departments. Never "tickets", "epics", "sprints", "stories"
3. **Mobile-first for intake, desktop-first for work.** Coaches submit from phones; practitioners and heads live on laptops
4. **Sensible defaults.** New task defaults to today, assigned to you, in your default department. Override only when needed
5. **One-screen dashboards.** The HoSS view fits a 13-inch laptop. Performance director view is similarly bounded
6. **Readable, not dense.** Avoid the Jira/Linear information-density trap. Generous spacing, larger hit targets
7. **Feels instant.** Sub-second interactions. If something is slow, show progress, not a spinner
8. **Time tracking feels like a tool, not surveillance.** Timer is visible to the user, not broadcast to managers in real time. Metrics are aggregated, not raw
9. **Accessibility is not optional.** Keyboard navigable. Screen reader labels. Colour is never the only signal

---

## Onboarding

Target: **install to first real request submitted in under 10 minutes.**

### Organisation admin (performance director or HoSS, first-time user)
1. Sign up with work email. Magic link, no password
2. Pick a starter template: "Small national institute", "Club high-performance function", "University sport science lab", "Federation programme". Each seeds sensible default departments, request types, and workflows
3. Edit the departments. Rename, delete, add. This is the moment the org makes the product theirs
4. Invite department heads and practitioners by email
5. Copy the public intake link (or download a printable QR code) for coaches and athletes
6. Dashboard shows welcome state with three sample requests to play with

### Practitioner
1. Click invite link, set name and optional photo
2. Land on empty queue with one sample task explaining the interface
3. First real request triggers a guided prompt

### Coach / athlete
1. Open link or scan QR code
2. Pick a request type from clear plain-English labels
3. Fill three to five fields
4. Submit, get confirmation with status link
5. Receive email or SMS on status change

No account, no password, no app to install.

---

## v1 scope

### Must have
- Email magic-link auth for staff
- Public intake form (no auth)
- User-defined departments and request types
- Task queue with list, kanban, and my-day views
- Comments, attachments, due dates, status
- **Time tracking: timer + manual log, estimates vs actuals**
- **Time-in-status captured automatically from status history**
- **SLA targets configurable per (request type, priority, department)**
- **Analytics dashboards: Time to First Response, Time to Resolution, utilisation, service time distribution**
- Cross-department dashboard for performance directors
- Working calendars (weekends, public holidays, configurable)
- Email notifications + weekly digest email
- Mobile-responsive PWA
- Four starter templates (institute, club HP, university lab, federation programme)
- Docker Compose self-host
- Hosted version (free tier) on Vercel + Supabase

### Should have (v1.1)
- Search across tasks and requests
- CSV / PDF export of tasks and analytics
- Audit log visible to admins
- QR-code intake generator
- Attachment preview
- Recurring tasks (monthly testing block, weekly reports)
- Department-level permissions (admin, manager, member, viewer)
- SMTP configuration UI

### v2 (the differentiator)
- **Discrete event simulation engine for workload forecasting**
- **What-if scenarios: staffing changes, demand changes, SLA target changes**
- **Staffing recommendation from service-level targets**
- **Seasonal pattern detection (pre-season, in-season, taper, camps)**
- **Per-sport and per-athlete service time analysis**

### Won't have (ever)
- Athlete health, wellness, training load, GPS, RPE, medical data
- Clinical notes, injury records, screening outcomes
- Contracts, finance, transfer market, scouting video
- Video analysis, match event data
- Native mobile apps (PWA only)
- Chat or messaging features beyond task comments
- Anything that turns this into Iterpro or Smartabase

Saying no to these is the product's spine. Every item above is something someone will ask for. Each one drifts the product into a category that's either regulated, crowded, or out of scope.

---

## Technical approach

Deliberately boring. Proven, well-documented, runnable by anyone with basic server skills.

- **Frontend**: Next.js 15, TypeScript, Tailwind, shadcn/ui
- **Backend**: Supabase (Postgres, Auth, Storage, Realtime)
- **Background jobs**: Supabase Edge Functions or a small Node worker for notifications and digests
- **Simulation engine (v2)**: Python service (FastAPI + SimPy) running on a schedule or on demand, reading read-replicas
- **Email**: Resend (hosted) or SMTP (self-host)
- **Hosting**: Vercel for hosted version, Docker Compose for self-host
- **Licence**: AGPL-3.0
- **Code**: Public GitHub repo

GitHub hosts the code, not the data. Postgres is the engine.

Row-level security on every table from day one. Append-only `audit_log` (critical for simulation data quality). No PII in application logs. Regional Supabase region guidance for self-host (ap-southeast-2 for AU, ap-southeast-1 for SG, etc.). Dependabot enabled. Weekly database backup script ships with deployment.

Core schema (sketch — full draft is a separate deliverable):

`organisations` · `profiles` · `memberships` (per-department role) · `departments` · `item_types` · `items` (polymorphic task/request base) · `workflows` · `status_transitions` · `comments` · `attachments` · `time_logs` · `sla_targets` · `working_calendars` · `audit_log` · `notifications` · `org_templates` · `request_tags` (sport, athlete, squad, period, severity)

---

## Open source and distribution

- AGPL-3.0, matching Plane, MinIO, and the open-source standard for self-hostable SaaS. Modifications run as a service must be open-sourced
- Public GitHub repo with contributor guide, issue templates, roadmap
- Self-host guide for Ubuntu and generic Docker-compatible Linux
- Free hosted version for small organisations that can't self-host
- No enterprise tier in v1

---

## Success criteria

v1 succeeds if:
1. Three real organisations use it in production for a month
2. Non-technical practitioners prefer it to the spreadsheet + WhatsApp combo they had before
3. At least one performance director uses the cross-department dashboard weekly
4. Install-to-first-request is under 10 minutes for a motivated admin
5. At least one external contributor opens a useful pull request
6. We have three months of real service-time data across two or more orgs (precondition for v2 simulation)

v1 fails if:
- Non-technical users need technical help day-to-day
- Setup takes more than a weekend for a motivated admin
- The data model can't support v2 simulation cleanly
- The project drifts into AMS territory

v2 succeeds if:
1. At least one performance director makes a real staffing decision based on a Backroom simulation
2. A peer-reviewed paper cites the tool or the approach

---

## Competitive landscape

| | Generic PM | Iterpro / Smartabase | **Backroom** |
|---|---|---|---|
| Price | £10-30/user/mo | £££ enterprise | Free self-host |
| Sport vocabulary | No | Yes | Yes |
| Custom departments | Yes (manual) | Limited | Yes (first-class) |
| Time tracking | Paid add-on | Limited | v1 core |
| SLA analytics | Partial (JSM only) | Limited | v1 core |
| Simulation | No | No | **v2 core** |
| Athlete health data | No | Yes | No (deliberately) |
| Open source | No | No | Yes |
| Self-hostable | Rarely | No | Yes |

---

## Open questions

1. Do athletes get accounts in v2, or stay anonymous submitters?
2. Does the hosted version need a business model, or is it a community service supported by sponsorship or grants?
3. Should Backroom ship an import format compatible with Jira/Monday for teams migrating from those tools?
4. Pilot site: HPSI? An AIS-affiliated NSO? A Victorian academy? Pick one before writing schema
5. Research angle: is the simulation work a paper in its own right? Is there a funding opportunity (e.g. TISS Research Accelerator, AIS innovation) worth aligning to?

---

## Next steps

1. Review and edit this brief
2. Wireframe the seven key screens: login, performance director dashboard, department head dashboard, practitioner queue, task detail (with timer), public intake form, analytics view
3. Draft the Supabase schema with RLS policies, focused on data integrity for the v2 simulation layer
4. Scaffold Next.js + Supabase, wire auth, ship the first screen end-to-end
5. Recruit one pilot site from your network (HPSI, AIS-affiliated NSO, Vic academy) before writing any UI beyond the first screen
6. Next turn: drill into the simulation design so we know v1 data model is capturing the right things

---

*Document owner: Haresh Suppiah. Version 0.2.*

## References cited

- Fletcher, D., Arnold, R., & McEwan, D. (2024). *Performance support team effectiveness in elite sport: a narrative review.* International Review of Sport and Exercise Psychology.
- Rothwell, M., Davids, K., Stone, J., O'Sullivan, M., Vaughan, J., Newcombe, D., & Shuttleworth, R. (2020). *A Department of Methodology can coordinate transdisciplinary sport science support.* Journal of Expertise, 3(1), 55-65.
- Alfano, H., & Collins, D. (2021). *Good practice delivery in sport science and medicine support: perceptions of experienced sport leaders and practitioners.* Managing Sport and Leisure, 26(3), 145-160.
- Saville, C. E., Griffiths, P., Ball, J. E., & Monks, T. (2019). *How many nurses do we need? A review and discussion of operational research techniques applied to nurse staffing.* International Journal of Nursing Studies, 97, 7-13.
- Qureshi, S. M., Purdy, N., Mohani, A., & Neumann, W. P. (2019). *Predicting the effect of nurse-patient ratio on nurse workload and care quality using discrete event simulation.* Journal of Nursing Management, 27(5), 971-980.
