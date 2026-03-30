# Feature: Admin Cost-Per-Project Dashboard

## Metadata
issueNumber: `6`
adwId: `gn1ivk-admin-cost-per-proje`
issueJson: `{"number":6,"title":"Admin cost-per-project dashboard","body":"## Parent PRD\n\n`specs/prd/login-and-roles.md`\n\n## What to build\n\nBuild the admin dashboard at `/admin` showing a purpose-built cost-per-project overview. The page queries the existing D1 tables (`projects`, `cost_records`, `token_usage`) and displays:\n\n- Total computed cost per project\n- Breakdown by model and provider\n- Issue-level cost detail within a project\n- Token usage associated with cost records\n\nThis is a read-only view over tables owned by the cost worker.\n\nRefer to the **Admin Dashboard** and **Existing Tables** sections of the parent PRD. See also **Testing Decisions > Admin Cost Overview Module**.\n\n## Acceptance criteria\n\n- [ ] `/admin` page displays a cost-per-project overview for all projects\n- [ ] Each project shows total computed cost in USD\n- [ ] Cost breakdown by model and provider is visible per project\n- [ ] Issue-level cost details are accessible (drill-down or expandable)\n- [ ] Token usage (by type) is shown alongside cost records\n- [ ] Projects with no cost records display zero cost, not missing rows\n- [ ] Data transformation from raw D1 queries to structured view is tested\n- [ ] Aggregation query logic is tested\n- [ ] Page is only accessible to admin role (enforced by middleware from #5)\n\n## Blocked by\n\n- Blocked by #5 (Role resolution + admin route guard)\n\n## User stories addressed\n\n- User story 9 (cost-per-project overview)\n- User story 10 (breakdown by model/provider)\n- User story 11 (per-issue cost detail)\n- User story 12 (token usage)","state":"OPEN","author":"paysdoc","labels":[],"createdAt":"2026-03-30T15:36:49Z","comments":[{"author":"paysdoc","createdAt":"2026-03-30T16:44:30Z","body":"## Take action"}],"actionableComment":null}`

## Feature Description
Build a read-only admin dashboard at `/admin` that displays a cost-per-project overview by querying Cloudflare D1 tables (`projects`, `cost_records`, `token_usage`). The dashboard shows total computed cost per project in USD, allows drill-down into cost breakdown by model/provider, issue-level cost detail, and associated token usage. Projects with no cost records display zero cost. The page is protected by the existing admin middleware from issue #5.

## User Story
As an admin user
I want to see a cost-per-project overview on the /admin page
So that I can monitor spending across projects, models, and issues

## Problem Statement
Admin users currently have no visibility into per-project cost data. The `/admin` page is a placeholder showing only the logged-in email. Cost data exists in D1 tables but there is no UI to query, aggregate, and display it.

## Solution Statement
Extend the D1 schema with `projects`, `cost_records`, and `token_usage` tables. Build a data access layer that queries and aggregates cost data from D1. Replace the placeholder `/admin` page with a server-rendered dashboard that displays per-project cost summaries with expandable drill-downs for model/provider breakdown, issue-level detail, and token usage. The existing middleware from issue #5 already guards the route to admin-only access.

## Relevant Files
Use these files to implement the feature:

- `src/app/admin/page.tsx` — Current placeholder admin page; will be replaced with the cost dashboard
- `src/auth.ts` — Auth.js configuration with D1 adapter; shows the pattern for accessing D1 via `getCloudflareContext()`
- `src/middleware.ts` — Existing admin route guard from issue #5; already protects `/admin/*`
- `src/lib/roles.ts` — Role resolution; used for admin checks in server components
- `src/types/next-auth.d.ts` — Auth type augmentations; pattern for type declarations
- `src/app/globals.css` — CSS custom properties (--accent, --card-bg, --border, etc.) used by all components
- `src/components/Navbar.tsx` — Navbar component; may need admin link addition
- `src/components/ServiceCard.tsx` — Example of card component pattern using CSS custom properties
- `migrations/0001_auth_tables.sql` — Existing D1 migration; pattern for new migration
- `wrangler.jsonc` — D1 database binding configuration (`DB`)
- `vitest.config.ts` — Vitest configuration with `@/` alias
- `features/admin-cost-dashboard.feature` — BDD scenarios defining expected behavior
- `app_docs/feature-1l6tsn-role-resolution-admin-guard.md` — Context on role resolution and admin guard implementation
- `app_docs/feature-id4hh3-auth-bootstrap-social-login.md` — Context on auth, D1 adapter, and Cloudflare context pattern
- `.claude/commands/test_e2e.md` — E2E test runner instructions

