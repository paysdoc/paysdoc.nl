# paysdoc.nl

Marketing website for [Paysdoc](https://paysdoc.nl) — AI-powered development workflows. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4.

## Getting Started

Install dependencies:

```bash
npm install
```

Copy the sample environment file and fill in your values:

```bash
cp .env.sample .env
```

See `.env.sample` for all required variables. For local development with Cloudflare Workers (`wrangler dev`), copy the same values into `.dev.vars` — Cloudflare ignores `.env`.

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Project Structure

```
src/
  app/                  # Next.js App Router pages
    about/page.tsx
    admin/page.tsx
    api/
      auth/[...nextauth]/route.ts
      interest/route.ts     # Interest capture API endpoint (POST /api/interest)
    auth/verify-request/page.tsx
    contact/page.tsx
    dashboard/
      page.tsx
      AddRepoForm.tsx
      RepoList.tsx
      actions.ts        # Server actions for repo CRUD
    how-it-works/page.tsx
    login/page.tsx
    services/page.tsx
    favicon.ico
    globals.css
    layout.tsx
    page.tsx
  components/           # Shared UI components
    InterestForm.tsx
    Footer.tsx
    Hero.tsx
    Navbar.tsx
    ProjectCostCard.tsx
    Providers.tsx
    ServiceCard.tsx
    SkillCard.tsx
  lib/                  # Shared utilities and business logic
    costs.ts            # Cost aggregation helpers
    repo-url.ts         # GitHub/GitLab URL parsing
    roles.ts            # Role resolution helpers
    __tests__/          # Unit tests (Vitest)
  types/                # TypeScript type augmentations
    cost.ts             # Cost domain types (D1 row + view types)
    next-auth.d.ts      # Extended Auth.js session/JWT types
  auth.ts               # Auth.js v5 configuration
  middleware.ts         # Route protection middleware
workers/
  email-worker/         # Cloudflare Worker — sends magic link emails via Resend
migrations/             # Cloudflare D1 SQL migrations
scripts/
  smoke.mjs             # Playwright smoke test (npm run smoke; -- --production adds the real-domain checks)
  lib/production-rules.mjs  # Pure og:url / https-only / no-pages.dev rules used by --production (unit-tested)
  dev/                  # Local-only D1 fixtures for the preview (never applied to production)
.github/workflows/
  deploy.yml            # Build + deploy to Cloudflare Workers on push to main
  cloudflare-ops.yml    # Manual wrangler operations against the live account
features/               # Cucumber BDD feature files
e2e-tests/              # E2E test plans
specs/                  # ADW-generated implementation specs
app_docs/               # Feature documentation
public/
  fonts/                # Self-hosted brand fonts (Euphemia UCAS)
  images/               # Brand imagery (logo, headshot)
  # Static SVGs and favicon
cloudflare-env.d.ts     # Cloudflare environment type bindings
wrangler.jsonc          # Cloudflare Workers deployment config (Worker + static assets)
open-next.config.ts     # OpenNext Cloudflare adapter config
vitest.config.ts        # Vitest unit test configuration
cucumber.js             # Cucumber BDD configuration
.adw/                   # ADW pipeline configuration (project, scenarios, providers)
```

## Domain Language

See [UBIQUITOUS_LANGUAGE.md](./UBIQUITOUS_LANGUAGE.md) for the canonical terminology used across this project and the ADW product.

## Authentication

Authentication is handled by [Auth.js v5](https://authjs.dev/) with Google and GitHub OAuth providers, backed by a [Cloudflare D1](https://developers.cloudflare.com/d1/) SQLite database.

### Required environment variables

| Variable | Description |
|----------|-------------|
| `AUTH_SECRET` | Random secret used to sign/encrypt session tokens (generate with `openssl rand -base64 32`) |
| `AUTH_GOOGLE_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret |
| `AUTH_GITHUB_ID` | GitHub OAuth app client ID |
| `AUTH_GITHUB_SECRET` | GitHub OAuth app client secret |

For local development, create a `.env.local` file at the project root (git-ignored):

```
AUTH_SECRET=your-secret-here
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
AUTH_GITHUB_ID=your-github-client-id
AUTH_GITHUB_SECRET=your-github-client-secret
```

Alternatively, use a `.dev.vars` file (Cloudflare convention) with the same variables — both are read during local development.

### D1 database setup

1. Create the D1 database (one-time):

   ```bash
   npx wrangler d1 create paysdoc-auth-db
   ```

2. Update the `database_id` field in `wrangler.jsonc` with the ID returned above.

3. Run migrations locally:

   ```bash
   npx wrangler d1 migrations apply paysdoc-auth-db --local
   ```

4. Run migrations in production:

   ```bash
   npx wrangler d1 migrations apply paysdoc-auth-db --remote
   ```

## Deployment

The site is deployed to [Cloudflare Workers](https://developers.cloudflare.com/workers/) with static assets via GitHub Actions (`.github/workflows/deploy.yml`). The [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) adapter builds the Next.js app into a Worker (`.open-next/worker.js`) plus an assets directory (`.open-next/assets`); `wrangler.jsonc` points `main` at the Worker and binds the assets as `ASSETS`, so `wrangler deploy` ships both. On every push to `main` (or a manual `workflow_dispatch`), the workflow:

1. Installs dependencies with `npm ci` (Node 22)
2. Runs `npm run lint` and `npm test`
3. Builds the app with OpenNext (`npm run build` → `.open-next/`)
4. Applies D1 migrations (`npx wrangler d1 migrations apply paysdoc-auth-db --remote`)
5. Deploys the site Worker `paysdoc-nl` (`npx wrangler deploy`)
6. Pushes the site Worker secrets with `wrangler secret bulk`
7. Installs and deploys the email Worker (`workers/email-worker`)
8. Pushes the email Worker secrets with `wrangler secret bulk`
9. Prints the deployed `workers.dev` URL in the log and the job summary

The following GitHub Actions secrets must be configured in the repository. The workflow pushes the application secrets to the Workers on every deploy (values are only ever passed via `env` and piped on stdin, never echoed), so Cloudflare Secrets Store is no longer used and secrets never need to be set in the Cloudflare dashboard.

| Secret | Used by | Description |
|--------|---------|-------------|
| `CLOUDFLARE_API_TOKEN` | Workflow | Cloudflare API token with Workers, D1 and KV permissions |
| `CLOUDFLARE_ACCOUNT_ID` | Workflow | Cloudflare account ID |
| `AUTH_SECRET` | Site + email Worker | Session signing secret; shared so the email Worker can validate requests |
| `AUTH_GOOGLE_ID` | Site | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Site | Google OAuth client secret |
| `AUTH_GITHUB_ID` | Site | GitHub OAuth app client ID |
| `AUTH_GITHUB_SECRET` | Site | GitHub OAuth app client secret |
| `COST_API_TOKEN` | Site | Token for the cost API at `COST_API_URL` (declared as a binding; not yet read by app code) |
| `RESEND_API_KEY` | Email Worker | Resend API key for sending magic link emails |

Non-secret configuration (`COST_API_URL`, `EMAIL_WORKER_URL`, `EMAIL_FROM`) lives in the `vars` block of the respective `wrangler.jsonc`. The `INTEREST_KV` namespace id in `wrangler.jsonc` must be created once (see `kv-create` below) before the first deploy.

### Local preview on the Cloudflare runtime

```bash
npm run build          # OpenNext build → .open-next/
npm run preview        # serves the built Worker in workerd (pass -- --port 8788 to pick a port)
BASE_URL=http://localhost:8788 npm run smoke   # Playwright smoke test against the preview
BASE_URL=https://www.paysdoc.nl npm run smoke -- --production   # same, plus the production-only checks
```

`--production` additionally asserts that every public page has an `og:url` on `https://www.paysdoc.nl`, that its
`link[rel=icon]` fetches with 200, and that no request made while rendering any page goes over plain `http:` or to
the retired `*.pages.dev` project. The JSON report and screenshots land in `.maestro/playbooks/Initiation/Working`
(override with `SMOKE_OUT_DIR`); the production evidence kept in the repo is under `docs/deployment/evidence/<date>/`.

The preview reads `.dev.vars` for secrets and uses the local D1/KV state in `.wrangler/`. The protected pages (`/dashboard`, `/admin`) use the `projects`, `client_repos`, `cost_records` and `token_usage` tables created by `migrations/0002_client_repos.sql` and `migrations/0003_cost_tables.sql`, so run the local migrations first.

### Cloudflare ops workflow

`.github/workflows/cloudflare-ops.yml` runs `wrangler` against the live account using the repository's `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` secrets, so no local `wrangler login` is needed. Trigger it with:

```bash
gh workflow run cloudflare-ops.yml -f operation=<op> [-f argument=...]
```

Operations: `whoami`, `kv-list`, `kv-create` (creates `INTEREST_KV` and prints its id), `kv-keys`, `kv-get` (argument: key), `secret-list`, `worker-secret-list`, `d1-schema`, `d1-query` (argument: SQL), `deployments`, `rollback`. Read the output with `gh run view --log` (or `gh run watch`) on the run that was started.

## Magic Link Email Setup

Magic link (passwordless) login is implemented via the Auth.js Email provider backed by a Cloudflare Worker that sends emails using [Resend](https://resend.com/).

### Email worker deployment

The worker lives in `workers/email-worker/`. To deploy it manually:

```bash
cd workers/email-worker
npm install
npx wrangler deploy
```

After deploying, Cloudflare will print the worker URL (e.g. `https://email.paysdoc.workers.dev`). Set this as `EMAIL_WORKER_URL` in the main app environment.

### Required environment variables

In addition to the OAuth variables, the following are required:

| Variable | Where | Description |
|----------|-------|-------------|
| `EMAIL_WORKER_URL` | Main app | Full URL of the deployed email worker |
| `EMAIL_FROM` | Email worker | Sender address (e.g. `noreply@paysdoc.nl`) |
| `AUTH_SECRET` | Both | Shared secret — must match between app and worker for request validation |
| `RESEND_API_KEY` | Email worker | Resend API key for sending emails |

`EMAIL_FROM` is set in `workers/email-worker/wrangler.jsonc`; `AUTH_SECRET` and `RESEND_API_KEY` are pushed to the email Worker by the deploy workflow (see **Deployment** above).

For local development, add to the main app's `.dev.vars`:

```
EMAIL_WORKER_URL=https://email.paysdoc.workers.dev
```

And add to `workers/email-worker/.dev.vars`:

```
AUTH_SECRET=your-secret-here
EMAIL_FROM=noreply@paysdoc.nl
RESEND_API_KEY=re_your-resend-api-key
```

### DNS configuration (HITL required)

> **Note:** These DNS records must be manually configured by the domain owner. The code can be deployed and reviewed without them, but magic link emails will not be delivered until DNS is in place.

Add your domain in the [Resend dashboard](https://resend.com/domains) and configure the following DNS records in Cloudflare:

#### 1. SPF record

| Type | Name | Content |
|------|------|---------|
| TXT | `send` | `v=spf1 include:amazonses.com ~all` *(copy exact value from Resend)* |

#### 2. DKIM record

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| TXT | `resend._domainkey` | *(copy from Resend dashboard)* | DNS only (grey cloud) |

#### 3. MX record (sending)

| Type | Name | Mail Server | Priority |
|------|------|-------------|----------|
| MX | `send` | *(copy from Resend)* | 10 |

#### 4. DMARC record (recommended)

| Type | Name | Content |
|------|------|---------|
| TXT | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:paysdoc@gmail.com` |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build (OpenNext for Cloudflare) |
| `npm run preview` | Serve the built Worker locally in the Cloudflare `workerd` runtime |
| `npm run smoke` | Playwright smoke test against `BASE_URL` (default `http://localhost:8788`); add `-- --production` for the real-domain checks |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests (Vitest) |
