# Role Resolution + Admin Route Guard

**ADW ID:** 1l6tsn-role-resolution-admi
**Date:** 2026-03-30
**Specification:** specs/issue-5-adw-1l6tsn-role-resolution-admi-sdlc_planner-role-resolution-admin-guard.md

## Overview

Adds role-based access control (RBAC) to the paysdoc.nl application. A pure `resolveRole` function determines whether a user is an `admin` or `client` based on their email address, the role is embedded in the Auth.js JWT and session, and the Next.js middleware enforces that clients cannot access `/admin/*` routes. This slice also establishes Vitest as the project's unit test infrastructure.

## What Was Built

- `resolveRole(email)` pure function: maps two hardcoded admin emails to `'admin'`, all others to `'client'` (case-insensitive)
- Auth.js `jwt` and `session` callbacks: role is resolved at sign-in and propagated through the JWT token to the session object
- TypeScript module augmentation: `session.user.role` and `token.role` are fully type-safe
- Custom middleware wrapper: replaces the simple `auth` re-export; redirects unauthenticated users to `/login` and authenticated clients away from `/admin/*` to `/dashboard`
- Vitest test infrastructure: configured with `@/` path alias, 7 unit tests covering all role resolution cases

## Technical Implementation

### Files Modified

- `src/auth.ts`: Removed `authorized` callback; added `jwt` callback (resolves role on sign-in) and `session` callback (copies role from token to session)
- `src/middleware.ts`: Replaced one-line `auth` re-export with a custom `auth()` wrapper enforcing auth + role checks
- `package.json`: Added `vitest` dev dependency and `"test": "vitest run"` script

### New Files

- `src/lib/roles.ts`: `Role` type (`'admin' | 'client'`) and `resolveRole(email)` function
- `src/types/next-auth.d.ts`: Module augmentation adding `role` to Auth.js `Session` and `JWT` interfaces
- `vitest.config.ts`: Vitest configuration with `globals: true` and `@/` alias pointing to `./src`
- `src/lib/__tests__/roles.test.ts`: 7 unit tests for `resolveRole` (admin emails, client default, case insensitivity, null/undefined)

### Key Changes

- Role is resolved **once at sign-in** via the `jwt` callback and cached in the JWT — no database lookup per request
- The `authorized` callback was **removed** from `src/auth.ts` to avoid a conflict where it would redirect to `/login` before the middleware wrapper could redirect clients to `/dashboard`
- The middleware checks routes in order: (1) no session → `/login`, (2) client on `/admin/*` → `/dashboard`, (3) otherwise pass through
- Email comparison uses `email.toLowerCase()` making admin recognition case-insensitive
- `null` and `undefined` emails safely default to `'client'` (covers OAuth providers that may not return an email)

## How to Use

**Role resolution in server components / API routes:**
```typescript
import { auth } from '@/auth';

const session = await auth();
if (session?.user.role === 'admin') {
  // admin-only logic
}
```

**Role resolution in middleware (already wired):**

The middleware automatically redirects based on role. No additional configuration is needed for `/admin/*` or `/dashboard/*` protection.

**Adding a new admin email:**

Edit `src/lib/roles.ts` and add the email (lowercase) to the `ADMIN_EMAILS` array:
```typescript
const ADMIN_EMAILS = ['paysdoc@gmail.com', 'martin@paysdoc.nl', 'new-admin@example.com'];
```

## Configuration

No environment variables are required for role resolution. Admin emails are hardcoded in `src/lib/roles.ts`. If dynamic role assignment is needed in the future, only that file needs to change — the callback and middleware layers remain unchanged.

## Testing

Run the unit test suite:
```bash
npm test
```

This runs 7 Vitest tests covering:
- `paysdoc@gmail.com` → `'admin'`
- `martin@paysdoc.nl` → `'admin'`
- `jane@example.com` → `'client'`
- `PAYSDOC@GMAIL.COM` → `'admin'` (case-insensitive)
- `Martin@Paysdoc.NL` → `'admin'` (case-insensitive)
- `null` → `'client'`
- `undefined` → `'client'`

BDD feature files (`features/role-resolution.feature`, `features/admin-route-guard.feature`) tagged `@adw-1l6tsn-role-resolution-admi` serve as living documentation for the expected routing behavior.

## Notes

- **JWT strategy**: Because the project uses JWT sessions, role is embedded in the token at sign-in. Changing a user's admin status requires them to sign out and back in.
- **No database migration**: Role resolution is email-based only. No D1 schema changes were required.
- **Admin emails are case-insensitive but stored lowercase**: The `ADMIN_EMAILS` array uses lowercase; `resolveRole` normalizes the input with `.toLowerCase()` before comparison.
- **Route matcher is unchanged**: The middleware `config.matcher` still covers `['/dashboard/:path*', '/admin/:path*']` — same as Issue #4.
