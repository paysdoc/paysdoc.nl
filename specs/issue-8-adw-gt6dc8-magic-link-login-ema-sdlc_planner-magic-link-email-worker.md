# Feature: Magic Link Login + Email Worker

## Metadata
issueNumber: `8`
adwId: `gt6dc8-magic-link-login-ema`
issueJson: `{"number":8,"title":"Magic link login + email worker","body":"## Parent PRD\n\n`specs/prd/login-and-roles.md`\n\n## What to build\n\nAdd magic link (passwordless email) login as a fallback authentication method. When a user enters their email on the login page, Auth.js generates a verification token and calls a Cloudflare Worker to send the magic link email. The user clicks the link and is authenticated.\n\nThis slice includes:\n\n- Auth.js email provider configuration\n- Cloudflare Worker (in this repo) that receives email address + verification URL and sends a formatted email\n- Email template for the magic link\n- Documentation for required DNS configuration (SPF, DKIM for the sending domain)\n\n**HITL**: Requires DNS configuration (SPF/DKIM records) on the sending domain before magic links can be verified end-to-end. The code can be written and reviewed, but full verification needs human action.\n\nRefer to the **Magic Link Email Worker** section of the parent PRD.\n\n## Acceptance criteria\n\n- [ ] Login page has an email input field for magic link login\n- [ ] Submitting an email triggers Auth.js email provider flow\n- [ ] Cloudflare Worker receives the verification request and sends an email\n- [ ] Email contains a correctly formatted magic link\n- [ ] Clicking the magic link authenticates the user and redirects to dashboard\n- [ ] DNS setup requirements (SPF, DKIM) are documented\n- [ ] Worker is deployable from this repo\n\n## Blocked by\n\n- Blocked by #4 (Auth bootstrap + social login + route protection)\n\n## User stories addressed\n\n- User story 3 (login via magic link)\n- User story 22 (receive email within seconds)","state":"OPEN","author":"paysdoc","labels":["hitl"],"createdAt":"2026-03-30T15:37:13Z","comments":[],"actionableComment":null}`

## Feature Description
Add magic link (passwordless email) login as a fallback authentication method alongside the existing Google and GitHub OAuth providers. When a user enters their email on the login page, Auth.js v5 generates a verification token (stored in the D1 `verification_tokens` table), then calls a Cloudflare Worker via HTTP to send the magic link email. The user clicks the link in their email and is authenticated and redirected to the dashboard.

This feature includes:
- Auth.js Email provider configuration wired into the existing auth setup
- A standalone Cloudflare Worker (in `workers/email-worker/`) that receives an email address + verification URL and sends a formatted HTML email via an email service API
- An HTML email template for the magic link
- Documentation for required DNS configuration (SPF, DKIM) on the sending domain

## User Story
As a visitor without a Google or GitHub account
I want to log in using a magic link sent to my email
So that I can access protected areas of paysdoc.nl without needing a social account

## Problem Statement
Currently, login to paysdoc.nl requires a Google or GitHub account. Users who do not have or prefer not to use these social providers are locked out of protected areas. A passwordless email-based login provides an inclusive fallback that works for any user with an email address.

## Solution Statement
Add the Auth.js Email provider to the existing auth configuration. When a user submits their email on the login page, Auth.js generates a verification token, stores it in the D1 `verification_tokens` table (already created by migration `0001_auth_tables.sql`), and calls a custom `sendVerificationRequest` function. This function makes an HTTP POST to a Cloudflare Worker endpoint with the email address and verification URL. The Worker formats and sends a branded HTML email containing the magic link. The user clicks the link, Auth.js verifies the token, creates/finds the user record, and establishes a JWT session.

## Relevant Files
Use these files to implement the feature:

