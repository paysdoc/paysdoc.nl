# Chore: Remove Secrets Store, use plain env vars for secrets

## Metadata
issueNumber: `28`
adwId: `hwz8bi-remove-secrets-store`
issueJson: `{"number":28,"title":"Remove Secrets Store, use plain env vars for secrets","body":"## Summary\n\nReplace Cloudflare Secrets Store bindings with plain environment variables. Secrets Store adds complexity without value — secrets are already duplicated in the Pages dashboard because the store can't be used with Pages. Removing it gives a single, simpler secrets mechanism and unblocks local dev (Secrets Store bindings don't work with `getPlatformProxy`).\n\n## Changes\n\n### Config\n- `wrangler.jsonc` — drop `secrets_store_secrets` block; change D1 binding from `\"paysdoc_auth_db\"` to `\"DB\"`\n- `workers/email-worker/wrangler.jsonc` — drop `secrets_store_secrets` block\n\n### Types\n- `cloudflare-env.d.ts` — remove `SecretStoreSecret` interface; change `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, `COST_API_TOKEN` from `SecretStoreSecret` to `string`\n\n### Code\n- `src/auth.ts` — remove `.get()` calls on secret bindings (values are now plain strings)\n- `workers/email-worker/src/index.ts` — change `Env` interface from `{ get(): Promise<string> }` to `string`; remove `.get()` calls\n\n### Local dev\n- `.env.local` → deleted (secrets moved to `.dev.vars`)\n- `.dev.vars` — created with auth secrets; read by `getPlatformProxy` onto the Cloudflare `env` object\n\n### Docs\n- `README.md` — remove Secrets Store Setup section; update auth docs to reference Pages env vars and `wrangler secret put`\n\n## Secrets management after this change\n\n| Target | Mechanism | How to set |\n|--------|-----------|------------|\n| Pages (prod) | Pages environment variables | Cloudflare dashboard or `wrangler pages secret put` |\n| Email worker (prod) | Worker secrets | `wrangler secret put` (in `workers/email-worker/`) |\n| Local dev | `.dev.vars` file | Manual (gitignored) |\n\n## Pre-requisites (manual, before deploy)\n\n- Ensure all secrets are set in Pages dashboard (already done)\n- Set email worker secrets: `wrangler secret put AUTH_SECRET` and `wrangler secret put RESEND_API_KEY` in `workers/email-worker/`\n- After deploy: `npx wrangler secrets-store store delete 1b912ba249fb4664a0bf42e8b01e4a1d`","state":"OPEN","author":"paysdoc","labels":[],"createdAt":"2026-04-03T17:14:03Z","comments":[],"actionableComment":null}`

## Chore Description
Replace all Cloudflare Secrets Store bindings with plain environment variables across the main app and email worker. The Secrets Store adds unnecessary complexity because:
1. It can't be used with Pages — secrets are already duplicated in the Pages dashboard
2. It doesn't work with `getPlatformProxy`, blocking local dev
3. It requires async `.get()` calls on every secret access

After this change, secrets become plain `string` values on the Cloudflare `env` object. Production secrets are set via the Cloudflare dashboard (Pages env vars) and `wrangler secret put` (email worker). Local dev uses `.dev.vars` files.

**Pre-existing state on this branch:** Commit `cf2cba9` already removed the `secrets_store_secrets` block from the main `wrangler.jsonc`. The README has partial (unstaged) edits. A `.env.sample` file has been created (untracked). The `.gitignore` has been updated to allow `.env.sample`. The remaining work covers all other files listed in the issue.

## Relevant Files
Use these files to resolve the chore:

- `wrangler.jsonc` — Change D1 binding name from `"paysdoc_auth_db"` to `"DB"` to match the `CloudflareEnv` type and code usage (`env.DB`)
- `workers/email-worker/wrangler.jsonc` — Remove `secrets_store_secrets` block; email worker secrets will use `wrangler secret put` instead
- `cloudflare-env.d.ts` — Remove `SecretStoreSecret` interface; change all secret bindings from `SecretStoreSecret` to `string`
- `src/auth.ts` — Remove async `.get()` calls on secret bindings; secrets become plain strings
- `workers/email-worker/src/index.ts` — Change `Env` interface from `{ get(): Promise<string> }` to `string`; remove `.get()` calls
- `README.md` — Remove all Secrets Store references; update to reference Pages env vars and `wrangler secret put`
- `.env.sample` — Already created (untracked), needs to be committed
- `.gitignore` — Already updated (unstaged), needs to be committed
- `app_docs/feature-07s3yg-migrate-secrets-to-store.md` — Conditional doc for the original Secrets Store migration; update to reflect reversal

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Update Cloudflare config — `wrangler.jsonc`
- Change the D1 binding name from `"paysdoc_auth_db"` to `"DB"` to align with the `CloudflareEnv` interface (`DB: D1Database`) and the code in `src/auth.ts` line 44 (`D1Adapter(env.DB)`)
- The `secrets_store_secrets` block was already removed in commit `cf2cba9` — verify it is absent

### Step 2: Update email worker config — `workers/email-worker/wrangler.jsonc`
- Remove the entire `secrets_store_secrets` array (lines 9-12)
- Keep the `vars` block with `EMAIL_FROM` (it's a non-secret plain var)
- The resulting file should contain: `name`, `main`, `compatibility_date`, `compatibility_flags`, and `vars` only

### Step 3: Update types — `cloudflare-env.d.ts`
- Delete the `SecretStoreSecret` interface (lines 1-3)
- Change all secret bindings from `SecretStoreSecret` to `string`:
  - `AUTH_SECRET: string`
  - `AUTH_GOOGLE_ID: string`
  - `AUTH_GOOGLE_SECRET: string`
  - `AUTH_GITHUB_ID: string`
  - `AUTH_GITHUB_SECRET: string`
  - `COST_API_TOKEN: string`
- Remove the comment `// Vars (plain strings, not secrets)` since all values are now plain strings
- Keep `DB: D1Database`, `INTEREST_KV: KVNamespace`, `EMAIL_WORKER_URL: string`, and `COST_API_URL: string` unchanged

