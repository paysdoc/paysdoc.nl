# Feature: Magic link login + email worker

## Metadata
issueNumber: `8`
adwId: `6otp7j-magic-link-login-ema`
issueJson: `{"number":8,"title":"Magic link login + email worker","body":"## Parent PRD\n\n`specs/prd/login-and-roles.md`\n\n## What to build\n\nAdd magic link (passwordless email) login as a fallback authentication method. When a user enters their email on the login page, Auth.js generates a verification token and calls a Cloudflare Worker to send the magic link email. The user clicks the link and is authenticated.\n\nThis slice includes:\n\n- Auth.js email provider configuration\n- Cloudflare Worker (in this repo) that receives email address + verification URL and sends a formatted email\n- Email template for the magic link\n- Documentation for required DNS configuration (SPF, DKIM for the sending domain)\n\n**HITL**: Requires DNS configuration (SPF/DKIM records) on the sending domain before magic links can be verified end-to-end. The code can be written and reviewed, but full verification needs human action.\n\nRefer to the **Magic Link Email Worker** section of the parent PRD.\n\n## Acceptance criteria\n\n- [ ] Login page has an email input field for magic link login\n- [ ] Submitting an email triggers Auth.js email provider flow\n- [ ] Cloudflare Worker receives the verification request and sends an email\n- [ ] Email contains a correctly formatted magic link\n- [ ] Clicking the magic link authenticates the user and redirects to dashboard\n- [ ] DNS setup requirements (SPF, DKIM) are documented\n- [ ] Worker is deployable from this repo\n\n## Blocked by\n\n- Blocked by #4 (Auth bootstrap + social login + route protection)\n\n## User stories addressed\n\n- User story 3 (login via magic link)\n- User story 22 (receive email within seconds)","state":"OPEN","author":"paysdoc","labels":["hitl"],"createdAt":"2026-03-30T15:37:13Z","comments":[],"actionableComment":null}`

## Feature Description
Add magic link (passwordless email) login as a fallback authentication method alongside the existing Google and GitHub OAuth providers. When a visitor enters their email on the login page, Auth.js generates a verification token and invokes a custom `sendVerificationRequest` function that calls a Cloudflare Worker to deliver the magic link email. The visitor clicks the link and is authenticated with a session, redirected to `/dashboard`.

This slice adds two components: (1) Auth.js Email provider configuration integrated into the existing `src/auth.ts`, and (2) a standalone Cloudflare Worker in `workers/email-worker/` that receives the email address + verification URL via HTTP POST and sends a formatted email using the Cloudflare MailChannels integration (free for Workers). DNS documentation for SPF/DKIM is included so the sending domain can be configured for deliverability.

## User Story
As a visitor to paysdoc.nl
I want to log in using a magic link sent to my email
So that I can access protected areas without needing a Google or GitHub account

## Problem Statement
The current authentication system only supports Google and GitHub OAuth. Visitors who don't have or don't want to use a social account have no way to log in. A passwordless email-based option is needed as a fallback authentication method that works for any user with an email address.

## Solution Statement
Configure Auth.js's Email provider in the existing auth setup (`src/auth.ts`) with a custom `sendVerificationRequest` function that sends a POST request to a Cloudflare Worker. The Worker (`workers/email-worker/`) accepts the email address and verification URL, renders an HTML email template with the magic link, and sends it via MailChannels (Cloudflare's free email sending integration for Workers). The login page is updated with an email input field and "Send magic link" button that triggers the Auth.js email sign-in flow via a server action. The `verification_tokens` table already exists in D1 from the issue #4 migration — no schema changes are needed.

## Relevant Files
Use these files to implement the feature:

