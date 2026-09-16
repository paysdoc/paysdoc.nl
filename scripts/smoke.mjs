#!/usr/bin/env node
/**
 * Reusable end-to-end smoke test for paysdoc.nl.
 *
 * Runs against any deployment (local `npm run preview`, a workers.dev URL, or
 * production) and asserts the checks spelled out in `e2e-tests/*.md`:
 * public pages load cleanly, branding assets and fonts resolve, page metadata
 * is present, the interest form and its API work, auth wiring is in place and
 * pages fit a mobile viewport.
 *
 * Usage:
 *   BASE_URL=http://localhost:8788 npm run smoke     (default BASE_URL)
 *   BASE_URL=https://www.paysdoc.nl npm run smoke
 *   BASE_URL=https://www.paysdoc.nl npm run smoke -- --production
 *
 * `--production` adds the checks that only make sense on the real domain:
 * every public page advertises an `og:url` on https://www.paysdoc.nl, its
 * `link[rel=icon]` fetches with 200, and no request made while rendering any
 * page (in every check, desktop and mobile) goes over plain http or to the
 * retired *.pages.dev project. The rules live in scripts/lib/production-rules.mjs.
 *
 * Output:
 *   .maestro/playbooks/Initiation/Working/smoke-<timestamp>.json  (report)
 *   .maestro/playbooks/Initiation/Working/screenshots/*.png       (screenshots)
 *   Override the output folder with SMOKE_OUT_DIR.
 *
 * Every check (and the top-level report) uses the shape from e2e-tests/*.md:
 *   { test_name, status: "passed" | "failed", screenshots: string[], error: string | null }
 *
 * Exit code is 1 when any check fails, so this can gate a deploy.
 */

import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { PRODUCTION_ORIGIN, ogUrlProblem, requestProblems } from './lib/production-rules.mjs';

const BASE_URL = (process.env.BASE_URL ?? 'http://localhost:8788').replace(/\/+$/, '');
const PRODUCTION = process.argv.includes('--production');
const OUT_DIR = path.resolve(
  process.env.SMOKE_OUT_DIR ?? '.maestro/playbooks/Initiation/Working'
);
const SCREENSHOT_DIR = path.join(OUT_DIR, 'screenshots');
const RUN_STAMP = new Date().toISOString().replace(/[:.]/g, '-');
const REPORT_PATH = path.join(OUT_DIR, `smoke-${RUN_STAMP}.json`);

const DESKTOP_VIEWPORT = { width: 1280, height: 800 };
const MOBILE_VIEWPORT = { width: 390, height: 844 };
const ACTION_TIMEOUT_MS = 15_000;
const NETWORK_IDLE_TIMEOUT_MS = 5_000;

const PUBLIC_PAGES = [
  '/',
  '/about',
  '/services',
  '/how-it-works',
  '/contact',
  '/login',
  '/auth/verify-request',
];

const BRAND_ASSETS = [
  '/fonts/EuphemiaUCAS-Regular.ttf',
  '/logo-simpel.png',
  '/images/headshot.jpg',
];