### New Files

- `migrations/0002_cost_tables.sql` — D1 migration creating `projects`, `cost_records`, and `token_usage` tables
- `src/types/cost.ts` — TypeScript interfaces for cost domain types (Project, CostRecord, TokenUsage, aggregated views)
- `src/lib/costs.ts` — Data access layer: D1 query functions and aggregation logic for cost data
- `src/components/ProjectCostCard.tsx` — Client component for expandable project cost card with drill-down
- `e2e-tests/test_admin_cost_dashboard.md` — E2E test specification for the admin cost dashboard

## Implementation Plan
### Phase 1: Foundation
Create the D1 database schema for cost-related tables and define TypeScript types that model the domain. This establishes the data layer before any UI work begins.

- Create D1 migration `0002_cost_tables.sql` with `projects`, `cost_records`, and `token_usage` tables
- Define TypeScript interfaces in `src/types/cost.ts` for raw table rows and aggregated dashboard views

### Phase 2: Core Implementation
Build the data access layer and UI components. The data access layer handles all D1 queries and aggregation logic. The UI consists of a server-rendered admin page that fetches data and client-side expandable cards for drill-down interactivity.

- Implement `src/lib/costs.ts` with functions to query D1 and aggregate costs per project, by model/provider, by issue, and with token usage
- Build `src/components/ProjectCostCard.tsx` as a client component with expandable sections for model breakdown, issue detail, and token usage
- Update `src/app/admin/page.tsx` to be a server component that queries D1, transforms data, and renders the dashboard with ProjectCostCard components

### Phase 3: Integration
Validate the feature integrates correctly with the existing auth and middleware infrastructure, passes all quality gates, and the E2E test confirms the dashboard renders as expected.

- Verify admin-only access via existing middleware
- Run lint, type-check, and build validation
- Execute E2E test against the running application

## Step by Step Tasks
Execute every step in order, top to bottom.

### Step 1: Create the E2E test specification
- Create `e2e-tests/test_admin_cost_dashboard.md` based on the pattern in `e2e-tests/test_auth_flow.md`
- The test should navigate to `/admin` unauthenticated and verify redirect to `/login`
- The test should verify the page title and "Cost per Project" heading render (unauthenticated paths only, since OAuth cannot be tested in E2E)
- Include screenshot capture at each verification point
- Follow the JSON output format from `e2e-tests/test_auth_flow.md`

### Step 2: Create D1 migration for cost tables
- Create `migrations/0002_cost_tables.sql`
- Define `projects` table with columns: `id` (INTEGER PRIMARY KEY), `name` (TEXT NOT NULL)
- Define `cost_records` table with columns: `id` (INTEGER PRIMARY KEY AUTOINCREMENT), `project_id` (INTEGER NOT NULL, FK to projects), `issue_number` (INTEGER), `model` (TEXT), `provider` (TEXT), `amount_usd` (REAL NOT NULL DEFAULT 0), `created_at` (TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)
- Define `token_usage` table with columns: `id` (INTEGER PRIMARY KEY AUTOINCREMENT), `cost_record_id` (INTEGER NOT NULL, FK to cost_records), `token_type` (TEXT NOT NULL), `count` (INTEGER NOT NULL DEFAULT 0)
- Add foreign key constraints and appropriate indexes for query performance

### Step 3: Define TypeScript types for the cost domain
- Create `src/types/cost.ts`
- Define interfaces for raw D1 row types: `ProjectRow`, `CostRecordRow`, `TokenUsageRow`
- Define aggregated view types: `ProjectCostSummary` (project with total cost), `ModelProviderBreakdown` (model + provider + total), `IssueCostDetail` (issue number + cost + token usage), `TokenUsageSummary` (token type + count)
- Export all types for use in data access and components

### Step 4: Build the data access layer
- Create `src/lib/costs.ts`
- Implement `getProjectCostSummaries(db: D1Database)`: queries all projects LEFT JOINed with cost_records, groups by project, returns `ProjectCostSummary[]` sorted by project name. Projects with no cost records show `totalCost: 0`
- Implement `getModelProviderBreakdown(db: D1Database, projectId: number)`: queries cost_records for a project grouped by model + provider, returns `ModelProviderBreakdown[]`
- Implement `getIssueCostDetails(db: D1Database, projectId: number)`: queries cost_records grouped by issue_number with associated token_usage, returns `IssueCostDetail[]`
- Use parameterized queries to prevent SQL injection
- All functions return typed results matching the interfaces from `src/types/cost.ts`

