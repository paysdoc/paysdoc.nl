# Feature: Client repo management + dashboard

## Metadata
issueNumber: `7`
adwId: `8g73bx-client-repo-manageme`
issueJson: `{"number":7,"title":"Client repo management + dashboard","body":"## Parent PRD\n\n`specs/prd/login-and-roles.md`\n\n## What to build\n\nBuild the client dashboard at `/dashboard` where clients can manage their repositories. Clients can add repos by entering a GitHub or GitLab URL, remove repos, and see their list of registered repos with project info.\n\nThis slice includes:\n\n- D1 migration to create the `client_repos` table\n- CRUD operations: add, remove, list repos for the authenticated user\n- Auto-match logic: when a repo is added, check `projects.repo_url` for a match and set `project_id`\n- Client dashboard UI: repo list (name, URL, linked project), add form, remove button, \"more functionality coming soon\" message\n- URL parsing to detect provider (github/gitlab)\n\nRefer to the **Data Model — New Tables**, **Auto-Match Logic**, and **UI Changes** sections of the parent PRD. See also **Testing Decisions > Client Repos Module**.\n\n## Acceptance criteria\n\n- [ ] `client_repos` table is created via D1 migration\n- [ ] Client can add a repo by entering a GitHub URL\n- [ ] Client can add a repo by entering a GitLab URL\n- [ ] Provider (github/gitlab) is correctly detected from URL\n- [ ] Repo name is extracted or derived from the URL\n- [ ] Client can remove a repo from their list\n- [ ] Client sees only their own repos, not other clients' repos\n- [ ] Auto-match: adding a repo whose URL matches `projects.repo_url` sets `project_id`\n- [ ] Auto-match: adding a repo with no matching project leaves `project_id` null\n- [ ] Linked project name and repo URL are shown for matched repos\n- [ ] \"More functionality coming soon\" message is displayed\n- [ ] CRUD operations are tested (add, remove, list)\n- [ ] Auto-match logic is tested (match found, no match)\n- [ ] URL parsing / provider detection is tested\n- [ ] Page is only accessible to authenticated users (enforced by middleware from #4)\n\n## Blocked by\n\n- Blocked by #5 (Role resolution + admin route guard)\n\n## User stories addressed\n\n- User story 13 (see list of registered repos)\n- User story 14 (add repo by URL)\n- User story 15 (remove repo)\n- User story 16 (auto-match to project)\n- User story 17 (more coming soon message)\n- User story 18 (see project name and repo URL)","state":"OPEN","author":"paysdoc","labels":[],"createdAt":"2026-03-30T15:37:00Z","comments":[],"actionableComment":null}`

## Feature Description
Build the client dashboard at `/dashboard` where authenticated clients can manage their repositories. Clients can add repos by entering a GitHub or GitLab URL, remove repos, and see their list of registered repos with project info. When a repo is added, the system auto-matches it against existing Paysdoc projects by comparing `repo_url` and links them if a match is found. The dashboard also displays a "More functionality coming soon" message.

## User Story
As a client user
I want to add, view, and remove my repositories on the dashboard and see which ones are linked to Paysdoc projects
So that I can manage my repos and track which ones are being developed through Paysdoc

## Problem Statement
The current `/dashboard` page is a placeholder that only shows the authenticated user's email. Clients have no way to register their repositories, view them, or see which repos are linked to active Paysdoc projects. There is no `client_repos` or `projects` table in the D1 database, and no CRUD functionality exists.

## Solution Statement
Create a D1 migration adding `projects` and `client_repos` tables. Build a URL parser to detect GitHub/GitLab providers and extract repo names. Implement server actions for add, remove, and list operations with auto-match logic that checks the `projects` table for URL matches. Transform the dashboard page into a full repo management UI with a repo list (showing name, URL, linked project), an add form, remove buttons, and a "coming soon" banner. All operations are scoped to the authenticated user via their `user_id` from the session.

## Relevant Files
Use these files to implement the feature:

