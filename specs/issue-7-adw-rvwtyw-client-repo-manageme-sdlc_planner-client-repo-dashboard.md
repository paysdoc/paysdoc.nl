# Feature: Client Repository Management + Dashboard

## Metadata
issueNumber: `7`
adwId: `rvwtyw-client-repo-manageme`
issueJson: `{"number":7,"title":"Client repo management + dashboard","body":"## Parent PRD\n\n`specs/prd/login-and-roles.md`\n\n## What to build\n\nBuild the client dashboard at `/dashboard` where clients can manage their repositories. Clients can add repos by entering a GitHub or GitLab URL, remove repos, and see their list of registered repos with project info.\n\nThis slice includes:\n\n- D1 migration to create the `client_repos` table\n- CRUD operations: add, remove, list repos for the authenticated user\n- Auto-match logic: when a repo is added, check `projects.repo_url` for a match and set `project_id`\n- Client dashboard UI: repo list (name, URL, linked project), add form, remove button, \"more functionality coming soon\" message\n- URL parsing to detect provider (github/gitlab)\n\n## Acceptance criteria\n\n- [ ] `client_repos` table is created via D1 migration\n- [ ] Client can add a repo by entering a GitHub URL\n- [ ] Client can add a repo by entering a GitLab URL\n- [ ] Provider (github/gitlab) is correctly detected from URL\n- [ ] Repo name is extracted or derived from the URL\n- [ ] Client can remove a repo from their list\n- [ ] Client sees only their own repos, not other clients' repos\n- [ ] Auto-match: adding a repo whose URL matches `projects.repo_url` sets `project_id`\n- [ ] Auto-match: adding a repo with no matching project leaves `project_id` null\n- [ ] Linked project name and repo URL are shown for matched repos\n- [ ] \"More functionality coming soon\" message is displayed\n- [ ] CRUD operations are tested (add, remove, list)\n- [ ] Auto-match logic is tested (match found, no match)\n- [ ] URL parsing / provider detection is tested\n- [ ] Page is only accessible to authenticated users (enforced by middleware from #4)","state":"OPEN","author":"paysdoc","labels":[],"createdAt":"2026-03-30T15:37:00Z","comments":[],"actionableComment":null}`

## Feature Description
Build the client dashboard at `/dashboard` where authenticated clients can manage their GitHub and GitLab repositories. The dashboard provides CRUD operations (add, remove, list) for repos, automatically detects the provider (GitHub/GitLab) from the URL, extracts the repo name, and auto-matches repos to existing Paysdoc projects by comparing `repo_url`. The dashboard displays each repo's name, URL, linked project (if matched), and a "More functionality coming soon" message. A D1 migration creates the `projects` and `client_repos` tables, and server-side API routes handle all data operations scoped to the authenticated user.

## User Story
As a client user
I want to manage my GitHub and GitLab repositories from a dashboard
So that I can register repos, see which ones are linked to Paysdoc projects, and remove repos I no longer need

## Problem Statement
Authenticated clients currently see only a placeholder dashboard with their email. There is no way for clients to register repositories, track which repos are linked to Paysdoc projects, or manage their repo list. The database lacks `client_repos` and `projects` tables needed for this functionality.

## Solution Statement
Create D1 migrations for `projects` and `client_repos` tables. Build a URL parsing utility to detect provider and extract repo name. Implement server-side API routes (`/api/client-repos`) for CRUD operations scoped to the authenticated user with auto-match logic that links repos to projects by `repo_url`. Enhance the existing `/dashboard` page with a repo list, add form, remove buttons, and a "coming soon" message — all rendered as a server component with client-side interactivity for form submission and deletion.

## Relevant Files
Use these files to implement the feature:

