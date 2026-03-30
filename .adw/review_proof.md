# Review Proof Requirements

This file defines the proof requirements for this project. The `/review` command reads it to determine what evidence to produce when reviewing a pull request.

## Proof Type

Project type: **Web/UI (Next.js marketing site)**

Evidence to produce:
1. Browser screenshots of affected pages/components at desktop and mobile viewports
2. TypeScript type check output (`npx tsc --noEmit`)
3. Lint output (`npm run lint`)
4. Build output (`npm run build`) confirming no build errors
5. Dev server verification — confirm pages load without console errors
6. Visual inspection of UI changes against the design intent described in the issue

## Proof Format

Structure proof in the review JSON output as follows:
- `reviewSummary` — High-level overview of what was changed, verified, and any notable findings
- `reviewIssues` — List of discrepancies, regressions, or concerns found during review
- `screenshots` — Paths to screenshot artifacts showing before/after or key UI states

## Proof Attachment

Proof is attached to the PR via these review JSON fields:
- `reviewSummary`: narrative description of the review outcome
- `screenshots`: array of file paths to screenshot images captured during review
- `reviewIssues`: array of issues or concerns, each with a description and severity

## What NOT to Do

- Do not skip visual verification — this is a UI project and visual regressions matter
- Do not approve without running `npm run build`; build errors block deployment
- Do not rely solely on lint/type-check passing as proof of correctness
- Do not screenshot only the desktop viewport; mobile layout must also be verified
