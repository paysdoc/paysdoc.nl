---
type: report
title: Production Smoke Test
created: 2026-09-16
tags:
  - deployment
  - qa
related:
  - '[[2026-workers-migration]]'
  - '[[Manual-Verification-Checklist]]'
  - '[[Deployment-Runbook]]'
---

# Production Smoke Test

Results of the full production verification of `https://www.paysdoc.nl` on 2026-09-16, the day the zone routes
made the Cloudflare Worker the real site (Phase 03 of the Workers migration, see [[2026-workers-migration]]).
Everything a script can check was checked and passed. What still needs a person in a browser is in
[[Manual-Verification-Checklist]]; the how-to for deploying and operating the site is in [[Deployment-Runbook]].

**Scope.** Custom domain and HTTPS, build identity, the Playwright smoke test with the `--production` rules, the
interest form into KV, the OAuth and magic-link start flows, protected routes, broken links, security headers, the
cost API, and TTFB. Each item was run against the `main` commit deployed at that moment; the commit and the deploy
run are given per section because three fixes shipped during the day (PRs #41, #42, #44) and the later checks ran
against the fixed builds.

**Outcome.** 35/35 smoke checks, 6/6 link checks, all login-flow and redirect checks pass. Three defects were found
and fixed the same day: a redirect loop on `www` (PR #41), plain `http://` served without an upgrade (PR #42), and
missing security headers (PR #44). Nothing is failing at the time of writing.

## Results

Verdict legend: **pass** = observed result equals the expected result; **fixed** = failed on the first pass, fixed,
re-checked and passing. Evidence paths are relative to `docs/deployment/`; run links are the GitHub Actions runs.

### 1. Domain, HTTPS and build identity

Checked at 10:39Z (commit `10de4b9`, deploy run 35085907774) and again at 10:50Z after the http fix (commit
`b750ec6`, deploy run [35086663401](https://github.com/paysdoc/paysdoc.nl/actions/runs/35086663401)).

| Check | Result | Verdict | Evidence |
| --- | --- | --- | --- |
| `https://www.paysdoc.nl/` | 200 | pass | [[2026-workers-migration]] §Phase 03 |
| `https://paysdoc.nl/` (apex) | 308 → `https://www.paysdoc.nl/` | pass | same |
| `https://paysdoc.nl/about?x=1` | 308 → `https://www.paysdoc.nl/about?x=1`, path and query kept | pass | same |
| `https://www.paysdoc.nl/about` | 200 | pass | same |
| `http://www.paysdoc.nl/` | first pass **200 over plain http**; now 308 → `https://www.paysdoc.nl/` | fixed | PR [#42](https://github.com/paysdoc/paysdoc.nl/pull/42), `src/lib/__tests__/deploy-config.test.ts` |
| `http://www.paysdoc.nl/about?x=1` | 308 → `https://www.paysdoc.nl/about?x=1` | pass | same |
| `http://paysdoc.nl/` | 308 → `https://www.paysdoc.nl/` in one hop | pass | same |
| Served by Cloudflare | `server: cloudflare`, `cf-ray` present, `x-opennext: 1` | pass | same |
| Served by the Worker, not the retired Pages project | `GET /api/auth/providers` 200 JSON with `https://www.paysdoc.nl/api/auth/callback/{google,github,email}` (Pages returned 404 here) | pass | same |
| Served build is the merged commit | all 11 `_next/static/chunks/*.js` content-hash names on the live home page exist in a clean local build of the same commit; `BUILD_ID` (`/BUILD_ID` is a public asset) is random per build and was recorded, not compared | pass | [[2026-workers-migration]] §Phase 03 |
| `www` redirect loop | first live check after PR #40: `https://www.paysdoc.nl/` → `308 /:path*` (OpenNext tests the `has` host value as an unanchored regex) | fixed | PR [#41](https://github.com/paysdoc/paysdoc.nl/pull/41), deploy run [35085702387](https://github.com/paysdoc/paysdoc.nl/actions/runs/35085702387) |

### 2. Automated smoke test (`scripts/smoke.mjs`)

Run at 10:53Z against commit `afbd424` (deploy run 35086663401, `BUILD_ID` `qu7p3Bg1Qpj7cWK9eWfWs`). A baseline run
without `--production` passed 28/28 three minutes earlier (`smoke+2026-09-16T10-50-37-447Z@paysdoc.nl`).

| Check | Result | Verdict | Evidence |
| --- | --- | --- | --- |
| Page load, desktop 1280×800: `/`, `/about`, `/services`, `/how-it-works`, `/contact`, `/login`, `/auth/verify-request` | 7/7 rendered, no console errors | pass | `evidence/2026-09-16/smoke-production-2026-09-16T10-53-30-377Z.json`, `evidence/2026-09-16/desktop-home.png` |
| Metadata on the same 7 pages | title and description present, rebrand wording | pass | same report |
| Branding | font `Euphemia UCAS`, `--foreground #1a0a1e`, logo, headshot, 3 assets served | pass | same report |
| Interest form `/contact` submission | success state shown | pass | `evidence/2026-09-16/interest-form-success.png` |
| `POST /api/interest` validation | 400 for an invalid body, 201 for a valid one | pass | same report |
| Interest email lands in production KV | `kv-get` returns `{"email":"smoke+2026-09-16T10-53-30-377Z@paysdoc.nl","timestamp":"2026-09-16T10:53:54.529Z"}` | pass | `kv-keys` run [35087218278](https://github.com/paysdoc/paysdoc.nl/actions/runs/35087218278), `kv-get` runs [35087301023](https://github.com/paysdoc/paysdoc.nl/actions/runs/35087301023) and [35087492253](https://github.com/paysdoc/paysdoc.nl/actions/runs/35087492253) |
| `/api/auth/providers` | google, github, email | pass | same report |
| Login link and OAuth buttons on `/login` | present | pass | `evidence/2026-09-16/auth-login-page.png` |
| Unauthenticated `/dashboard` and `/admin` | both redirect to `/login` | pass | same report |
| Page load, mobile 390×844, same 7 pages | 7/7 rendered, no horizontal overflow | pass | `evidence/2026-09-16/mobile-home.png` |
| `--production`: `og:url` on `https://www.paysdoc.nl`, `link[rel=icon]` 200, no `http:` or `*.pages.dev` request, on all 7 pages | 7/7; 39 to 40 requests per page, all on the www origin | pass | same report, rules in `scripts/lib/production-rules.mjs` |
| **Total** | **35/35 passed** | pass | `evidence/2026-09-16/README.md` |

### 3. Login flows, as far as automation goes

Run at 10:59Z against commit `09c7212` (deploy run 35087708893, `BUILD_ID` `pB8AFusJZAEMAZ85DexhR`).

| Check | Result | Verdict | Evidence |
| --- | --- | --- | --- |
| `GET /api/auth/csrf` | 200, 64-hex token, `__Host-authjs.csrf-token` cookie | pass | [[2026-workers-migration]] §Phase 03 |
| `POST /api/auth/signin/google` | 302 → `accounts.google.com/o/oauth2/v2/auth` with `client_id` (72 chars) and PKCE | pass | same |
| Google `redirect_uri` | `https://www.paysdoc.nl/api/auth/callback/google` | pass, **owner must confirm in the console** | same, and HITL item 1 below |
| `POST /api/auth/signin/github` | 302 → `github.com/login/oauth/authorize` with `client_id` (20 chars) and PKCE | pass | same |
| GitHub `redirect_uri` | `https://www.paysdoc.nl/api/auth/callback/github` | pass, **owner must confirm in the console** | same, and HITL item 1 below |
| `POST /api/auth/signin/email` for `paysdoc@gmail.com` | 302 → `/api/auth/verify-request` → 302 → `/auth/verify-request` → 200 "Check your email"; no `/login?error=` | pass | same |
| Verification token persisted | one `verification_tokens` row, expires 2026-09-17T10:59:51Z | pass | `d1-query` run [35088003353](https://github.com/paysdoc/paysdoc.nl/actions/runs/35088003353) |
| Email Worker auth check (control) | wrong bearer → 401, GET → 405 | pass | same |
| `/dashboard`, `/admin` and sub-paths unauthenticated | 307 → `/login` | pass | same |

The two-hop redirect on the magic link is stock Auth.js behaviour (`@auth/core` 0.41.1 sends the browser to
`<basePath>/verify-request`, which forwards to the configured page), not a misconfiguration.

### 4. Links, headers, cost API, TTFB

Run at 11:04Z against commit `8694905` (deploy run 35088180814); headers re-checked at 11:10Z against `5a0409f`
(deploy run [35088767574](https://github.com/paysdoc/paysdoc.nl/actions/runs/35088767574)).

| Check | Result | Verdict | Evidence |
| --- | --- | --- | --- |
| Broken links on `/`, `/about`, `/services`, `/how-it-works`, `/contact` | 30 internal link targets all 200 with redirects disabled; LinkedIn, GitHub and `mailto:info@paysdoc.nl` present; 6/6 checks | pass | `evidence/2026-09-16/links-2026-09-16T11-07-52-468Z.json`, `scripts/check-links.mjs` |
| `strict-transport-security` | absent on the first pass; now `max-age=31536000` (no `includeSubDomains`/`preload`, on purpose) | fixed | PR [#44](https://github.com/paysdoc/paysdoc.nl/pull/44), `next.config.ts` `headers()` |
| `x-content-type-options` | absent; now `nosniff` | fixed | same |
| `referrer-policy` | absent; now `strict-origin-when-cross-origin` | fixed | same |
| Headers on static assets and on 307/308 redirects | not sent (assets binding and OpenNext redirects answer before the config headers are merged) | expected, optional follow-up | [[2026-workers-migration]] §Open items |
| Cost API `https://costs.paysdoc.nl/` | 404 at the root; the worker is up (CORS headers present) but has no root route; `COST_API_URL` is not used anywhere in `src/` | noted, nothing to do | [[2026-workers-migration]] §Phase 03 |
| TTFB `https://www.paysdoc.nl/`, 3 samples | 0.935 / 0.648 / 0.118 s, median **0.65 s** (cold isolate versus warm; every HTML response was `x-nextjs-cache: MISS`) | pass | same |

### 5. State at the time of writing (2026-09-16, `main` `6d876db`)

`https://www.paysdoc.nl/` 200 with all three security headers, apex and plain-http 308 to `https://www.paysdoc.nl/`,
`/dashboard` 307 to `/login`, `/api/auth/providers` 200 JSON, live `BUILD_ID` `nQAaENxmD--6lGV6hgWtN`.

## Open items for the owner

Copied from the Auto Run `hitl.md` on 2026-09-16. Every earlier item there (API token scopes, Worker not deployed,
custom-domain routes) is resolved; only these remain, none of them block automation.

1. **Confirm the OAuth redirect URIs in the provider consoles.** The site sends these values on
   `https://www.paysdoc.nl`; logins only work if the consoles list exactly them.

   | Provider | `redirect_uri` sent by the site | Where to check |
   | --- | --- | --- |
   | Google | `https://www.paysdoc.nl/api/auth/callback/google` | Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 client (`AUTH_GOOGLE_ID`) → *Authorised redirect URIs* |
   | GitHub | `https://www.paysdoc.nl/api/auth/callback/github` | GitHub → Settings → Developer settings → OAuth Apps → app (`AUTH_GITHUB_ID`) → *Authorization callback URL* |

2. **A real sign-in email is waiting.** The automated magic-link check sent one to `paysdoc@gmail.com` (from
   `noreply@paysdoc.nl`, single use, valid until 2026-09-17 10:59Z). Use it for the magic-link item in
   [[Manual-Verification-Checklist]] or let it expire.
3. **Complete the manual checklist**: Google and GitHub sign-in, magic link, dashboard add/remove, admin page
   (the empty state *No projects found.* is the expected result, all cost tables are empty), sign-out, and a
   real-phone layout check. See [[Manual-Verification-Checklist]].
4. **Optional, dashboard-only hardening** (the Worker already handles both, this only moves them to the edge):
   *Always Use HTTPS* and HSTS under Cloudflare → SSL/TLS → Edge Certificates for zone `paysdoc.nl`.
5. **FYI**: `https://paysdoc-nl.paysdoc.workers.dev/` is 404 since the zone routes exist; add `"workers_dev": true`
   to `wrangler.jsonc` if a Cloudflare-hosted preview URL is wanted back. The four `smoke+…@paysdoc.nl` keys written
   by the smoke runs stay in the production `INTEREST_KV` namespace (the ops workflow has no delete operation).

## Re-running the smoke test

From a checkout with `npm ci` and the Playwright browsers installed (`npx playwright install chromium`):

```bash
BASE_URL=https://www.paysdoc.nl SMOKE_OUT_DIR=/tmp/paysdoc-smoke npm run smoke -- --production
BASE_URL=https://www.paysdoc.nl SMOKE_OUT_DIR=/tmp/paysdoc-smoke npm run check-links
```

Both exit non-zero on any failure and write a JSON report plus screenshots to `SMOKE_OUT_DIR` (default
`.maestro/playbooks/Initiation/Working`, which only exists inside the Auto Run). Each smoke run submits a fresh
`smoke+<timestamp>@paysdoc.nl` address through the interest form and the API, so expect two new KV keys; confirm
them with the `Cloudflare ops` workflow:

```bash
gh workflow run cloudflare-ops.yml --ref main -f operation=kv-keys
gh workflow run cloudflare-ops.yml --ref main -f operation=kv-get -f key='smoke+<timestamp>@paysdoc.nl'
```

To keep a new run as evidence, copy the report JSON and the `desktop-home`, `mobile-home`,
`interest-form-success` and `auth-login-page` screenshots into `docs/deployment/evidence/<date>/` with a short
`README.md` index, as done for 2026-09-16.
