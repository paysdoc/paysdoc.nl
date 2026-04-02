# paysdoc.nl

Marketing website for [Paysdoc](https://paysdoc.nl) — AI-powered development workflows. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4.

## Getting Started

Install dependencies:

```bash
npm install
```

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
    auth/verify-request/page.tsx
    contact/page.tsx
    dashboard/
      page.tsx
      AddRepoForm.tsx
      RepoList.tsx
      actions.ts        # Server actions for repo CRUD
    login/page.tsx
    services/page.tsx
    api/auth/[...nextauth]/route.ts
    favicon.ico
    globals.css
    layout.tsx
    page.tsx
  components/           # Shared UI components
    CalEmbed.tsx
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
features/               # Cucumber BDD feature files
e2e-tests/              # E2E test plans
specs/                  # ADW-generated implementation specs
app_docs/               # Feature documentation
public/                 # Static assets (SVGs)
cloudflare-env.d.ts     # Cloudflare environment type bindings
vitest.config.ts        # Vitest unit test configuration
cucumber.js             # Cucumber BDD configuration
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

For local development, create a `.dev.vars` file (Cloudflare convention, git-ignored):

```
AUTH_SECRET=your-secret-here
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
AUTH_GITHUB_ID=your-github-client-id
AUTH_GITHUB_SECRET=your-github-client-secret
```

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

The site is deployed to [Cloudflare Pages](https://pages.cloudflare.com/) via GitHub Actions using the [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) adapter for server-side rendering. On every push to `main`, the workflow:

1. Installs dependencies with Bun
2. Builds the app with OpenNext (`bun run build` → `.open-next/`)
3. Applies D1 migrations (`--remote`)
4. Deploys `.open-next/assets` to Cloudflare Pages using Wrangler

The following GitHub Actions secrets must be configured in the repository:

| Secret | Description |
|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Pages deployment permissions |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |

All other app secrets (`AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, `EMAIL_WORKER_URL`, `EMAIL_FROM`, `RESEND_API_KEY`) are managed via Cloudflare Secrets Store — see **Secrets Store Setup** below.

## Secrets Store Setup

App secrets are stored in Cloudflare Secrets Store and injected at runtime via `secrets_store_secrets` bindings. This must be set up once before the first production deployment.

1. Create the store:

   ```bash
   npx wrangler secrets-store store create paysdoc-secrets --remote
   ```

2. Copy the returned store ID and replace `<STORE_ID>` in both `wrangler.jsonc` files (root and `workers/email-worker/`).

3. Create each secret in the store:

   ```bash
   npx wrangler secrets-store secret create AUTH_SECRET --store-id <STORE_ID> --remote
   npx wrangler secrets-store secret create AUTH_GOOGLE_ID --store-id <STORE_ID> --remote
   npx wrangler secrets-store secret create AUTH_GOOGLE_SECRET --store-id <STORE_ID> --remote
   npx wrangler secrets-store secret create AUTH_GITHUB_ID --store-id <STORE_ID> --remote
   npx wrangler secrets-store secret create AUTH_GITHUB_SECRET --store-id <STORE_ID> --remote
   npx wrangler secrets-store secret create EMAIL_WORKER_URL --store-id <STORE_ID> --remote
   npx wrangler secrets-store secret create RESEND_API_KEY --store-id <STORE_ID> --remote
   npx wrangler secrets-store secret create EMAIL_FROM --store-id <STORE_ID> --remote
   ```

4. Local development continues to use `.dev.vars` files — Secrets Store does not work with `wrangler dev` locally.

## Magic Link Email Setup

Magic link (passwordless) login is implemented via the Auth.js Email provider backed by a Cloudflare Worker that sends emails using [Resend](https://resend.com/).

### Email worker deployment

The worker lives in `workers/email-worker/`. To deploy it manually:

```bash
cd workers/email-worker
npm install
npx wrangler deploy
```

After deploying, Cloudflare will print the worker URL (e.g. `https://paysdoc-email-worker.<account>.workers.dev`). Set this as `EMAIL_WORKER_URL` in the main app environment.

### Required environment variables

In addition to the OAuth variables, the following are required:

| Variable | Where | Description |
|----------|-------|-------------|
| `EMAIL_WORKER_URL` | Main app | Full URL of the deployed email worker |
| `EMAIL_FROM` | Email worker | Sender address (e.g. `noreply@paysdoc.nl`) |
| `AUTH_SECRET` | Both | Shared secret — must match between app and worker for request validation |
| `RESEND_API_KEY` | Email worker | Resend API key for sending emails |

`EMAIL_FROM`, `AUTH_SECRET`, and `RESEND_API_KEY` are managed via Cloudflare Secrets Store (see **Secrets Store Setup** above). They no longer need to be set in the Cloudflare dashboard.

For local development, add to the main app's `.dev.vars`:

```
EMAIL_WORKER_URL=https://paysdoc-email-worker.<account>.workers.dev
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
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests (Vitest) |