- `src/app/dashboard/page.tsx` — Existing dashboard page to be enhanced with repo list, add form, and "more coming soon" message
- `src/auth.ts` — Auth.js config; used to get the session and D1 database binding via `getCloudflareContext()`
- `src/middleware.ts` — Already protects `/dashboard/:path*` for authenticated users; no changes needed
- `src/types/next-auth.d.ts` — Session type augmentation; may need `id` added to session user
- `src/lib/roles.ts` — Role resolution; no changes needed but referenced for auth pattern
- `src/components/Navbar.tsx` — Navbar with Dashboard link; no changes needed
- `src/components/Providers.tsx` — SessionProvider wrapper; no changes needed
- `src/app/layout.tsx` — Root layout; no changes needed
- `migrations/0001_auth_tables.sql` — Existing migration for reference on D1 SQL patterns
- `wrangler.jsonc` — Cloudflare config with `DB` D1 binding
- `cloudflare-env.d.ts` — TypeScript types for Cloudflare env bindings
- `features/client-dashboard.feature` — BDD scenarios for dashboard UI
- `features/client-repo-management.feature` — BDD scenarios for CRUD operations
- `features/client-repo-url-parsing.feature` — BDD scenarios for URL parsing
- `features/client-repo-auto-match.feature` — BDD scenarios for auto-match logic
- `app_docs/feature-id4hh3-auth-bootstrap-social-login.md` — Auth implementation reference (D1 access pattern, server actions)
- `app_docs/feature-1l6tsn-role-resolution-admin-guard.md` — Role resolution reference (session.user.role usage)
- `.adw/commands.md` — Validation commands for the project
- `.claude/commands/test_e2e.md` — E2E test runner instructions
- `.claude/commands/e2e-examples/test_basic_query.md` — E2E test example (if exists, otherwise use `e2e-tests/test_auth_flow.md` as template)

### New Files
- `migrations/0002_projects_and_client_repos.sql` — D1 migration creating `projects` and `client_repos` tables
- `src/lib/repo-url.ts` — URL parsing utility: detect provider (github/gitlab), extract repo name, normalize URL
- `src/lib/__tests__/repo-url.test.ts` — Vitest tests for URL parsing utility
- `src/app/api/client-repos/route.ts` — API route handler for GET (list) and POST (add) operations
- `src/app/api/client-repos/[id]/route.ts` — API route handler for DELETE (remove) operation
- `src/app/dashboard/RepoList.tsx` — Client component for the interactive repo list with remove buttons
- `src/app/dashboard/AddRepoForm.tsx` — Client component for the add repo form
- `e2e-tests/test_client_repo_dashboard.md` — E2E test for the client repo dashboard feature

## Implementation Plan
### Phase 1: Foundation
Create the D1 migration for `projects` and `client_repos` tables and implement the URL parsing utility with tests. These are the building blocks all other work depends on.

- **D1 migration** (`0002_projects_and_client_repos.sql`): Creates `projects` table with `id`, `name`, `repo_url` columns, and `client_repos` table with `id`, `user_id`, `repo_url`, `repo_name`, `provider`, `project_id` (nullable FK to projects), `created_at`. Add unique constraint on `(user_id, repo_url)` to prevent duplicates.
- **URL parsing utility** (`src/lib/repo-url.ts`): Pure function that takes a URL string, detects `github` or `gitlab` provider from hostname, strips trailing slashes and `.git` suffixes, extracts the repo name path (owner/repo for GitHub, full path for GitLab subgroups).
- **Session user ID**: Ensure `session.user.id` is available by updating the Auth.js `session` callback and the `next-auth.d.ts` type augmentation to pass through the user ID from the JWT token.

### Phase 2: Core Implementation
Build the API routes for CRUD operations and the auto-match logic.

- **GET `/api/client-repos`**: Fetch all repos for the authenticated user (joined with projects for linked project name). Returns JSON array.
- **POST `/api/client-repos`**: Parse the submitted URL, detect provider, extract name. Query `projects` table for a matching `repo_url`. Insert into `client_repos` with optional `project_id`. Return the created repo.
- **DELETE `/api/client-repos/[id]`**: Delete a repo by ID, scoped to the authenticated user (WHERE user_id = session.user.id AND id = param).
- All routes check `auth()` and return 401 if not authenticated.

