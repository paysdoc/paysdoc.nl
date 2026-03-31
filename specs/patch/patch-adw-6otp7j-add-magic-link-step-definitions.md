# Patch: Add BDD step definitions for magic link scenarios

## Metadata
adwId: `6otp7j-magic-link-login-ema`
reviewChangeRequest: `Issue #2: BDD scenario proof was skipped — no step definition files found in features/step_definitions/. The @regression and @adw-6otp7j-magic-link-login-ema scenarios in magic-link-login.feature and magic-link-email-worker.feature could not be validated.`

## Issue Summary
**Original Spec:** specs/issue-8-adw-6otp7j-magic-link-login-ema-sdlc_planner-magic-link-email-worker.md
**Issue:** The `features/step_definitions/` directory does not exist. Cucumber.js is configured (`cucumber.js` config file requires `features/step_definitions/**/*.ts`) but no step definition files have been created. The scenario proof check skips validation entirely because there are no files to load.
**Solution:** Create step definition files for `magic-link-login.feature` and `magic-link-email-worker.feature` with Cucumber.js step definitions matching all Gherkin steps. UI-facing steps use Playwright for browser assertions. Worker and infrastructure steps use HTTP requests or file system checks. Steps that require external services (MailChannels, DNS) are marked as pending.

## Files to Modify
Use these files to implement the patch:

- `features/step_definitions/magic-link-login.steps.ts` — **Create**: Step definitions for all magic-link-login.feature scenarios (login page UI, email submission, validation, magic link auth flow)
- `features/step_definitions/magic-link-email-worker.steps.ts` — **Create**: Step definitions for all magic-link-email-worker.feature scenarios (worker request/response, email format, build, DNS docs)
- `features/support/world.ts` — **Create**: Custom Cucumber World class with Playwright browser/page setup and teardown, shared state (e.g. verification URL, response status)

## Implementation Steps
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Install required dependencies
- Install Playwright and Cucumber TypeScript support: `npm install --save-dev @playwright/test`
- Verify `@cucumber/cucumber` and `ts-node` are already installed (they are referenced in `cucumber.js` config)
- If `ts-node` is not present: `npm install --save-dev ts-node`

### Step 2: Create the Cucumber World with Playwright support
- Create `features/support/world.ts`
- Define a custom `World` class extending `@cucumber/cucumber`'s `World`:
  - Properties: `browser: Browser | null`, `page: Page | null`, `response: Response | null`, `baseUrl: string`
  - `Before` hook: launch Playwright chromium browser (headless), create a new page, set `baseUrl` from `process.env.BASE_URL || 'http://localhost:3000'`
  - `After` hook: close browser
- Export `setWorldConstructor` with the custom World
- Import and register `Before`/`After` hooks

### Step 3: Create magic-link-login step definitions
- Create `features/step_definitions/magic-link-login.steps.ts`
- Import `Given`, `When`, `Then` from `@cucumber/cucumber`
- Implement step definitions matching every step in `features/magic-link-login.feature`:

  **Given steps:**
  - `Given('I am an unauthenticated user')` — ensure no auth cookies; navigate to clear state
  - `Given('I am on the login page')` — navigate to `/login`
  - `Given('a magic link has been sent to {string}')` — mark as `pending()` (requires email infrastructure)
  - `Given('the magic link contains a valid verification token')` — mark as `pending()`
  - `Given('the magic link verification token has expired')` — mark as `pending()`
  - `Given('the magic link has already been used to authenticate')` — mark as `pending()`

  **When steps:**
  - `When('I navigate to the login page')` — `page.goto(baseUrl + '/login')`
  - `When('I enter {string} in the magic link email field')` — `page.fill('input[type="email"]', email)`
  - `When('I click the {string} button')` — `page.click('button:has-text("...")')`
  - `When('I leave the magic link email field empty')` — ensure email input is empty
  - `When('I click the magic link')` — mark as `pending()` (requires actual email)
  - `When('I click the magic link again')` — mark as `pending()`

  **Then steps:**
  - `Then('I should see an email input field for magic link login')` — assert `input[type="email"]` is visible
  - `Then('I should see a {string} button')` — assert button with text is visible
  - `Then('I should see a confirmation message that a magic link has been sent')` — assert page contains confirmation text or navigated to `/auth/verify-request`
  - `Then('the Auth.js email provider should generate a verification token')` — mark as `pending()` (DB check)
  - `Then('I should see a validation error for the email field')` — check the email input's validity state via `page.evaluate`
  - `Then('I should be authenticated as {string}')` — mark as `pending()`
  - `Then('I should be redirected to {string}')` — assert `page.url()` contains the path
  - `Then('I should see an error indicating the link has expired')` — mark as `pending()`
  - `Then('I should not be authenticated')` — mark as `pending()`
  - `Then('I should see an error indicating the link is no longer valid')` — mark as `pending()`

