# Feature: Interest Capture — API + Form Component + Contact Page

## Metadata
issueNumber: `17`
adwId: `ncd0ia-interest-capture-api`
issueJson: `{"number":17,"title":"Interest capture: API + form component + Contact page","body":"## Parent PRD\n\n`specs/prd/website-rebrand-and-repositioning.md`\n\n## What to build\n\nA complete interest registration flow from UI to storage: a reusable InterestForm component, a backend API endpoint that stores emails in Cloudflare Workers KV, and a rewritten Contact page that replaces the broken Cal.com embed with the new form + direct contact details.\n\nRefer to the Interest Capture API (Module 2), InterestForm Component (Module 3), and Contact Page Rewrite (Module 8) in the parent PRD.\n\n**End-to-end behavior**: A visitor on the Contact page enters their email and clicks submit. The form validates the email client-side, posts to `/api/interest`, which validates server-side and stores it in Workers KV. The visitor sees a confirmation message. The site owner can retrieve interest list via Wrangler CLI. The Contact page also shows email (info@paysdoc.nl), LinkedIn, and GitHub links.\n\n## Acceptance criteria\n\n- [ ] KV namespace bound in `wrangler.jsonc` and typed in `cloudflare-env.d.ts`\n- [ ] `POST /api/interest` endpoint accepts `{ email }`, validates format, stores in KV with timestamp, returns 201\n- [ ] Duplicate email submissions are idempotent (overwrite timestamp, no error)\n- [ ] Invalid email returns 400\n- [ ] `InterestForm` component with email input, submit button, client-side validation, success state, and error state\n- [ ] Contact page: CalEmbed removed, InterestForm present, direct contact details (email, LinkedIn, GitHub) displayed\n- [ ] Interest emails retrievable via `wrangler kv` CLI\n\n## Blocked by\n\nNone — can start immediately (parallel with brand rebrand).\n\n## User stories addressed\n\n- User story 2 (register interest in pilot)\n- User story 8 (contact via email or LinkedIn)\n- User story 13 (emails stored in Workers KV)\n- User story 18 (email format validation)","state":"OPEN","author":"paysdoc","labels":[],"createdAt":"2026-04-02T17:46:15Z","comments":[],"actionableComment":null}`

## Feature Description
A complete interest registration flow from UI to persistent storage. Visitors on the Contact page can enter their email to register interest in the Paysdoc pilot program. The form validates the email client-side, submits to a `POST /api/interest` endpoint which validates server-side and stores the email in Cloudflare Workers KV with a timestamp. Duplicate submissions are idempotent. The Contact page is rewritten to replace the broken Cal.com embed with the new InterestForm and direct contact details (email, LinkedIn, GitHub).

## User Story
As a potential Paysdoc customer
I want to register my interest by entering my email on the Contact page
So that I can be notified about the pilot program and easily find direct contact information

## Problem Statement
The current Contact page embeds a Cal.com scheduling widget that is broken. There is no way for visitors to register their interest in the Paysdoc pilot. The page lacks a LinkedIn link for alternative contact.

## Solution Statement
Replace the CalEmbed with a reusable InterestForm component backed by a `POST /api/interest` API route that stores emails in Cloudflare Workers KV. The KV key is the email address itself, making duplicate submissions naturally idempotent (overwrites the timestamp). The Contact page is rewritten to display the InterestForm alongside direct contact details (email, LinkedIn, GitHub).

## Relevant Files
Use these files to implement the feature:

- `wrangler.jsonc` — Add KV namespace binding for interest storage
- `cloudflare-env.d.ts` — Add `INTEREST_KV` type to `CloudflareEnv` interface
- `src/app/contact/page.tsx` — Rewrite to remove CalEmbed, add InterestForm and contact details
- `src/components/CalEmbed.tsx` — Will be removed (no longer used after Contact page rewrite)
- `src/app/dashboard/AddRepoForm.tsx` — Reference for existing form component patterns (`'use client'`, styling)
- `src/app/dashboard/actions.ts` — Reference for `getCloudflareContext` usage pattern
- `src/app/api/auth/[...nextauth]/route.ts` — Reference for API route structure
- `src/app/globals.css` — CSS custom properties used for theming (reference only)
- `src/components/Footer.tsx` — Reference for link styling patterns
- `.claude/commands/test_e2e.md` — E2E test runner instructions (read before running E2E test)