- `src/auth.ts` — Auth.js v5 configuration; add Email provider here alongside existing Google and GitHub providers
- `src/app/login/page.tsx` — Login page; add email input field, "Send magic link" button, and confirmation/error states
- `wrangler.jsonc` — Main Cloudflare config; reference for compatibility flags and D1 bindings
- `migrations/0001_auth_tables.sql` — Existing D1 schema; `verification_tokens` table already exists (no new migration needed)
- `src/middleware.ts` — Route protection middleware; no changes needed but relevant for understanding the auth redirect flow
- `src/components/Navbar.tsx` — Auth-aware navigation; no changes needed but relevant for understanding authenticated state
- `package.json` — Dependencies; no new dependencies needed (Auth.js Email provider is built into `next-auth`)
- `.github/workflows/deploy.yml` — CI/CD pipeline; needs a step to deploy the email worker
- `app_docs/feature-id4hh3-auth-bootstrap-social-login.md` — Auth bootstrap feature documentation (conditional doc: auth system context)
- `.claude/commands/test_e2e.md` — E2E test runner instructions
- `features/magic-link-login.feature` — BDD scenarios for the login UI flow
- `features/magic-link-email-worker.feature` — BDD scenarios for the email worker
- `e2e-tests/test_auth_flow.md` — Existing E2E test for reference on format and approach

### New Files
- `workers/email-worker/src/index.ts` — Cloudflare Worker entry point; handles POST requests with email + verification URL, formats and sends email via MailChannels API
- `workers/email-worker/wrangler.toml` — Worker-specific Cloudflare configuration (separate from the main app)
- `workers/email-worker/tsconfig.json` — TypeScript config for the worker
- `workers/email-worker/src/email-template.ts` — HTML email template for the magic link email
- `app_docs/feature-gt6dc8-magic-link-email-worker.md` — Feature documentation (created at completion)
- `app_docs/dns-setup-guide.md` — DNS configuration documentation for SPF and DKIM records
- `e2e-tests/test_magic_link_login.md` — E2E test file for the magic link login UI

## Implementation Plan
### Phase 1: Foundation
Set up the Cloudflare Worker project structure in `workers/email-worker/` with its own `wrangler.toml`, TypeScript config, and entry point. Create the HTML email template. This establishes the email-sending infrastructure before wiring it into Auth.js.

### Phase 2: Core Implementation
1. Implement the email worker: accept POST requests with `{ email, url }` payload, validate inputs, render the email template, and send via the MailChannels API (free for Cloudflare Workers, requires SPF DNS record).
2. Add the Auth.js Email provider to `src/auth.ts` with a custom `sendVerificationRequest` function that POSTs to the email worker endpoint.
3. Update the login page (`src/app/login/page.tsx`) to include an email input field, a "Send magic link" button with a server action, and confirmation/error state handling.

### Phase 3: Integration
1. Add the worker deployment step to the GitHub Actions workflow.
2. Create DNS setup documentation (SPF, DKIM records for the sending domain).
3. Create the E2E test file and validate all scenarios.
4. Create the feature documentation in `app_docs/`.

## Step by Step Tasks
Execute every step in order, top to bottom.

### Step 1: Create the E2E test file for magic link login
- Create `e2e-tests/test_magic_link_login.md` following the format of `e2e-tests/test_auth_flow.md`
- Test steps should cover:
  1. Navigate to `/login`
  2. Verify email input field is visible with appropriate placeholder text
  3. Verify "Send magic link" button is visible
  4. Verify Google and GitHub OAuth buttons still exist alongside the email input
  5. Enter an email address and click "Send magic link"
  6. Verify a confirmation message appears
  7. Try submitting an empty/invalid email and verify validation error
  8. Take screenshots at each verification point

### Step 2: Create the Cloudflare Worker project structure
- Create `workers/email-worker/` directory
- Create `workers/email-worker/wrangler.toml` with:
  - `name = "paysdoc-email-worker"`
  - `compatibility_date = "2025-04-01"`
  - `compatibility_flags = ["nodejs_compat"]`
  - `main = "src/index.ts"`
  - Environment variable bindings: `EMAIL_WORKER_SECRET` (shared secret for request authentication), `SENDER_EMAIL`, `SENDER_NAME`
- Create `workers/email-worker/tsconfig.json` targeting ES2022 with Cloudflare Workers types
- Create `workers/email-worker/package.json` with `@cloudflare/workers-types` as a dev dependency