### Step 4: Create magic-link-email-worker step definitions
- Create `features/step_definitions/magic-link-email-worker.steps.ts`
- Import `Given`, `When`, `Then` from `@cucumber/cucumber`
- Implement step definitions matching every step in `features/magic-link-email-worker.feature`:

  **Given steps:**
  - `Given('the magic link email worker is running')` — set worker URL from `process.env.EMAIL_WORKER_URL || 'http://localhost:8787'`; optionally verify with a health check (or mark as pending if worker is not running)
  - `Given('the Cloudflare Worker source code exists in this repository')` — assert `workers/email-worker/src/index.ts` exists via `fs.existsSync`
  - `Given('the project documentation exists')` — assert `README.md` exists via `fs.existsSync`

  **When steps:**
  - `When('Auth.js sends a verification request for {string} with a verification URL')` — POST to worker URL with `{ to, url: 'https://paysdoc.nl/api/auth/callback/email?token=test' }` and auth header
  - `When('a magic link email is sent to {string}')` — same as above
  - `When('a verification request is received without an email address')` — POST with `{ url: '...' }` only (no `to` field)
  - `When('a verification request is received without a verification URL')` — POST with `{ to: 'user@example.com' }` only (no `url` field)
  - `When('I run the worker build command')` — execute `cd workers/email-worker && npx tsc --noEmit`

  **Then steps:**
  - `Then('the worker should send an email to {string}')` — assert response status is 200 (or mark pending if MailChannels is not available)
  - `Then('the email should contain the verification URL as a clickable magic link')` — mark as `pending()` (requires email content inspection)
  - `Then('the email subject should indicate a sign-in request')` — mark as `pending()`
  - `Then('the email body should contain a clickable link with the verification URL')` — mark as `pending()`
  - `Then('the email should be sent from the configured sending address')` — mark as `pending()`
  - `Then('the worker should return an error response')` — assert response status is 400 or 401
  - `Then('no email should be sent')` — assert by checking response body for error message
  - `Then('the build should succeed without errors')` — assert the build command exited with code 0
  - `Then('there should be documentation for SPF record configuration')` — read `README.md` and assert it contains "SPF"
  - `Then('there should be documentation for DKIM record configuration')` — read `README.md` and assert it contains "DKIM"
  - `Then('the documentation should specify the sending domain requirements')` — read `README.md` and assert it contains sending domain info
  - `Then('the email should be queued for delivery within {int} seconds')` — mark as `pending()`

## Validation
Execute every command to validate the patch is complete with zero regressions.

1. `npm run lint` — verify zero lint errors
2. `npx tsc --noEmit` — verify zero type errors in main application
3. `cd workers/email-worker && npx tsc --noEmit && cd ../..` — verify zero type errors in email worker
4. `npm run build` — verify OpenNext build succeeds
5. `npx cucumber-js --dry-run` — verify all step definitions are found and match the feature file steps (no undefined steps)
6. `npx cucumber-js --tags "@regression and @adw-gt6dc8-magic-link-login-ema" --dry-run` — verify the tagged scenarios have matching step definitions

## Patch Scope
**Lines of code to change:** ~250
**Risk level:** low
**Testing required:** Lint, type-check, build, cucumber dry-run to verify step definitions match feature files. Actual scenario execution requires running app + email worker, which is a HITL dependency.
