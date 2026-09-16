#!/usr/bin/env node
/**
 * Broken-link crawl for the public pages of paysdoc.nl.
 *
 * Loads each public page in Chromium, collects every `<a href>` and checks:
 *   - internal links (same origin) answer HTTP 200 directly (no redirect),
 *     and a fragment, if any, exists as an element id on the target page
 *   - same-page anchors point at an existing element id
 *   - the required external destinations (LinkedIn, GitHub, a mailto address)
 *     are present somewhere in the crawl; external links are not fetched
 * Rules live in scripts/lib/link-rules.mjs.
 *
 * Usage:
 *   BASE_URL=https://www.paysdoc.nl npm run check-links
 *   (BASE_URL defaults to http://localhost:8788, like scripts/smoke.mjs)
 *
 * Output: <SMOKE_OUT_DIR>/links-<timestamp>.json, same folder and check shape
 * as the smoke report. Exit code is 1 when any check fails.
 */

import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { classifyLink, internalLinkProblem, missingExternal } from './lib/link-rules.mjs';

const BASE_URL = (process.env.BASE_URL ?? 'http://localhost:8788').replace(/\/+$/, '');
const OUT_DIR = path.resolve(process.env.SMOKE_OUT_DIR ?? '.maestro/playbooks/Initiation/Working');
const RUN_STAMP = new Date().toISOString().replace(/[:.]/g, '-');
const REPORT_PATH = path.join(OUT_DIR, `links-${RUN_STAMP}.json`);
const TIMEOUT_MS = 15_000;

/** The public marketing pages; auth pages are covered by scripts/smoke.mjs. */
const PUBLIC_PAGES = ['/', '/about', '/services', '/how-it-works', '/contact'];

/** Read every anchor on the page: raw href attribute, visible text and where it sits. */
async function collectAnchors(page) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll('a[href]')).map((a) => ({
      href: a.getAttribute('href') ?? '',
      text: (a.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 60),
    }))
  );
}

/** Fetch an internal URL without following redirects and return status + Location. */
async function probe(request, url) {
  const res = await request.get(url, { maxRedirects: 0, timeout: TIMEOUT_MS });
  return { status: res.status(), location: res.headers()['location'] ?? null };
}

/** Whether an element with this id exists on the page currently loaded in `page`. */
async function hasId(page, id) {
  return page.evaluate((i) => document.getElementById(i) !== null, id);
}

async function crawlPage({ context, request, route, hashCache }) {
  const page = await context.newPage();
  try {
    const pageUrl = BASE_URL + route;
    const response = await page.goto(pageUrl, { waitUntil: 'load' });
    if (!response || response.status() !== 200) {
      throw new Error(`${route}: page itself returned HTTP ${response?.status() ?? 'none'}`);
    }
    const anchors = await collectAnchors(page);
    const seen = new Map();
    for (const { href, text } of anchors) {
      const link = classifyLink(href, pageUrl, BASE_URL);
      const key = `${link.kind} ${link.url ?? link.href}`;
      if (!seen.has(key)) seen.set(key, { ...link, text, problem: null });
    }
    const links = [...seen.values()];

    for (const link of links) {
      if (link.kind === 'internal') {
        const target = link.url.split('#')[0];
        link.problem = internalLinkProblem(await probe(request, target));
        if (!link.problem && link.hash) {
          if (!hashCache.has(target)) {
            const p = await context.newPage();
            try {
              await p.goto(target, { waitUntil: 'load' });
              hashCache.set(target, new Set(await p.evaluate(() => Array.from(document.querySelectorAll('[id]')).map((e) => e.id))));
            } finally {
              await p.close();
            }
          }
          if (!hashCache.get(target).has(link.hash)) link.problem = `no element with id "${link.hash}" on ${target}`;
        }
      } else if (link.kind === 'anchor') {
        if (!(await hasId(page, link.hash))) link.problem = `no element with id "${link.hash}" on this page`;
      } else if (link.kind === 'other') {
        link.problem = `unexpected href "${link.href}"`;
      }
    }

    const broken = links.filter((l) => l.problem);
    if (broken.length) {
      throw Object.assign(new Error(`${route}: ${broken.map((l) => `${l.href} → ${l.problem}`).join('; ')}`), { links });
    }
    return links;
  } finally {
    await page.close();
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  console.log(`Link crawl against ${BASE_URL}`);

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  context.setDefaultTimeout(TIMEOUT_MS);
  const request = context.request;
  const hashCache = new Map();
  const results = [];
  const allLinks = [];

  try {
    for (const route of PUBLIC_PAGES) {
      const result = { test_name: `Links: ${route}`, status: 'passed', screenshots: [], error: null, links: [] };
      try {
        result.links = await crawlPage({ context, request, route, hashCache });
      } catch (err) {
        result.status = 'failed';
        result.error = err instanceof Error ? err.message : String(err);
        result.links = err?.links ?? [];
      }
      allLinks.push(...result.links.map((l) => ({ page: route, ...l })));
      results.push(result);
      const counts = result.links.reduce((acc, l) => ((acc[l.kind] = (acc[l.kind] ?? 0) + 1), acc), {});
      console.log(`${result.status === 'passed' ? '✔' : '✘'} ${result.test_name} ${JSON.stringify(counts)}${result.error ? `\n    ${result.error}` : ''}`);
    }
  } finally {
    await browser.close();
  }

  const missing = missingExternal(allLinks);
  const externalCheck = {
    test_name: 'Links: required external destinations present (LinkedIn, GitHub, mailto)',
    status: missing.length === 0 ? 'passed' : 'failed',
    screenshots: [],
    error: missing.length === 0 ? null : `missing: ${missing.join(', ')}`,
    links: allLinks.filter((l) => l.kind === 'external' || l.kind === 'mailto' || l.kind === 'tel'),
  };
  results.push(externalCheck);
  console.log(`${externalCheck.status === 'passed' ? '✔' : '✘'} ${externalCheck.test_name}${externalCheck.error ? `\n    ${externalCheck.error}` : ''}`);

  const failed = results.filter((r) => r.status === 'failed');
  const report = {
    test_name: `paysdoc.nl link crawl (${BASE_URL})`,
    status: failed.length === 0 ? 'passed' : 'failed',
    screenshots: [],
    error: failed.length === 0 ? null : failed.map((r) => `${r.test_name}: ${r.error}`).join('\n'),
    base_url: BASE_URL,
    started_at: RUN_STAMP,
    pages: PUBLIC_PAGES,
    summary: {
      total: results.length,
      passed: results.length - failed.length,
      failed: failed.length,
      links: allLinks.length,
      internal: allLinks.filter((l) => l.kind === 'internal').length,
    },
    checks: results,
  };

  await writeFile(REPORT_PATH, JSON.stringify(report, null, 2) + '\n');
  console.log(`\n${report.summary.passed}/${report.summary.total} checks passed. Report: ${path.relative(process.cwd(), REPORT_PATH)}`);
  process.exitCode = report.status === 'passed' ? 0 : 1;
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
