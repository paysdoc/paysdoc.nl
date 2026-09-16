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

  it('permanently redirects every apex path to www, preserving the path', async () => {
    const redirects = await nextConfig.redirects!();
    expect(redirects).toHaveLength(1);
    expect(redirects[0]).toEqual({
      source: '/:path*',
      has: [{ type: 'host', value: 'paysdoc.nl' }],
      destination: 'https://www.paysdoc.nl/:path*',
      permanent: true,
    });
  });

  it('uses www.paysdoc.nl as metadataBase so og:url resolves to the canonical host', () => {
    const layout = fs.readFileSync(path.join(root, 'src/app/layout.tsx'), 'utf8');
    expect(layout).toMatch(/metadataBase:\s*new URL\('https:\/\/www\.paysdoc\.nl'\)/);
  });
});
