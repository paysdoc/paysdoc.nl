# Patch: Re-run @regression proof with active dev server

## Metadata
adwId: `vwtcle-remove-secrets-store`
reviewChangeRequest: `Issue #1: @regression scenarios failed with exit code 1 and no output. The branch removes @regression tags from all feature files except home-page.feature (6 remaining tags). The regression suite could not produce any test output, which blocks release confidence. Resolution: Investigate why cucumber-js --tags '@regression' exits with code 1 and no output. The devserver may not have been running when scenario_proof was generated, or there may be a step definition issue for the remaining home-page regression scenarios. Re-run the regression suite with the devserver active and fix any failing scenarios.`

## Issue Summary
**Original Spec:** specs/issue-28-adw-hwz8bi-remove-secrets-store-sdlc_planner-remove-secrets-store.md
**Issue:** The scenario proof pipeline reported both `@regression` and `@adw-28` suites as FAILED (exit code 1, no output). This blocks release confidence for the secrets store removal chore.
**Solution:** The root cause is an infrastructure gap — the dev server was not running when `cucumber-js` executed. The 6 `@regression` scenarios in `features/home-page.feature` use Playwright to navigate to `BASE_URL` (defaults to `http://localhost:3000`). Without a listening server, every `page.goto()` hits `ERR_CONNECTION_REFUSED`, causing cucumber-js to exit with code 1 and no test output. There are no `@adw-28`-tagged scenarios (correct by design — issue #28 is a chore, not a feature). No code changes are needed; the fix is to start the dev server before running the regression suite.

## Root Cause Analysis

### Why exit code 1 with no output?
1. `features/step_definitions/home-page.steps.ts:10` defaults `BASE_URL` to `http://localhost:3000`
2. The `Before` hook (`home-page.steps.ts:12-16`) launches headless Chromium via Playwright
3. Each scenario navigates to `BASE_URL` in the `Given` step — without a running server, Playwright throws `ERR_CONNECTION_REFUSED`
4. Cucumber-js exits code 1 before any scenario output is produced

### Why @adw-28 also failed?
- `grep -r "@adw-28" features/` returns zero matches — no scenarios carry this tag
- This is correct: issue #28 is a chore (config/type removal), not a user-facing feature
- The reported exit code 1 for `@adw-28` was from the same underlying infrastructure issue (dev server not running), which caused a general cucumber startup failure

### Are step definitions complete?
- All 6 `@regression` scenarios in `home-page.feature` have corresponding step definitions in `home-page.steps.ts`
- The step definitions were verified: Given/Then matchers cover all 6 scenarios
- No undefined step risk

## Files to Modify

No source files need modification. This patch re-executes the scenario proof with the dev server active.

## Implementation Steps
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Verify @regression tag state
- Run `grep -rn "@regression" features/` — must only match `features/home-page.feature` (6 occurrences at lines 9, 16, 22, 29, 37, 47)
- Run `npx cucumber-js --tags "@regression" --dry-run` — must show 6 scenarios with exit code 0

### Step 2: Verify @adw-28 tag state
- Run `grep -r "@adw-28" features/` — must return empty (no matches)
- Run `npx cucumber-js --tags "@adw-28"` — must exit code 0 with "0 scenarios"

### Step 3: Start the dev server and run @regression scenarios
- Start dev server: `npm run dev -- --port 38368` in background
- Wait for server readiness: poll `curl -s -o /dev/null -w "%{http_code}" http://localhost:38368` until HTTP 200 (up to 60 seconds)
- Execute: `BASE_URL=http://localhost:38368 npx cucumber-js --tags "@regression"`
- Expected: 6 scenarios, 6 passed, exit code 0
- If any scenario fails, re-run with `--format json` to capture detailed failure output and investigate the specific step that failed

### Step 4: Stop the dev server
- Kill the background dev server process

## Validation
Execute every command to validate the patch is complete with zero regressions.

1. `npm run lint` — Linting passes
2. `npx tsc --noEmit` — Type-check passes
3. `npm run build` — Build succeeds
4. `npx cucumber-js --tags "@adw-28" 2>&1; echo "EXIT=$?"` — "0 scenarios", EXIT=0
5. `BASE_URL=http://localhost:38368 npx cucumber-js --tags "@regression"` — All 6 @regression scenarios pass (with dev server running on port 38368)

## Patch Scope
**Lines of code to change:** 0
**Risk level:** low
**Testing required:** Run @regression cucumber scenarios with dev server active on port 38368; verify all 6 pass. Confirm @adw-28 exits cleanly with 0 scenarios. Run lint, type-check, and build.
