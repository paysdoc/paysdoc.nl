# Patch: Implement magic link login and email worker

## Metadata
adwId: `6otp7j-magic-link-login-ema`
reviewChangeRequest: `Issue #1: No implementation code exists. The branch only contains spec/planning files (7 files changed, all non-code). All 9 spec steps remain unimplemented: no email worker, no Auth.js Email provider, no login page updates, no verify-request page, no CI/CD changes, no DNS docs.`

## Issue Summary
**Original Spec:** specs/issue-8-adw-6otp7j-magic-link-login-ema-sdlc_planner-magic-link-email-worker.md
**Issue:** No implementation code exists on the branch. Only spec/planning files were committed. All 9 implementation steps are unimplemented: no email worker source, no Auth.js Email provider, no magic link UI on login page, no verify-request page, no CI/CD deployment step, no DNS documentation.
**Solution:** Execute the full implementation plan from the spec. Build the email worker, integrate Auth.js Email provider, update the login page with magic link UI, create the verify-request page, update CI/CD, and add DNS documentation.

## Files to Modify
Use these files to implement the patch:

- `workers/email-worker/package.json` — **Create**: Worker project manifest with deploy/dev scripts and `@cloudflare/workers-types`
- `workers/email-worker/tsconfig.json` — **Create**: TypeScript config for Cloudflare Workers
- `workers/email-worker/wrangler.jsonc` — **Create**: Worker-specific Cloudflare config (name, compat date/flags, env var bindings)
- `workers/email-worker/src/index.ts` — **Create**: Worker entry point — POST handler that validates auth, parses body, sends email via MailChannels
- `src/auth.ts` — **Modify**: Add Email provider with custom `sendVerificationRequest` calling the email worker; add `verifyRequest` page config
- `src/app/login/page.tsx` — **Modify**: Add email input, "Send magic link" button, divider between OAuth and magic link sections
- `src/app/auth/verify-request/page.tsx` — **Create**: Confirmation page shown after magic link email is sent
- `.github/workflows/deploy.yml` — **Modify**: Add email worker install + deploy steps
- `README.md` — **Modify**: Add "Magic Link Email Setup" section with DNS (SPF/DKIM/domain lockdown) docs
- `e2e-tests/test_magic_link_login.md` — **Create**: E2E test spec for magic link UI validation

## Implementation Steps
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Create E2E test specification
- Create `e2e-tests/test_magic_link_login.md` following the pattern in `e2e-tests/test_auth_flow.md`
- Test steps should validate:
  - Login page shows email input field for magic link login
  - Login page shows "Send magic link" button
  - Email input coexists with "Sign in with Google" and "Sign in with GitHub" buttons
  - Submitting an email (with the form action) shows redirect to verify-request page or confirmation
  - Invalid/empty email shows HTML5 validation (browser-native, no custom JS needed)
- Include user story, test steps, success criteria, and output format matching existing E2E test conventions

### Step 2: Create email worker project and implement the worker
- Create `workers/email-worker/package.json` with:
  - name: `paysdoc-email-worker`
  - scripts: `deploy` → `wrangler deploy`, `dev` → `wrangler dev`
  - devDependencies: `@cloudflare/workers-types`, `wrangler`
- Create `workers/email-worker/tsconfig.json` with ES2022 target, module/moduleResolution bundler, `@cloudflare/workers-types` in types
- Create `workers/email-worker/wrangler.jsonc` with:
  - name: `paysdoc-email-worker`
  - compatibility_date: `2025-04-01`
  - compatibility_flags: `["nodejs_compat"]`
  - `[vars]` section for `EMAIL_FROM` (placeholder)
  - Comment noting `AUTH_SECRET` should be set via `wrangler secret put`
- Create `workers/email-worker/src/index.ts`:
  - `export default { fetch }` handler
  - Only accept POST (return 405 otherwise)
  - Validate `Authorization: Bearer <AUTH_SECRET>` header (return 401 on mismatch)
  - Parse JSON body `{ to: string, url: string }` — return 400 if missing/invalid
  - Send email via MailChannels API (`https://api.mailchannels.net/tx/v1/send`):
    - From: `EMAIL_FROM` env var
    - To: the `to` field
    - Subject: "Sign in to paysdoc.nl"
    - HTML body: styled email with magic link button
    - Plain text fallback with the URL
  - Return 200 on success, 500 on MailChannels failure
