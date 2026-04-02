# Auth Bootstrap + Social Login + Route Protection

**ADW ID:** id4hh3-auth-bootstrap-socia
**Date:** 2026-03-30
**Specification:** specs/issue-4-adw-id4hh3-auth-bootstrap-socia-sdlc_planner-auth-bootstrap-social-login.md

## Overview

This feature transitions paysdoc.nl from a static export to a server-rendered Next.js application on Cloudflare Pages using the `@opennextjs/cloudflare` adapter. It adds Auth.js v5 with Cloudflare D1 as the session store, Google and GitHub OAuth login, Navbar auth-state integration, and Next.js middleware protecting `/dashboard/*` and `/admin/*`.

## What Was Built

- `@opennextjs/cloudflare` adapter replacing `output: 'export'` — enables SSR, API routes, and middleware on Cloudflare Workers/Pages
- Auth.js v5 (`next-auth@beta`) with `@auth/d1-adapter` for session and account persistence in Cloudflare D1
- Google and GitHub OAuth providers configured via environment variables
- D1 migration creating `users`, `accounts`, `sessions`, `verification_tokens` tables
- Next.js middleware protecting `/dashboard/*` and `/admin/*` — redirects unauthenticated users to `/login`
- Login page (`/login`) with server-action-driven Google and GitHub sign-in buttons; auto-redirects to `/dashboard` if already authenticated
- Navbar updated to show a "Login" link when unauthenticated, or avatar/name with a dropdown (Dashboard link, Logout) when authenticated
- `Providers` client component wrapping the app layout with `SessionProvider`
- Placeholder `/dashboard` and `/admin` pages that display the authenticated user's email
- GitHub Actions workflow updated to run D1 migrations and deploy from `.open-next/assets` instead of `out/`

## Technical Implementation

### Files Modified

- `next.config.ts`: Removed `output: 'export'`; added `initOpenNextCloudflareForDev()` call
- `src/app/layout.tsx`: Wrapped body content with `<Providers>` for session context
- `src/components/Navbar.tsx`: Added `useSession()`, avatar/dropdown for authenticated state, Login link for unauthenticated state
- `.github/workflows/deploy.yml`: Added D1 migration step, changed deploy path to `.open-next/assets`, added auth secrets to env

### New Files

- `src/auth.ts`: Auth.js v5 config — D1Adapter via `getCloudflareContext()`, Google + GitHub providers, JWT session strategy, `/login` sign-in page
- `src/app/api/auth/[...nextauth]/route.ts`: Auth.js route handler (exports `GET` and `POST`)
- `src/middleware.ts`: Re-exports `auth` as middleware; matcher covers `/dashboard/:path*` and `/admin/:path*`
- `src/components/Providers.tsx`: `"use client"` wrapper around `SessionProvider`
- `src/app/login/page.tsx`: Login page with server actions calling `signIn('google')` and `signIn('github')`
- `src/app/dashboard/page.tsx`: Protected placeholder showing authenticated user's email
- `src/app/admin/page.tsx`: Protected placeholder showing authenticated user's email
- `migrations/0001_auth_tables.sql`: D1 schema for Auth.js (`users`, `accounts`, `sessions`, `verification_tokens`)
- `wrangler.jsonc`: Cloudflare Workers config with `nodejs_compat` flag and `DB` D1 binding
- `open-next.config.ts`: OpenNext Cloudflare adapter config with edge middleware overrides
- `cloudflare-env.d.ts`: TypeScript types for Cloudflare environment bindings

### Key Changes

- **Static → SSR**: Removing `output: 'export'` and adding `@opennextjs/cloudflare` is a fundamental architectural shift — all server-side capabilities (API routes, middleware, cookies) are now available.
- **D1Adapter via async context**: `getCloudflareContext({ async: true })` is called inside the NextAuth config factory function to access the `DB` binding at runtime (required for Cloudflare Workers environment).
- **JWT sessions**: Session strategy is `'jwt'` (not `'database'`) because the D1Adapter handles account/user persistence while the session token travels as a signed JWT cookie.
- **Server actions for sign-in**: The login page uses inline server actions (`'use server'`) to call `signIn()` server-side, avoiding a client-side redirect loop.
- **Middleware as re-export**: `src/middleware.ts` re-exports `auth` from `@/auth` directly — Auth.js's `authorized` callback returns `!!session`, redirecting unauthenticated requests to `/login`.

## How to Use

### Local Development

1. Create a `.dev.vars` file at the project root with your OAuth credentials:
   ```
   AUTH_SECRET=<generate with: openssl rand -base64 32>
   AUTH_GOOGLE_ID=<your Google OAuth client ID>
   AUTH_GOOGLE_SECRET=<your Google OAuth client secret>
   AUTH_GITHUB_ID=<your GitHub OAuth App ID>
   AUTH_GITHUB_SECRET=<your GitHub OAuth App secret>
   ```
2. Create and migrate the local D1 database:
   ```bash
   npx wrangler d1 create paysdoc-auth-db
   # Update wrangler.jsonc with the returned database_id
   npx wrangler d1 migrations apply paysdoc-auth-db --local
   ```
3. Run the dev server: `npm run dev`
4. Navigate to the homepage — the Navbar shows a "Login" link
5. Click "Login" to reach `/login` and sign in with Google or GitHub

### Production Setup

1. Create the D1 database and update `wrangler.jsonc` with the real `database_id`
2. Set up the Cloudflare Secrets Store and create all secrets (see `README.md` — Secrets Store Setup)
3. Update the `<STORE_ID>` placeholder in `wrangler.jsonc` with the real store ID
4. Push to `main` — the workflow applies migrations then deploys

## Configuration

| Variable | Description |
|---|---|
| `AUTH_SECRET` | Secret used to sign/encrypt session tokens (generate with `openssl rand -base64 32`) |
| `AUTH_GOOGLE_ID` | Google OAuth 2.0 client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth 2.0 client secret |
| `AUTH_GITHUB_ID` | GitHub OAuth App client ID |
| `AUTH_GITHUB_SECRET` | GitHub OAuth App client secret |

These secrets are accessed at runtime via `env.BINDING.get()` through Cloudflare Secrets Store bindings. For local development they are read from `.dev.vars`.

OAuth callback URLs to register:
- Google: `https://<your-domain>/api/auth/callback/google`
- GitHub: `https://<your-domain>/api/auth/callback/github`

For local dev, use `http://localhost:3000/api/auth/callback/google` and `/github`.

## Testing

```bash
# Lint and type-check
npm run lint
npx tsc --noEmit

# Build (verifies OpenNext output)
npm run build

# E2E test (Playwright)
# See e2e-tests/test_auth_flow.md for full steps
# Covers: Login button visible, /login renders OAuth buttons, /dashboard and /admin redirect unauthenticated users
```

E2E screenshots are captured in `agents/id4hh3-auth-bootstrap-socia/test_e2e/img/auth_flow/`.

## Notes

- **D1 database_id placeholder**: `wrangler.jsonc` contains a placeholder `database_id`. Replace it with the actual ID from `npx wrangler d1 create paysdoc-auth-db` before the first deployment.
- **Full OAuth flow not E2E tested**: Automated E2E only covers unauthenticated paths (redirect behavior, page rendering). Live OAuth requires real credentials and cannot be mocked without a real provider.
- **No unit tests**: Per project configuration, testing is via E2E and manual validation only.
- **Images**: `images: { unoptimized: true }` is retained — Cloudflare Workers does not support Next.js image optimization.
- **Bun in CI, npm locally**: The GitHub Actions workflow uses Bun for the build step; local development uses npm.
