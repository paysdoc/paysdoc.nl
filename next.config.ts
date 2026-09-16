import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

// Both www.paysdoc.nl and the apex are routed to this Worker (wrangler.jsonc
// `routes`); www is canonical, so the apex is redirected permanently.
//
// Two OpenNext (the Cloudflare runtime) quirks shape these rules:
// - it tests the `has` host value as an *unanchored* regex, so a bare
//   'paysdoc.nl' also matches 'www.paysdoc.nl' and loops; hence the anchors.
// - it only compiles the destination when the source captured a param, so a
//   single '/:path*' rule sends '/' to the literal '/:path*'; hence '/' and
//   '/:path+' are separate rules.
const APEX_HOST = { type: 'host', value: '^paysdoc\\.nl$' } as const;
// Cloudflare sets x-forwarded-proto to the scheme the visitor used. The zone's
// "Always Use HTTPS" setting is off, so plain-http requests reach the Worker
// and are upgraded here. Anchored for the same unanchored-regex reason: a bare
// 'http' would also match 'https' and loop.
const PLAIN_HTTP = { type: 'header', key: 'x-forwarded-proto', value: '^http$' } as const;
const WWW_ORIGIN = 'https://www.paysdoc.nl';

// Security headers for every response the Worker renders. Static assets
// (`/_next/static/*`, `/favicon.ico`, files in `public/`) are served by the
// Workers assets binding before this code runs and do not get them.
// HSTS is deliberately without `includeSubDomains`/`preload`: the header is
// only ever sent from www, and other paysdoc.nl hosts are not ours to commit.
const SECURITY_HEADERS = [
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
];

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  async redirects() {
    return [
      { source: '/', has: [APEX_HOST], destination: `${WWW_ORIGIN}/`, permanent: true },
      { source: '/:path+', has: [APEX_HOST], destination: `${WWW_ORIGIN}/:path+`, permanent: true },
      { source: '/', has: [PLAIN_HTTP], destination: `${WWW_ORIGIN}/`, permanent: true },
      { source: '/:path+', has: [PLAIN_HTTP], destination: `${WWW_ORIGIN}/:path+`, permanent: true },
    ];
  },
  async headers() {
    return [{ source: '/:path*', headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
