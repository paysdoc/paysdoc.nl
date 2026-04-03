# Patch: Make Cucumber baseUrl configurable via env var

## Metadata
adwId: `t7sfbq-about-page-rewrite`
reviewChangeRequest: `specs/issue-19-adw-t7sfbq-about-page-rewrite-sdlc_planner-about-page-rewrite.md`

## Issue Summary
**Original Spec:** specs/issue-19-adw-t7sfbq-about-page-rewrite-sdlc_planner-about-page-rewrite.md
**Issue:** All 5 `@regression` scenarios fail with `ERR_CONNECTION_REFUSED` at `http://localhost:3002`. The `features/support/world.ts` file hardcodes `baseUrl` to `http://localhost:3002`, but the dev server runs on a different port (typically 3000 or a dynamically assigned port). This causes every Playwright-based scenario to fail immediately before any assertions run.
**Solution:** Make `baseUrl` in `features/support/world.ts` configurable via the `BASE_URL` environment variable, defaulting to `http://localhost:3000` (the standard Next.js dev server port).

## Files to Modify

- `features/support/world.ts` — Change hardcoded `baseUrl` from `'http://localhost:3002'` to `process.env.BASE_URL || 'http://localhost:3000'`

## Implementation Steps
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Update baseUrl in CustomWorld
- In `features/support/world.ts`, change line 7:
  - From: `readonly baseUrl = 'http://localhost:3002';`
  - To: `readonly baseUrl = process.env.BASE_URL || 'http://localhost:3000';`
- This allows the scenario proof runner to pass `BASE_URL=http://localhost:<port>` when starting tests, while local developers get the standard Next.js default port (3000).

### Step 2: Verify TypeScript compiles
- Run `npx tsc --noEmit` to confirm the change doesn't introduce type errors (the type of `baseUrl` changes from a string literal to `string`, which is compatible).

## Validation
Execute every command to validate the patch is complete with zero regressions.

```bash
# 1. Lint check
npm run lint

# 2. TypeScript type-check
npx tsc --noEmit

# 3. Production build
npm run build

# 4. Verify baseUrl is now configurable (grep for the env var pattern)
grep -n 'process.env.BASE_URL' features/support/world.ts
# Should show the new configurable baseUrl line

# 5. Verify hardcoded port 3002 is gone
grep -n '3002' features/support/world.ts
# Should return empty (exit 1 = no matches = correct)

# 6. Dry-run Cucumber to confirm runner still starts
npx cucumber-js --tags @regression --dry-run 2>&1 | head -20
# Should show scenario names, not a crash
```

## Patch Scope
**Lines of code to change:** 1
**Risk level:** low
**Testing required:** Confirm `npx tsc --noEmit` passes and `grep` verifies the env var is in place. Full scenario execution requires a running dev server, which is validated separately by the E2E test runner.