- Run `cd workers/email-worker && npm install` to install dependencies

### Step 3: Integrate Auth.js Email provider and update login page
- Edit `src/auth.ts`:
  - Import `Email` from `next-auth/providers/email` (Note: in Auth.js v5 beta, the import is `import Email from 'next-auth/providers/nodemailer'` — but since we use a custom `sendVerificationRequest`, we use `import Nodemailer from 'next-auth/providers/nodemailer'` or the generic email provider approach via `{ id: 'email', name: 'Email', type: 'email', sendVerificationRequest }` — verify the correct import for `next-auth@5.0.0-beta.30`)
  - Add the Email provider to the providers array with a custom `sendVerificationRequest` function that:
    - POSTs to `process.env.EMAIL_WORKER_URL` with `Authorization: Bearer ${process.env.AUTH_SECRET}`
    - Body: `{ to: identifier, url }`
    - Throws on non-OK response
  - Add `verifyRequest: '/auth/verify-request'` to the `pages` config
- Edit `src/app/login/page.tsx`:
  - Add a visual divider (e.g., `<div>or</div>`) between OAuth buttons and magic link section
  - Add a `<form>` with:
    - `<input type="email" name="email" required placeholder="your@email.com" />`
    - `<button type="submit">Send magic link</button>`
    - Server action: `signIn('nodemailer', { email: formData.get('email'), redirectTo: '/dashboard' })`
  - Style consistently with existing OAuth buttons (same width, border, padding, font)
- Create `src/app/auth/verify-request/page.tsx`:
  - Simple server component with centered card
  - Heading: "Check your email"
  - Message: "We sent a magic link to your email address. Click the link to sign in."
  - Link back to login page
  - Style consistently with login page (same container, max-w-sm, spacing)

### Step 4: Update CI/CD pipeline and DNS documentation
- Edit `.github/workflows/deploy.yml`:
  - Add step after main `Install dependencies` to install email worker deps: `cd workers/email-worker && npm install`
  - Add step after `Deploy to Cloudflare Pages` to deploy the email worker:
    ```yaml
    - name: Deploy email worker
      run: cd workers/email-worker && npx wrangler deploy
      env:
        CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    ```
- Edit `README.md` — add a "Magic Link Email Setup" section after the existing "Authentication" section covering:
  - Email worker deployment instructions (`cd workers/email-worker && npx wrangler deploy`)
  - Required env vars: `EMAIL_WORKER_URL`, `EMAIL_FROM`, `AUTH_SECRET` (shared)
  - SPF record: `v=spf1 include:relay.mailchannels.net -all`
  - DKIM record: per MailChannels docs
  - Domain lockdown TXT record: `_mailchannels.<domain>` → `v=mc1 cfid=<worker-subdomain>.workers.dev`
  - HITL note: DNS records must be configured by a human before email delivery works

### Step 5: Run validation
- `npm run lint` — zero lint errors
- `npx tsc --noEmit` — zero type errors in main app
- `cd workers/email-worker && npx tsc --noEmit` — zero type errors in worker
- `npm run build` — OpenNext build succeeds
- Read and execute `e2e-tests/test_magic_link_login.md` via the E2E test runner

## Validation
Execute every command to validate the patch is complete with zero regressions.

1. `npm run lint` — verify zero lint errors
2. `npx tsc --noEmit` — verify zero type errors in main application
3. `cd workers/email-worker && npx tsc --noEmit && cd ../..` — verify zero type errors in email worker
4. `npm run build` — verify OpenNext build succeeds
5. Read `.claude/commands/test_e2e.md`, then read and execute `e2e-tests/test_magic_link_login.md` to validate the magic link UI renders correctly alongside OAuth buttons

## Patch Scope
**Lines of code to change:** ~350
**Risk level:** medium
**Testing required:** Lint, type-check (main app + worker), build, E2E test for login page UI. Full end-to-end magic link flow requires DNS configuration (HITL) and cannot be automated.