- `src/auth.ts` — Add Auth.js Email provider with custom `sendVerificationRequest` that calls the email worker
- `src/app/login/page.tsx` — Add email input field and "Send magic link" button alongside existing OAuth buttons
- `wrangler.jsonc` — Reference for Cloudflare Workers configuration patterns (D1 binding, compatibility flags)
- `cloudflare-env.d.ts` — May need to add bindings if the email worker needs environment access
- `migrations/0001_auth_tables.sql` — Reference: `verification_tokens` table already exists, no migration needed
- `README.md` — Add documentation for magic link setup, email worker deployment, and DNS configuration
- `.github/workflows/deploy.yml` — Add email worker deployment step
- `package.json` — Reference for existing dependencies; may need `nodemailer` if required by Auth.js Email provider
- `app_docs/feature-id4hh3-auth-bootstrap-social-login.md` — Reference for auth implementation patterns and conventions
- `.claude/commands/test_e2e.md` — E2E test runner instructions (read before creating E2E test)
- `UBIQUITOUS_LANGUAGE.md` — Domain terminology: Magic Link, Email Worker, Visitor, Session

### New Files
- `workers/email-worker/src/index.ts` — Cloudflare Worker entry point: receives POST with `{to, url, from}`, validates input, sends email via MailChannels, returns success/error response
- `workers/email-worker/wrangler.jsonc` — Worker-specific Cloudflare configuration (name, compatibility date/flags, environment variables)
- `workers/email-worker/package.json` — Worker dependencies and build scripts
- `workers/email-worker/tsconfig.json` — TypeScript config for the worker (Cloudflare Workers types)
- `e2e-tests/test_magic_link_login.md` — E2E test validating email input, magic link button, confirmation message, and coexistence with OAuth buttons

## Implementation Plan
### Phase 1: Foundation
Set up the Cloudflare Worker project structure for the email sender. This is an isolated Worker that can be developed and tested independently. Create the `workers/email-worker/` directory with its own `wrangler.jsonc`, `package.json`, `tsconfig.json`, and entry point. The Worker exposes a single POST endpoint that accepts `{to, url, from}` and sends an HTML email via MailChannels.

### Phase 2: Core Implementation
Integrate the Auth.js Email provider into the existing auth config. Add a custom `sendVerificationRequest` function that POSTs to the email worker URL. Update the login page with an email input field, "Send magic link" button, and confirmation/error states. Use a server action to call `signIn('email', { email, redirectTo: '/dashboard' })`.

### Phase 3: Integration
Wire the email worker deployment into the CI/CD pipeline. Document DNS configuration requirements (SPF, DKIM) for the sending domain. Update the README with magic link setup instructions. Create the E2E test specification. Validate the full flow: email input → Auth.js token generation → worker sends email → magic link click → authenticated session.

## Step by Step Tasks

### Step 1: Create E2E test specification
- Create `e2e-tests/test_magic_link_login.md` that validates:
  - Login page shows email input field for magic link
  - Login page shows "Send magic link" button
  - Email input coexists with "Sign in with Google" and "Sign in with GitHub" buttons
  - Submitting an email shows a confirmation message
  - Invalid/empty email shows validation error
- Read `.claude/commands/test_e2e.md` for the E2E test runner format
- Follow the pattern established in `e2e-tests/test_auth_flow.md`

### Step 2: Create the email worker project structure
- Create `workers/email-worker/` directory
- Create `workers/email-worker/package.json` with name `paysdoc-email-worker`, a `deploy` script (`wrangler deploy`), a `dev` script (`wrangler dev`), and `@cloudflare/workers-types` as a dev dependency
- Create `workers/email-worker/tsconfig.json` with Cloudflare Workers-compatible settings (ES2022 target, module resolution, `@cloudflare/workers-types` in types)
- Create `workers/email-worker/wrangler.jsonc` with worker name `paysdoc-email-worker`, compatibility date `2025-04-01`, compatibility flags `["nodejs_compat"]`, and environment variable bindings for `EMAIL_FROM` (sender address) and `AUTH_SECRET` (shared secret for request validation)

