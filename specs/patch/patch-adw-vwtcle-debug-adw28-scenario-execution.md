# Patch: Debug @adw-28 scenario execution and validate chore

## Metadata
adwId: `vwtcle-remove-secrets-store`
reviewChangeRequest: `Issue #2: @adw-28 scenarios failed with exit code 1 and no output. This blocks validation of the secrets store removal feature. Resolution: Debug @adw-28 scenario execution. Verify that all feature files are properly tagged, step definitions exist, and the dev server is accessible at the expected endpoint.`

## Issue Summary
**Original Spec:** specs/issue-28-adw-hwz8bi-remove-secrets-store-sdlc_planner-remove-secrets-store.md
**Issue:** The ADW pipeline reports `@adw-28` scenarios failed with exit code 1 and no output, blocking validation of the secrets store removal chore.
**Solution:** Issue #28 is a **chore** (config/types/code removal), not a feature — there are no `@adw-28` BDD scenarios by design. No feature files contain the `@adw-28` tag. Running `cucumber-js --tags "@adw-28"` currently exits with code 0 and outputs "0 scenarios, 0 steps." The reported exit code 1 was caused by the prior state where 63 `@regression`-tagged scenarios had undefined step definitions (already fixed in commit `c438e0a`). Validation of this chore is done via the spec's validation commands (type-check, lint, build, grep for removed references), not BDD scenarios. The patch re-runs these validation commands and the `@regression` suite with a dev server to produce definitive proof.

## Root Cause Analysis

### Finding 1: No @adw-28 scenarios exist (correct by design)
- `grep -r "@adw-28" features/` returns no matches
- Issue #28 is a chore (remove Secrets Store) — chores modify config, types, and internal code without changing user-facing behavior, so they have no BDD scenarios
- `cucumber-js --tags "@adw-28"` exits with code 0, reporting "0 scenarios, 0 steps" — this is correct behavior

### Finding 2: Exit code 1 was from undefined @regression scenarios (already fixed)
- Prior to commit `c438e0a`, 63 of 69 `@regression` scenarios had no step definitions
- Cucumber-js strict mode treats undefined steps as failures → exit code 1
- Commit `c438e0a` removed `@regression` from these 63 scenarios
- Current state: only 6 `@regression` scenarios remain (all in `features/home-page.feature`, all with step definitions)

### Finding 3: @regression scenarios require a running dev server
- The 6 home-page `@regression` scenarios use Playwright to navigate to `BASE_URL` (defaults to `http://localhost:3000`)
- Without a dev server, Playwright gets `ERR_CONNECTION_REFUSED` → exit code 1 with no meaningful output
- The pipeline's `prepare_app` step must start the dev server before running scenarios

## Files to Modify
Use these files to implement the patch:

No source files need modification. This patch validates the existing state and produces proof that the chore is complete.

## Implementation Steps
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Confirm @adw-28 tag state
- Run `grep -r "@adw-28" features/ --include="*.feature"` — must return empty (no @adw-28 scenarios exist)
- Run `npx cucumber-js --tags "@adw-28" --dry-run` — must exit code 0 with "0 scenarios"
- Run `npx cucumber-js --tags "@adw-28"` — must exit code 0 with "0 scenarios" (confirms no failure)

### Step 2: Confirm @regression tag state
- Run `grep -r "@regression" features/ --include="*.feature"` — must only match `features/home-page.feature` (6 occurrences)
- Run `npx cucumber-js --tags "@regression" --dry-run` — must show "6 scenarios (6 skipped)" with exit code 0

### Step 3: Run spec validation commands
- `npx tsc --noEmit` — Type-check passes (confirms `SecretStoreSecret` removal is clean)
- `npm run lint` — Linting passes
- `npm run build` — Build succeeds
- `grep -r "SecretStoreSecret" --include="*.ts" --include="*.d.ts" .` — No remaining `SecretStoreSecret` references
- `grep -r "secrets_store" --include="*.jsonc" --include="*.json" .` — No remaining secrets store config references
- `grep -ri "secrets store" README.md` — No remaining Secrets Store references in README

### Step 4: Run @regression scenarios with dev server
- Start dev server: `npm run dev -- --port 38368` (background)
- Wait for server readiness (HTTP 200 on `http://localhost:38368`)
- Run: `BASE_URL=http://localhost:38368 npx cucumber-js --tags "@regression"`
- All 6 home-page scenarios must pass
- Stop the dev server

## Validation
Execute every command to validate the patch is complete with zero regressions.

1. `npx cucumber-js --tags "@adw-28" 2>&1; echo "EXIT=$?"` — "0 scenarios", EXIT=0
2. `npx cucumber-js --tags "@regression" --dry-run 2>&1; echo "EXIT=$?"` — "6 scenarios (6 skipped)", EXIT=0
3. `npx tsc --noEmit` — type-check passes
4. `npm run lint` — linting passes
5. `npm run build` — build succeeds
6. `BASE_URL=http://localhost:38368 npx cucumber-js --tags "@regression"` — all 6 scenarios pass (with dev server on port 38368)

## Patch Scope
**Lines of code to change:** 0
**Risk level:** low
**Testing required:** Re-run @adw-28 tag (confirms 0 scenarios, exit 0), re-run @regression with dev server (confirms 6 pass), run spec validation commands (type-check, lint, build, grep)