### Step 4: Update auth code — `src/auth.ts`
- Remove the `Promise.all` block (lines 12-18) that calls `.get()` on each secret
- Replace with direct string reads from `env`:
  ```ts
  const authSecret = env.AUTH_SECRET;
  ```
- Update the `Google` and `GitHub` provider configs to use `env.*` directly:
  ```ts
  Google({ clientId: env.AUTH_GOOGLE_ID, clientSecret: env.AUTH_GOOGLE_SECRET }),
  GitHub({ clientId: env.AUTH_GITHUB_ID, clientSecret: env.AUTH_GITHUB_SECRET }),
  ```
- In the `sendVerificationRequest` closure, reference `env.AUTH_SECRET` directly (or keep the `authSecret` local const for readability)
- Since secrets are no longer async, the function body becomes simpler but still needs `await getCloudflareContext()` (which is async)

### Step 5: Update email worker code — `workers/email-worker/src/index.ts`
- Change the `Env` interface (lines 1-5):
  - `AUTH_SECRET: string` (was `{ get(): Promise<string> }`)
  - `RESEND_API_KEY: string` (was `{ get(): Promise<string> }`)
  - `EMAIL_FROM: string` (already a string, keep as-is)
- Remove the `Promise.all` block (lines 63-66) that calls `.get()`
- Replace with direct reads:
  ```ts
  const authSecret = env.AUTH_SECRET;
  const resendApiKey = env.RESEND_API_KEY;
  ```
- The rest of the handler code references local `authSecret`/`resendApiKey` constants, so no further changes needed

### Step 6: Update README.md
- The README already has partial updates in the working tree. Complete the remaining changes:
- In the **Secrets Setup** section: remove the sentence referencing Secrets Store for the email worker. Replace with: "The email worker (`workers/email-worker/`) uses Worker secrets for `AUTH_SECRET` and `RESEND_API_KEY`. Set via `wrangler secret put` in the `workers/email-worker/` directory."
- In the **Magic Link Email Setup** → **Required environment variables** section: replace "`AUTH_SECRET` and `RESEND_API_KEY` for the email worker are managed via Cloudflare Secrets Store (see `workers/email-worker/wrangler.jsonc`). `EMAIL_FROM` is a plain var set in the same file." with "`AUTH_SECRET` and `RESEND_API_KEY` for the email worker are set via `wrangler secret put` in the `workers/email-worker/` directory. `EMAIL_FROM` is a plain var in `workers/email-worker/wrangler.jsonc`."
- Ensure NO remaining references to "Secrets Store" exist anywhere in the README
- In the **Authentication** → "For local development" section: update to reference `.dev.vars` as the primary mechanism (remove `.env.local` reference if present)

### Step 7: Update feature doc — `app_docs/feature-07s3yg-migrate-secrets-to-store.md`
- Add a notice at the top of the file that this feature was **reversed** by issue #28
- Example: `> **Reversed:** This Secrets Store migration was reverted in issue #28. Secrets are now plain environment variables. See the README for current setup.`
- This preserves the historical documentation while making it clear the approach was abandoned

### Step 8: Stage and verify all changes
- Stage `.gitignore`, `.env.sample`, `wrangler.jsonc`, `workers/email-worker/wrangler.jsonc`, `cloudflare-env.d.ts`, `src/auth.ts`, `workers/email-worker/src/index.ts`, `README.md`, `app_docs/feature-07s3yg-migrate-secrets-to-store.md`
- Verify no files containing actual secrets are staged

### Step 9: Run validation commands
- Execute all validation commands listed below to confirm zero regressions

## Validation Commands
Execute every command to validate the chore is complete with zero regressions.

- `npx tsc --noEmit` — Type-check the entire project; confirms `SecretStoreSecret` removal and `string` types are consistent
- `npm run lint` — Run ESLint to check for code quality issues
- `npm run build` — Build the application to verify no build errors (OpenNext/Cloudflare adapter)
- `cd workers/email-worker && npx tsc --noEmit` — Type-check the email worker separately (it has its own tsconfig)
- `grep -r "SecretStoreSecret" --include="*.ts" --include="*.d.ts" .` — Verify no remaining `SecretStoreSecret` references in TypeScript files
- `grep -r "secrets_store" --include="*.jsonc" --include="*.json" .` — Verify no remaining `secrets_store_secrets` references in config files
- `grep -ri "secrets store" README.md` — Verify no remaining "Secrets Store" references in README

## Notes
- The D1 binding rename (`paysdoc_auth_db` → `DB`) aligns the wrangler config with the existing TypeScript type definition and code usage. This is a correctness fix — the binding name in wrangler determines the property name on the `env` object.
- After deployment, the old Secrets Store should be deleted: `npx wrangler secrets-store store delete 1b912ba249fb4664a0bf42e8b01e4a1d`
- Email worker secrets (`AUTH_SECRET`, `RESEND_API_KEY`) must be set via `wrangler secret put` in the `workers/email-worker/` directory before the worker is redeployed without Secrets Store bindings.
- The `.env.sample` file serves as the template for both `.env` (Next.js) and `.dev.vars` (Cloudflare) local development files.
