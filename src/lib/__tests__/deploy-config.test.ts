import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import nextConfig from '../../../next.config';

const root = path.resolve(__dirname, '../../..');

// wrangler.jsonc allows comments; strip them before parsing.
function readWranglerConfig(): { routes?: { pattern: string; zone_name: string }[] } {
  const raw = fs.readFileSync(path.join(root, 'wrangler.jsonc'), 'utf8');
  return JSON.parse(raw.replace(/^\s*\/\/.*$/gm, ''));
}

describe('custom domain deploy config', () => {
  it('routes both www.paysdoc.nl and the apex to the Worker on the paysdoc.nl zone', () => {
    const { routes } = readWranglerConfig();
    expect(routes).toEqual([
      { pattern: 'www.paysdoc.nl/*', zone_name: 'paysdoc.nl' },
      { pattern: 'paysdoc.nl/*', zone_name: 'paysdoc.nl' },
    ]);
  });

  it('permanently redirects the apex root and every apex path to www, preserving the path', async () => {
    const redirects = await nextConfig.redirects!();
    const apexHost = { type: 'host', value: '^paysdoc\\.nl$' };
    const plainHttp = { type: 'header', key: 'x-forwarded-proto', value: '^http$' };
    expect(redirects).toEqual([
      { source: '/', has: [apexHost], destination: 'https://www.paysdoc.nl/', permanent: true },
      { source: '/:path+', has: [apexHost], destination: 'https://www.paysdoc.nl/:path+', permanent: true },
      { source: '/', has: [plainHttp], destination: 'https://www.paysdoc.nl/', permanent: true },
      { source: '/:path+', has: [plainHttp], destination: 'https://www.paysdoc.nl/:path+', permanent: true },
    ]);
  });

  it('upgrades plain-http requests to https without matching https itself under OpenNext', async () => {
    const redirects = await nextConfig.redirects!();
    const httpRules = redirects.filter((r) => r.has?.some((h) => h.type === 'header'));
    expect(httpRules).toHaveLength(2);
    for (const rule of httpRules) {
      const [{ key, value }] = rule.has!;
      expect(key).toBe('x-forwarded-proto');
      expect(rule.destination.startsWith('https://www.paysdoc.nl/')).toBe(true);
      for (const re of [new RegExp(value!), new RegExp(`^${value}$`)]) {
        expect(re.test('http')).toBe(true);
        expect(re.test('https')).toBe(false);
      }
    }
  });

  it('anchors the apex host match so www does not redirect to itself under OpenNext', async () => {
    // OpenNext tests `has.value` with an unanchored `new RegExp(value)`; Next.js
    // wraps it as `^value$`. The value must match only the bare apex under both.
    const [{ has }] = await nextConfig.redirects!();
    const value = has![0].value!;
    for (const re of [new RegExp(value), new RegExp(`^${value}$`)]) {
      expect(re.test('paysdoc.nl')).toBe(true);
      expect(re.test('www.paysdoc.nl')).toBe(false);
      expect(re.test('paysdoc-nl.paysdoc.workers.dev')).toBe(false);
    }
  });

  it('uses www.paysdoc.nl as metadataBase so og:url resolves to the canonical host', () => {
    const layout = fs.readFileSync(path.join(root, 'src/app/layout.tsx'), 'utf8');
    expect(layout).toMatch(/metadataBase:\s*new URL\('https:\/\/www\.paysdoc\.nl'\)/);
  });

  it('sends HSTS, nosniff and a referrer policy on every rendered response', async () => {
    const headers = await nextConfig.headers!();
    expect(headers).toHaveLength(1);
    const [{ source, headers: entries }] = headers;
    expect(source).toBe('/:path*');
    expect(entries).toEqual([
      { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    ]);
    // OpenNext compiles header values with path-to-regexp; a ':' would be read as a param.
    for (const { key, value } of entries) {
      expect(key).not.toMatch(/:/);
      expect(value).not.toMatch(/:/);
    }
  });
});
