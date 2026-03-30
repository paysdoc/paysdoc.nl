# Client Repo Dashboard

**ADW ID:** 8g73bx-client-repo-manageme
**Date:** 2026-03-30
**Specification:** specs/issue-7-adw-8g73bx-client-repo-manageme-sdlc_planner-client-repo-dashboard.md

## Overview

Transforms the `/dashboard` placeholder into a full repository management UI where authenticated clients can add GitHub/GitLab repos by URL, remove them, and see which repos are auto-matched to Paysdoc projects. A new D1 migration creates the `projects` and `client_repos` tables that back this feature.

## What Was Built

- D1 migration (`0002_client_repos.sql`) creating `projects` and `client_repos` tables with foreign keys and indexes
- URL parsing utility (`src/lib/repo-url.ts`) detecting GitHub/GitLab providers and extracting repo names (supports subgroups and `.git` suffixes)
- Three Next.js server actions (`listRepos`, `addRepo`, `removeRepo`) with D1 queries scoped to the authenticated user
- Auto-match logic: when adding a repo, the system checks `projects.repo_url` for a match and sets `project_id` accordingly
- `AddRepoForm` client component with URL input and pending state via `useFormStatus`
- `RepoList` client component displaying name, provider badge, URL link, linked project, and per-row remove button
- Transformed dashboard page rendering the above components with a "More functionality coming soon" banner
- Auth.js session extended to propagate `user.id` from the JWT `sub` claim
- BDD feature files for dashboard display, CRUD, URL parsing, and auto-match scenarios
- E2E test definition for unauthenticated redirect validation

## Technical Implementation

### Files Modified

- `src/app/dashboard/page.tsx`: Rewritten as a server component — fetches repos, renders `AddRepoForm`, `RepoList`, and the coming-soon banner
- `src/auth.ts`: Session callback now sets `session.user.id = token.sub!` to expose user ID to server actions
- `src/types/next-auth.d.ts`: Added `id: string` to the `Session.user` interface
- `src/middleware.ts`: Minor update (route protection already in place from issue #5)
- `features/route-protection.feature`: Minor update to existing BDD scenario

### New Files

- `migrations/0002_client_repos.sql`: D1 migration with `projects` (id, name, repo_url) and `client_repos` (id, user_id, repo_url, repo_name, provider, project_id) tables; unique index on `(user_id, repo_url)` prevents duplicates
- `src/lib/repo-url.ts`: Pure function `parseRepoUrl(url)` returning `{ provider, name } | null`; GitHub extracts `owner/repo`, GitLab joins all path segments (supporting subgroups)
- `src/app/dashboard/actions.ts`: Server actions using `auth()` + `getCloudflareContext({ async: true })` for D1 access; exports `ClientRepo` type
- `src/app/dashboard/AddRepoForm.tsx`: `'use client'` form component with `useFormStatus`-driven submit button
- `src/app/dashboard/RepoList.tsx`: `'use client'` list component accepting `ClientRepo[]` prop; empty state message when no repos
- `e2e-tests/test_client_dashboard.md`: E2E test plan for unauthenticated redirect scenarios
- `features/client-dashboard.feature`, `features/client-repo-management.feature`, `features/client-repo-url-parsing.feature`, `features/client-repo-auto-match.feature`: BDD scenarios tagged `@adw-8g73bx-client-repo-manageme`

### Key Changes

- **User-scoped queries**: All D1 queries bind `session.user.id` — clients can never read or remove another user's repos
- **Auto-match on insert**: `addRepo` runs `SELECT id FROM projects WHERE repo_url = ?` before inserting; matched `project_id` is stored, enabling the linked-project display in `RepoList`
- **No new npm dependencies**: Implemented entirely with Next.js server actions, D1 via `@opennextjs/cloudflare`, and `crypto.randomUUID()`
- **Progressive enhancement**: Forms use `<form action={serverAction}>` — functional without JavaScript; `useFormStatus` adds pending UI on top
- **Unique constraint handling**: D1 unique index on `(user_id, repo_url)` prevents duplicate registrations at the database level

## How to Use

1. Sign in at `/login` with a Google or GitHub account that has the `client` role
2. Navigate to `/dashboard`
3. In the **Add Repository** section, paste a GitHub or GitLab URL (e.g. `https://github.com/owner/repo`) and click **Add Repository**
4. The repo appears in **Registered Repositories** showing its name, provider badge, URL link, and linked project (if auto-matched)
5. To remove a repo, click the **Remove** button on its row

## Configuration

No additional environment variables are required. The feature uses the existing Cloudflare D1 `DB` binding configured in `wrangler.jsonc`.

**Apply the migration locally before testing:**
```bash
npx wrangler d1 migrations apply paysdoc-auth-db --local
```

## Testing

Run validation commands:
```bash
npm run lint
npx tsc --noEmit
npm run build
```

E2E: read `.claude/commands/test_e2e.md`, then execute `e2e-tests/test_client_dashboard.md`. The automated E2E covers the unauthenticated redirect to `/login`; full CRUD flows require a live authenticated session and are covered by the BDD feature files in `features/`.

## Notes

- **`projects` table is minimal**: Created here only to support auto-match. Future issues may extend it with description, status, etc.
- **No unit tests**: Per `.adw/project.md` configuration, unit tests are omitted; coverage is via BDD scenarios and E2E validation.
- **GitLab subgroups**: `parseRepoUrl` supports deep paths like `https://gitlab.com/group/subgroup/repo` — all segments after the host are joined as the repo name.
- **Duplicate repos**: The D1 unique index on `(user_id, repo_url)` prevents a user from adding the same URL twice; the `addRepo` action will throw on constraint violation.
