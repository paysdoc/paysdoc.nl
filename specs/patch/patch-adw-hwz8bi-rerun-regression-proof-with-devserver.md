# Patch: Re-run @regression scenario proof with dev server

## Metadata
adwId: `hwz8bi-remove-secrets-store`
reviewChangeRequest: `Issue #1: @regression scenarios failed during scenario proof execution (exit code 1, no output). The 6 home-page @regression scenarios require a running dev server; the proof was generated without one, causing ERR_CONNECTION_REFUSED failures. This is an infrastructure concern, not a code defect. Resolution: Re-run the scenario proof with the dev server running.`

## Issue Summary
**Original Spec:** specs/issue-28-adw-hwz8bi-remove-secrets-store-sdlc_planner-remove-secrets-store.md
**Issue:** The 6 `@regression` scenarios in `features/home-page.feature` use Playwright to navigate to `BASE_URL` (defaults to `http://localhost:3000`). The scenario proof was executed without a running dev server, so all page navigations hit ERR_CONNECTION_REFUSED, resulting in exit code 1 with no output.
**Solution:** Start the Next.js dev server before running the `@regression` cucumber scenarios, then capture the passing results. No code changes are needed — this is purely an infrastructure/execution issue.

## Files to Modify

No source files need modification. This patch only requires re-executing the scenario proof with the correct infrastructure (dev server running).

## Implementation Steps
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Start the dev server
- Run `npm run dev -- --port 38368` in the background
- Wait for the dev server to be ready (check for "Ready" or successful HTTP response on `http://localhost:38368`)
- Export `BASE_URL=http://localhost:38368` for the cucumber process

### Step 2: Run @regression scenarios
- Execute: `BASE_URL=http://localhost:38368 npx cucumber-js --tags "@regression"`
- Capture the full output (exit code, stdout, stderr)
- All 6 home-page @regression scenarios should pass

### Step 3: Run @adw-28 scenarios (if any exist)
- Check if any scenarios are tagged `@adw-28` or `@adw-hwz8bi`: `grep -r "@adw-28\|@adw-hwz8bi" features/`
- If tagged scenarios exist, run: `BASE_URL=http://localhost:38368 npx cucumber-js --tags "@adw-28 or @adw-hwz8bi"`
- Note: The original chore (issue #28) is about removing Secrets Store config/types/code — it has no feature-level @adw-28 scenarios since it's a chore, not a feature. This step may be a no-op.

### Step 4: Stop the dev server
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
