# Feature: Role resolution + admin route guard

## Metadata
issueNumber: `5`
adwId: `1l6tsn-role-resolution-admi`
issueJson: `{"number":5,"title":"Role resolution + admin route guard","body":"## Parent PRD\n\n`specs/prd/login-and-roles.md`\n\n## What to build\n\nAdd role-based access control so that admin and client users see different things. When a user logs in, their role is determined by their email address: `paysdoc@gmail.com` and `martin@paysdoc.nl` are admins, everyone else is a client. The role is included in the Auth.js session object. Middleware enforces that clients accessing `/admin/*` are redirected to `/dashboard`.\n\nThis slice also sets up the test infrastructure (Vitest) and includes tests for the role resolution logic.\n\nRefer to the **Role Resolution** and **Route Protection** sections of the parent PRD. See also **Testing Decisions > Auth Module — Role Resolution**.\n\n## Acceptance criteria\n\n- [ ] Role resolution function returns `admin` for `paysdoc@gmail.com` and `martin@paysdoc.nl`\n- [ ] Role resolution function returns `client` for all other email addresses\n- [ ] Role resolution is case-insensitive for email matching\n- [ ] Role is included in the Auth.js session object via callbacks\n- [ ] Authenticated client accessing `/admin` is redirected to `/dashboard`\n- [ ] Authenticated admin can access `/admin` without redirect\n- [ ] Vitest is configured and runs in the project\n- [ ] Unit tests cover role resolution logic (admin emails, non-admin emails, case insensitivity)\n\n## Blocked by\n\n- Blocked by #4 (Auth bootstrap + social login + route protection)\n\n## User stories addressed\n\n- User story 7 (admin auto-recognized by email)\n- User story 8 (self-registered users default to client)\n- User story 21 (client accessing /admin redirected to /dashboard)","state":"OPEN","author":"paysdoc","labels":[],"createdAt":"2026-03-30T15:36:36Z","comments":[],"actionableComment":null}`

## Feature Description
Add role-based access control (RBAC) to the paysdoc.nl application. A pure function determines a user's role (`admin` or `client`) based on their email address: `paysdoc@gmail.com` and `martin@paysdoc.nl` are admins, all others are clients. The role is injected into the Auth.js session via JWT and session callbacks, making it available to both server components and middleware. The Next.js middleware is upgraded from a simple auth re-export to a custom wrapper that enforces role-based routing — authenticated clients accessing `/admin/*` are redirected to `/dashboard`.

This slice also establishes Vitest as the project's unit test infrastructure and delivers comprehensive unit tests for the role resolution logic.

## User Story
As the paysdoc.nl application
I want to resolve user roles by email and restrict `/admin` routes to admins only
So that admin users have elevated access while client users are appropriately guided to their dashboard

## Problem Statement
The current authentication system (Issue #4) protects `/dashboard/*` and `/admin/*` from unauthenticated access but treats all authenticated users identically. There is no concept of roles — any logged-in user can access both `/dashboard` and `/admin`. The project also lacks unit test infrastructure, making it impossible to verify pure logic in isolation.

## Solution Statement
1. Create a pure `resolveRole(email)` function that maps admin emails to `'admin'` and everything else to `'client'` (case-insensitive).
2. Wire the role into the Auth.js session via `jwt` and `session` callbacks so it's available everywhere (`req.auth`, `session.user.role`).
3. Augment the `next-auth` TypeScript types to include `role` on `Session` and `JWT`.
4. Replace the middleware's simple `auth` re-export with a custom `auth()` wrapper that redirects non-admin users away from `/admin/*` to `/dashboard`.
5. Install Vitest and write unit tests covering admin emails, non-admin emails, case insensitivity, and null/undefined edge cases.

## Relevant Files
Use these files to implement the feature:

- `src/auth.ts` — Auth.js v5 configuration; add `jwt` and `session` callbacks to inject role, remove `authorized` callback (middleware wrapper handles it)
- `src/middleware.ts` — Replace simple `auth` re-export with custom `auth()` wrapper that checks role for `/admin/*` routes
- `package.json` — Add `vitest` dev dependency and `test` script
- `tsconfig.json` — Reference for path aliases (`@/*` → `./src/*`) needed in Vitest config
- `features/role-resolution.feature` — BDD scenarios defining expected role resolution behavior (read-only reference)
- `features/admin-route-guard.feature` — BDD scenarios defining expected admin route guard behavior (read-only reference)
- `app_docs/feature-id4hh3-auth-bootstrap-social-login.md` — Reference documentation for the auth system built in Issue #4

### New Files
- `src/lib/roles.ts` — Pure role resolution function and `Role` type export
- `src/types/next-auth.d.ts` — TypeScript module augmentation adding `role` to Auth.js `Session` and `JWT` types
- `vitest.config.ts` — Vitest configuration with path alias support
- `src/lib/__tests__/roles.test.ts` — Unit tests for role resolution logic

## Implementation Plan
### Phase 1: Foundation
Set up Vitest test infrastructure and create the pure role resolution function — these are independent of the auth system and can be built and tested in isolation.

- Install Vitest as a dev dependency
- Create `vitest.config.ts` with path alias matching `tsconfig.json`
- Add `"test": "vitest run"` script to `package.json`
- Create `src/lib/roles.ts` with the `resolveRole` function and `Role` type

### Phase 2: Core Implementation
Wire the role into the Auth.js session and augment TypeScript types so the role is available throughout the application.

- Create `src/types/next-auth.d.ts` to augment `Session` and `JWT` types with `role`
- Modify `src/auth.ts` to add `jwt` callback (sets `token.role` on sign-in) and `session` callback (copies `token.role` to `session.user.role`)
- Remove the `authorized` callback from `src/auth.ts` (the middleware wrapper will handle auth checks directly)

### Phase 3: Integration
Upgrade the middleware to enforce role-based access control on `/admin/*` routes.

- Replace `src/middleware.ts` from a simple re-export to a custom `auth()` wrapper function
- The wrapper checks: no session → redirect to `/login`; client on `/admin/*` → redirect to `/dashboard`; otherwise → allow through
- Write unit tests for role resolution covering all acceptance criteria

## Step by Step Tasks
Execute every step in order, top to bottom.

### Step 1: Install Vitest and configure test infrastructure
- Run `npm install --save-dev vitest`
- Create `vitest.config.ts` at project root:
  ```typescript
  import { defineConfig } from 'vitest/config';
  import path from 'path';

  export default defineConfig({
    test: {
      globals: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  });
  ```
- Add `"test": "vitest run"` to the `scripts` section in `package.json`
- Verify Vitest runs: `npm test` (should report no test files found, exit cleanly)

### Step 2: Create the role resolution function
- Create `src/lib/roles.ts`:
  ```typescript
  const ADMIN_EMAILS = ['paysdoc@gmail.com', 'martin@paysdoc.nl'];

  export type Role = 'admin' | 'client';

  export function resolveRole(email: string | null | undefined): Role {
    if (!email) return 'client';
    return ADMIN_EMAILS.includes(email.toLowerCase()) ? 'admin' : 'client';
  }
  ```
- The function is pure with no external dependencies — easily testable

### Step 3: Write unit tests for role resolution
- Create `src/lib/__tests__/roles.test.ts`:
  - Test that `paysdoc@gmail.com` resolves to `'admin'`
  - Test that `martin@paysdoc.nl` resolves to `'admin'`
  - Test that `jane@example.com` resolves to `'client'`
  - Test that `PAYSDOC@GMAIL.COM` (uppercase) resolves to `'admin'` (case-insensitive)
  - Test that `Martin@Paysdoc.NL` (mixed case) resolves to `'admin'` (case-insensitive)
  - Test that `null` resolves to `'client'`
  - Test that `undefined` resolves to `'client'`
- Run `npm test` and confirm all tests pass

### Step 4: Augment next-auth TypeScript types
- Create `src/types/next-auth.d.ts`:
  ```typescript
  import type { DefaultSession } from 'next-auth';

  declare module 'next-auth' {
    interface Session {
      user: {
        role: 'admin' | 'client';
      } & DefaultSession['user'];
    }
  }

  declare module 'next-auth/jwt' {
    interface JWT {
      role?: 'admin' | 'client';
    }
  }
  ```
- This ensures `session.user.role` and `token.role` are type-safe throughout the codebase

### Step 5: Add role to Auth.js session via callbacks
- Modify `src/auth.ts`:
  - Import `resolveRole` from `@/lib/roles`
  - Replace the `callbacks` object: remove `authorized` callback, add `jwt` and `session` callbacks
  - `jwt` callback: when `user` is present (sign-in event), set `token.role = resolveRole(user.email)`
  - `session` callback: copy `token.role` to `session.user.role`
- The resulting callbacks section:
  ```typescript
  callbacks: {
    jwt({ token, user }) {
      if (user?.email) {
        token.role = resolveRole(user.email);
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as 'admin' | 'client';
      }
      return session;
    },
  },
  ```

### Step 6: Upgrade middleware for role-based route guard
- Rewrite `src/middleware.ts` from the simple re-export to a custom `auth()` wrapper:
  ```typescript
  import { auth } from '@/auth';
  import { NextResponse } from 'next/server';

  export default auth((req) => {
    const { pathname } = req.nextUrl;

    if (!req.auth) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    if (pathname.startsWith('/admin') && req.auth.user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  });

  export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*'],
  };
  ```
- This handles three cases:
  1. No session → redirect to `/login`
  2. Client accessing `/admin/*` → redirect to `/dashboard`
  3. Admin accessing `/admin/*` or any user accessing `/dashboard/*` → allow through

### Step 7: Run validation commands
- Run all validation commands listed in the Validation Commands section below
- Ensure zero errors from lint, type-check, build, and tests

## Testing Strategy
### Unit Tests
This feature establishes Vitest as the project's unit test framework. Unit tests cover the `resolveRole` function:

- **Admin recognition**: `paysdoc@gmail.com` → `'admin'`, `martin@paysdoc.nl` → `'admin'`
- **Client default**: Any other email → `'client'`
- **Case insensitivity**: `PAYSDOC@GMAIL.COM`, `Martin@Paysdoc.NL` → `'admin'`
- **Null/undefined safety**: `null` → `'client'`, `undefined` → `'client'`

### Edge Cases
- Email is `null` or `undefined` (e.g., OAuth provider returns no email) → defaults to `'client'`
- Email with unexpected casing (all caps, mixed) → case-insensitive comparison ensures correct resolution
- Client user navigating to `/admin/users` (subpath) → middleware checks `pathname.startsWith('/admin')`, redirects to `/dashboard`
- Admin user navigating to `/admin/users` (subpath) → allowed through
- Unauthenticated user accessing `/admin` → still redirected to `/login` (auth check happens before role check)
- Admin user accessing `/dashboard` → allowed through (no role restriction on `/dashboard`)

## Acceptance Criteria
- [ ] `resolveRole('paysdoc@gmail.com')` returns `'admin'`
- [ ] `resolveRole('martin@paysdoc.nl')` returns `'admin'`
- [ ] `resolveRole('jane@example.com')` returns `'client'`
- [ ] `resolveRole('PAYSDOC@GMAIL.COM')` returns `'admin'` (case-insensitive)
- [ ] `resolveRole('Martin@Paysdoc.NL')` returns `'admin'` (case-insensitive)
- [ ] Role is present on `session.user.role` after Auth.js session callback
- [ ] Authenticated client accessing `/admin` is redirected to `/dashboard`
- [ ] Authenticated admin can access `/admin` without redirect
- [ ] Vitest is installed, configured, and `npm test` runs successfully
- [ ] All unit tests for role resolution pass
- [ ] `npm run lint` passes with no errors
- [ ] `npx tsc --noEmit` passes with no type errors
- [ ] `npm run build` succeeds

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `npm test` — Run Vitest unit tests to validate role resolution logic
- `npm run lint` — Run linter to check for code quality issues
- `npx tsc --noEmit` — Type-check the project with no emit (validates type augmentation)
- `npm run build` — Build the application using OpenNext for Cloudflare to verify no build errors

## Notes
- **Vitest is a new dependency**: Install via `npm install --save-dev vitest`. This establishes the project's unit test infrastructure for the first time.
- **No database migration needed**: Role resolution is purely email-based (hardcoded admin list). No schema changes to D1 are required.
- **`authorized` callback removal**: The existing `authorized({ auth: session }) { return !!session }` callback in `src/auth.ts` is removed because the custom middleware wrapper handles both authentication and authorization. Keeping both would cause the `authorized` callback to redirect to `/login` before the middleware wrapper can redirect clients to `/dashboard`.
- **JWT strategy**: Since the project uses JWT session strategy, the role is embedded in the JWT token via the `jwt` callback and then surfaced via the `session` callback. This means role is resolved once at sign-in and doesn't require a database lookup on each request.
- **Role resolution is deterministic**: The admin email list is hardcoded. If this needs to become dynamic (e.g., database-driven), only `src/lib/roles.ts` needs to change — the callback and middleware layers remain the same.
- **BDD feature files already exist**: `features/role-resolution.feature` and `features/admin-route-guard.feature` are tagged with `@adw-1l6tsn-role-resolution-admi` and define the expected behavior. These were created during scenario planning and serve as living documentation alongside the unit tests.
