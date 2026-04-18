## Summary

<!-- One paragraph. What shipped and why. -->

## TDD evidence

- [ ] Failing test committed first (red)
- [ ] Minimum production code to pass (green)
- [ ] Refactor commits (if any)
- [ ] Full suite still green

## Design discipline

- [ ] No anti-patterns from docs/DESIGN_SYSTEM.md §3 introduced
- [ ] All colour / spacing / motion decisions reference tokens
- [ ] Dark and light modes both verified
- [ ] Empty / error / loading states designed

## Phase

<!-- Which phase in docs/build-prompt.md §6? -->

## Checklist

- [ ] `pnpm lint` green
- [ ] `pnpm typecheck` green
- [ ] `pnpm test` green, coverage threshold holds
- [ ] `pnpm test:e2e` green
- [ ] `pnpm build` green
- [ ] `PROGRESS.md` updated
- [ ] Relevant docs updated (README, CHANGELOG, architecture, data-model)
