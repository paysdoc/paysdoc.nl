# Patch: Rebase onto main preserving role-resolution feature

## Metadata
adwId: `gt6dc8-magic-link-login-ema`
reviewChangeRequest: `specs/issue-8-adw-6otp7j-magic-link-login-ema-sdlc_planner-magic-link-email-worker.md`

## Issue Summary
**Original Spec:** specs/issue-8-adw-6otp7j-magic-link-login-ema-sdlc_planner-magic-link-email-worker.md
**Issue:** Branch diverged from main at `5e472fd` (PR #9 merge) but main has since merged PR #10 (issue #5: role-resolution and admin-guard). The branch rewrote `src/auth.ts` and `src/middleware.ts` without the role-resolution code, deleting `src/lib/roles.ts`, `src/types/next-auth.d.ts`, `vitest.config.ts`, `src/lib/__tests__/roles.test.ts`, feature files, and docs. The `package.json` also lost the `vitest` dependency and `test` script. Merging this branch as-is would revert the entire role-resolution feature.
**Solution:** Rebase this branch onto `origin/main`, resolve merge conflicts by combining both features: keep role-resolution callbacks AND add the email provider in `src/auth.ts`, keep admin guard logic AND update matcher in `src/middleware.ts`, keep vitest AND any new deps in `package.json`.

## Files to Modify
These files will have merge conflicts during rebase that require manual resolution:

- `src/auth.ts` — Merge: keep `resolveRole` import + jwt/session callbacks from main, add email provider + `verifyRequest` page from this branch
- `src/middleware.ts` — Merge: keep admin role guard from main, add `/auth/verify-request` to matcher if needed
- `package.json` — Merge: keep `vitest` dep and `test` script from main, keep any new deps from this branch

These files deleted by the branch must be preserved (rebase will auto-restore them from main):
- `src/lib/roles.ts` — Role resolution utility (from main)
- `src/types/next-auth.d.ts` — Session/JWT type augmentation (from main)
- `vitest.config.ts` — Vitest config (from main)
- `src/lib/__tests__/roles.test.ts` — Role resolution tests (from main)
- `features/admin-route-guard.feature` — Admin guard BDD feature (from main)
- `features/role-resolution.feature` — Role resolution BDD feature (from main)
- `app_docs/feature-1l6tsn-role-resolution-admin-guard.md` — Role resolution docs (from main)
- `specs/issue-5-adw-*` — Issue #5 spec (from main)

## Implementation Steps
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Fetch latest origin/main and start rebase
- Run `git fetch origin`
- Run `git rebase origin/main`
- Rebase will stop on conflicts — expect conflicts in `src/auth.ts`, `src/middleware.ts`, and `package.json`

### Step 2: Resolve `src/auth.ts` conflict
The merged file must contain BOTH features. The final file should:
- Import `resolveRole` from `@/lib/roles` (from main)
- Import `EmailConfig` from `@auth/core/providers/email` (from this branch)
- Define the `emailProvider` config object with `sendVerificationRequest` (from this branch)
- Include `emailProvider` in the providers array (from this branch)
- Keep the `jwt` callback that calls `resolveRole` (from main)
- Keep the `session` callback that propagates `role` (from main)
- Add `verifyRequest: '/auth/verify-request'` to `pages` config (from this branch)
- Do NOT include the `authorized` callback (it replaced the role callbacks — that was the bug)

### Step 3: Resolve `src/middleware.ts` conflict
The merged file must keep the admin guard logic from main:
- Import `auth` from `@/auth` and `NextResponse` from `next/server`
- Use the `auth((req) => { ... })` wrapper with redirect-to-login for unauthenticated and redirect-to-dashboard for non-admin on `/admin` routes
- Keep the matcher as `['/dashboard/:path*', '/admin/:path*']`

### Step 4: Resolve `package.json` conflict
The merged file must:
- Keep `"test": "vitest run"` in scripts (from main)
- Keep `"vitest": "^4.1.2"` in devDependencies (from main)
- Keep any other deps unchanged

### Step 5: Complete rebase and validate
- After resolving all conflicts, run `git add .` and `git rebase --continue`
- If additional conflict rounds appear, resolve them following the same principles (keep both features)
- After rebase completes, run validation commands

## Validation
Execute every command to validate the patch is complete with zero regressions.

1. `npx tsc --noEmit` — Type-check succeeds (role types, email provider types all resolve)
2. `npm run lint` — Zero lint errors
3. `npm run test` — Vitest tests pass (role resolution tests from main)
4. `npm run build` — Next.js OpenNext build succeeds
5. `cd workers/email-worker && npx tsc --noEmit && cd ../..` — Email worker type-checks
6. `git diff --stat origin/main` — Verify role-resolution files are NO LONGER shown as deleted (roles.ts, next-auth.d.ts, vitest.config.ts, feature files, app_docs, specs)
7. `git log --oneline origin/main..HEAD` — Verify clean rebase history

## Patch Scope
**Lines of code to change:** ~30 (conflict resolution in 3 files)
**Risk level:** medium (rebase with conflict resolution; risk of accidentally dropping changes)
**Testing required:** Full validation suite — type-check, lint, unit tests, build — to ensure neither feature regressed