### Phase 3: Integration
Build the dashboard UI components and wire them to the API.

- **Dashboard page** (`src/app/dashboard/page.tsx`): Server component that fetches the user's repos via direct D1 query (same pattern as auth.ts using `getCloudflareContext`). Renders the "My Repositories" section, `AddRepoForm`, `RepoList`, and "More functionality coming soon" message.
- **RepoList** (`src/app/dashboard/RepoList.tsx`): Client component receiving repos as props. Renders a table/list with repo name, URL, linked project name (or empty), and a remove button per repo. Remove triggers DELETE API call and updates local state.
- **AddRepoForm** (`src/app/dashboard/AddRepoForm.tsx`): Client component with a URL input and submit button. On submit, calls POST API, on success refreshes the repo list (via `router.refresh()`).

## Step by Step Tasks
Execute every step in order, top to bottom.

### Step 1: Create the E2E test file
- Create `e2e-tests/test_client_repo_dashboard.md` with test steps covering:
  - Navigate to `/dashboard` unauthenticated → redirected to `/login`
  - Verify "My Repositories" section, "Add Repository" form, and "More functionality coming soon" message are visible
  - Note: full CRUD flow cannot be E2E tested without auth session, so focus on unauthenticated redirect and page structure verification
- Follow the format from `e2e-tests/test_auth_flow.md`

### Step 2: Create D1 migration
- Create `migrations/0002_projects_and_client_repos.sql` with:
  - `projects` table: `id TEXT PRIMARY KEY`, `name TEXT NOT NULL`, `repo_url TEXT`, `created_at TEXT DEFAULT (datetime('now'))`
  - Unique index on `projects(repo_url)` where repo_url is not null
  - `client_repos` table: `id TEXT PRIMARY KEY`, `user_id TEXT NOT NULL`, `repo_url TEXT NOT NULL`, `repo_name TEXT NOT NULL`, `provider TEXT NOT NULL`, `project_id TEXT`, `created_at TEXT DEFAULT (datetime('now'))`
  - Foreign key `user_id` → `users(id) ON DELETE CASCADE`
  - Foreign key `project_id` → `projects(id) ON DELETE SET NULL`
  - Unique index on `client_repos(user_id, repo_url)` to prevent duplicate repos per user
- Apply locally: `npx wrangler d1 migrations apply paysdoc-auth-db --local`

### Step 3: Implement URL parsing utility
- Create `src/lib/repo-url.ts` exporting:
  - `type RepoProvider = 'github' | 'gitlab'`
  - `interface ParsedRepo { provider: RepoProvider; repoName: string; normalizedUrl: string }`
  - `function parseRepoUrl(url: string): ParsedRepo` — throws on invalid/unsupported URLs
- Logic:
  - Parse URL, check hostname is `github.com` or `gitlab.com`
  - Strip trailing `/`, `.git` suffix
  - For GitHub: extract first two path segments (`owner/repo`)
  - For GitLab: extract full path (supports subgroups like `group/subgroup/repo`)
  - Build `normalizedUrl` as `https://{host}/{repoName}`
- Handle edge cases from `features/client-repo-url-parsing.feature`:
  - Trailing slashes, `.git` suffix, nested paths (GitHub `/tree/main`), GitLab subgroups

### Step 4: Write Vitest tests for URL parsing
- Create `src/lib/__tests__/repo-url.test.ts` with tests covering all scenarios from `features/client-repo-url-parsing.feature`:
  - GitHub URL → provider "github", name "owner/repo-name"
  - GitLab URL → provider "gitlab", name "owner/repo-name"
  - Trailing slash stripped
  - `.git` suffix stripped (both providers)
  - GitHub nested path (`/tree/main`) → extracts owner/repo only
  - GitLab subgroups → extracts full path
  - Invalid URL throws error
  - Unsupported host throws error