- `src/app/dashboard/page.tsx` — Current placeholder dashboard page; will be transformed into the full repo management dashboard
- `src/auth.ts` — Auth.js v5 config; needs modification to propagate `user.id` into the session via the JWT `sub` claim
- `src/middleware.ts` — Route protection middleware; already protects `/dashboard/*`, no changes needed
- `src/lib/roles.ts` — Role resolution; no changes needed but referenced for pattern consistency
- `src/types/next-auth.d.ts` — Type augmentations for Auth.js session/JWT; needs `id` added to the session user type
- `migrations/0001_auth_tables.sql` — Existing auth schema; reference for D1 migration conventions (table style, foreign keys, indexes)
- `wrangler.jsonc` — Cloudflare D1 binding config; no changes needed (already has `DB` binding)
- `cloudflare-env.d.ts` — Cloudflare env types; no changes needed
- `src/app/login/page.tsx` — Login page with server actions; reference for server action pattern
- `src/components/Navbar.tsx` — Navbar component; reference for Tailwind styling conventions and `var()` CSS custom properties
- `src/app/layout.tsx` — Root layout; reference for page structure and Tailwind patterns
- `features/client-dashboard.feature` — BDD scenarios for dashboard display
- `features/client-repo-management.feature` — BDD scenarios for CRUD operations
- `features/client-repo-url-parsing.feature` — BDD scenarios for URL parsing
- `features/client-repo-auto-match.feature` — BDD scenarios for auto-match logic
- `app_docs/feature-id4hh3-auth-bootstrap-social-login.md` — Auth implementation doc; reference for D1 access pattern via `getCloudflareContext`
- `app_docs/feature-1l6tsn-role-resolution-admin-guard.md` — Role resolution doc; reference for session/JWT callback patterns
- `.claude/commands/test_e2e.md` — E2E test runner instructions; read before executing E2E tests
- `e2e-tests/test_auth_flow.md` — Existing E2E test; reference for E2E test format

### New Files
- `migrations/0002_client_repos.sql` — D1 migration creating `projects` and `client_repos` tables
- `src/lib/repo-url.ts` — Pure utility for parsing GitHub/GitLab URLs (provider detection + name extraction)
- `src/app/dashboard/actions.ts` — Server actions for add, remove, and list repo operations with auto-match logic
- `src/app/dashboard/RepoList.tsx` — Client component displaying the repo table with remove buttons
- `src/app/dashboard/AddRepoForm.tsx` — Client component with the add-repo form
- `e2e-tests/test_client_dashboard.md` — E2E test plan for the client dashboard feature

## Implementation Plan
### Phase 1: Foundation
Create the D1 migration with `projects` and `client_repos` tables. The `projects` table is needed for auto-match logic (checking `projects.repo_url`). Build the pure URL parsing utility in `src/lib/repo-url.ts` that detects GitHub vs GitLab providers and extracts the repo name (owner/repo for GitHub, full group path for GitLab). Extend the Auth.js session to include `user.id` so server actions can scope queries by user. Create the E2E test definition file.

### Phase 2: Core Implementation
Implement server actions in `src/app/dashboard/actions.ts` for:
- `listRepos()` — fetches all repos for the authenticated user, joining with `projects` for linked project names
- `addRepo(formData)` — parses the URL, detects provider, extracts name, checks `projects` for auto-match, inserts into `client_repos`
- `removeRepo(formData)` — deletes a repo by ID, scoped to the authenticated user

Build the client components:
- `AddRepoForm.tsx` — form with URL input and submit button, calls the `addRepo` server action
- `RepoList.tsx` — displays repos in a list/table with name, URL, linked project, and remove button per row

### Phase 3: Integration
Transform `src/app/dashboard/page.tsx` from its placeholder state into the full dashboard. The server component fetches repos via the `listRepos` action, renders the `AddRepoForm` and `RepoList` components, and displays the "More functionality coming soon" message. Validate the complete flow with lint, type-check, build, and E2E tests.

## Step by Step Tasks

### Step 1: Create D1 migration for `projects` and `client_repos` tables
- Create `migrations/0002_client_repos.sql`
- Define `projects` table: `id` (TEXT PK), `name` (TEXT NOT NULL), `repo_url` (TEXT), `created_at` (TEXT DEFAULT datetime('now'))
- Define `client_repos` table: `id` (TEXT PK), `user_id` (TEXT NOT NULL, FK → users.id ON DELETE CASCADE), `repo_url` (TEXT NOT NULL), `repo_name` (TEXT NOT NULL), `provider` (TEXT NOT NULL, CHECK IN ('github', 'gitlab')), `project_id` (TEXT, FK → projects.id ON DELETE SET NULL), `created_at` (TEXT DEFAULT datetime('now'))
- Add unique index on `client_repos (user_id, repo_url)` to prevent duplicate registrations
- Add index on `projects (repo_url)` for efficient auto-match lookups
- Follow the same style as `0001_auth_tables.sql` (CREATE IF NOT EXISTS, TEXT primary keys, explicit foreign keys)
- Apply the migration locally: `npx wrangler d1 migrations apply paysdoc-auth-db --local`

