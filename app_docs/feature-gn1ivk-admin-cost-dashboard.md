# Admin Cost-Per-Project Dashboard

**ADW ID:** gn1ivk-admin-cost-per-proje
**Date:** 2026-03-30
**Specification:** specs/issue-6-adw-gn1ivk-admin-cost-per-proje-sdlc_planner-admin-cost-dashboard.md

## Overview

The admin cost-per-project dashboard replaces the placeholder `/admin` page with a read-only, server-rendered view that aggregates cost data from Cloudflare D1. Admins can see total USD spend per project, drill down into model/provider breakdowns, and inspect per-issue cost with associated token usage. The page is protected by the existing middleware from issue #5, restricting access to admin-role users only.

## What Was Built

- D1 migration creating `projects`, `cost_records`, and `token_usage` tables with FK constraints and indexes
- TypeScript type definitions for raw D1 rows and aggregated dashboard view types
- Data access layer (`src/lib/costs.ts`) with three parameterized query functions
- `ProjectCostCard` client component with expandable drill-down sections
- Upgraded `src/app/admin/page.tsx` from a placeholder to a full server-rendered dashboard
- BDD feature file (`features/admin-cost-dashboard.feature`) and E2E test spec

## Technical Implementation

### Files Modified

- `src/app/admin/page.tsx`: Replaced placeholder with server component that queries D1 and renders `ProjectCostCard` per project; added empty-state handling
- `src/middleware.ts`: Minor update (admin guard already in place from issue #5)
- `features/route-protection.feature`: Updated to reflect current route protection behavior

### New Files

- `migrations/0002_cost_tables.sql`: Creates `projects`, `cost_records`, and `token_usage` tables with foreign keys and composite indexes
- `src/types/cost.ts`: Raw row types (`ProjectRow`, `CostRecordRow`, `TokenUsageRow`) and aggregated view types (`ProjectCostSummary`, `ModelProviderBreakdown`, `IssueCostDetail`, `TokenUsageSummary`)
- `src/lib/costs.ts`: Three exported async functions — `getProjectCostSummaries`, `getModelProviderBreakdown`, `getIssueCostDetails` — all using parameterized D1 queries
- `src/components/ProjectCostCard.tsx`: `"use client"` component accepting pre-fetched data as props; uses `useState` for expand/collapse; renders two collapsible tables (model/provider, issue detail with token usage)
- `e2e-tests/test_admin_cost_dashboard.md`: E2E test specification for the dashboard
- `features/admin-cost-dashboard.feature`: BDD scenarios covering the full acceptance criteria

### Key Changes

- **Server-side D1 access**: `getCloudflareContext({ async: true })` retrieves the `DB` binding in the server component; no API route needed
- **LEFT JOIN aggregation**: `getProjectCostSummaries` fetches all projects and their cost data in parallel using `Promise.all`, ensuring projects with zero records still appear with `$0.00`
- **Parameterized queries**: All SQL uses `?` placeholders bound via `.bind()` to prevent SQL injection; dynamic `IN (...)` clauses build placeholders programmatically
- **Props-down pattern**: All D1 data fetching happens in the server component; `ProjectCostCard` is a pure client component receiving typed props — no client-side fetching
- **CSS custom properties**: Styling uses `--card-bg`, `--border`, `--accent`, `--muted`, `--foreground` from `globals.css`, consistent with existing components

## How to Use

1. Navigate to `/admin` while signed in with an account that has the `admin` role
2. The dashboard lists all projects with their total cost in USD
3. Click **"▸ Cost by Model & Provider"** on any project card to expand the model/provider breakdown table
4. Click **"▸ Cost by Issue"** to expand issue-level cost detail with nested token usage counts
5. Projects with no cost records show `$0.00` and empty tables when expanded

## Configuration

No new environment variables or configuration required. The feature uses the existing `DB` Cloudflare D1 binding declared in `wrangler.jsonc`. Apply the migration before use:

```bash
npx wrangler d1 migrations apply DB --local   # local dev
npx wrangler d1 migrations apply DB           # production
```

## Testing

Run the standard validation suite:

```bash
npx tsc --noEmit   # TypeScript type check
npm run lint       # ESLint
npm run build      # Production build
```

For E2E testing, follow `e2e-tests/test_admin_cost_dashboard.md` using the test runner defined in `.claude/commands/test_e2e.md`.

## Notes

- The D1 tables are designed to be populated by a separate cost worker; the dashboard is read-only.
- `totalCost` is computed client-side by summing `modelProviderBreakdown` totals rather than issuing a separate aggregate query, avoiding double-counting when both breakdowns are shown.
- No new npm dependencies were added.
