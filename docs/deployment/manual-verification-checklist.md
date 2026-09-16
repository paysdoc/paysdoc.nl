---
type: reference
title: Manual production verification checklist
created: 2026-09-16
tags:
  - deployment
  - qa
  - auth
related:
  - '[[Production-Smoke-Test]]'
  - '[[Deployment-Runbook]]'
---

# Manual production verification checklist

Everything a script can verify on `https://www.paysdoc.nl` has been verified and is recorded in
[[Production-Smoke-Test]] and [`2026-workers-migration.md`](2026-workers-migration.md). The items below need a
real person in a browser with real provider accounts and a real mailbox. Tick each box once the expected result
was observed; if something differs, note what you saw next to the item and open an issue.

**Precondition for all login items:** the OAuth callback URLs in the two provider consoles must be the ones the
site sends (section 0). Until they are, Google and GitHub will show a `redirect_uri_mismatch` style error instead of
signing you in.

**State on 2026-09-16:** the production `users` table is empty (nobody has ever signed in on the live domain), so
the first successful item in section 1–3 creates the first user row.

**Accounts used:** `paysdoc@gmail.com` is an admin (`src/lib/roles.ts` lists `paysdoc@gmail.com` and
`martin@paysdoc.nl`); any other Google/GitHub account is a normal client and is the "non-admin account" below.

## 0. Provider console settings (confirm once)

These are the exact `redirect_uri` values the site sent on 2026-09-16 during the automated OAuth-start check
(`POST /api/auth/signin/google` and `/github` on the live domain). They cannot be read from the repo or the API.

- [ ] **Google** — Google Cloud Console → APIs & Services → Credentials → the OAuth 2.0 client whose id is the
      `AUTH_GOOGLE_ID` secret → *Authorised redirect URIs* contains exactly
      `https://www.paysdoc.nl/api/auth/callback/google`
- [ ] **GitHub** — GitHub → Settings → Developer settings → OAuth Apps → the app whose client id is the
      `AUTH_GITHUB_ID` secret → *Authorization callback URL* is exactly
      `https://www.paysdoc.nl/api/auth/callback/github`

Only `www` needs registering: `https://paysdoc.nl/*` and `http://…` are 308-redirected to `https://www.paysdoc.nl/*`
before any callback is handled.

## 1. Google login

- [ ] **Google login lands on the dashboard**
  - URL: `https://www.paysdoc.nl/login`
  - Steps: use a private/incognito window so no session cookie exists. Click **Sign in with Google**, pick the
    `paysdoc@gmail.com` account, accept the consent screen if shown.
  - Expected: you are returned to `https://www.paysdoc.nl/dashboard`; heading **My Repositories**; the line
    *Logged in as paysdoc@gmail.com*. The navbar no longer shows **Login** but your Google avatar (or a coloured
    initial) and display name; clicking it opens a menu with **Dashboard** and **Logout**.
  - Not expected: bouncing back to `/login?error=…` (callback URL not registered or `AUTH_GOOGLE_*` wrong), or a
    Google page saying `redirect_uri_mismatch`.

## 2. GitHub login

- [ ] **GitHub login lands on the dashboard**
  - URL: `https://www.paysdoc.nl/login` (sign out first, or use a fresh private window)
  - Steps: click **Sign in with GitHub**, authorise the app if asked.
  - Expected: same as Google — `/dashboard`, *Logged in as <the email GitHub reports>*, avatar + name in the
    navbar with a **Dashboard / Logout** menu. If the GitHub account uses `paysdoc@gmail.com` as its primary email
    the role is admin; otherwise it is a client (useful for item 6).
  - Not expected: `/login?error=OAuthCallback` or `OAuthAccountNotLinked` (the latter means the same email already
    exists from another provider; Auth.js refuses to link automatically).

## 3. Magic link

