---
type: note
title: Deployment documentation index
created: 2026-09-14
tags:
  - deployment
  - cloudflare
  - index
related:
  - '[[Deployment-Runbook]]'
  - '[[2026-workers-migration]]'
  - '[[Production-Smoke-Test]]'
  - '[[Manual-Verification-Checklist]]'
---

# Deployment documentation

Everything about running paysdoc.nl on Cloudflare Workers lives in this folder. Start with the runbook.

| Document | Type | What it is for |
| --- | --- | --- |
| [[Deployment-Runbook]] (`deployment-runbook.md`) | reference | Architecture, secrets model, everyday operations, first-deploy steps, troubleshooting, post-migration cleanup (manual) |
| [[2026-workers-migration]] (`2026-workers-migration.md`) | report | Deploy record of the Pages → Workers migration (2026-09-16): what changed, root causes, KV id, Worker URL, D1 schema decision |
| [[Production-Smoke-Test]] (`production-smoke-test.md`) | report | Results of the automated production checks on `www.paysdoc.nl` (smoke 35/35, link crawl, headers, TTFB), the open owner items and how to repeat them |
| [[Manual-Verification-Checklist]] (`manual-verification-checklist.md`) | reference | Human checklist: finish OAuth logins, click the magic link, walk `/dashboard` and `/admin`, sign out, mobile |

Evidence (JSON smoke and link reports, screenshots) from production runs is stored under `evidence/<date>/` next to
these files; `evidence/2026-09-16/` holds the launch-day set with its own `README.md`.

Related outside this folder: the **Deployment** and **Magic Link Email Setup** sections of the repository
`README.md`, `.github/workflows/deploy.yml` (build + deploy) and `.github/workflows/cloudflare-ops.yml`
(manual `wrangler` operations).
