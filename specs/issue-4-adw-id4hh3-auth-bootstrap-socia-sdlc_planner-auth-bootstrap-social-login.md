# Feature: Auth bootstrap + social login + route protection

## Metadata
issueNumber: `4`
adwId: `id4hh3-auth-bootstrap-socia`
issueJson: `{"number":4,"title":"Auth bootstrap + social login + route protection","body":"## Parent PRD\n\n`specs/prd/login-and-roles.md`\n\n## What to build\n\nEnd-to-end authentication flow on Cloudflare Pages: a user can click \"Login\" in the Navbar, authenticate via Google or GitHub OAuth, see their avatar/name in the Navbar with a dropdown (dashboard link, logout), and access placeholder `/dashboard` and `/admin` pages. Unauthenticated users hitting either route are redirected to login.\n\nThis slice sets up the foundational infrastructure:\n\n- `@opennextjs/cloudflare` adapter for Cloudflare Pages deployment\n- Auth.js v5 with D1 adapter (creates `users`, `accounts`, `sessions`, `verification_tokens` tables)\n- Google and GitHub OAuth providers\n- Login page\n- Navbar integration (login button when logged out, avatar + dropdown when logged in)\n- Next.js middleware protecting `/dashboard/*` and `/admin/*`\n- Bare placeholder pages for `/dashboard` and `/admin` (showing \"you are logged in as [email]\")\n\nRefer to the **Authentication**, **Route Protection**, and **UI Changes** sections of the parent PRD.\n\n## Acceptance criteria\n\n- [ ] `@opennextjs/cloudflare` adapter is configured and the app builds for Cloudflare Pages\n- [ ] Auth.js v5 is configured with D1 adapter; auth tables are created via migration\n- [ ] Google OAuth login flow works end-to-end\n- [ ] GitHub OAuth login flow works end-to-end\n- [ ] Navbar shows a \"Login\" button when unauthenticated\n- [ ] Navbar shows user avatar/name with dropdown (dashboard link, logout) when authenticated\n- [ ] Logout works and returns user to the homepage\n- [ ] `/dashboard` redirects to login page when unauthenticated\n- [ ] `/admin` redirects to login page when unauthenticated\n- [ ] `/dashboard` and `/admin` render placeholder content when authenticated\n- [ ] Session persists across page reloads\n\n## Blocked by\n\nNone - can start immediately\n\n## User stories addressed\n\n- User story 1 (Google login)\n- User story 2 (GitHub login)\n- User story 4 (login button in Navbar)\n- User story 5 (avatar/name in Navbar)\n- User story 6 (dropdown with dashboard + logout)\n- User story 19 (unauthenticated /admin redirects to login)\n- User story 20 (unauthenticated /dashboard redirects to login)\n- User story 23 (session persists across reloads)","state":"OPEN","author":"paysdoc","labels":[],"createdAt":"2026-03-30T15:36:23Z","comments":[],"actionableComment":null}`

## Feature Description
End-to-end authentication flow for the paysdoc.nl marketing site running on Cloudflare Pages. This feature transitions the site from a static export (`output: 'export'`) to a server-rendered Next.js application using the `@opennextjs/cloudflare` adapter, enabling Auth.js v5 with Cloudflare D1 as the session/account store. Users can log in via Google or GitHub OAuth, see their identity in the Navbar, and access protected `/dashboard` and `/admin` routes.

This is the foundational auth infrastructure slice — it establishes the OpenNext adapter, D1 schema, OAuth provider config, middleware-based route protection, and the core authenticated UI surface that all future role-based features will build upon.

## User Story
As a visitor to paysdoc.nl
I want to log in with my Google or GitHub account and see my identity in the Navbar
So that I can access protected areas (dashboard, admin) without creating a separate account

## Problem Statement
The site is currently a static export with no server-side capabilities. There is no authentication, no session management, and no route protection. Users cannot log in, and there are no protected pages. The deployment pipeline assumes static HTML output (`out/` directory), which is incompatible with Auth.js's server-side requirements (API routes, cookies, sessions).

## Solution Statement
Switch the Next.js deployment target from static export to `@opennextjs/cloudflare`, which enables server-side rendering and API routes on Cloudflare Workers/Pages. Integrate Auth.js v5 with the `@auth/d1-adapter` to persist sessions and accounts in Cloudflare D1 (SQLite-compatible). Configure Google and GitHub as OAuth providers. Add Next.js middleware to protect `/dashboard/*` and `/admin/*` routes by redirecting unauthenticated users to a login page. Update the Navbar to reflect auth state (login button vs. avatar/dropdown) and create placeholder pages for the protected routes.

## Relevant Files
Use these files to implement the feature:

- `next.config.ts` — Remove `output: 'export'`, keep `images: { unoptimized: true }`; no other Next.js config changes needed
- `package.json` — Add new dependencies: `@opennextjs/cloudflare`, `next-auth`, `@auth/d1-adapter`
- `src/components/Navbar.tsx` — Update to show login button (unauthenticated) or avatar/name + dropdown (authenticated)
- `src/app/layout.tsx` — Wrap children with SessionProvider via a Providers component
- `.github/workflows/deploy.yml` — Update build command to use OpenNext and deploy `.open-next/assets` instead of `out/`
- `README.md` — Document auth setup, required environment variables, and D1 migration instructions
- `app_docs/feature-k6j0g6-github-actions-cf-pages.md` — Reference for existing CI/CD pipeline details (read when modifying deploy workflow)
- `.claude/commands/test_e2e.md` — E2E test runner instructions (read before creating E2E test)

### New Files
- `wrangler.jsonc` — Cloudflare Workers/Pages configuration with D1 database binding, compatibility flags, and pages build output directory
- `open-next.config.ts` — OpenNext adapter configuration for Cloudflare (if required by `@opennextjs/cloudflare`)
- `src/auth.ts` — Auth.js v5 configuration with D1 adapter, Google and GitHub providers, and session callbacks
- `src/app/api/auth/[...nextauth]/route.ts` — Auth.js API route handler (exports GET and POST)
- `src/middleware.ts` — Next.js middleware protecting `/dashboard/*` and `/admin/*` routes; redirects unauthenticated users to `/login`
- `src/components/Providers.tsx` — Client component wrapping children with Auth.js `SessionProvider`
- `src/app/login/page.tsx` — Login page with Google and GitHub sign-in buttons
- `src/app/dashboard/page.tsx` — Protected dashboard placeholder showing authenticated user's email
- `src/app/admin/page.tsx` — Protected admin placeholder showing authenticated user's email
- `migrations/0001_auth_tables.sql` — D1 migration SQL creating `users`, `accounts`, `sessions`, `verification_tokens` tables for Auth.js
- `e2e-tests/test_auth_flow.md` — E2E test validating login button, OAuth redirect, protected route redirect, and navbar auth state

## Implementation Plan

### Phase 1: Foundation — @opennextjs/cloudflare Adapter
Transition the site from static export to server-rendered Next.js on Cloudflare Workers/Pages. This is the prerequisite for all server-side functionality (API routes, middleware, sessions).

- Install `@opennextjs/cloudflare` as a dev dependency
- Remove `output: 'export'` from `next.config.ts`
- Create `wrangler.jsonc` with `nodejs_compat` compatibility flag and D1 database binding
- Update `package.json` build script to use the OpenNext build command
- Update `.github/workflows/deploy.yml` to deploy the OpenNext output instead of `out/`

### Phase 2: Core Implementation — Auth.js v5 + D1
Set up the authentication system with OAuth providers and database persistence.

- Install `next-auth` (v5) and `@auth/d1-adapter`
- Create D1 migration SQL for auth tables (`users`, `accounts`, `sessions`, `verification_tokens`)
- Create `src/auth.ts` with Auth.js configuration:
  - D1Adapter accessing the `DB` binding via `getCloudflareContext()`
  - Google and GitHub OAuth providers (configured via environment variables)
  - Session strategy using database sessions
- Create API route handler at `src/app/api/auth/[...nextauth]/route.ts`
- Create `src/middleware.ts` to protect `/dashboard` and `/admin` routes

### Phase 3: Integration — UI Changes
Wire auth state into the existing UI and add new pages.

- Create `src/components/Providers.tsx` — client component wrapping `SessionProvider`
- Update `src/app/layout.tsx` to wrap children with `Providers`
- Update `src/components/Navbar.tsx`:
  - Unauthenticated: show "Login" link pointing to `/login`
  - Authenticated: show user avatar/name with a dropdown containing "Dashboard" link and "Logout" button
- Create `/login` page with Google and GitHub sign-in buttons
- Create `/dashboard` placeholder page showing the authenticated user's email
- Create `/admin` placeholder page showing the authenticated user's email
- Update `README.md` with auth environment variables and D1 setup instructions

## Step by Step Tasks
Execute every step in order, top to bottom.

### Step 1: Create E2E test specification
- Create `e2e-tests/test_auth_flow.md` describing the E2E test for the auth feature:
  - **User Story**: A visitor can see a Login button, click it to reach the login page, see OAuth provider buttons, and when unauthenticated is redirected from `/dashboard` and `/admin` to `/login`
  - **Test Steps**:
    1. Navigate to the homepage
    2. Verify a "Login" link/button is visible in the Navbar
    3. Click "Login" — verify navigation to `/login`
    4. Verify Google and GitHub sign-in buttons are present on the login page
    5. Navigate directly to `/dashboard` — verify redirect to `/login` (unauthenticated)
    6. Navigate directly to `/admin` — verify redirect to `/login` (unauthenticated)
    7. Take screenshots at each verification point
  - **Success Criteria**: Login button visible, login page renders with OAuth buttons, protected routes redirect to login
  - **Note**: Full OAuth flow cannot be tested in E2E without real OAuth credentials; test covers the unauthenticated paths only

### Step 2: Install @opennextjs/cloudflare and configure the adapter
- Run `npm install --save-dev @opennextjs/cloudflare`
- Update `next.config.ts`:
  - Remove `output: 'export'`
  - Keep `images: { unoptimized: true }`
- Create `wrangler.jsonc` at project root with:
  ```jsonc
  {
    "name": "paysdoc-nl",
    "compatibility_date": "2025-04-01",
    "compatibility_flags": ["nodejs_compat"],
    "d1_databases": [
      {
        "binding": "DB",
        "database_name": "paysdoc-auth-db",
        "database_id": "<PLACEHOLDER — replace after running wrangler d1 create>"
      }
    ]
  }
  ```
- If `@opennextjs/cloudflare` requires an `open-next.config.ts`, create it with default configuration
- Update the `build` script in `package.json` to: `"build": "npx @opennextjs/cloudflare build"`
- Verify the build succeeds: `npm run build`

### Step 3: Install Auth.js v5 and D1 adapter
- Run `npm install next-auth@beta @auth/d1-adapter`
- These packages provide:
  - `next-auth` — Auth.js v5 for Next.js with built-in route handlers and middleware support
  - `@auth/d1-adapter` — Cloudflare D1 database adapter for session/account persistence

### Step 4: Create D1 migration for auth tables
- Create `migrations/0001_auth_tables.sql` with the Auth.js D1 adapter schema:
  - `users` table: `id`, `name`, `email`, `emailVerified`, `image`
  - `accounts` table: `id`, `userId`, `type`, `provider`, `providerAccountId`, `refresh_token`, `access_token`, `expires_at`, `token_type`, `scope`, `id_token`, `session_state`
  - `sessions` table: `id`, `sessionToken`, `userId`, `expires`
  - `verification_tokens` table: `identifier`, `token`, `expires`
  - Foreign keys from `accounts` and `sessions` to `users`
  - Unique constraints as required by Auth.js

### Step 5: Configure Auth.js with providers and D1 adapter
- Create `src/auth.ts`:
  - Import `NextAuth` from `next-auth`
  - Import `D1Adapter` from `@auth/d1-adapter`
  - Import Google and GitHub providers from `next-auth/providers/google` and `next-auth/providers/github`
  - Use the NextAuth function-style config to access `getCloudflareContext()` from `@opennextjs/cloudflare` for the D1 binding
  - Configure providers using environment variables: `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`
  - Set `AUTH_SECRET` environment variable for session encryption
  - Export `handlers`, `auth`, `signIn`, `signOut`
- Create `src/app/api/auth/[...nextauth]/route.ts`:
  - Import `handlers` from `@/auth`
  - Export `GET` and `POST` from handlers

### Step 6: Create middleware for route protection
- Create `src/middleware.ts`:
  - Import `auth` from `@/auth`
  - Export default middleware that checks for a valid session
  - If no session exists and the path starts with `/dashboard` or `/admin`, redirect to `/login`
  - Configure `matcher` to only run on `/dashboard/:path*` and `/admin/:path*`

### Step 7: Create SessionProvider wrapper
- Create `src/components/Providers.tsx`:
  - `"use client"` directive
  - Import `SessionProvider` from `next-auth/react`
  - Accept `children` and optional `session` props
  - Wrap children with `<SessionProvider>`
- Update `src/app/layout.tsx`:
  - Import `Providers` component
  - Wrap `<main>` and other body content with `<Providers>`

### Step 8: Create the login page
- Create `src/app/login/page.tsx`:
  - Server component with metadata: `title: 'Login'`
  - Display heading "Sign in to paysdoc.nl"
  - Two sign-in buttons: "Sign in with Google" and "Sign in with GitHub"
  - Each button triggers the respective Auth.js sign-in action (use `signIn` from `next-auth/react` or a server action calling `signIn` from `@/auth`)
  - Style consistently with existing site theme (Tailwind CSS, CSS variables)
  - If user is already authenticated, redirect to `/dashboard`

### Step 9: Update the Navbar for auth state
- Modify `src/components/Navbar.tsx`:
  - Use `useSession()` from `next-auth/react` to access auth state
  - **Unauthenticated**: Add a "Login" link after the existing nav links, pointing to `/login`
  - **Authenticated**: Replace the "Login" link with:
    - User avatar (from `session.user.image`) or a fallback initial
    - User name (from `session.user.name`)
    - A dropdown menu containing:
      - "Dashboard" link to `/dashboard`
      - "Logout" button that calls `signOut()` with `callbackUrl: '/'`
  - The dropdown should toggle on click and close when clicking outside
  - Style consistently with existing Navbar theme

### Step 10: Create dashboard and admin placeholder pages
- Create `src/app/dashboard/page.tsx`:
  - Server component
  - Import `auth` from `@/auth` and call it to get the session
  - Display: "Dashboard — you are logged in as {session.user.email}"
  - Metadata: `title: 'Dashboard'`
- Create `src/app/admin/page.tsx`:
  - Server component
  - Import `auth` from `@/auth` and call it to get the session
  - Display: "Admin — you are logged in as {session.user.email}"
  - Metadata: `title: 'Admin'`

### Step 11: Update GitHub Actions deployment workflow
- Read `app_docs/feature-k6j0g6-github-actions-cf-pages.md` for context on the existing pipeline
- Modify `.github/workflows/deploy.yml`:
  - Change the build step from `bun run build` to `bun run build` (which now runs `npx @opennextjs/cloudflare build` via the updated package.json script)
  - Change the deploy step from `npx wrangler pages deploy out/` to the correct OpenNext output directory (e.g., `.open-next/assets` or as documented by `@opennextjs/cloudflare`)
  - Add a D1 migration step before deploy: `npx wrangler d1 migrations apply paysdoc-auth-db --remote`
  - Add required secrets to the env block: `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`

### Step 12: Update README.md
- Add an **Authentication** section documenting:
  - Auth.js v5 with Google and GitHub OAuth
  - Required environment variables: `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`
  - D1 database setup: `npx wrangler d1 create paysdoc-auth-db` and update `wrangler.jsonc` with the database ID
  - Running D1 migrations: `npx wrangler d1 migrations apply paysdoc-auth-db --local` (dev) / `--remote` (prod)
  - Local development with `.dev.vars` file for secrets
- Update the **Deployment** section to reflect the OpenNext build process

### Step 13: Validate the implementation
- Run all validation commands listed below to confirm zero regressions
- Read `.claude/commands/test_e2e.md`, then read and execute `e2e-tests/test_auth_flow.md` to validate the auth flow E2E

## Testing Strategy

### Edge Cases
- User navigates to `/dashboard` or `/admin` while unauthenticated — should redirect to `/login`
- User navigates to `/login` while already authenticated — should redirect to `/dashboard`
- User clicks logout — session is destroyed, Navbar reverts to login button, and user is returned to homepage
- Session cookie expires — next request to a protected route should redirect to `/login`
- OAuth provider returns an error (e.g., user denies consent) — login page should handle gracefully
- User with no avatar image from OAuth provider — Navbar should show a fallback (e.g., initial letter)
- Multiple rapid clicks on login/logout — should not cause race conditions

## Acceptance Criteria
- `@opennextjs/cloudflare` adapter is configured and `npm run build` succeeds (OpenNext output produced)
- D1 migration SQL creates all four auth tables (`users`, `accounts`, `sessions`, `verification_tokens`)
- Auth.js v5 is configured with D1 adapter, Google provider, and GitHub provider
- `/api/auth/*` routes are functional (Auth.js handles sign-in, sign-out, session, CSRF)
- Middleware redirects unauthenticated requests to `/dashboard/*` and `/admin/*` to `/login`
- Navbar displays "Login" link when unauthenticated
- Navbar displays user avatar/name with dropdown (Dashboard link, Logout button) when authenticated
- Clicking "Logout" destroys the session and redirects to `/`
- `/dashboard` renders "you are logged in as [email]" when authenticated
- `/admin` renders "you are logged in as [email]" when authenticated
- Session persists across page reloads (cookie-based, D1-backed)
- `npm run lint` passes with no errors
- `npx tsc --noEmit` passes with no type errors
- GitHub Actions workflow is updated for OpenNext build and D1 migration

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `npm run lint` — Run linter to check for code quality issues
- `npx tsc --noEmit` — Type-check the project with no emit
- `npm run build` — Build the application using OpenNext for Cloudflare to verify no build errors
- Read `.claude/commands/test_e2e.md`, then read and execute `e2e-tests/test_auth_flow.md` to validate the auth flow E2E

## Notes
- **Critical architectural change**: This feature removes `output: 'export'` from `next.config.ts`, transitioning the site from static HTML to server-rendered Next.js on Cloudflare Workers. This is required for Auth.js (API routes, cookies, middleware) and affects the entire deployment pipeline.
- **New dependencies**: `@opennextjs/cloudflare` (dev), `next-auth@beta` (v5), `@auth/d1-adapter`. Install via `npm install`.
- **Environment variables**: Five new secrets are required — `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`. For local dev, use a `.dev.vars` file (Cloudflare convention). For production, add to Cloudflare Pages environment variables and GitHub Actions secrets.
- **D1 database**: Must be created manually via `npx wrangler d1 create paysdoc-auth-db` before the first deployment. The `database_id` in `wrangler.jsonc` must be updated with the actual ID returned by this command. This is analogous to how the Cloudflare Pages project creation was out of scope for issue #2.
- **No unit tests**: `.adw/project.md` does not have unit tests enabled. Testing is via E2E and manual validation.
- **GitHub Actions uses Bun**: The deploy workflow uses Bun for speed in CI while npm is the local package manager. The OpenNext build command must work under Bun.
- **images config**: `images: { unoptimized: true }` is retained because Cloudflare Workers does not support Next.js's built-in image optimization server.
- **Existing Navbar**: Currently a client component with `usePathname()`. The auth state integration adds `useSession()` from `next-auth/react` and a dropdown menu — keep the existing nav links and styling intact.
