---
type: reference
title: Production smoke test evidence 2026-09-16
created: 2026-09-16
tags:
  - deployment
  - qa
related:
  - '[[2026-workers-migration]]'
  - '[[Production-Smoke-Test]]'
---

# Production smoke test evidence, 2026-09-16

Captured by `BASE_URL=https://www.paysdoc.nl npm run smoke -- --production` at 10:53Z against the Worker deployed
from `main` commit `afbd424` (deploy run 35086663401, live `BUILD_ID` `qu7p3Bg1Qpj7cWK9eWfWs`).

| File | What it is |
| --- | --- |
| `smoke-production-2026-09-16T10-53-30-377Z.json` | Full report: 35/35 checks passed (28 baseline + 7 `--production`). Screenshot paths inside it refer to the scratch folder the run wrote to; only the four below are kept here. |
| `desktop-home.png` | Home page, 1280×800 desktop viewport, full page |
| `mobile-home.png` | Home page, 390×844 mobile viewport at 2× DPR, full page |
| `interest-form-success.png` | `/contact` after submitting `smoke+2026-09-16T10-53-30-377Z@paysdoc.nl`, showing the success message |
| `auth-login-page.png` | `/login` reached via the navbar link, with the Google and GitHub buttons |
| `links-2026-09-16T11-07-52-468Z.json` | Broken-link crawl (`BASE_URL=https://www.paysdoc.nl npm run check-links`, 11:07Z, `main` `8694905`): 6/6 checks, 30 internal links all 200, LinkedIn / GitHub / mailto present |

The submitted address was confirmed in the production `INTEREST_KV` namespace by the `Cloudflare ops` workflow
(`kv-get` run [35087492253](https://github.com/paysdoc/paysdoc.nl/actions/runs/35087492253)):
`{"email":"smoke+2026-09-16T10-53-30-377Z@paysdoc.nl","timestamp":"2026-09-16T10:53:54.529Z"}`.
