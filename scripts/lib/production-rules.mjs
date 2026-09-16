/**
 * Pure rules for the `--production` mode of `scripts/smoke.mjs`.
 *
 * Kept free of Playwright so they can be unit-tested with vitest
 * (`scripts/lib/__tests__/production-rules.test.mjs`).
 */

/** The only origin production pages may advertise and load from. */
export const PRODUCTION_ORIGIN = 'https://www.paysdoc.nl';

/** Hosts of the retired Cloudflare Pages project; nothing may be fetched from them any more. */
const LEGACY_HOST_SUFFIX = 'pages.dev';

/**
 * Why a page's `og:url` is unacceptable in production, or `null` when it is fine.
 * It must be absolute and start with the production origin, so shared links
 * never point at a preview host or a relative path.
 */
export function ogUrlProblem(ogUrl) {
  if (!ogUrl) return 'missing og:url';
  if (!ogUrl.startsWith(PRODUCTION_ORIGIN)) {
    return `og:url "${ogUrl}" does not start with ${PRODUCTION_ORIGIN}`;
  }
  return null;
}

/**
 * Why a request made while rendering a page is unacceptable in production, or
 * `null` when it is fine: nothing may go over plain http and nothing may come
 * from the old `*.pages.dev` project. Non-http(s) schemes (data:, blob:) are ignored.
 */
export function requestProblem(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return `unparseable request URL "${url}"`;
  }
  if (parsed.protocol === 'http:') return `served over plain http: ${url}`;
  if (parsed.protocol !== 'https:') return null;
  const host = parsed.hostname.toLowerCase();
  if (host === LEGACY_HOST_SUFFIX || host.endsWith(`.${LEGACY_HOST_SUFFIX}`)) {
    return `served from the retired Pages project: ${url}`;
  }
  return null;
}

/** Every problem found in a list of request URLs (deduplicated, in first-seen order). */
export function requestProblems(urls) {
  const seen = new Set();
  const out = [];
  for (const url of urls) {
    const problem = requestProblem(url);
    if (problem && !seen.has(problem)) {
      seen.add(problem);
      out.push(problem);
    }
  }
  return out;
}
