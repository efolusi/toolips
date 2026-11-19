// Unknown tool ids and blog slugs, routed to the branded 404 before any page runs.
//
// Next 15 renders a notFound() thrown from a page (tool/[id], blog/[slug]) as an
// empty `<html id="__next_error__">` document: the branded 404 only appears once
// JavaScript has run, and crawlers and no-JS readers get a blank page. A path
// that matches no route at all is served by app/not-found.tsx on the server,
// with the right language. So an id or slug that does not exist is rewritten to
// a path no route matches, and the pages' own notFound() stays as a backstop.
//
// The known ids are read from the sources at build time: the catalog in
// @toolips/tool-core and the markdown files in content/blog. The catalog is a
// TypeScript file that next.config cannot import, so its ids are read as text;
// src/__tests__/unknown-slug-rewrites.test.ts checks the result against TOOLS.

import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const CATALOG = join(HERE, "src", "lib", "core", "catalog.ts");
const BLOG_DIR = join(HERE, "content", "blog");

/** A path no route serves, so app/not-found.tsx answers it. */
export const NOT_FOUND_DESTINATION = "/__not-found";

/** Every tool id in the catalog, in catalog order. */
export function catalogToolIds(source = readFileSync(CATALOG, "utf8")) {
  return [...source.matchAll(/^\s*\{\s*id:\s*"([a-z0-9-]+)"/gm)].map((m) => m[1]);
}

/** Every blog slug: the markdown file names in content/blog. */
export function blogSlugs(dir = BLOG_DIR) {
  try {
    return readdirSync(dir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.slice(0, -3));
  } catch {
    return [];
  }
}

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** `:name` that matches one path segment that is not in `known`. */
function unknownSegment(name, known) {
  if (known.length === 0) return `:${name}([^/]+)`;
  return `:${name}((?!(?:${known.map(escape).join("|")})/?$)[^/]+)`;
}

export function unknownSlugRewrites({ slugs = blogSlugs() } = {}) {
  const sections = [
    ["blog", unknownSegment("slug", slugs)],
  ];
  return sections.flatMap(([section, segment]) => [
    { source: `/${section}/${segment}`, destination: NOT_FOUND_DESTINATION },
    { source: `/:locale(en|id)/${section}/${segment}`, destination: NOT_FOUND_DESTINATION },
  ]);
}