The automated check on 2026-09-16 already sent one real sign-in mail to `paysdoc@gmail.com` (valid until
2026-09-17 10:59 UTC, single use). Either use that mail or request a new one as described.

- [ ] **Email arrives**
  - URL: `https://www.paysdoc.nl/login`
  - Steps: enter `paysdoc@gmail.com` in the email field, click **Send magic link**.
  - Expected: the page changes to `https://www.paysdoc.nl/auth/verify-request?provider=email&type=email` with the
    heading **Check your email**. Within a minute an email with subject **Sign in to paysdoc.nl** from
    `paysdoc.nl <noreply@paysdoc.nl>` arrives at `paysdoc@gmail.com`.
  - If nothing arrives: check the spam folder first. Delivery depends on the Resend DNS records for `paysdoc.nl`
    (SPF, DKIM, MX on `send`, DMARC on `_dmarc`) described in the README under *Magic Link Email Setup → DNS
    configuration*, and on the domain showing as *Verified* at https://resend.com/domains. A redirect to
    `/login?error=…` instead of the *Check your email* page means the email Worker or Resend rejected the request
    (it did not on 2026-09-16).
- [ ] **Link signs you in**
  - Steps: click the button/link in the email (it points at `https://www.paysdoc.nl/api/auth/callback/email?…`).
  - Expected: you land on `https://www.paysdoc.nl/dashboard` with *Logged in as paysdoc@gmail.com*; the navbar shows
    the signed-in state with a coloured **P** initial (email sign-ins have no avatar image).
- [ ] **Second click is rejected**
  - Steps: sign out (item 6) or open a second private window, then click the same link in the same email again.
  - Expected: you are **not** signed in; the site shows `https://www.paysdoc.nl/login?error=Verification` (the
    token is deleted from D1 on first use, so the second use fails verification). Requesting a fresh link works
    again.

## 4. Dashboard: repository list

Do this while signed in (any provider).

- [ ] **Add a GitHub repository**
  - URL: `https://www.paysdoc.nl/dashboard`
  - Steps: in **Add Repository** enter `https://github.com/paysdoc/paysdoc.nl` and click **Add Repository**.
  - Expected: the button briefly reads *Adding…*, then the entry appears under **Registered Repositories** as
    **paysdoc/paysdoc.nl** with the badge **github** and the URL as a link (opens in a new tab). No *Linked project*
    line is expected, because the production `projects` table has no row for that URL.
- [ ] **Remove it**
  - Steps: click **Remove** on the entry.
  - Expected: the entry disappears and the list shows *No repositories yet.* (assuming it was the only one).
- [ ] **Invalid URL shows an error**
  - Steps (browser validation): type `not a url` and click **Add Repository**.
  - Expected: the browser blocks the submit with its own *Please enter a URL* tooltip; nothing is sent.
  - Steps (server validation): type `https://example.com/foo/bar` (a valid URL that is not `github.com` or
    `gitlab.com`) and click **Add Repository**.
  - Expected: the server action rejects it with *Invalid GitHub or GitLab URL* and no entry is added. Because the
    app has no `error.tsx` boundary yet, production shows Next.js's generic *Application error* screen rather than
    the message text; reloading `/dashboard` shows the unchanged list. That is the current, known behaviour — a
    friendlier inline error is a follow-up, not a deploy failure. Adding the same repository twice also errors
    (unique index on user + URL).

## 5. Admin: cost per project

