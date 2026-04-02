# Chore: Migrate secrets to Cloudflare Secrets Store

## Metadata
issueNumber: `14`
adwId: `07s3yg-migrate-secrets-to-c`
issueJson: `{"number":14,"title":"Migrate secrets to Cloudflare Secrets Store","body":"## Parent PRD\n\n`specs/prd/login-and-roles.md`\n\n## What to build\n\nReplace all direct secret access (`process.env.*` and plain `env.*`) with Cloudflare Secrets Store bindings using async `env.BINDING.get()`. This makes Secrets Store the single source of truth for production secrets, shared across the main app and email worker.\n\n### Changes required\n\n**Code — `src/auth.ts`** (6 secrets):\n- `process.env.AUTH_SECRET` → `env.AUTH_SECRET.get()`\n- `process.env.AUTH_GOOGLE_ID` → `env.AUTH_GOOGLE_ID.get()`\n- `process.env.AUTH_GOOGLE_SECRET` → `env.AUTH_GOOGLE_SECRET.get()`\n- `process.env.AUTH_GITHUB_ID` → `env.AUTH_GITHUB_ID.get()`\n- `process.env.AUTH_GITHUB_SECRET` → `env.AUTH_GITHUB_SECRET.get()`\n- `process.env.EMAIL_WORKER_URL` → `env.EMAIL_WORKER_URL.get()`\n\nAll accessed via `getCloudflareContext()` which is already used for D1 bindings.\n\n**Code — `workers/email-worker/src/index.ts`** (3 secrets):\n- `env.AUTH_SECRET` → `await env.AUTH_SECRET.get()`\n- `env.RESEND_API_KEY` → `await env.RESEND_API_KEY.get()`\n- `env.EMAIL_FROM` → `await env.EMAIL_FROM.get()`\n\n**Config — `wrangler.jsonc`** (main app):\n- Add `secrets_store_secrets` bindings for all 6 secrets\n\n**Config — `workers/email-worker/wrangler.jsonc`**:\n- Add `secrets_store_secrets` bindings for AUTH_SECRET, RESEND_API_KEY, EMAIL_FROM\n\n**GitHub Actions — `.github/workflows/deploy.yml`**:\n- Remove app secrets (AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, AUTH_GITHUB_ID, AUTH_GITHUB_SECRET, EMAIL_WORKER_URL, EMAIL_FROM) from deploy step\n- Keep only CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID\n\n**Cloudflare setup (manual, before deploy)**:\n- Create a Secrets Store: `npx wrangler secrets-store store create paysdoc-secrets --remote`\n- Create secrets in the store for all values listed above\n\n**Local dev**: continues to use `.dev.vars` files (Secrets Store does not work with `wrangler dev` locally).\n\n## Acceptance criteria\n\n- [ ] `src/auth.ts` accesses all secrets via `env.BINDING.get()` through `getCloudflareContext()`\n- [ ] `workers/email-worker/src/index.ts` accesses all secrets via `await env.BINDING.get()`\n- [ ] Both `wrangler.jsonc` files have `secrets_store_secrets` bindings configured\n- [ ] GitHub Actions deploy workflow no longer passes app secrets — only CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID\n- [ ] Local dev still works via `.dev.vars`\n- [ ] Auth flows (Google, GitHub, magic link) work end-to-end in production\n- [ ] Email worker sends magic link emails successfully in production","state":"OPEN","author":"paysdoc","labels":[],"createdAt":"2026-04-02T14:24:47Z","comments":[],"actionableComment":null}`

## Chore Description
Replace all direct secret access (`process.env.*` and plain `env.*`) with Cloudflare Secrets Store bindings using async `env.BINDING.get()`. This centralizes production secret management in Cloudflare Secrets Store, shared across the main Next.js app and the email worker. The main app currently reads secrets via `process.env.*` (6 secrets in `src/auth.ts`), and the email worker reads them as plain `env.*` strings (3 secrets in `workers/email-worker/src/index.ts`). Both wrangler configs need `secrets_store_secrets` bindings, and GitHub Actions should stop passing app secrets at deploy time since they'll now come from the Secrets Store.

