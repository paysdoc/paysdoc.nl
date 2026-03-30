# GitHub Actions CI/CD: Deploy to Cloudflare Pages

**ADW ID:** k6j0g6-add-github-actions-w
**Date:** 2026-03-30
**Specification:** specs/issue-2-adw-k6j0g6-add-github-actions-w-sdlc_planner-gh-actions-cf-pages.md

## Overview

Adds a GitHub Actions workflow that automatically builds the static Next.js site and deploys it to Cloudflare Pages on every push to `main`. The workflow uses Bun for fast dependency installation and builds, and Wrangler (added as a pinned dev dependency) to publish the `out/` directory to the `paysdoc-nl` Cloudflare Pages project.

## What Was Built

- GitHub Actions workflow file (`.github/workflows/deploy.yml`) triggered on push to `main`
- Wrangler `4.78.0` added as a pinned dev dependency in `package.json`
- README `## Deployment` section documenting the CI/CD flow and required secrets
- README restructured to include project structure and scripts reference

## Technical Implementation

### Files Modified

- `.github/workflows/deploy.yml`: New workflow — checks out repo, installs Bun, runs `bun install` + `bun run build`, deploys `out/` via Wrangler
- `package.json`: Added `wrangler@4.78.0` to `devDependencies`
- `package-lock.json`: Updated lockfile after adding wrangler
- `README.md`: Replaced default Next.js boilerplate with project-specific docs including deployment instructions, project structure, and scripts table

### Key Changes

- Workflow triggers exclusively on `push` to `main` — no PR previews, no manual triggers
- Bun is used in CI for speed; npm remains the local package manager
- Wrangler is pinned at `4.78.0` to ensure reproducible deployments
- Secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are injected via GitHub Actions secrets (never hardcoded)
- `next.config.ts` already had `output: 'export'` — no changes needed there

## How to Use

1. Ensure the Cloudflare Pages project `paysdoc-nl` exists in the Cloudflare dashboard (one-time, out of scope for this workflow)
2. Add the following secrets to the GitHub repository under **Settings → Secrets and variables → Actions**:
   - `CLOUDFLARE_API_TOKEN` — Cloudflare API token with Pages deployment permissions
   - `CLOUDFLARE_ACCOUNT_ID` — Cloudflare account ID
3. Push a commit to `main` — the workflow runs automatically

## Configuration

| Secret | Description |
|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Pages:Edit permission |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID (visible in dashboard URL or account overview) |

The Cloudflare Pages project name is hardcoded as `paysdoc-nl` in `.github/workflows/deploy.yml`. Change the `--project-name` flag if the project is renamed.

## Testing

- Run `npm run build` locally to confirm the `out/` directory is produced without errors
- Run `cat .github/workflows/deploy.yml` to verify the workflow structure
- Run `grep wrangler package.json` to confirm wrangler is listed as a dev dependency
- After merging to `main`, check the **Actions** tab in GitHub for workflow run status and the Cloudflare Pages dashboard for a new deployment

## Notes

- The Cloudflare Pages project must be created manually before the first deploy — this is explicitly out of scope for this issue
- Hosting provider can be swapped in the future by replacing the Wrangler deploy step without touching the build steps, as motivated by the issue
- Wrangler is a dev dependency only; it is invoked via `npx wrangler` in CI to avoid adding it to the production bundle