- Run `npm test` to verify all pass

### Step 5: Update Auth.js session to include user ID
- Modify `src/auth.ts`:
  - In the `jwt` callback, persist `token.sub` (the user ID) — it's already there by default in Auth.js JWT
  - In the `session` callback, add `session.user.id = token.sub as string`
- Modify `src/types/next-auth.d.ts`:
  - Add `id: string` to the `Session['user']` interface
  - Add `sub: string` to the JWT interface augmentation if needed

### Step 6: Create API route — GET and POST `/api/client-repos`
- Create `src/app/api/client-repos/route.ts`:
  - Import `auth` from `@/auth`, `getCloudflareContext` from `@opennextjs/cloudflare`, `parseRepoUrl` from `@/lib/repo-url`
  - **GET handler**:
    - Call `auth()` to get session; return 401 if no session
    - Get `env.DB` via `getCloudflareContext()`
    - Query: `SELECT cr.*, p.name as project_name FROM client_repos cr LEFT JOIN projects p ON cr.project_id = p.id WHERE cr.user_id = ? ORDER BY cr.created_at DESC`
    - Return JSON array
  - **POST handler**:
    - Call `auth()` to get session; return 401 if no session
    - Parse request body for `url` field
    - Call `parseRepoUrl(url)` — return 400 on error
    - Check for duplicate: `SELECT id FROM client_repos WHERE user_id = ? AND repo_url = ?`; return 409 if exists
    - Auto-match: `SELECT id, name FROM projects WHERE repo_url = ?` using `normalizedUrl`
    - Generate ID with `crypto.randomUUID()`
    - Insert: `INSERT INTO client_repos (id, user_id, repo_url, repo_name, provider, project_id) VALUES (?, ?, ?, ?, ?, ?)`
    - Return created repo with 201 status

### Step 7: Create API route — DELETE `/api/client-repos/[id]`
- Create `src/app/api/client-repos/[id]/route.ts`:
  - **DELETE handler**:
    - Call `auth()` to get session; return 401 if no session
    - Get `id` from route params
    - Delete: `DELETE FROM client_repos WHERE id = ? AND user_id = ?` (scoped to user)
    - Check `result.meta.changes` — return 404 if 0 rows affected
    - Return 204 on success

### Step 8: Build the AddRepoForm client component
- Create `src/app/dashboard/AddRepoForm.tsx`:
  - `"use client"` directive
  - Input field for repo URL, submit button labeled "Add Repository"
  - On submit, POST to `/api/client-repos` with the URL
  - On success, call `router.refresh()` to re-render the server component
  - Show inline error message on 400 (invalid URL), 409 (duplicate), or other errors
  - Disable button during submission

### Step 9: Build the RepoList client component
- Create `src/app/dashboard/RepoList.tsx`:
  - `"use client"` directive
  - Props: array of repo objects (id, repo_name, repo_url, provider, project_name)
  - Render each repo with: name, URL (as link), provider badge, linked project name (if present)
  - Remove button per repo: calls DELETE `/api/client-repos/{id}`, on success calls `router.refresh()`
  - Empty state message when no repos

### Step 10: Enhance the dashboard page
- Rewrite `src/app/dashboard/page.tsx`:
  - Keep as async server component
  - Call `auth()` for session
  - Get `env.DB` via `getCloudflareContext()`
  - Query repos for the authenticated user (same query as GET API route)
  - Render:
    - "My Repositories" heading
    - `<AddRepoForm />` component
    - `<RepoList repos={repos} />` component
    - "More functionality coming soon" message (paragraph or banner)
  - Maintain existing Tailwind styling patterns (centered layout, accent colors, spacing)

### Step 11: Run validation commands
- Run `npm run lint` — verify no linting errors
- Run `npx tsc --noEmit` — verify no type errors
- Run `npm test` — verify all tests pass (existing role tests + new URL parsing tests)
- Run `npm run build` — verify production build succeeds
- Read `.claude/commands/test_e2e.md`, then read and execute `e2e-tests/test_client_repo_dashboard.md` to validate the dashboard E2E

