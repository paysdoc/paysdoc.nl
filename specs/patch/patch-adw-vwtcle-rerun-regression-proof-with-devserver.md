# Patch: Re-run regression scenario proof with dev server

## Metadata
adwId: `vwtcle-remove-secrets-store`
reviewChangeRequest: `Issue #1: @regression scenarios failed with exit code 1 and produced no output. The scenario proof file shows Status: FAILED with '(no output)', suggesting cucumber-js could not execute — likely because the dev server was not running or the test runner encountered a startup error before producing any scenario results. Resolution: Re-run the scenario proof pipeline ensuring the dev server is started before cucumber-js execution (prepare_app step). With the dev server running on the correct port and BASE_URL set, the 6 remaining @regression scenarios in home-page.feature should pass. If they still fail, inspect cucumber-js verbose output to identify the root cause.`

## Issue Summary
**Original Spec:** specs/issue-28-adw-hwz8bi-remove-secrets-store-sdlc_planner-remove-secrets-store.md
**Issue:** The 6 `@regression` scenarios in `features/home-page.feature` failed with exit code 1 and no output during the scenario proof pipeline. The `prepare_app` step (dev server startup) was not executed before `cucumber-js`, so Playwright connections to `BASE_URL` were refused.
**Solution:** Re-run the scenario proof pipeline with the dev server started first (`npm run dev -- --port {PORT}`), then execute `cucumber-js --tags "@regression"` with `BASE_URL` pointing at the running server. No code changes needed — this is an execution infrastructure issue.

## Files to Modify
Use these files to implement the patch:

No source files need modification. This patch re-executes the scenario proof with the correct infrastructure (dev server running before cucumber-js).

## Implementation Steps
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Start the dev server
- Run `npm run dev -- --port 38368` in the background
- Wait for the dev server to respond with HTTP 200 on `http://localhost:38368` (poll with `curl -s -o /dev/null -w "%{http_code}" http://localhost:38368` until it returns 200, up to 30 seconds)

### Step 2: Run @regression scenarios with dev server
- Execute: `BASE_URL=http://localhost:38368 npx cucumber-js --tags "@regression"`
- Capture full output (stdout, stderr, exit code)
- Expected: all 6 home-page `@regression` scenarios pass with exit code 0
- If any scenario fails, re-run with `--format progress-bar --format-options '{"colorsEnabled":true}'` to get verbose output and identify the root cause

### Step 3: Stop the dev server
- Kill the background dev server process started in Step 1

## Validation
Execute every command to validate the patch is complete with zero regressions.

1. `npm run lint` — Linting passes
2. `npx tsc --noEmit` — Type-check passes
3. `npm run build` — Build succeeds
4. `BASE_URL=http://localhost:38368 npx cucumber-js --tags "@regression"` — All 6 @regression scenarios pass (with dev server running on port 38368)

## Patch Scope
**Lines of code to change:** 0
**Risk level:** low
**Testing required:** Re-run @regression cucumber scenarios with dev server running on port 38368; verify all 6 pass