### New Files
- `src/app/api/interest/route.ts` — POST endpoint: validates email, stores in KV, returns 201/400
- `src/components/InterestForm.tsx` — Client component: email input, submit button, client-side validation, success/error states
- `e2e-tests/test_interest_capture.md` — E2E test plan for the interest capture flow

## Implementation Plan
### Phase 1: Foundation
Add the Cloudflare Workers KV namespace binding and TypeScript types. This enables the API route to access KV storage at runtime.

1. Add a `kv_namespaces` entry in `wrangler.jsonc` with binding name `INTEREST_KV`
2. Add `INTEREST_KV: KVNamespace` to the `CloudflareEnv` interface in `cloudflare-env.d.ts`

### Phase 2: Core Implementation
Build the API endpoint and the form component independently — they have no compile-time dependency on each other.

1. Create `POST /api/interest` route that uses `getCloudflareContext` to access `env.INTEREST_KV`, validates the email with a regex, stores `{ email, timestamp }` as a JSON value keyed by the email, and returns 201 (success) or 400 (invalid email / missing body)
2. Create the `InterestForm` client component with an email input, submit button, client-side validation via HTML5 `type="email"` + `required`, fetch-based submission to `/api/interest`, and success/error display states

### Phase 3: Integration
Wire the new component into the Contact page and clean up the removed CalEmbed.

1. Rewrite `src/app/contact/page.tsx` to import `InterestForm` instead of `CalEmbed`, update the page copy, and add LinkedIn to the contact details section
2. Delete `src/components/CalEmbed.tsx` since it is no longer referenced
3. Remove the CalEmbed import from any other files (none expected, but verify)

## Step by Step Tasks
Execute every step in order, top to bottom.

### Step 1: Create E2E test file
- Create `e2e-tests/test_interest_capture.md` with the test plan for the interest capture flow
- Test steps should cover:
  - Navigate to `/contact` page
  - Verify the InterestForm is present (email input + submit button)
  - Verify CalEmbed/iframe is NOT present
  - Verify direct contact details are displayed (email: info@paysdoc.nl, LinkedIn, GitHub links)
  - Test empty email submission triggers HTML5 validation (no navigation)
  - Test invalid email format triggers HTML5 validation (no navigation)
  - Test valid email submission shows success confirmation message
  - Take screenshots at each verification point
- Follow the format of existing E2E tests in `e2e-tests/` (User Story, Test Steps, Success Criteria, Output Format)

### Step 2: Add KV namespace binding to wrangler.jsonc
- Add a `kv_namespaces` array entry with `"binding": "INTEREST_KV"` and `"id": "<placeholder>"` to `wrangler.jsonc`
- The KV namespace must be created via `npx wrangler kv namespace create INTEREST_KV` before deploying to production; for local dev, `wrangler dev` automatically creates a local KV store
- Place the entry after the existing `d1_databases` block

### Step 3: Add KV type to cloudflare-env.d.ts
- Add `INTEREST_KV: KVNamespace;` to the `CloudflareEnv` interface
- Place it after the existing `DB: D1Database;` line, in the bindings section

### Step 4: Create POST /api/interest route
- Create `src/app/api/interest/route.ts`
- Export an async `POST` handler that:
  - Parses the JSON request body for `{ email }`
  - Returns 400 if email is missing or fails a basic email regex validation (e.g., `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
  - Uses `getCloudflareContext({ async: true })` to get `env.INTEREST_KV`
  - Stores the interest with `env.INTEREST_KV.put(email, JSON.stringify({ email, timestamp: new Date().toISOString() }))`
  - Returns `Response` with status 201 and `{ success: true }` JSON body
  - Only accepts POST method (App Router handles this via the named export)
- Duplicate emails naturally overwrite the KV entry (idempotent by design)

### Step 5: Create InterestForm component
- Create `src/components/InterestForm.tsx` as a `'use client'` component
- Include:
  - An email `<input>` with `type="email"`, `required`, and placeholder text
  - A submit `<button>` with loading state
  - `useState` for form state management: `idle`, `submitting`, `success`, `error`
  - On submit: prevent default, fetch `POST /api/interest` with `{ email }`, handle response
  - Success state: show a confirmation message (e.g., "Thanks! We'll be in touch.")
  - Error state: show the error message returned by the API
- Follow the project's styling conventions:
  - Use CSS custom variables: `var(--border)`, `var(--accent)`, `var(--muted)`, `var(--background)`, `var(--foreground)`
  - Match input styling from `AddRepoForm.tsx`: rounded border, focus ring with accent color
  - Submit button with accent background: `bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]`

### Step 6: Rewrite the Contact page
- Edit `src/app/contact/page.tsx`:
  - Remove the `CalEmbed` import and usage
  - Import and render `InterestForm` in place of the CalEmbed
  - Update the page heading/copy to reflect interest registration (e.g., "Interested in the pilot? Leave your email and we'll be in touch.")
  - In the "Other ways to reach me" section, add a LinkedIn link alongside the existing GitHub and Email links
  - LinkedIn URL: `https://linkedin.com/company/paysdoc` (or personal profile — verify with project owner; use company URL as default)
  - Keep the existing page layout structure (`max-w-3xl mx-auto px-6 py-20`)
  - Update metadata title if needed (keep as "Contact")