### Step 2: Create E2E test definition file
- Create `e2e-tests/test_client_dashboard.md` following the format of `e2e-tests/test_auth_flow.md`
- User story: An authenticated client can see the dashboard with a repo list, add a repo by URL, see it appear in the list, and remove it
- Test steps (unauthenticated paths only, since OAuth cannot be automated):
  1. Navigate to `/dashboard` — verify redirect to `/login` (unauthenticated)
  2. Navigate to homepage — verify "Login" link is visible
  3. Verify `/dashboard` is protected (same as auth flow, confirms middleware from #4)
- Note: Full CRUD testing requires a live authenticated session which cannot be E2E tested without real OAuth — BDD scenarios serve as living documentation for these flows
- Include success criteria and JSON output format

### Step 3: Extend Auth.js session to include `user.id`
- Modify `src/types/next-auth.d.ts`: add `id: string` to the `Session.user` interface
- Modify `src/auth.ts` `session` callback: add `session.user.id = token.sub!;` to propagate the user ID from the JWT `sub` claim into the session object
- This is required so server actions can use `session.user.id` to scope D1 queries by user

### Step 4: Create URL parsing utility
- Create `src/lib/repo-url.ts`
- Export `parseRepoUrl(url: string): { provider: 'github' | 'gitlab'; name: string } | null`
- Logic:
  - Parse the URL, extract hostname and pathname
  - If hostname is `github.com`: provider is `'github'`, name is the first two path segments (`owner/repo`)
  - If hostname is `gitlab.com`: provider is `'gitlab'`, name is all path segments (supports subgroups like `group/subgroup/repo`)
  - Strip trailing slashes, `.git` suffix, and extra path segments (e.g., `/tree/main`) for GitHub
  - Return `null` for unrecognized hosts or invalid URLs
- Match all scenarios in `features/client-repo-url-parsing.feature`

### Step 5: Create server actions for repo CRUD + auto-match
- Create `src/app/dashboard/actions.ts` with `'use server'` directive
- Import `auth` from `@/auth`, `getCloudflareContext` from `@opennextjs/cloudflare`, `parseRepoUrl` from `@/lib/repo-url`
- Implement `listRepos()`:
  - Get session via `auth()`, bail if no session
  - Get D1 via `getCloudflareContext({ async: true })`
  - Query: `SELECT cr.*, p.name as project_name FROM client_repos cr LEFT JOIN projects p ON cr.project_id = p.id WHERE cr.user_id = ? ORDER BY cr.created_at DESC`
  - Return the rows
- Implement `addRepo(formData: FormData)`:
  - Get session, get D1
  - Extract `url` from formData
  - Call `parseRepoUrl(url)` — if null, throw/return error
  - Auto-match: `SELECT id, name FROM projects WHERE repo_url = ?` using the raw URL
  - Generate a UUID for the new row (use `crypto.randomUUID()`)
  - Insert into `client_repos` with `user_id`, `repo_url`, `repo_name`, `provider`, `project_id` (from auto-match or null)
  - Call `revalidatePath('/dashboard')` to refresh the page
- Implement `removeRepo(formData: FormData)`:
  - Get session, get D1
  - Extract `repoId` from formData
  - Delete: `DELETE FROM client_repos WHERE id = ? AND user_id = ?` (scoped to the authenticated user)
  - Call `revalidatePath('/dashboard')` to refresh the page

### Step 6: Create the AddRepoForm client component
- Create `src/app/dashboard/AddRepoForm.tsx` with `'use client'` directive
- Import `addRepo` action from `./actions`
- Render a form with:
  - A text input for the repository URL (name `url`, placeholder `https://github.com/owner/repo`)
  - A submit button labeled "Add Repository"
- Use `<form action={addRepo}>` for progressive enhancement
- Use `useFormStatus` from `react-dom` for a pending state on the submit button
- Style with Tailwind CSS using the project's `var()` custom property conventions (e.g., `border-[var(--border)]`, `bg-[var(--background)]`)

### Step 7: Create the RepoList client component
- Create `src/app/dashboard/RepoList.tsx` with `'use client'` directive
- Import `removeRepo` action from `./actions`
- Accept a `repos` prop (array of repo objects with `id`, `repo_name`, `repo_url`, `provider`, `project_name`)
- If repos is empty, show an "No repositories yet" empty state message
- For each repo, display:
  - Repo name (e.g., `owner/repo`)
  - Provider badge (`github` or `gitlab`)
  - URL (as a link)
  - Linked project name if `project_name` is present, otherwise show nothing / "—"
  - A remove button wrapped in `<form action={removeRepo}>` with a hidden input for `repoId`
- Style consistently with existing components (Tailwind, CSS custom properties)

### Step 8: Transform the dashboard page
- Rewrite `src/app/dashboard/page.tsx` as a server component
- Import `auth` from `@/auth`, `listRepos` from `./actions`, `AddRepoForm` and `RepoList` from their files
- Fetch session and repos on the server
- Render:
  - Page heading: "Dashboard" or "My Repositories"
  - Welcome message with user's name/email
  - The `AddRepoForm` component
  - The `RepoList` component with the fetched repos
  - A "More functionality coming soon" info banner/message
- Keep the metadata export: `{ title: 'Dashboard' }`
- Use the same layout patterns as other pages (centered max-width container, min-height calc)

### Step 9: Run validation commands
- Run `npm run lint` to check for linting errors
- Run `npx tsc --noEmit` to verify type safety
- Run `npm run build` to ensure the production build succeeds
- Read `.claude/commands/test_e2e.md`, then read and execute the `e2e-tests/test_client_dashboard.md` E2E test to validate the feature

## Testing Strategy

### Edge Cases
- **Invalid URL**: User enters a non-GitHub/GitLab URL (e.g., `https://bitbucket.org/...`) — should show an error, not crash
- **Malformed URL**: User enters garbage text — `parseRepoUrl` returns `null`, action rejects gracefully
- **Duplicate repo**: User tries to add the same repo URL twice — D1 unique index prevents it; action should handle the constraint error gracefully
- **Trailing slash / .git suffix**: URLs like `https://github.com/owner/repo/` or `https://github.com/owner/repo.git` should normalize correctly
- **GitHub URL with extra path**: `https://github.com/owner/repo/tree/main` should still extract `owner/repo`
- **GitLab subgroups**: `https://gitlab.com/group/subgroup/repo` should extract `group/subgroup/repo`
- **No matching project**: Auto-match query returns no rows — `project_id` stays `null`
- **User isolation**: A client can only see and remove their own repos — all queries are scoped by `user_id`
- **Empty state**: Client with no repos sees an empty list and the add form
- **Concurrent session**: If user's session is invalidated mid-action, `auth()` returns null and the action fails safely

## Acceptance Criteria
- [ ] `client_repos` table is created via D1 migration (`migrations/0002_client_repos.sql`)
- [ ] `projects` table is created via D1 migration (required for auto-match)
- [ ] Client can add a repo by entering a GitHub URL
- [ ] Client can add a repo by entering a GitLab URL
- [ ] Provider (github/gitlab) is correctly detected from URL
- [ ] Repo name is extracted or derived from the URL (owner/repo for GitHub, full path for GitLab)
- [ ] Client can remove a repo from their list
- [ ] Client sees only their own repos, not other clients' repos (queries scoped by `user_id`)
- [ ] Auto-match: adding a repo whose URL matches `projects.repo_url` sets `project_id`
- [ ] Auto-match: adding a repo with no matching project leaves `project_id` null
- [ ] Linked project name and repo URL are shown for matched repos
- [ ] "More functionality coming soon" message is displayed on the dashboard
- [ ] BDD feature scenarios in `features/client-dashboard.feature`, `features/client-repo-management.feature`, `features/client-repo-url-parsing.feature`, and `features/client-repo-auto-match.feature` are satisfied
- [ ] Page is only accessible to authenticated users (enforced by existing middleware from #4/#5)
- [ ] No lint errors, no type errors, production build succeeds

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `npm run lint` — Run ESLint to check for code quality issues
- `npx tsc --noEmit` — Type-check the entire project without emitting files
- `npm run build` — Build the production application to verify no build errors
- Read `.claude/commands/test_e2e.md`, then read and execute `e2e-tests/test_client_dashboard.md` to validate the dashboard feature works via browser automation

## Notes
- **No unit test tasks**: `.adw/project.md` does not contain a `## Unit Tests: enabled` section, so unit tests are omitted per ADW configuration. Testing is covered by BDD feature scenarios and E2E validation.
- **`projects` table**: The `projects` table does not currently exist in the database. It is created in this migration as a minimal table required for auto-match logic. In future issues, this table may be extended with additional columns (description, status, etc.).
- **User ID in session**: The Auth.js JWT `sub` claim contains the user ID by default. This plan explicitly propagates it to `session.user.id` in the session callback and adds the TypeScript type, since the dashboard server actions depend on it for scoping queries.
- **No new npm dependencies**: All functionality is implemented with existing dependencies (Next.js server actions, D1 via `@opennextjs/cloudflare`, `crypto.randomUUID()` for IDs).
- **Server actions over API routes**: Following the existing pattern from the login page, this plan uses Next.js server actions rather than REST API routes for CRUD operations. Server actions provide built-in CSRF protection, progressive enhancement, and simpler code.
- **BDD feature files already exist**: The Cucumber feature files for this issue (`features/client-dashboard.feature`, `features/client-repo-management.feature`, `features/client-repo-url-parsing.feature`, `features/client-repo-auto-match.feature`) are already checked in and tagged with `@adw-8g73bx-client-repo-manageme`.