### Step 5: Build the ProjectCostCard client component
- Create `src/components/ProjectCostCard.tsx` with `"use client"` directive
- Accept props: project name, total cost, model/provider breakdown data, issue cost details with token usage
- Display project name and formatted total cost (USD with 2 decimal places)
- Include expandable/collapsible sections:
  - "Cost by Model & Provider" — table showing model, provider, and total cost per combination
  - "Cost by Issue" — table showing issue number, cost, and nested token usage (input_tokens, output_tokens, cache_read, etc.)
- Use CSS custom properties from globals.css for styling (--card-bg, --border, --accent, --muted)
- Use Tailwind CSS utility classes consistent with existing components
- Use React `useState` for expand/collapse toggle state

### Step 6: Update the admin page with the cost dashboard
- Modify `src/app/admin/page.tsx` (Server Component)
- Import `getCloudflareContext` from `@opennextjs/cloudflare` to access D1
- Import `auth` from `@/auth` to get the session
- Import data access functions from `@/lib/costs`
- Query D1 for all project cost summaries, and for each project, fetch model/provider breakdown and issue cost details
- Render a page header showing "Cost per Project" and the logged-in admin email
- Map over projects and render a `ProjectCostCard` for each
- Handle the empty state: if no projects exist, show a message

### Step 7: Run validation commands
- Run `npx tsc --noEmit` to verify TypeScript compiles without errors
- Run `npm run lint` to check for code quality issues
- Run `npm run build` to verify the production build succeeds
- Read `.claude/commands/test_e2e.md`, then read and execute the E2E test `e2e-tests/test_admin_cost_dashboard.md`

## Testing Strategy
### Edge Cases
- Projects with zero cost records must display `$0.00`, not be omitted from the list
- Cost amounts with floating-point precision issues (e.g., 1.11 + 2.22 + 3.33 = 6.66) must display correctly
- Projects with cost records but no token usage should show cost without token breakdown
- Empty database (no projects at all) should show an appropriate empty state message
- Large numbers of projects and records should render without performance issues

## Acceptance Criteria
- `/admin` page displays a "Cost per Project" overview heading visible to admin users
- Each project is listed with its name and total computed cost in USD (formatted as `$X.XX`)
- Cost breakdown by model and provider is visible per project via expandable section
- Issue-level cost details are accessible via expandable drill-down within each project
- Token usage (by type: input_tokens, output_tokens, cache_read, etc.) is shown alongside cost records in the issue detail view
- Projects with no cost records display `$0.00` as total cost, not missing from the list
- Page is only accessible to admin role — non-admin users are redirected to `/dashboard` by middleware
- TypeScript compiles without errors (`npx tsc --noEmit`)
- ESLint passes (`npm run lint`)
- Production build succeeds (`npm run build`)

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `npx tsc --noEmit` — Verify TypeScript compiles without errors
- `npm run lint` — Run ESLint to check for code quality issues
- `npm run build` — Build the application for production to verify no build errors
- Read `.claude/commands/test_e2e.md`, then read and execute the E2E test `e2e-tests/test_admin_cost_dashboard.md` to validate the admin cost dashboard functionality

## Notes
- The D1 tables (`projects`, `cost_records`, `token_usage`) are described in the issue as "owned by the cost worker." This plan creates the schema migration so the tables exist for the dashboard to query. The cost worker (a separate system) will populate these tables.
- No new npm dependencies are required. The feature uses existing Next.js App Router, React 19, Tailwind CSS 4, and the Cloudflare D1 binding already configured in `wrangler.jsonc`.
- The admin page is a React Server Component that queries D1 directly — no API route is needed since data is fetched server-side.
- The `ProjectCostCard` component uses `"use client"` only for expand/collapse interactivity; all data is passed as props from the server component.
- Conditional docs matched: `app_docs/feature-1l6tsn-role-resolution-admin-guard.md` (RBAC/admin access) and `app_docs/feature-id4hh3-auth-bootstrap-social-login.md` (D1 adapter, Cloudflare context pattern).
- The `.adw/project.md` does not contain a `## Unit Tests` section, so unit test tasks are omitted from this plan. The BDD feature file `features/admin-cost-dashboard.feature` serves as the primary test specification for data transformation and aggregation correctness.