## Testing Strategy
### Unit Tests
Vitest tests for the URL parsing utility (`src/lib/__tests__/repo-url.test.ts`):
- GitHub URL detection and name extraction
- GitLab URL detection and name extraction
- Trailing slash normalization
- `.git` suffix removal
- GitHub nested path truncation to owner/repo
- GitLab subgroup full path extraction
- Invalid URL rejection
- Unsupported hostname rejection

Existing tests (`src/lib/__tests__/roles.test.ts`) must continue to pass.

### Edge Cases
- URL with trailing slash (`https://github.com/owner/repo/`)
- URL with `.git` suffix (`https://github.com/owner/repo.git`)
- GitHub URL with extra path segments (`/tree/main`, `/blob/main/file.ts`)
- GitLab URL with subgroups (`https://gitlab.com/group/subgroup/repo`)
- Duplicate repo URL for the same user (should return 409)
- Removing a repo that doesn't exist or belongs to another user (should return 404)
- Empty URL submission (should return 400)
- Non-GitHub/GitLab URL (should return 400)
- User with no repos sees empty state
- User sees only their own repos, not other users' repos
- Auto-match with exact URL match sets project_id
- Auto-match with no matching project leaves project_id null
- Session user.id is correctly propagated for database queries

## Acceptance Criteria
- [x] `client_repos` and `projects` tables are created via D1 migration (`0002_projects_and_client_repos.sql`)
- [ ] Client can add a repo by entering a GitHub URL
- [ ] Client can add a repo by entering a GitLab URL
- [ ] Provider (github/gitlab) is correctly detected from URL
- [ ] Repo name is extracted or derived from the URL
- [ ] Client can remove a repo from their list
- [ ] Client sees only their own repos, not other clients' repos
- [ ] Auto-match: adding a repo whose URL matches `projects.repo_url` sets `project_id`
- [ ] Auto-match: adding a repo with no matching project leaves `project_id` null
- [ ] Linked project name and repo URL are shown for matched repos
- [ ] "More functionality coming soon" message is displayed
- [ ] CRUD operations are tested (add, remove, list)
- [ ] Auto-match logic is tested (match found, no match)
- [ ] URL parsing / provider detection is tested
- [ ] Page is only accessible to authenticated users (enforced by middleware from #4)

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

1. `npm run lint` — Run linter to check for code quality issues
2. `npx tsc --noEmit` — Type-check the entire project
3. `npm test` — Run Vitest tests (role resolution + URL parsing)
4. `npm run build` — Build the application to verify no build errors
5. Read `.claude/commands/test_e2e.md`, then read and execute `e2e-tests/test_client_repo_dashboard.md` to validate the dashboard E2E

## Notes
- **No new libraries needed**: All functionality uses built-in Next.js APIs, D1 SQL, and the existing `@opennextjs/cloudflare` adapter for `getCloudflareContext()`.
- **D1 access pattern**: Follow the same pattern as `src/auth.ts` — call `getCloudflareContext({ async: true })` to get `env.DB` in server components and API routes.
- **ID generation**: Use `crypto.randomUUID()` for primary keys (available in Cloudflare Workers runtime).
- **No `specs/prd/login-and-roles.md` found**: The parent PRD referenced in the issue doesn't exist in the repo. The plan is derived from the issue body acceptance criteria and the existing BDD feature files.
- **Projects table seeding**: The `projects` table is created empty. For auto-match to work in production, projects must be seeded or managed via a separate admin feature. For testing, seed data should be inserted directly via SQL.
- **Auth middleware already in place**: `/dashboard/:path*` is protected by the existing middleware from issues #4/#5. No middleware changes are needed.
- **Server component data fetching**: The dashboard page fetches data directly via D1 in the server component (not via API call to itself). The API routes exist for client-side mutations (add/remove) from the `"use client"` components.