### Step 3: Create the HTML email template
- Create `workers/email-worker/src/email-template.ts`
- Export a function `renderMagicLinkEmail(url: string): string` that returns a branded HTML email body
- The email should include:
  - A clear subject line: "Sign in to paysdoc.nl"
  - A prominent, clickable "Sign in" button linking to the verification URL
  - A fallback plain-text URL for email clients that don't render HTML
  - Paysdoc branding (company name, minimal styling)
  - A note that the link expires (Auth.js default: 24 hours)
  - A disclaimer that the user can ignore the email if they didn't request it

### Step 4: Implement the email worker
- Create `workers/email-worker/src/index.ts` as a Cloudflare Worker
- Accept POST requests to `/send` with JSON body: `{ email: string, url: string }`
- Validate the request:
  - Check for `Authorization: Bearer <EMAIL_WORKER_SECRET>` header
  - Validate `email` is present and is a valid email format
  - Validate `url` is present and is a valid URL
  - Return 400 with error message if validation fails
  - Return 401 if authorization fails
- Render the email using the template function
- Send the email via MailChannels API (POST to `https://api.mailchannels.net/tx/v1/send`) with:
  - `from`: configured sender email/name from environment
  - `to`: the user's email
  - `subject`: "Sign in to paysdoc.nl"
  - `content`: HTML body from the template + plain text fallback
  - DKIM configuration via MailChannels headers (domain, selector, private key from env)
- Return 200 on success, 500 on email send failure
- Add CORS headers for the Next.js app origin

### Step 5: Add Auth.js Email provider configuration
- Modify `src/auth.ts` to add the Email provider:
  - Import `Email` from `next-auth/providers/email` (Note: in Auth.js v5 beta, this is `import Nodemailer from "next-auth/providers/nodemailer"` or the generic email approach using `sendVerificationRequest`)
  - Add Email provider to the providers array with a custom `sendVerificationRequest` function
  - The `sendVerificationRequest` function should:
    - Extract `identifier` (email) and `url` (verification URL) from the params
    - Make a `fetch` POST to the email worker URL (from `process.env.EMAIL_WORKER_URL`)
    - Include `Authorization: Bearer <EMAIL_WORKER_SECRET>` header
    - Send `{ email: identifier, url }` as JSON body
    - Throw an error if the worker returns a non-200 response
- Add new environment variables: `EMAIL_WORKER_URL`, `EMAIL_WORKER_SECRET`, `AUTH_EMAIL_FROM`

### Step 6: Update the login page with email input
- Modify `src/app/login/page.tsx` to add the magic link email form:
  - Add a visual separator (divider with "or" text) between social login buttons and the email form
  - Add a form with:
    - An email input field (`type="email"`, `name="email"`, required, with placeholder "Enter your email")
    - A "Send magic link" submit button styled consistently with the existing OAuth buttons
  - The form action should be a server action that calls `signIn('email', { email, redirectTo: '/dashboard' })`
  - After submission, show a confirmation message: "Check your email for a magic link to sign in"
  - Handle the `error` search parameter from Auth.js to display error messages (expired link, invalid token, etc.)
  - Use the existing Tailwind styling patterns from the OAuth buttons

### Step 7: Add worker deployment to CI/CD
- Modify `.github/workflows/deploy.yml` to add a step after the main app deployment:
  - `npx wrangler deploy --config workers/email-worker/wrangler.toml`
  - Add `EMAIL_WORKER_SECRET` to the environment variables/secrets
- Document the new secrets needed in the deployment workflow

### Step 8: Create DNS setup documentation
- Create `app_docs/dns-setup-guide.md` with:
  - Overview of why SPF and DKIM records are required for magic link emails
  - SPF record configuration: add `include:_spf.mx.cloudflare.net` to the domain's SPF TXT record
  - DKIM record configuration: generate a DKIM keypair, add the public key as a DNS TXT record, configure the private key as a worker secret
  - Step-by-step instructions for Cloudflare DNS dashboard
  - Verification commands to test DNS records (`dig`, `nslookup`)
  - Troubleshooting common issues (emails going to spam, SPF failures)

### Step 9: Create feature documentation
- Create `app_docs/feature-gt6dc8-magic-link-email-worker.md` following the pattern of `app_docs/feature-id4hh3-auth-bootstrap-social-login.md`
- Document:
  - Overview of the magic link feature
  - Files modified and new files created
  - Technical implementation details
  - Configuration (new environment variables)
  - How to use locally and in production
  - DNS setup reference (link to `dns-setup-guide.md`)