- [ ] **Admin sees the cost page**
  - URL: `https://www.paysdoc.nl/admin`, signed in as `paysdoc@gmail.com` (Google or magic link)
  - Expected: heading **Cost per Project** with `paysdoc@gmail.com` at the top right. **Expected body on
    2026-09-16: the empty state *No projects found.*** — the Phase 02 schema check found `projects`,
    `cost_records` and `token_usage` missing in production; the migrations created them empty, and a
    `d1-query` on 2026-09-16 11:15 UTC ([run 35089336685](https://github.com/paysdoc/paysdoc.nl/actions/runs/35089336685))
    returned `projects` **0**, `cost_records` **0**, `client_repos` 0, `users` 0, `verification_tokens` 1. Cost
    cards only appear once the cost worker behind `costs.paysdoc.nl` (or a manual insert) writes rows into
    `projects` / `cost_records`; if you see cards instead, that is also fine and means data has arrived since.
  - Not expected: a redirect to `/dashboard` (would mean the role resolved to `client`: the signed-in email is not
    in `src/lib/roles.ts`) or an *Application error* page (would mean the tables are missing — check
    `d1-schema` via the ops workflow).
- [ ] **Non-admin is redirected**
  - URL: `https://www.paysdoc.nl/admin`, signed in with an account whose email is **not** `paysdoc@gmail.com` or
    `martin@paysdoc.nl` (for example a second GitHub account, or a magic link to another mailbox you control).
  - Expected: immediate redirect to `https://www.paysdoc.nl/dashboard`; the admin page never renders.
- [ ] **Signed-out visitor is redirected to login**
  - URL: `https://www.paysdoc.nl/admin` in a private window.
  - Expected: redirect to `https://www.paysdoc.nl/login` (already verified automatically; re-check only if you
    changed the middleware).

## 6. Sign out

- [ ] **Logout returns to the public site and re-locks the dashboard**
  - Steps: open the avatar/name menu in the navbar and click **Logout**.
  - Expected: you land on `https://www.paysdoc.nl/` (the home page) and the navbar shows **Login** again. Now open
    `https://www.paysdoc.nl/dashboard` directly: it redirects to `https://www.paysdoc.nl/login`. Opening
    `https://www.paysdoc.nl/login` while still signed in instead redirects to `/dashboard`.

## 7. Mobile, on a real phone

The smoke test screenshots a 375 px viewport in headless Chromium; touch behaviour, real fonts and the on-screen
keyboard need a device. Use the phone's own browser over mobile data as well as Wi-Fi if possible.

- [ ] **Navbar**
  - URL: `https://www.paysdoc.nl/`
  - Expected: logo + **PAYSDOC / consultancy** on the left, a hamburger button on the right, no desktop links
    visible. Tapping the hamburger opens a panel with **Home, About, Services, How It Works, Contact, Login** (or
    your name, **Dashboard**, **Logout** when signed in); tapping a link closes it and navigates; the icon toggles
    to an X while open. Nothing overflows horizontally.
- [ ] **Hero**
  - Expected: the home hero headline wraps without clipping, the call-to-action button is fully tappable, the
    text stays readable without pinch-zoom.
- [ ] **Interest form**
  - URL: `https://www.paysdoc.nl/contact` (the same form is at the bottom of `/how-it-works`)
  - Steps: tap the email field (keyboard should be the email layout), enter an address you can identify later, submit.
  - Expected: the form is replaced by *Thanks! We'll be in touch.*; the button and input do not overflow the
    screen; the entry lands in the `INTEREST_KV` namespace (`kv-keys` via the ops workflow if you want proof).
- [ ] **Footer**
  - Expected: LinkedIn and GitHub links and the copyright line stack cleanly at the bottom of every page and are
    tappable; the `mailto:info@paysdoc.nl` link on `/contact` opens the mail app.
- [ ] **Login page on the phone**
  - URL: `https://www.paysdoc.nl/login`
  - Expected: the three buttons and the email field fit the width; a Google or GitHub sign-in completes on the
    phone and lands on `/dashboard` with the mobile signed-in menu.

## Reporting

Record the date, browser/phone and the outcome of each section as a comment on the GitHub issue that tracks the
production verification, or append a dated *Manual verification* section to [[Production-Smoke-Test]]. Anything
that failed goes into `.maestro/playbooks/Working/hitl.md` (local) or a new issue with the exact URL, the account
used and what was shown instead of the expected result.
