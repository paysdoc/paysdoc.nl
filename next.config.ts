import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  // Both www.paysdoc.nl and the apex are routed to this Worker (wrangler.jsonc
  // `routes`); www is canonical, so the apex is redirected permanently.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'paysdoc.nl' }],
        destination: 'https://www.paysdoc.nl/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
