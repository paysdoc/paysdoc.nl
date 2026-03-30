# Chore: Add GitHub Actions workflow to deploy to Cloudflare Pages

## Metadata
issueNumber: `2`
adwId: `k6j0g6-add-github-actions-w`
issueJson: `{"number":2,"title":"Add GitHub Actions workflow to deploy to Cloudflare Pages","body":"## Summary\n\nSet up a GitHub Actions workflow that builds and deploys the static Next.js site to Cloudflare Pages on every push to `main`.\n\n## Requirements\n\n- **Trigger**: push to `main` only\n- **Runtime**: Bun (latest)\n- **Steps**: `bun install` → `bun run build` → deploy `out/` directory via Wrangler\n- **Wrangler**: add as a dev dependency in `package.json` (pinned version)\n- **Cloudflare project name**: `paysdoc-nl`\n- **Secrets required**: `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` (stored as GitHub Actions secrets)\n\n## Out of scope\n\n- Linting/type-checking gates\n- Preview deploys for PRs\n- Manual triggers\n- Cloudflare Pages project creation (done separately)\n\n## Motivation\n\nKeep CI/CD under our control in GitHub Actions rather than using Cloudflare's native Git integration, so the hosting provider can be swapped without reworking the deployment pipeline.\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)","state":"OPEN","author":"paysdoc","labels":[],"createdAt":"2026-03-30T15:03:35Z","comments":[],"actionableComment":null}`

## Chore Description
Set up a GitHub Actions workflow that builds the static Next.js site and deploys the `out/` directory to Cloudflare Pages on every push to `main`. The workflow uses Bun as its runtime and Wrangler for the Cloudflare Pages deployment. Wrangler must be added as a pinned dev dependency in `package.json`. The workflow relies on two GitHub Actions secrets: `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. The Cloudflare Pages project name is `paysdoc-nl`.

The project already has `output: 'export'` configured in `next.config.ts`, so `next build` produces a static `out/` directory ready for deployment.

## Relevant Files
Use these files to resolve the chore:

- `package.json` — Add wrangler as a pinned dev dependency
- `next.config.ts` — Confirms static export (`output: 'export'`) is already configured; no changes needed
- `README.md` — Update deployment section to document the CI/CD workflow and required secrets

### New Files
- `.github/workflows/deploy.yml` — GitHub Actions workflow file for building and deploying to Cloudflare Pages

## Step by Step Tasks

### Step 1: Add wrangler as a pinned dev dependency
- Add `wrangler` at pinned version `4.78.0` to the `devDependencies` in `package.json`
- Run `npm install` to update `package-lock.json`

### Step 2: Create the GitHub Actions workflow file
- Create `.github/workflows/deploy.yml` with the following configuration:
  - **Name**: `Deploy to Cloudflare Pages`
  - **Trigger**: `push` to `main` branch only
  - **Job**: single `deploy` job running on `ubuntu-latest`
  - **Steps**:
    1. `actions/checkout@v4` — check out the repository
    2. `oven-sh/setup-bun@v2` — install latest Bun runtime
    3. `bun install` — install dependencies
    4. `bun run build` — build the static Next.js site (produces `out/` directory)
    5. Deploy using `npx wrangler pages deploy out/ --project-name paysdoc-nl` with environment variables `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` sourced from GitHub Actions secrets

### Step 3: Update README.md
- Add a `## Deployment` section documenting:
  - The CI/CD workflow triggers on push to `main`
  - The workflow builds and deploys to Cloudflare Pages
  - Required GitHub Actions secrets: `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`

### Step 4: Validate
- Run the validation commands below to confirm the build still succeeds and no regressions are introduced

## Validation Commands
Execute every command to validate the chore is complete with zero regressions.

- `npm run lint` — Run linter to check for code quality issues
- `npm run build` — Build the application to verify no build errors and confirm `out/` directory is produced
- `cat .github/workflows/deploy.yml` — Verify workflow file exists and has correct structure
- `grep wrangler package.json` — Verify wrangler is listed as a dev dependency

## Notes
- The project currently uses npm as its package manager locally. The GitHub Actions workflow uses Bun as specified in the issue requirements. This is intentional — Bun is used in CI for speed.
- `next.config.ts` already has `output: 'export'` and `images: { unoptimized: true }`, so no changes are needed there.
- The Cloudflare Pages project (`paysdoc-nl`) must be created separately in the Cloudflare dashboard before the workflow can succeed — this is explicitly out of scope for this issue.
- Wrangler is pinned at `4.78.0` (latest stable as of 2026-03-30) to ensure reproducible deployments.
