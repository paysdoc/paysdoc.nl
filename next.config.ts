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
const WWW_ORIGIN = 'https://www.paysdoc.nl';

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  async redirects() {
    return [
      { source: '/', has: [APEX_HOST], destination: `${WWW_ORIGIN}/`, permanent: true },
      { source: '/:path+', has: [APEX_HOST], destination: `${WWW_ORIGIN}/:path+`, permanent: true },
    ];
  },
};

export default nextConfig;