const EXPECTED_FOREGROUND = '#1a0a1e';
const EXPECTED_FONT = 'Euphemia UCAS';
const EXPECTED_PROVIDERS = ['google', 'github', 'email'];
const PROTECTED_PAGES = ['/dashboard', '/admin'];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Turn a route into a filesystem-safe slug ("/" → "home", "/how-it-works" → "how-it-works"). */
function slug(route) {
  return route === '/' ? 'home' : route.replace(/^\//, '').replace(/[^a-z0-9]+/gi, '-');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

/** Path stored in the report: relative to the repo root so it is stable across machines. */
function reportPath(absolutePath) {
  return path.relative(process.cwd(), absolutePath);
}

/**
 * Attach console / network listeners to a page and return a collector whose
 * `problems()` lists everything that should fail a clean page load.
 * Aborted requests (client-side navigation cancelling prefetches) are not failures.
 */
function watchPage(page) {
  const consoleErrors = [];
  const failedRequests = [];
  const requestUrls = [];

  page.on('request', (req) => {
    requestUrls.push(req.url());
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => {
    consoleErrors.push(`Uncaught: ${err.message}`);
  });
  page.on('requestfailed', (req) => {
    const reason = req.failure()?.errorText ?? 'unknown';
    if (reason.includes('ERR_ABORTED')) return;
    failedRequests.push(`${req.method()} ${req.url()} → ${reason}`);
  });
  page.on('response', (res) => {
    if (res.status() >= 400) {
      failedRequests.push(`${res.request().method()} ${res.url()} → HTTP ${res.status()}`);
    }
  });

  return {
    /** Every URL requested since the watcher was attached (document, assets, XHR). */
    requestUrls() {
      return [...requestUrls];
    },
    problems() {
      const out = [];
      if (consoleErrors.length) out.push(`console errors: ${JSON.stringify(consoleErrors)}`);
      if (failedRequests.length) out.push(`failed requests: ${JSON.stringify(failedRequests)}`);
      if (PRODUCTION) {
        const insecure = requestProblems(requestUrls);
        if (insecure.length) out.push(`insecure or legacy requests: ${JSON.stringify(insecure)}`);
      }
      return out;
    },
  };
}

/** Navigate, wait for the network to settle, and assert the document itself returned 200. */
async function loadPage(page, route) {
  const response = await page.goto(BASE_URL + route, { waitUntil: 'load' });
  assert(response, `${route}: no response`);
  assert(response.status() === 200, `${route}: expected HTTP 200, got ${response.status()}`);
  await page.waitForLoadState('networkidle', { timeout: NETWORK_IDLE_TIMEOUT_MS }).catch(() => {});
  return response;
}

async function screenshot(page, name, options = {}) {
  const file = path.join(SCREENSHOT_DIR, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true, ...options });
  return reportPath(file);
}

/** Read the metadata tags that must exist on every page. */
async function readMetadata(page) {
  return page.evaluate(() => ({
    title: document.title?.trim() ?? '',
    description: document.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() ?? '',
    ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content')?.trim() ?? '',
  }));
}

// ---------------------------------------------------------------------------
// Checks: each is `async (ctx) => string[]` returning screenshot paths.
// ---------------------------------------------------------------------------

function pageLoadCheck(route, viewportName) {
  return async ({ context }) => {
    const page = await context.newPage();
    try {
      const watcher = watchPage(page);
      await loadPage(page, route);
      const shots = [await screenshot(page, `${viewportName}-${slug(route)}`)];
      const problems = watcher.problems();
      assert(problems.length === 0, `${route}: ${problems.join('; ')}`);
      return shots;
    } finally {
      await page.close();
    }
  };
}

function metadataCheck(route) {
  return async ({ context }) => {
    const page = await context.newPage();
    try {
      await loadPage(page, route);
      const meta = await readMetadata(page);
      const missing = Object.entries(meta)
        .filter(([, value]) => !value)
        .map(([key]) => key);
      assert(missing.length === 0, `${route}: missing/empty ${missing.join(', ')} (got ${JSON.stringify(meta)})`);
      return [];
    } finally {
      await page.close();
    }
  };
}

async function brandingCheck({ context }) {
  const page = await context.newPage();
  try {
    await loadPage(page, '/');

    const { fontFamily, foreground } = await page.evaluate(() => ({
      fontFamily: getComputedStyle(document.body).fontFamily,
      foreground: getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim(),
    }));
    assert(fontFamily.includes(EXPECTED_FONT), `body font-family "${fontFamily}" does not include "${EXPECTED_FONT}"`);
    assert(
      foreground.toLowerCase() === EXPECTED_FOREGROUND,
      `--foreground resolved to "${foreground}", expected "${EXPECTED_FOREGROUND}"`
    );

    const logo = page.locator('nav img[alt="Paysdoc logo"]');
    await logo.first().waitFor({ state: 'visible' });
    const headshot = page.locator('img[src*="headshot"]');
    await headshot.first().waitFor({ state: 'visible' });

    const shots = [
      await screenshot(page, 'branding-navbar', { fullPage: false, clip: { x: 0, y: 0, width: 1280, height: 64 } }),
      await screenshot(page, 'branding-hero', { fullPage: false }),
    ];

    for (const asset of BRAND_ASSETS) {
      const res = await context.request.get(BASE_URL + asset);
      assert(res.status() === 200, `${asset}: expected HTTP 200, got ${res.status()}`);
    }
    return shots;
  } finally {
    await page.close();
  }
}

async function interestFormCheck({ context, runStamp }) {
  const page = await context.newPage();
  try {
    const watcher = watchPage(page);
    await loadPage(page, '/contact');

    const emailInput = page.locator('form input[type="email"]');
    const submit = page.locator('form button[type="submit"]', { hasText: 'Register interest' });
    await emailInput.waitFor({ state: 'visible' });
    await submit.waitFor({ state: 'visible' });
    assert((await page.locator('iframe').count()) === 0, '/contact: unexpected <iframe> on page');

    const shots = [await screenshot(page, 'interest-form-initial')];

    await emailInput.fill(`smoke+${runStamp}@paysdoc.nl`);
    await submit.click();
    await page.getByText("Thanks! We'll be in touch.").waitFor({ state: 'visible' });
    shots.push(await screenshot(page, 'interest-form-success'));

    const problems = watcher.problems();
    assert(problems.length === 0, `/contact submission: ${problems.join('; ')}`);
    return shots;
  } finally {
    await page.close();
  }
}

async function interestApiCheck({ context, runStamp }) {
  const invalid = await context.request.post(`${BASE_URL}/api/interest`, {
    data: { email: 'not-an-email' },
  });
  assert(invalid.status() === 400, `POST /api/interest (invalid email): expected 400, got ${invalid.status()}`);

  const valid = await context.request.post(`${BASE_URL}/api/interest`, {
    data: { email: `smoke+${runStamp}-api@paysdoc.nl` },
  });
  assert(valid.status() === 201, `POST /api/interest (valid email): expected 201, got ${valid.status()}`);
  return [];
}

async function authProvidersCheck({ context }) {
  const res = await context.request.get(`${BASE_URL}/api/auth/providers`);
  assert(res.status() === 200, `GET /api/auth/providers: expected 200, got ${res.status()}`);
  const providers = await res.json();
  const missing = EXPECTED_PROVIDERS.filter((id) => !(id in providers));
  assert(missing.length === 0, `GET /api/auth/providers: missing ${missing.join(', ')} (got ${Object.keys(providers).join(', ')})`);
  return [];
}

async function loginPageCheck({ context }) {
  const page = await context.newPage();
  try {
    await loadPage(page, '/');
    const loginLink = page.locator('nav a[href="/login"]', { hasText: 'Login' });
    await loginLink.waitFor({ state: 'visible' });
    await loginLink.click();
    await page.waitForURL(`${BASE_URL}/login`);

    for (const label of ['Sign in with Google', 'Sign in with GitHub']) {
      await page.getByRole('button', { name: label }).waitFor({ state: 'visible' });
    }
    return [await screenshot(page, 'auth-login-page')];
  } finally {
    await page.close();
  }
}

function protectedRedirectCheck(route) {
  return async ({ context }) => {
    const page = await context.newPage();
    try {
      await page.goto(BASE_URL + route, { waitUntil: 'load' });
      const finalPath = new URL(page.url()).pathname;
      assert(finalPath === '/login', `${route}: expected to end on /login, ended on ${finalPath}`);
      return [await screenshot(page, `auth-redirect-${slug(route)}`)];
    } finally {
      await page.close();
    }
  };
}

/**
 * Production-only page check: absolute og:url on the production origin, a
 * fetchable favicon, and not a single request over http: or from *.pages.dev.
 */
function productionPageCheck(route) {
  return async ({ context }) => {
    const page = await context.newPage();
    try {
      const watcher = watchPage(page);
      await loadPage(page, route);

      const { ogUrl, iconHref } = await page.evaluate(() => ({
        ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute('content')?.trim() ?? '',
        iconHref: document.querySelector('link[rel="icon"]')?.getAttribute('href')?.trim() ?? '',
      }));

      const ogProblem = ogUrlProblem(ogUrl);
      assert(ogProblem === null, `${route}: ${ogProblem}`);

      assert(iconHref, `${route}: no <link rel="icon"> in the document`);
      const iconUrl = new URL(iconHref, page.url()).toString();
      const icon = await context.request.get(iconUrl);
      assert(icon.status() === 200, `${route}: icon ${iconUrl} returned HTTP ${icon.status()}`);

      const urls = watcher.requestUrls();
      const insecure = requestProblems(urls);
      assert(
        insecure.length === 0,
        `${route}: ${insecure.length} of ${urls.length} requests insecure/legacy: ${JSON.stringify(insecure)}`
      );
      const offOrigin = urls.filter((u) => !u.startsWith(PRODUCTION_ORIGIN + '/') && !u.startsWith('data:'));
      console.log(`    ${route}: og:url=${ogUrl} icon=${icon.status()} requests=${urls.length} (off-origin: ${offOrigin.length})`);
      return [];
    } finally {
      await page.close();
    }
  };
}

function mobileCheck(route) {
  return async ({ mobileContext }) => {
    const page = await mobileContext.newPage();
    try {
      const watcher = watchPage(page);
      await loadPage(page, route);
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const shots = [await screenshot(page, `mobile-${slug(route)}`)];
      assert(
        scrollWidth <= MOBILE_VIEWPORT.width,
        `${route}: horizontal overflow on mobile (scrollWidth ${scrollWidth} > ${MOBILE_VIEWPORT.width})`
      );
      const problems = watcher.problems();
      assert(problems.length === 0, `${route} (mobile): ${problems.join('; ')}`);
      return shots;
    } finally {
      await page.close();
    }
  };
}

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

function buildChecks() {
  const checks = [];
  for (const route of PUBLIC_PAGES) {
    checks.push({ name: `Page load (desktop): ${route}`, run: pageLoadCheck(route, 'desktop') });
  }
  for (const route of PUBLIC_PAGES) {
    checks.push({ name: `Metadata: ${route}`, run: metadataCheck(route) });
  }
  checks.push({ name: 'Branding: font, colours, logo, headshot, assets', run: brandingCheck });
  checks.push({ name: 'Interest form: /contact submission', run: interestFormCheck });
  checks.push({ name: 'Interest API: POST /api/interest validation', run: interestApiCheck });
  checks.push({ name: 'Auth: providers endpoint', run: authProvidersCheck });
  checks.push({ name: 'Auth: login link and OAuth buttons', run: loginPageCheck });
  for (const route of PROTECTED_PAGES) {
    checks.push({ name: `Auth: unauthenticated ${route} redirects to /login`, run: protectedRedirectCheck(route) });
  }
  for (const route of PUBLIC_PAGES) {
    checks.push({ name: `Page load (mobile 390×844): ${route}`, run: mobileCheck(route) });
  }
  if (PRODUCTION) {
    for (const route of PUBLIC_PAGES) {
      checks.push({ name: `Production: og:url, icon and https-only requests on ${route}`, run: productionPageCheck(route) });
    }
  }
  return checks;
}

async function main() {
  await mkdir(SCREENSHOT_DIR, { recursive: true });
  console.log(`Smoke test against ${BASE_URL}${PRODUCTION ? ' (--production)' : ''}`);

  const browser = await chromium.launch();
  const contextOptions = { colorScheme: 'light', ignoreHTTPSErrors: false };
  const context = await browser.newContext({ ...contextOptions, viewport: DESKTOP_VIEWPORT });
  const mobileContext = await browser.newContext({
    ...contextOptions,
    viewport: MOBILE_VIEWPORT,
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  });
  context.setDefaultTimeout(ACTION_TIMEOUT_MS);
  mobileContext.setDefaultTimeout(ACTION_TIMEOUT_MS);

  const env = { context, mobileContext, runStamp: RUN_STAMP };
  const results = [];

  try {
    for (const check of buildChecks()) {
      const result = { test_name: check.name, status: 'passed', screenshots: [], error: null };
      try {
        result.screenshots = await check.run(env);
      } catch (err) {
        result.status = 'failed';
        result.error = err instanceof Error ? err.message : String(err);
      }
      results.push(result);
      console.log(`${result.status === 'passed' ? '✔' : '✘'} ${result.test_name}${result.error ? `\n    ${result.error}` : ''}`);
    }
  } finally {
    await browser.close();
  }

  const failed = results.filter((r) => r.status === 'failed');
  const report = {
    test_name: `paysdoc.nl smoke test (${BASE_URL})`,
    status: failed.length === 0 ? 'passed' : 'failed',
    screenshots: results.flatMap((r) => r.screenshots),
    error: failed.length === 0 ? null : failed.map((r) => `${r.test_name}: ${r.error}`).join('\n'),
    base_url: BASE_URL,
    production: PRODUCTION,
    started_at: RUN_STAMP,
    summary: { total: results.length, passed: results.length - failed.length, failed: failed.length },
    checks: results,
  };

  await writeFile(REPORT_PATH, JSON.stringify(report, null, 2) + '\n');
  console.log(`\n${report.summary.passed}/${report.summary.total} checks passed. Report: ${reportPath(REPORT_PATH)}`);
  process.exitCode = report.status === 'passed' ? 0 : 1;
}

main().catch((err) => {
  console.error('Smoke test crashed:', err);
  process.exitCode = 1;
});