### Step 3: Implement the email worker
- Create `workers/email-worker/src/index.ts`
- Implement a `fetch` handler that:
  - Only accepts POST requests (returns 405 for other methods)
  - Validates the `Authorization` header contains a shared secret matching `AUTH_SECRET` env var
  - Parses JSON body expecting `{ to: string, url: string }`
  - Validates `to` is a non-empty email and `url` is a non-empty string
  - Returns 400 with error message for missing/invalid fields
  - Sends an email via MailChannels `send` API (`https://api.mailchannels.net/tx/v1/send`) with:
    - From: `EMAIL_FROM` environment variable
    - To: the `to` field from the request
    - Subject: "Sign in to paysdoc.nl"
    - HTML body: a styled email template with the magic link as a clickable button/link
    - Plain text body: fallback text with the URL
  - Returns 200 on success, 500 on MailChannels failure
- Keep the worker minimal — no frameworks, no decorators, just a plain `export default { fetch }` handler

### Step 4: Add Auth.js Email provider configuration
- Edit `src/auth.ts` to import and add an Email provider to the providers array
- Configure a custom `sendVerificationRequest` function that:
  - Receives `{ identifier (email), url, provider }` from Auth.js
  - Sends a POST request to the email worker URL (from `EMAIL_WORKER_URL` env var)
  - Includes the `AUTH_SECRET` in the Authorization header for request validation
  - Sends `{ to: identifier, url }` as the JSON body
  - Throws an error if the worker responds with a non-OK status
- Note: Auth.js Email provider requires the D1 adapter (already configured) for storing verification tokens — no `nodemailer` needed when using a custom `sendVerificationRequest`

### Step 5: Update the login page with magic link UI
- Edit `src/app/login/page.tsx` to add:
  - A visual divider ("or") between the OAuth buttons section and the magic link section
  - An email input field with `type="email"`, `name="email"`, `required`, and `placeholder="your@email.com"`
  - A "Send magic link" button
  - A server action form that calls `signIn('email', { email, redirectTo: '/dashboard' })` where email is read from the form data
  - Client-side email validation using the HTML5 `type="email"` and `required` attributes
- After submission, Auth.js will redirect to `/api/auth/verify-request` by default — configure `pages.verifyRequest` in auth config to show a custom confirmation page or use a query parameter to show inline confirmation
- Add a simple verify-request page at `src/app/auth/verify-request/page.tsx` that shows "Check your email — we sent a magic link to sign in"

### Step 6: Add the verify-request page
- Create `src/app/auth/verify-request/page.tsx` — a simple server component that displays a confirmation message: "Check your email" with instructions that a magic link has been sent
- Update `src/auth.ts` pages config to include `verifyRequest: '/auth/verify-request'`
- Style consistently with the login page (centered card, same width, same font/color conventions)

