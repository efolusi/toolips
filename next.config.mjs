import { localeRewrites } from "./locale-rewrites.mjs";
import { unknownSlugRewrites } from "./unknown-slug-rewrites.mjs";

/** @type {import('next').NextConfig} */
const config = {
  // Gate the build on type AND lint correctness. The whole tree typechecks
  // clean (the defineTool generic fix cleared the old 3rd-party-generic noise)
  // and `eslint .` reports 0 errors, so these no longer need to be suppressed —
  // a regression that breaks types or trips a bug-class lint rule now fails the
  // build instead of shipping.
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
  experimental: { optimizePackageImports: ["@efolusi/meridian"] },
  poweredByHeader: false,
  reactStrictMode: true,
  async rewrites() {
    // beforeFiles: runs after the middleware (which sets x-locale) and before
    // the filesystem, so /id/pricing resolves to the /pricing route.
    // Unknown tool ids and blog slugs go first, to a path no route serves, so
    // they get the server-rendered 404 (unknown-slug-rewrites.mjs says why).
    return { beforeFiles: [...unknownSlugRewrites(), ...localeRewrites()], afterFiles: [], fallback: [] };
  },
  async headers() {
    // Defense-in-depth security headers on every response. The
    // Content-Security-Policy is NOT set here — it's built per-request in
    // middleware (src/middleware.ts → lib/csp.ts) so production can carry a
    // fresh nonce and drop 'unsafe-inline' from script-src. The static headers
    // below have no per-request component and stay here.
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default config;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
if (process.env.NODE_ENV === "development") initOpenNextCloudflareForDev();
