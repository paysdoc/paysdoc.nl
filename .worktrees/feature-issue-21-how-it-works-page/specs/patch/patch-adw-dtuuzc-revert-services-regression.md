# Patch: Revert services page regression from how-it-works branch

## Metadata
adwId: `dtuuzc-how-it-works-page-ne`
reviewChangeRequest: `specs/issue-21-adw-8z0la0-how-it-works-page-ne-sdlc_planner-how-it-works-page.md`

## Issue Summary
**Original Spec:** specs/issue-21-adw-8z0la0-how-it-works-page-ne-sdlc_planner-how-it-works-page.md
**Issue:** The how-it-works branch (issue #21) incorrectly includes commit `a18e5a3` which rewrites the services page with two service tiers (issue #20 work). This pollutes the branch with unrelated changes: `src/app/services/page.tsx` and `src/components/ServiceCard.tsx` were modified, and five issue-#20 documentation files were added (`features/services-page.feature`, `e2e-tests/test_services_page.md`, two spec files, and `app_docs/feature-6q5dst-services-page-rewrite.md`). The services page content and its documentation belong solely to issue #20 and must not ship on the issue #21 branch.
**Solution:** Restore `src/app/services/page.tsx` and `src/components/ServiceCard.tsx` to match the `main` branch, and remove the issue-#20 documentation files that were added to this branch. This is a file-level revert — no logic changes required.

## Files to Modify
Use these files to implement the patch:

- `src/app/services/page.tsx` — restore to main branch version (pre-issue-#20 three-card layout)
- `src/components/ServiceCard.tsx` — restore to main branch version (without badge/CTA props)
- `features/services-page.feature` — remove (issue #20 artifact, does not belong on this branch)
- `e2e-tests/test_services_page.md` — remove (issue #20 artifact)
- `specs/issue-20-adw-2jhq2i-services-page-rewrit-sdlc_planner-services-page-rewrite.md` — remove (issue #20 artifact)
- `specs/issue-20-adw-6q5dst-services-page-rewrit-sdlc_planner-services-page-rewrite.md` — remove (issue #20 artifact)
- `app_docs/feature-6q5dst-services-page-rewrite.md` — remove (issue #20 artifact)

## Implementation Steps
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Restore services page files from main
- Run `git checkout main -- src/app/services/page.tsx src/components/ServiceCard.tsx`
- This replaces both files with the exact content from the `main` branch, eliminating the issue-#20 two-tier rewrite and restoring the original three-card layout with `Link` import and "Book a Discovery Call" CTA

### Step 2: Remove issue-#20 documentation files from this branch
- Run `git rm -f features/services-page.feature e2e-tests/test_services_page.md specs/issue-20-adw-2jhq2i-services-page-rewrit-sdlc_planner-services-page-rewrite.md specs/issue-20-adw-6q5dst-services-page-rewrit-sdlc_planner-services-page-rewrite.md app_docs/feature-6q5dst-services-page-rewrite.md`
- These files were added by the issue-#20 services rewrite commit and do not belong on the how-it-works branch

### Step 3: Verify and commit
- Run `git diff --cached --stat` to confirm only the expected files are staged
- Verify `src/app/services/page.tsx` contains the three original service cards: "AI Development Workflow Setup", "Custom Agent Development", "TypeScript Architecture & Consulting"
- Verify `src/components/ServiceCard.tsx` has no `badge`, `badgeVariant`, `ctaText`, or `ctaHref` props
- Commit with message: `fix: revert services page regression from issue-#20 leak`

## Validation
Execute every command to validate the patch is complete with zero regressions.

```bash
# 1. Verify services files match main exactly
git diff main -- src/app/services/page.tsx src/components/ServiceCard.tsx
# Expected: no output (files are identical to main)

# 2. Verify issue-#20 doc files are removed
git status -- features/services-page.feature e2e-tests/test_services_page.md specs/issue-20-adw-2jhq2i-services-page-rewrit-sdlc_planner-services-page-rewrite.md specs/issue-20-adw-6q5dst-services-page-rewrit-sdlc_planner-services-page-rewrite.md app_docs/feature-6q5dst-services-page-rewrite.md
# Expected: no output or files shown as deleted

# 3. Lint check
npm run lint

# 4. TypeScript type check
npx tsc --noEmit

# 5. Build verification
npm run build
```

## Patch Scope
**Lines of code to change:** ~120 (file-level revert of two source files, deletion of five documentation files)
**Risk level:** low
**Testing required:** Verify services files match main exactly, lint/typecheck/build pass, and how-it-works page still works correctly