### Step 10: Validate with lint, type-check, and build
- Run `npm run lint` — verify no linting errors
- Run `npx tsc --noEmit` — verify no type errors
- Run `npm run build` — verify the app builds successfully
- Run `cd workers/email-worker && npx wrangler deploy --dry-run` — verify the worker builds successfully
- Read `.claude/commands/test_e2e.md`, then read and execute `e2e-tests/test_magic_link_login.md` to validate the UI

## Testing Strategy
### Edge Cases
- Empty email field submission — form should show HTML5 validation (required attribute)
- Invalid email format — form should show HTML5 validation (type="email")
- Worker receives request without email — returns 400 error
- Worker receives request without verification URL — returns 400 error
- Worker receives request without valid authorization — returns 401 error
- MailChannels API returns an error — worker returns 500, Auth.js surfaces error to user
- Expired magic link token — Auth.js redirects to `/login?error=Verification` with error message
- Previously used magic link token — Auth.js redirects to `/login?error=Verification` with error message
- User already has an account via OAuth — magic link login should find existing user by email and authenticate
- Multiple rapid magic link requests — each generates a new token, only the latest is valid

## Acceptance Criteria
- Login page displays an email input field and "Send magic link" button alongside existing OAuth buttons
- Submitting a valid email triggers the Auth.js email provider flow and shows a confirmation message
- The Cloudflare Worker receives the verification request with email and URL, validates inputs, and sends an HTML email via MailChannels
- The email contains a correctly formatted, clickable magic link with the verification URL
- Clicking a valid magic link authenticates the user and redirects to `/dashboard`
- DNS setup requirements (SPF, DKIM) are documented in `app_docs/dns-setup-guide.md`
- The email worker is deployable from this repo via `npx wrangler deploy --config workers/email-worker/wrangler.toml`
- The email worker build succeeds (`npx wrangler deploy --dry-run`)
- All existing OAuth login flows continue to work (no regressions)
- Lint, type-check, and build all pass

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `npm run lint` — Run linter to check for code quality issues
- `npx tsc --noEmit` — Type-check the entire project
- `npm run build` — Build the application to verify no build errors
- `cd workers/email-worker && npm install && npx wrangler deploy --dry-run && cd ../..` — Verify the email worker builds successfully
- Read `.claude/commands/test_e2e.md`, then read and execute `e2e-tests/test_magic_link_login.md` to validate the magic link login UI

## Notes
- **MailChannels API**: MailChannels provides free transactional email sending for Cloudflare Workers. It requires SPF DNS records to authorize sending. DKIM signing is optional but strongly recommended for deliverability. If MailChannels is unavailable or deprecated, the worker can be adapted to use Resend, SendGrid, or any HTTP-based email API by changing the `fetch` call in the worker.
- **HITL requirement**: DNS records (SPF, DKIM) must be configured by a human on the sending domain before magic link emails will be delivered. The code can be written, reviewed, and deployed, but end-to-end verification requires this manual step.
- **No new D1 migration needed**: The `verification_tokens` table was already created in `migrations/0001_auth_tables.sql` as part of the Auth.js bootstrap (issue #4).
- **JWT session strategy**: The existing JWT session strategy works seamlessly with the Email provider — Auth.js creates the user in D1, then issues a JWT session cookie.
- **Auth.js v5 beta**: The project uses `next-auth@5.0.0-beta.30`. The Email provider API may change before stable release. Pin to the current beta version.
- **No new npm dependencies**: The Auth.js Email provider is built into the `next-auth` package. The email worker uses only Cloudflare Workers runtime APIs and `fetch`.
- **Worker authentication**: The shared `EMAIL_WORKER_SECRET` prevents unauthorized use of the email worker endpoint. This secret must be set in both the Next.js app environment and the worker environment.
- **New environment variables**: `EMAIL_WORKER_URL` (URL of the deployed email worker), `EMAIL_WORKER_SECRET` (shared auth secret), `SENDER_EMAIL` (from address), `SENDER_NAME` (from display name), and optionally `DKIM_PRIVATE_KEY` and `DKIM_SELECTOR` for DKIM signing.
