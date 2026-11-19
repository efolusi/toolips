import { SITE_URL } from "~/lib/api";
import type { MetadataRoute } from "next";

// dev.* is a preview of unreleased work and must never be indexed next to the
// real site, so it disallows everything. Production allows everything except the
// API surface and account-only pages.
export default function robots(): MetadataRoute.Robots {
  const base = SITE_URL;
  if (new URL(base).hostname.startsWith("dev.")) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: [] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