### Step 7: Update environment and configuration
- Update `cloudflare-env.d.ts` to document the `EMAIL_WORKER_URL` binding if needed at the app level
- Add `EMAIL_WORKER_URL` and `EMAIL_FROM` to the environment variables documentation
- Update `.github/workflows/deploy.yml` to:
  - Add a step to install email worker dependencies (`cd workers/email-worker && npm install`)
  - Add a step to deploy the email worker (`cd workers/email-worker && npx wrangler deploy`)
  - Add `EMAIL_WORKER_URL` to the Pages deployment env vars
  - Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` to the worker deploy step

### Step 8: Document DNS configuration
- Update `README.md` with a new section "Magic Link Email Setup" covering:
  - Email worker deployment instructions
  - Required environment variables (`EMAIL_WORKER_URL`, `EMAIL_FROM`, `AUTH_SECRET` shared between app and worker)
  - SPF record configuration: add a TXT record `v=spf1 include:relay.mailchannels.net -all` for the sending domain
  - DKIM record configuration: create a DKIM key pair using MailChannels documentation and add the DNS TXT record
  - Domain lockdown TXT record: `_mailchannels.<domain>` with `v=mc1 cfid=<worker-subdomain>.workers.dev` to authorize the worker
  - Note the HITL requirement: DNS records must be configured by a human before email delivery works

### Step 9: Run validation commands
- Run `npm run lint` — verify zero lint errors
- Run `npx tsc --noEmit` — verify zero type errors
- Run `npm run build` — verify the Next.js OpenNext build succeeds
- Run `cd workers/email-worker && npx tsc --noEmit` — verify worker type-checks
- Read `.claude/commands/test_e2e.md`, then read and execute `e2e-tests/test_magic_link_login.md` to validate the magic link UI

## Testing Strategy

### Edge Cases
- Empty email field submission — should show HTML5 validation error (handled by `required` attribute)
- Invalid email format — should show HTML5 validation error (handled by `type="email"`)
- Email worker receives request without `to` field — should return 400 error
- Email worker receives request without `url` field — should return 400 error
- Email worker receives request without valid Authorization header — should return 401
- Email worker receives non-POST request — should return 405
- MailChannels API failure — worker should return 500, Auth.js should surface error
- Expired magic link token — Auth.js handles this natively, shows error page
- Already-used magic link token — Auth.js handles this natively (token deleted after first use)
- User already authenticated navigates to login — existing redirect to `/dashboard` still works

## Acceptance Criteria
- [ ] Login page has an email input field for magic link login
- [ ] Login page has a "Send magic link" button
- [ ] Email input and magic link button coexist with Google and GitHub OAuth buttons
- [ ] Submitting an email triggers Auth.js Email provider flow (generates verification token in D1)
- [ ] Auth.js calls the Cloudflare email worker with the verification URL
- [ ] Email worker validates the request (auth header, required fields)
- [ ] Email worker sends an email via MailChannels with the magic link
- [ ] Email contains a correctly formatted, clickable magic link
- [ ] After submission, user sees a "check your email" confirmation page
- [ ] Clicking the magic link authenticates the user and redirects to `/dashboard`
- [ ] DNS setup requirements (SPF, DKIM, domain lockdown) are documented in README
- [ ] Email worker is deployable from this repo via `wrangler deploy`
- [ ] CI/CD pipeline deploys the email worker alongside the main app
- [ ] Invalid/missing fields return appropriate error responses from the worker

## Validation Commands

```bash
# Lint the main application
npm run lint

# Type-check the main application
npx tsc --noEmit

# Type-check the email worker
cd workers/email-worker && npx tsc --noEmit && cd ../..

# Build the main application (OpenNext)
npm run build

# E2E test: read .claude/commands/test_e2e.md, then execute e2e-tests/test_magic_link_login.md
```

## Notes
- **No `nodemailer` needed**: Auth.js Email provider supports a custom `sendVerificationRequest` function, bypassing the default nodemailer transport. This is ideal for Cloudflare Workers where Node.js-native modules aren't available.
- **MailChannels integration**: Cloudflare Workers can send emails for free via the MailChannels API. No additional email service subscription is needed. This requires a domain lockdown TXT record to authorize the worker.
- **HITL requirement**: DNS records (SPF, DKIM, domain lockdown) must be manually configured by the domain owner before magic link emails will be delivered successfully. The code can be written, reviewed, and deployed, but full end-to-end verification requires human DNS configuration.
- **Verification tokens table**: The `verification_tokens` table was already created in `migrations/0001_auth_tables.sql` (issue #4). No new migration is needed.
- **Session strategy**: The existing JWT session strategy works with the Email provider — no changes needed.
- **Library install command**: `npm install {library}` per `.adw/commands.md`. The email worker will need its own `npm install` for `@cloudflare/workers-types`.
- **Auth.js verify-request page**: Auth.js redirects to a verify-request page after email submission. A custom page is created at `/auth/verify-request` to match the site's styling.