### Step 7: Delete CalEmbed component
- Delete `src/components/CalEmbed.tsx`
- Verify no other files import `CalEmbed` (search the codebase)
- Update `README.md` project structure section if it references CalEmbed

### Step 8: Run validation commands
- Run `npm run lint` — verify zero lint errors
- Run `npx tsc --noEmit` — verify zero type errors
- Run `npm run build` — verify successful production build
- Read `.claude/commands/test_e2e.md`, then read and execute the `e2e-tests/test_interest_capture.md` E2E test to validate the feature works end-to-end

## Testing Strategy
### Edge Cases
- Empty request body to `/api/interest` — should return 400
- Missing email field in JSON body — should return 400
- Malformed email (no @, no domain) — should return 400
- Valid email submitted twice — second submission overwrites silently, returns 201
- Very long email string — KV accepts it; no explicit length limit needed
- Non-POST method to `/api/interest` — Next.js App Router returns 405 automatically (only POST is exported)
- Network error during form submission — InterestForm shows error state
- Form resubmission after success — form should reset or allow resubmission

## Acceptance Criteria
- KV namespace `INTEREST_KV` is bound in `wrangler.jsonc` and typed as `KVNamespace` in `cloudflare-env.d.ts`
- `POST /api/interest` accepts `{ email }`, validates format, stores in KV with timestamp, returns 201
- `POST /api/interest` returns 400 for invalid or missing email
- Duplicate email submissions overwrite the KV entry without error (idempotent)
- `InterestForm` component renders an email input and submit button
- `InterestForm` validates email client-side (HTML5 `type="email"` + `required`)
- `InterestForm` shows a success message after successful submission
- `InterestForm` shows an error message on failure
- Contact page no longer contains CalEmbed / Cal.com iframe
- Contact page displays InterestForm
- Contact page shows direct contact details: email (info@paysdoc.nl), LinkedIn, and GitHub links
- `CalEmbed.tsx` is deleted
- Interest emails are retrievable via `npx wrangler kv key list --binding INTEREST_KV --local`
- `npm run lint`, `npx tsc --noEmit`, and `npm run build` all pass without errors

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `npm run lint` — Run linter to check for code quality issues
- `npx tsc --noEmit` — Type-check to verify KV binding types and all new code compiles
- `npm run build` — Build the application to verify no build errors
- Read `.claude/commands/test_e2e.md`, then read and execute `e2e-tests/test_interest_capture.md` to validate the interest capture flow works end-to-end

## Notes
- The KV namespace ID in `wrangler.jsonc` will be a placeholder until the namespace is created via `npx wrangler kv namespace create INTEREST_KV`. For local development, `wrangler dev` creates a local KV store automatically — no remote namespace ID is needed.
- The LinkedIn URL defaults to `https://linkedin.com/company/paysdoc`. This should be confirmed with the project owner and updated if a personal profile URL is preferred.
- No new npm packages are required. The feature uses only built-in Next.js API routes, the Fetch API, React hooks, and existing Cloudflare KV bindings from `@opennextjs/cloudflare`.
- The `CalEmbed.tsx` component is deleted as part of this feature. If it is needed again in the future, it can be restored from git history.
- Interest data is retrievable via CLI: `npx wrangler kv key list --binding INTEREST_KV --local` (local) or `--remote` (production).
