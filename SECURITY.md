# Security policy

Backroom is in active development toward a 1.0 release. We take security
reports seriously and aim to acknowledge them quickly.

## Supported versions

| Version | Supported          |
| ------- | ------------------ |
| `0.x`   | Pre-1.0; no LTS guarantees. Critical fixes ship on the latest commit to `main`. |

When 1.0 lands this table will list the maintained release lines.

## Reporting a vulnerability

Please email **haresh@humanperformance.sg** with the subject prefix
`[backroom-security]` and as much detail as you can share:

- Affected version or commit SHA
- Steps to reproduce
- Impact assessment (what an attacker can do)
- Any proof-of-concept code or screenshots

Do **not** open a public GitHub issue for suspected vulnerabilities. If you
need to send sensitive material encrypted, mention that in your first email
and we will agree on a channel.

## Response expectations

- **Acknowledgement:** within 5 working days.
- **Triage and severity rating:** within 10 working days.
- **Fix or mitigation:** for high or critical issues we aim to ship within
  30 days of acknowledgement. Lower-severity issues are scheduled into the
  next reasonable release.
- **Disclosure:** we coordinate disclosure with the reporter. Once a fix is
  available we credit the reporter (with permission) in the release notes.

## Scope

In scope:
- The Backroom application code in this repository.
- The default deployment configuration (Docker compose, Caddy reverse proxy,
  GitHub Actions workflows).
- Supabase migrations and row-level security policies as written here.

Out of scope:
- Vulnerabilities in upstream dependencies (please report to those projects;
  we will track via Dependabot).
- Self-hosted deployments running modified configurations.
- Issues that require a malicious maintainer with administrator access.

## Hall of fame

Researchers who have responsibly disclosed will be listed here once Backroom
ships its first release.
