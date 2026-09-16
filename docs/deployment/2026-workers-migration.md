---
type: report
title: Workers migration deploy record
created: 2026-09-16
tags:
  - deployment
  - cloudflare
  - workers
related:
  - '[[Deployment-Runbook]]'
  - '[[Production-Smoke-Test]]'
---

# Workers migration deploy record

Record of the September 2026 move of paysdoc.nl from Cloudflare Pages (which served 404 for every page) to a
Cloudflare **Worker with static assets**, deployed by `wrangler deploy` from GitHub Actions. Condensed from the
Auto Run working log; the how-to lives in [[Deployment-Runbook]], the production verification on the real domain
in [[Production-Smoke-Test]].

## Outcome

| Item | Value |
| --- | --- |
| Merge | PR [#39](https://github.com/paysdoc/paysdoc.nl/pull/39) `deploy/workers-migration` → `main`, merge commit `d12d7b0` (closes #28) |
| Site Worker | `paysdoc-nl`, **`https://www.paysdoc.nl`** (zone routes since 2026-09-16; the `workers.dev` URL is disabled by wrangler once routes exist) |
| Site version id | `aeb4affd-ec96-45ac-bedb-f92e2e627b88` (deploy run [35084020706](https://github.com/paysdoc/paysdoc.nl/actions/runs/35084020706)) |
| Email Worker | `https://email.paysdoc.workers.dev`, version `70dfff7d-cdc6-4cab-9580-537fd9951f5d` |
| `INTEREST_KV` namespace | title `Interest`, id **`eefd36f984b64b4eb95f368a86867aaa`** (bound in `wrangler.jsonc`, commit `7cd246a`) |
| D1 database | `paysdoc-auth-db`, id `138b4abc-dc32-4f08-98a7-87442977a5d3`, migrations 0001–0003 applied remotely |
| Smoke test on workers.dev | 28/28 passed (`BASE_URL=https://paysdoc-nl.paysdoc.workers.dev npm run smoke`) |
| Custom domain | **attached 2026-09-16** — PR [#40](https://github.com/paysdoc/paysdoc.nl/pull/40) added zone routes `www.paysdoc.nl/*` and `paysdoc.nl/*` (closes #34); PR [#41](https://github.com/paysdoc/paysdoc.nl/pull/41) fixed the apex → www redirect (see below); deploy run [35085702387](https://github.com/paysdoc/paysdoc.nl/actions/runs/35085702387), version `3820902e…` superseded by the #41 deploy |

## What changed

Four root causes from Phase 01 were fixed in one PR:

1. **Wrong deploy target.** The OpenNext adapter builds a Worker (`.open-next/worker.js`), but the old workflow
   only uploaded `.open-next/assets` to Pages, so no server code ever ran. `wrangler.jsonc` is now a
   Workers-with-assets config (`main`, `ASSETS` binding, `WORKER_SELF_REFERENCE`, `nodejs_compat` and
   `global_fetch_strictly_public`, observability) and `deploy.yml` runs `wrangler deploy` for both Workers.
2. **Secrets Store leftovers.** `src/auth.ts`, `cloudflare-env.d.ts` and the email Worker read secrets through
   Secrets Store bindings that no longer existed. They now read plain string env vars; `trustHost: true` avoids
   `UntrustedHost` on Cloudflare.
3. **D1 binding name mismatch.** The database was bound as `paysdoc_auth_db` while the code uses `env.DB`.
   Renamed to `DB`.
4. **`INTEREST_KV` placeholder id.** The namespace now exists and is bound to the id above.

Also in the same PR: `src/middleware.ts` exports a real `middleware` function (the lazy NextAuth form returned a
Promise and caused silent 500s on `/dashboard` and `/admin`), Navbar mobile menu and root `openGraph` metadata so
the Playwright smoke test passes, and the two restored migrations described below.

### Secrets model

Application secrets live only as **GitHub Actions secrets**: `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`,
`AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, `COST_API_TOKEN`, `RESEND_API_KEY`, plus `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID`. On every run `deploy.yml` pushes them to the Workers with `wrangler secret bulk` (six to
`paysdoc-nl`, two to the email Worker). `AUTH_SECRET` is read from the same GitHub secret in both steps, so the two
Workers always share one value. Nothing reads the Cloudflare Secrets Store any more.

> [!WARNING]
> `gh secret set NAME --body -` does **not** read stdin; it stores the literal string `-`. The first upload
> (2026-09-14) did exactly that for all seven application secrets, and the first deploy shipped `client_id=-` to
> both OAuth providers. The tell-tale sign was every hyphen in the Actions log being masked as `***`. Always pipe
> the value: `printf '%s' "$value" | gh secret set NAME`. Re-uploaded 2026-09-16 and redeployed; verified by
> comparing the `client_id` in the OAuth redirects against the local values.

### Ops workflow

`.github/workflows/cloudflare-ops.yml` (`whoami`, `kv-*`, `secret-list`, `worker-secret-list`, `d1-schema`,
`d1-query`, `deployments`, `rollback`) is the only path to Cloudflare, because local `wrangler` is not logged in.
`workflow_dispatch` requires the workflow to exist on the default branch, so it was landed on `main` first
(`5ac7a88`) before the migration branch was merged.

## D1 schema decision

The `d1-schema` operation showed that production held only the Auth.js tables from `0001_auth_tables.sql`
(`users`, `accounts`, `sessions`, `verification_tokens`); `projects`, `client_repos`, `cost_records` and
`token_usage` were **missing**, so they are not maintained by the cost worker behind `costs.paysdoc.nl` in this
database. They were restored as real migrations from the SQL recovered in Phase 01:

| Migration | Creates |
| --- | --- |
| `migrations/0002_client_repos.sql` | `projects` (+ `projects_repo_url` index), `client_repos` (+ unique `client_repos_user_id_repo_url`) |
| `migrations/0003_cost_tables.sql` | `cost_records` (+ 2 indexes), `token_usage` (+ 1 index); does not redefine `projects` |

All statements are `CREATE … IF NOT EXISTS`. Every column referenced by `src/app/dashboard/actions.ts` and
`src/lib/costs.ts` exists, pinned by `src/lib/__tests__/migrations.test.ts`. The first `deploy.yml` run on
`main` applied both migrations remotely before `wrangler deploy`. The tables start empty; nothing in this repo
writes `cost_records` or `token_usage` yet.

## Verification performed on workers.dev

| Check | Result |
| --- | --- |
| `npm run smoke` (7 pages desktop + mobile, metadata, branding, interest form, `/api/interest`, auth providers, guarded routes) | 28/28 passed |
| Interest form entry in production KV (`kv-keys`, `kv-get`) | key listed, JSON has `email` and `timestamp` |
| `secret-list` / `worker-secret-list` | 6 site names, 2 email-worker names |
| Email Worker | `GET` → 405, `POST` without bearer → 401 |
| `POST /api/auth/signin/google` | 302 to `accounts.google.com` with the expected `client_id` |
| `POST /api/auth/signin/github` | 302 to `github.com/login/oauth/authorize` with the expected `client_id` |

The OAuth callbacks and the magic-link email were deliberately not exercised from workers.dev: the OAuth apps are
registered for `www.paysdoc.nl` and the magic link would point at the wrong host. Both are Phase 03 checks.

## Open items

- ~~**Custom domain routes** (#34)~~ — done 2026-09-16 (PRs #40 and #41). Note for future redirect rules: the
  OpenNext runtime (`@opennextjs/aws` 3.9.16) tests a `has` host value as an **unanchored** regex and leaves the
  destination literal when the source captured no params. A single `/:path*` rule with `value: 'paysdoc.nl'`
  therefore made `www.paysdoc.nl/` loop to `/:path*`. `next.config.ts` now uses `^paysdoc\.nl$` and two rules
  (`/` and `/:path+`); `src/lib/__tests__/deploy-config.test.ts` pins both. Verified with
  `npx wrangler dev --local --host paysdoc.nl` (and `--host www.paysdoc.nl`) before deploying.
- **Real-domain verification**: OAuth callbacks, magic-link sign-in, security headers, TTFB and the manual
  checklist (Phase 03). The first Phase 03 pass (2026-09-16) confirmed `https://www.paysdoc.nl/` 200, apex 308 → www,
  `/api/auth/providers` JSON from the Worker, and that the served Turbopack chunk hashes match a local build of
  `main` (the `BUILD_ID` is random per build, so compare chunk names, not ids; `/BUILD_ID` is a public asset).
  It also found `http://www.paysdoc.nl/` answering 200 over plain http because the zone's *Always Use HTTPS*
  setting is off. PR [#42](https://github.com/paysdoc/paysdoc.nl/pull/42) now upgrades it in the Worker: two more
  `redirects()` rules keyed on `x-forwarded-proto` = `^http$` (anchored for the same unanchored-regex reason as
  above). Enabling *Always Use HTTPS* at the edge as well remains a recommended dashboard-only step.
- **PR [#38](https://github.com/paysdoc/paysdoc.nl/pull/38)** (docs wrap-up: runbook, README sync, interest route
  test) is still open. Its status note predates this deploy and should be refreshed before merging.
- **Housekeeping**: the "filled in by Phase 02" comment above the `kv_namespaces` block in `wrangler.jsonc` is
  stale; wrangler in CI is 4.78.0 with 4.131.x available.
