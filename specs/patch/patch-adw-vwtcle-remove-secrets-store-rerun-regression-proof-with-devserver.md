# Patch: Re-run @regression scenario proof with dev server

## Metadata
adwId: `vwtcle-remove-secrets-store`
reviewChangeRequest: `Issue #1: @regression scenarios failed with exit code 1 and no output. This indicates a blocker-level issue with the regression test suite. Resolution: Investigate why @regression scenarios are failing silently. Check scenario configuration, test setup, and ensure all required dependencies are present.`

## Issue Summary
**Original Spec:** specs/issue-28-adw-hwz8bi-remove-secrets-store-sdlc_planner-remove-secrets-store.md
**Issue:** The 6 `@regression` scenarios in `features/home-page.feature` use Playwright to navigate to `BASE_URL` (defaults to `http://localhost:3000`). When executed without a running dev server, all page navigations hit `ERR_CONNECTION_REFUSED`, causing exit code 1 with no meaningful output. This is an infrastructure/execution issue, not a code defect — the scenarios themselves and step definitions are correct.
**Solution:** Start the Next.js dev server before running the `@regression` cucumber scenarios, then verify all 6 pass. No code changes are needed.

## Root Cause Analysis
- `features/home-page.feature` contains 6 scenarios tagged `@regression` (lines 9, 16, 22, 29, 37, 47)
- `features/step_definitions/home-page.steps.ts` uses Playwright to launch a headless Chromium browser and navigate to `BASE_URL` (line 10: `process.env.BASE_URL || 'http://localhost:3000'`)
- The regression proof was executed without a running dev server, so Playwright received `ERR_CONNECTION_REFUSED` on every `page.goto()` call
- Exit code 1 with no output is consistent with Playwright connection failures in headless mode

## Files to Modify

No source files need modification. This patch only requires re-executing the scenario proof with the correct infrastructure (dev server running).

## Implementation Steps
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Start the dev server
- Run `npm run dev -- --port 38368` in the background
- Wait for the dev server to be ready (check for "Ready" or successful HTTP response on `http://localhost:38368`)
- Export `BASE_URL=http://localhost:38368` for the cucumber process

### Step 2: Run @regression scenarios and capture output
- Execute: `BASE_URL=http://localhost:38368 npx cucumber-js --tags "@regression"`
- Capture the full output (exit code, stdout, stderr)
- All 6 home-page @regression scenarios should pass

### Step 3: Stop the dev server
- Kill the background dev server process

## Validation
Execute every command to validate the patch is complete with zero regressions.

1. `npm run lint` — Verify no linting regressions
2. `npx tsc --noEmit` — Verify no type-check regressions
3. `npm run build` — Verify build succeeds
4. `BASE_URL=http://localhost:38368 npx cucumber-js --tags "@regression"` — All 6 @regression scenarios pass (with dev server running on port 38368)

## Patch Scope
**Lines of code to change:** 0
**Risk level:** low
**Testing required:** Re-run @regression cucumber scenarios with dev server running; verify all 6 pass
