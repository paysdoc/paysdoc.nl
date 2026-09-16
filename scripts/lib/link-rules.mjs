/**
 * Pure rules for `scripts/check-links.mjs` (the broken-link crawl).
 *
 * Kept free of Playwright so they can be unit-tested with vitest
 * (`scripts/lib/__tests__/link-rules.test.mjs`).
 */

/**
 * External destinations every crawl must find at least once across the public
 * pages. They are not fetched (LinkedIn and GitHub rate-limit or block bots,
 * mailto has nothing to fetch); their presence is the check.
 */
export const REQUIRED_EXTERNAL = [
  { name: 'LinkedIn', matches: (link) => link.kind === 'external' && hostIs(link.url, 'linkedin.com') },
  { name: 'GitHub', matches: (link) => link.kind === 'external' && hostIs(link.url, 'github.com') },
  { name: 'mailto', matches: (link) => link.kind === 'mailto' },
];

function hostIs(url, domain) {
  const host = new URL(url).hostname.toLowerCase();
  return host === domain || host.endsWith(`.${domain}`);
}

/**
 * Classify one `href` found on `pageUrl`:
 *   internal  – same origin as `origin` (relative hrefs resolve here); fetched and must be 200
 *   anchor    – same page, hash only; the target id must exist on the page
 *   external  – another http(s) origin; only presence is checked
 *   mailto / tel – presence only
 *   other     – javascript:, data:, empty …; reported so nothing slips through unnoticed
 * `url` is always the absolute form; `hash` is the fragment without `#` (or null).
 */
export function classifyLink(href, pageUrl, origin) {
  const raw = (href ?? '').trim();
  if (raw === '' || raw === '#') return { kind: 'other', href: raw, url: null, hash: null };
  if (raw.startsWith('#')) {
    return { kind: 'anchor', href: raw, url: new URL(raw, pageUrl).href, hash: raw.slice(1) };
  }
  let parsed;
  try {
    parsed = new URL(raw, pageUrl);
  } catch {
    return { kind: 'other', href: raw, url: null, hash: null };
  }
  if (parsed.protocol === 'mailto:') return { kind: 'mailto', href: raw, url: parsed.href, hash: null };
  if (parsed.protocol === 'tel:') return { kind: 'tel', href: raw, url: parsed.href, hash: null };
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { kind: 'other', href: raw, url: parsed.href, hash: null };
  }
  const hash = parsed.hash ? parsed.hash.slice(1) : null;
  const kind = parsed.origin === new URL(origin).origin ? 'internal' : 'external';
  return { kind, href: raw, url: parsed.href, hash };
}

/**
 * Why an internal link's HTTP result is unacceptable, or `null` when it is fine.
 * A link must answer 200 directly: a redirect means the markup points at a
 * stale path even if the visitor eventually lands somewhere.
 */
export function internalLinkProblem({ status, location }) {
  if (status === 200) return null;
  if (status >= 300 && status < 400) return `redirects (${status}) to ${location ?? 'unknown'}`;
  return `HTTP ${status}`;
}

/** Names of the required external destinations that no crawled link satisfies. */
export function missingExternal(links) {
  return REQUIRED_EXTERNAL.filter((req) => !links.some((l) => req.matches(l))).map((r) => r.name);
}
