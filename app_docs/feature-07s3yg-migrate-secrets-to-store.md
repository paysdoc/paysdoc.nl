# Migrate Secrets to Cloudflare Secrets Store

**ADW ID:** 07s3yg-migrate-secrets-to-c
**Date:** 2026-04-02
**Specification:** specs/issue-14-adw-07s3yg-migrate-secrets-to-c-sdlc_planner-migrate-secrets-to-store.md

## Overview

Replaced all direct secret access (`process.env.*` and plain `env.*` string reads) with Cloudflare Secrets Store bindings using async `env.BINDING.get()`. The Secrets Store is now the single source of truth for all production secrets, shared across the main Next.js app and the email worker. GitHub Actions no longer passes app secrets at deploy time.

## What Was Built

- Secrets Store bindings for 6 secrets in the main app (`wrangler.jsonc`)
- Secrets Store bindings for 3 secrets in the email worker (`workers/email-worker/wrangler.jsonc`)
- Async secret resolution in `src/auth.ts` via `Promise.all` using `env.BINDING.get()`
- Async secret resolution in `workers/email-worker/src/index.ts` via `Promise.all`
- TypeScript types for Secrets Store bindings in `cloudflare-env.d.ts`
- Removal of 7 app secrets from GitHub Actions deploy step
- Updated `README.md` with Secrets Store setup instructions

## Technical Implementation

### Files Modified

- `src/auth.ts`: Moved `emailProvider` definition inside the `NextAuth` async callback; replaced all 6 `process.env.*` reads with `await env.BINDING.get()` via `getCloudflareContext()`
- `workers/email-worker/src/index.ts`: Updated `Env` interface types from `string` to `{ get(): Promise<string> }`; replaced 3 synchronous `env.*` reads with `await env.*.get()` resolved via `Promise.all`
- `wrangler.jsonc`: Added `secrets_store_secrets` array with 6 bindings (`AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, `EMAIL_WORKER_URL`)
- `workers/email-worker/wrangler.jsonc`: Removed `vars` block; added `secrets_store_secrets` array with 3 bindings (`AUTH_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`)
- `.github/workflows/deploy.yml`: Removed 7 app-level secrets from the "Deploy to Cloudflare Pages" step; kept only `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`
- `cloudflare-env.d.ts`: Added `SecretStoreSecret` interface (`{ get(): Promise<string> }`); updated all 6 main-app secret bindings to use this type
- `README.md`: Removed app secrets from GitHub Actions secrets table; added "Secrets Store Setup" section with creation commands

### Key Changes

- **`src/auth.ts`**: All 6 secrets are resolved in parallel at the top of the `NextAuth` callback using `Promise.all([env.EMAIL_WORKER_URL.get(), env.AUTH_SECRET.get(), ...])`. The `emailProvider` object is now constructed inside this callback (after secrets are available) instead of at module level.
- **`workers/email-worker/src/index.ts`**: All 3 secrets resolved via `Promise.all([env.AUTH_SECRET.get(), env.RESEND_API_KEY.get(), env.EMAIL_FROM.get()])` at the top of the `fetch` handler, then referenced as local constants throughout.
- **`wrangler.jsonc` files**: Each `secrets_store_secrets` entry has a `<STORE_ID>` placeholder that must be replaced with the actual Cloudflare Secrets Store ID after manual store creation.
- **GitHub Actions**: The deploy step now only requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` — no app secrets in CI.
- **Local dev**: Unchanged — `.dev.vars` files continue to provide secrets for `wrangler dev`. Wrangler automatically wraps `.dev.vars` values in a compatible object when `secrets_store_secrets` bindings are configured.

## How to Use

### One-time Cloudflare Setup (required before first deploy)

1. Create the Secrets Store:
   ```bash
   npx wrangler secrets-store store create paysdoc-secrets --remote
   ```
2. Copy the returned store ID and replace `<STORE_ID>` in both `wrangler.jsonc` and `workers/email-worker/wrangler.jsonc`.
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

### Local Development

No changes required. Continue using `.dev.vars` files in the repo root and `workers/email-worker/` for local development with `wrangler dev`.

### GitHub Actions

Remove the following secrets from your GitHub repository settings (they are no longer passed to the deploy step):
- `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, `EMAIL_WORKER_URL`, `EMAIL_FROM`

Keep: `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

## Configuration

### `wrangler.jsonc` — main app bindings

```jsonc
"secrets_store_secrets": [
  { "binding": "AUTH_SECRET", "secret_name": "AUTH_SECRET", "store_id": "<STORE_ID>" },
  { "binding": "AUTH_GOOGLE_ID", "secret_name": "AUTH_GOOGLE_ID", "store_id": "<STORE_ID>" },
  { "binding": "AUTH_GOOGLE_SECRET", "secret_name": "AUTH_GOOGLE_SECRET", "store_id": "<STORE_ID>" },
  { "binding": "AUTH_GITHUB_ID", "secret_name": "AUTH_GITHUB_ID", "store_id": "<STORE_ID>" },
  { "binding": "AUTH_GITHUB_SECRET", "secret_name": "AUTH_GITHUB_SECRET", "store_id": "<STORE_ID>" },
  { "binding": "EMAIL_WORKER_URL", "secret_name": "EMAIL_WORKER_URL", "store_id": "<STORE_ID>" }
]
```

### `workers/email-worker/wrangler.jsonc` — email worker bindings

```jsonc
"secrets_store_secrets": [
  { "binding": "AUTH_SECRET", "secret_name": "AUTH_SECRET", "store_id": "<STORE_ID>" },
  { "binding": "RESEND_API_KEY", "secret_name": "RESEND_API_KEY", "store_id": "<STORE_ID>" },
  { "binding": "EMAIL_FROM", "secret_name": "EMAIL_FROM", "store_id": "<STORE_ID>" }
]
```

### TypeScript type (`cloudflare-env.d.ts`)

```ts
interface SecretStoreSecret {
  get(): Promise<string>;
}
```

## Testing

1. Run type-check: `npx tsc --noEmit`
2. Run linter: `npm run lint`
3. Run build: `npm run build`
4. Deploy to staging and verify:
   - Google OAuth login works end-to-end
   - GitHub OAuth login works end-to-end
   - Magic link email is sent and received
   - Email worker returns 200 on valid requests and 401 on invalid auth

## Notes

- **`vars` block removed from email worker**: The previous `workers/email-worker/wrangler.jsonc` had a `vars` block with empty/default values that would shadow Secrets Store bindings. It has been removed.
- **`<STORE_ID>` placeholder**: Both `wrangler.jsonc` files ship with `<STORE_ID>` as a placeholder. The deploy will fail until this is replaced with the real store ID from the manual setup step.
- **Local dev limitation**: Secrets Store does not work with `wrangler dev` locally. Wrangler wraps `.dev.vars` values in a compatible shim object, so `.get()` calls work transparently in local mode.
- **`AUTH_SECRET` shared between apps**: Both the main app and email worker reference the same `AUTH_SECRET` secret in the store. The email worker uses it for Bearer token validation; the main app uses it for Auth.js signing.
