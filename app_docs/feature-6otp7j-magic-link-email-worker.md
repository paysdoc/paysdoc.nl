# Magic Link Login + Email Worker

**ADW ID:** `6otp7j-magic-link-login-ema`
**Date:** 2026-03-30
**Specification:** `specs/issue-8-adw-6otp7j-magic-link-login-ema-sdlc_planner-magic-link-email-worker.md`

## Overview

Adds passwordless magic link login as a fallback authentication method alongside the existing Google and GitHub OAuth providers. When a visitor submits their email on the login page, Auth.js generates a verification token, then invokes a custom Cloudflare Worker (`workers/email-worker/`) that sends a formatted HTML email via the MailChannels API. Clicking the link authenticates the user and redirects to `/dashboard`.

## What Was Built

- **Auth.js Email provider** configured in `src/auth.ts` with a custom `sendVerificationRequest` that calls the email worker via HTTP POST
- **Cloudflare Worker** (`workers/email-worker/`) — standalone TypeScript worker that accepts `{ to, url }`, validates the request, and sends email via MailChannels
- **Login page update** — email input field, "Send magic link" button, and an "or" divider separating it from OAuth buttons
- **Verify-request page** at `/auth/verify-request` — confirmation page shown after email submission
- **CI/CD updates** — email worker install + deploy steps added to `.github/workflows/deploy.yml`
- **E2E test spec** at `e2e-tests/test_magic_link_login.md`

## Technical Implementation

### Files Modified

- `src/auth.ts`: Added `EmailConfig` provider with custom `sendVerificationRequest`; added `verifyRequest: '/auth/verify-request'` to pages config
- `src/app/login/page.tsx`: Added email input, "Send magic link" button, server action form, and "or" divider
- `.github/workflows/deploy.yml`: Added install and deploy steps for the email worker; added `EMAIL_WORKER_URL` and `EMAIL_FROM` env vars to Pages deploy step
- `cloudflare-env.d.ts`: Updated with email worker bindings

### New Files

- `workers/email-worker/src/index.ts`: Worker fetch handler — validates method (POST only), Bearer auth header, JSON body fields, sends via MailChannels
- `workers/email-worker/wrangler.jsonc`: Worker config — name `paysdoc-email-worker`, compatibility date `2025-04-01`, `nodejs_compat` flag, `EMAIL_FROM` and `AUTH_SECRET` vars
- `workers/email-worker/package.json`: Worker package with `wrangler deploy` / `wrangler dev` scripts
- `workers/email-worker/tsconfig.json`: TypeScript config with Cloudflare Workers types
- `src/app/auth/verify-request/page.tsx`: Server component — "Check your email" confirmation page
- `e2e-tests/test_magic_link_login.md`: E2E test spec for magic link UI

### Key Changes

- Auth.js Email provider does **not** use nodemailer — the custom `sendVerificationRequest` replaces it entirely, making the setup compatible with Cloudflare Workers edge runtime
- The email worker authenticates incoming requests using a shared `AUTH_SECRET` Bearer token (same value as `AUTH_SECRET` in the main app)
- Verification tokens are stored in the `verification_tokens` D1 table created in `migrations/0001_auth_tables.sql` (issue #4) — no new migration needed
- MailChannels sending requires DNS configuration (SPF, DKIM, domain lockdown) before email delivery works end-to-end — this is a HITL requirement
- Magic link tokens expire after 24 hours and are single-use (Auth.js default behaviour)

## How to Use

1. Navigate to `/login`
2. Enter your email address in the "your@email.com" field
3. Click **Send magic link**
4. You are redirected to `/auth/verify-request` — check your inbox
5. Click the link in the email to authenticate and land on `/dashboard`

## Configuration

### Environment Variables

| Variable | Where set | Description |
|---|---|---|
| `EMAIL_WORKER_URL` | Main app (Pages) | Full URL of the deployed email worker, e.g. `https://paysdoc-email-worker.<account>.workers.dev` |
| `EMAIL_FROM` | Email worker (Cloudflare dashboard) | Sender address, e.g. `noreply@paysdoc.nl` |
| `AUTH_SECRET` | Both app and worker | Shared secret — must match in both environments |

### DNS Configuration (HITL required)

Before magic link emails are delivered, the sending domain needs three DNS records:

1. **SPF** — add `v=spf1 include:relay.mailchannels.net -all` as a TXT record on the sending domain
2. **DKIM** — generate a DKIM key pair per the [MailChannels DKIM docs](https://support.mailchannels.com/hc/en-us/articles/7122849237389) and add the DNS TXT record
3. **Domain lockdown** — add `_mailchannels.<domain>` TXT record with value `v=mc1 cfid=<worker-subdomain>.workers.dev`

### Worker Deployment

```bash
cd workers/email-worker
npm install
npx wrangler deploy
```

CI/CD deploys the worker automatically on push to main via `.github/workflows/deploy.yml`.

## Testing

- **Unit / type check**: `cd workers/email-worker && npx tsc --noEmit`
- **E2E**: Read `.claude/commands/test_e2e.md`, then execute `e2e-tests/test_magic_link_login.md`
- **Edge cases covered**: empty email (HTML5 `required`), invalid format (HTML5 `type="email"`), missing `to`/`url` fields (worker returns 400), missing/invalid auth header (worker returns 401), non-POST method (worker returns 405), MailChannels failure (worker returns 500)

## Notes

- **HITL requirement**: DNS records must be manually configured before end-to-end email delivery works. Code can be deployed and reviewed independently.
- **MailChannels is free** for Cloudflare Workers — no external email service subscription needed.
- **Expired/used tokens** are handled natively by Auth.js — the D1 adapter deletes tokens after first use and rejects expired ones.
