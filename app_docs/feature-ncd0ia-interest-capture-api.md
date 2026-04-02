# Interest Capture API + Form + Contact Page

**ADW ID:** ncd0ia-interest-capture-api
**Date:** 2026-04-02
**Specification:** specs/issue-17-adw-ncd0ia-interest-capture-api-sdlc_planner-interest-capture.md

## Overview

Implements a complete end-to-end interest registration flow for the Paysdoc pilot program. Visitors on the Contact page can submit their email via a client-side form component; the form posts to a new `POST /api/interest` API route that validates the email and stores it in Cloudflare Workers KV with a timestamp. The broken Cal.com embed on the Contact page has been replaced with this new form and expanded direct contact details.

## What Was Built

- `POST /api/interest` API route — server-side email validation and KV storage
- `InterestForm` React component — client-side email input with success/error states
- Contact page rewrite — replaces CalEmbed with InterestForm, adds LinkedIn link
- Cloudflare Workers KV binding (`INTEREST_KV`) wired in `wrangler.jsonc` and typed in `cloudflare-env.d.ts`
- `CalEmbed.tsx` component deleted (no longer used)
- Feature and E2E test files added under `features/` and `e2e-tests/`

## Technical Implementation

### Files Modified

- `src/app/api/interest/route.ts`: New file — `POST` handler that validates email with regex, stores `{ email, timestamp }` JSON in `INTEREST_KV`, returns 201 on success or 400 on invalid/missing email
- `src/components/InterestForm.tsx`: New file — `'use client'` component with email input, submit button, loading state, and success/error display via `useState`
- `src/app/contact/page.tsx`: Replaced `CalEmbed` import with `InterestForm`; updated heading/copy for pilot interest; reordered and expanded contact links (email, LinkedIn, GitHub)
- `wrangler.jsonc`: Added `kv_namespaces` block binding `INTEREST_KV` (ID is a placeholder — create via `npx wrangler kv namespace create INTEREST_KV` before deploying)
- `cloudflare-env.d.ts`: Added `INTEREST_KV: KVNamespace` to `CloudflareEnv` interface
- `src/components/CalEmbed.tsx`: Deleted

### Key Changes

- **KV storage is keyed by email address** — duplicate submissions naturally overwrite the existing entry (idempotent by design; no special handling needed)
- **Dual validation** — client-side via HTML5 `type="email" required` attributes; server-side via `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` regex
- **`getCloudflareContext({ async: true })`** is used in the API route to access `env.INTEREST_KV`, consistent with the existing pattern in `src/app/dashboard/actions.ts`
- **`InterestForm` state machine** — four states (`idle`, `submitting`, `success`, `error`) drive the UI; success replaces the form with a confirmation message
- **KV namespace ID is a placeholder** in `wrangler.jsonc`; `wrangler dev` creates a local KV store automatically without requiring a real ID

## How to Use

### Registering interest (end user)
1. Visit `/contact`
2. Enter your email address in the input field
3. Click **Register interest**
4. A confirmation message ("Thanks! We'll be in touch.") replaces the form on success

### Retrieving stored emails (site owner)
```bash
# Local dev
npx wrangler kv key list --binding INTEREST_KV --local

# Production (after creating the remote namespace)
npx wrangler kv key list --binding INTEREST_KV --remote

# Read a specific entry
npx wrangler kv get --binding INTEREST_KV "user@example.com" --local
```

## Configuration

### Required before production deployment
1. Create the KV namespace:
   ```bash
   npx wrangler kv namespace create INTEREST_KV
   ```
2. Replace the `"<placeholder>"` ID in `wrangler.jsonc` with the real namespace ID returned by the command above.

### Environment variables
No additional environment variables are needed — the KV binding is configured entirely via `wrangler.jsonc`.

## Testing

```bash
# Static checks
npm run lint
npx tsc --noEmit
npm run build

# E2E test plan
# Read e2e-tests/test_interest_capture.md and follow the steps with a browser or Playwright
```

The E2E test plan in `e2e-tests/test_interest_capture.md` covers:
- InterestForm presence on `/contact`
- Absence of CalEmbed/iframe
- Direct contact detail links (email, LinkedIn, GitHub)
- HTML5 validation for empty/invalid email (no network request)
- Valid email submission shows success confirmation

## Notes

- The LinkedIn URL defaults to `https://linkedin.com/company/paysdoc`. Update in `src/app/contact/page.tsx` if a personal profile URL is preferred.
- `CalEmbed.tsx` is gone but can be restored from git history if ever needed.
- No new npm packages were added — the feature uses only built-in Next.js API routes, the Fetch API, React hooks, and existing `@opennextjs/cloudflare` bindings.
- Interest data is stored indefinitely in KV until manually deleted. There is no expiration or deduplication beyond idempotent overwrites.