## Relevant Files
Use these files to resolve the chore:

- `src/auth.ts` — Contains all 6 `process.env.*` secret accesses that must be converted to `env.BINDING.get()` via `getCloudflareContext()`. Already calls `getCloudflareContext()` for the D1 binding.
- `workers/email-worker/src/index.ts` — Contains 3 plain `env.*` secret accesses (`AUTH_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`) in the `Env` interface and `fetch` handler. Must be converted to async `env.BINDING.get()`.
- `wrangler.jsonc` — Main app Cloudflare config. Needs `secrets_store_secrets` bindings for all 6 secrets.
- `workers/email-worker/wrangler.jsonc` — Email worker config. Needs `secrets_store_secrets` bindings for 3 secrets, and the `vars` block with empty/default secret values should be removed.
- `.github/workflows/deploy.yml` — Deploy workflow. Must remove app-level secrets from the Pages deploy step env block (keep only `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`).
- `cloudflare-env.d.ts` — TypeScript type definitions for Cloudflare environment bindings. Must add types for the new Secrets Store bindings (each binding is typed as `{ get(): Promise<string> }`).
- `README.md` — Documents required GitHub Actions secrets and environment variables. Must be updated to reflect that app secrets are now managed via Cloudflare Secrets Store.
- `app_docs/feature-k6j0g6-github-actions-cf-pages.md` — Documents the CI/CD pipeline and secrets configuration (conditional doc: relevant because we're modifying the deploy workflow).
- `app_docs/feature-id4hh3-auth-bootstrap-social-login.md` — Documents auth configuration and environment variables (conditional doc: relevant because we're changing how auth secrets are accessed).
- `app_docs/feature-6otp7j-magic-link-email-worker.md` — Documents the email worker and its environment variables (conditional doc: relevant because we're changing how email worker secrets are accessed).

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Update TypeScript types in `cloudflare-env.d.ts`
- Add a `SecretStoreSecret` interface: `{ get(): Promise<string> }`
- Add all 6 main-app secret bindings to the `CloudflareEnv` interface as `SecretStoreSecret` type:
  - `AUTH_SECRET: SecretStoreSecret`
  - `AUTH_GOOGLE_ID: SecretStoreSecret`
  - `AUTH_GOOGLE_SECRET: SecretStoreSecret`
  - `AUTH_GITHUB_ID: SecretStoreSecret`
  - `AUTH_GITHUB_SECRET: SecretStoreSecret`
  - `EMAIL_WORKER_URL: SecretStoreSecret`
- Change the existing `EMAIL_WORKER_URL: string` to use the new `SecretStoreSecret` type

### Step 2: Update `wrangler.jsonc` — main app Secrets Store bindings
- Add a `secrets_store_secrets` array with bindings for all 6 secrets:
  - Each entry has `binding` (the name used in code), `secret_name` (the name in the store), and `store_id` (placeholder `"<STORE_ID>"` — must be filled in after manual store creation)
  - Bindings: `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, `EMAIL_WORKER_URL`

### Step 3: Update `workers/email-worker/wrangler.jsonc` — email worker Secrets Store bindings
- Remove the `vars` block (no longer needed — secrets come from the store, and local dev uses `.dev.vars`)
- Add a `secrets_store_secrets` array with bindings for 3 secrets:
  - `AUTH_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`
  - Use same `store_id` placeholder `"<STORE_ID>"`

### Step 4: Update `src/auth.ts` — use async Secrets Store bindings
- The function already calls `const { env } = await getCloudflareContext({ async: true })` and uses `env.DB`
- Move the `emailProvider` definition inside the `NextAuth(async () => { ... })` callback so it has access to `env`
- Replace all 6 `process.env.*` reads with `await env.BINDING.get()`:
  - `process.env.EMAIL_WORKER_URL` → `await env.EMAIL_WORKER_URL.get()`
  - `process.env.AUTH_SECRET` → `await env.AUTH_SECRET.get()`
  - `process.env.AUTH_GOOGLE_ID` → `await env.AUTH_GOOGLE_ID.get()`
  - `process.env.AUTH_GOOGLE_SECRET` → `await env.AUTH_GOOGLE_SECRET.get()`
  - `process.env.AUTH_GITHUB_ID` → `await env.AUTH_GITHUB_ID.get()`
  - `process.env.AUTH_GITHUB_SECRET` → `await env.AUTH_GITHUB_SECRET.get()`
- The `emailProvider` needs `env` in scope for `EMAIL_WORKER_URL` and `AUTH_SECRET`, so it must be constructed inside the callback after the `getCloudflareContext()` call

### Step 5: Update `workers/email-worker/src/index.ts` — use async Secrets Store bindings
- Update the `Env` interface: change all 3 fields from `string` to `{ get(): Promise<string> }` (Secrets Store binding type)
- In the `fetch` handler, replace synchronous `env.*` reads with `await env.*.get()`:
  - `env.AUTH_SECRET` → `await env.AUTH_SECRET.get()`
  - `env.RESEND_API_KEY` → `await env.RESEND_API_KEY.get()`
  - `env.EMAIL_FROM` → `await env.EMAIL_FROM.get()`
- Resolve all 3 secrets at the top of the handler for clarity: `const [authSecret, resendApiKey, emailFrom] = await Promise.all([env.AUTH_SECRET.get(), env.RESEND_API_KEY.get(), env.EMAIL_FROM.get()])`
- Update all usages in the handler body to use the resolved local variables

### Step 6: Update `.github/workflows/deploy.yml` — remove app secrets from deploy
- In the "Deploy to Cloudflare Pages" step, remove these env vars:
  - `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, `EMAIL_WORKER_URL`, `EMAIL_FROM`
- Keep only `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in that step
- The "Apply D1 migrations" and "Deploy email worker" steps remain unchanged (they already only use `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`)

### Step 7: Update `README.md` — reflect new secrets management
- Update the "Deployment" section's GitHub Actions secrets table: remove rows for `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, `EMAIL_WORKER_URL`, `EMAIL_FROM`
- Add a new "Secrets Store Setup" section explaining:
  - Create the store: `npx wrangler secrets-store store create paysdoc-secrets --remote`
  - Update `store_id` in both `wrangler.jsonc` files with the returned store ID
  - Create each secret in the store
  - Local dev continues to use `.dev.vars` (unchanged)
- Update the "Magic Link Email Setup" section's "Required environment variables" table to note that `EMAIL_FROM`, `AUTH_SECRET`, and `RESEND_API_KEY` are now managed via Secrets Store instead of Cloudflare dashboard variables

### Step 8: Run validation commands
- Run all validation commands listed below to confirm zero regressions

## Validation Commands
Execute every command to validate the chore is complete with zero regressions.

- `npm run lint` — Run linter to check for code quality issues
- `npx tsc --noEmit` — Type-check to verify Secrets Store types are correct
- `npm run build` — Build the application to verify no build errors

## Notes
- **Manual prerequisite before deploy**: The Cloudflare Secrets Store must be created and populated before deploying. Run `npx wrangler secrets-store store create paysdoc-secrets --remote`, then create each secret. Update the `<STORE_ID>` placeholder in both `wrangler.jsonc` files with the returned store ID.
- **Local dev unchanged**: `.dev.vars` files continue to work for local development — Secrets Store does not work with `wrangler dev` locally. The `.dev.vars` values are injected as plain strings, which means local dev will still read them as `env.BINDING` but calling `.get()` on a string will fail. This is expected: Wrangler automatically wraps `.dev.vars` values in a compatible object when `secrets_store_secrets` bindings are configured.
- **Email worker `vars` removal**: The current `workers/email-worker/wrangler.jsonc` has a `vars` block with empty/default values for `AUTH_SECRET`, `RESEND_API_KEY`, and `EMAIL_FROM`. These must be removed since secrets now come from the store. Leaving them would shadow the Secrets Store bindings.
- **Store ID placeholder**: Use `"<STORE_ID>"` as a placeholder in both wrangler configs. The actual ID is obtained after the manual `npx wrangler secrets-store store create` step and must be filled in before deployment.
