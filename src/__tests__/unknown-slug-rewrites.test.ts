// @ts-expect-error Next ships this compiled dependency without types.
import { pathToRegexp } from "next/dist/compiled/path-to-regexp";
import { TOOLS } from "~/lib/core/catalog";
import { describe, expect, it } from "vitest";

import { getAllPosts } from "../lib/blog";
import {
  blogSlugs,
  catalogToolIds,
  NOT_FOUND_DESTINATION,
  unknownSlugRewrites,
} from "../../unknown-slug-rewrites.mjs";

type Rewrite = { source: string; destination: string };

/** Compiled with the same path-to-regexp Next uses for config rewrites. */
function rewritten(path: string, rules: Rewrite[] = unknownSlugRewrites()): boolean {
  return rules.some((r) => (pathToRegexp(r.source) as RegExp).exec(path) !== null);
}

describe("unknown tool and blog paths", () => {
  it("reads every catalog tool id from the catalog source", () => {
    expect(catalogToolIds()).toEqual(TOOLS.map((t) => t.id));
  });

  it("knows every published blog slug", async () => {
    const posts = await getAllPosts();
    expect(blogSlugs().sort()).toEqual(posts.map((p) => p.slug).sort());
  });

  it("sends unknown ids and slugs to a path no route serves", () => {
    for (const rule of unknownSlugRewrites()) expect(rule.destination).toBe(NOT_FOUND_DESTINATION);
    for (const path of ["/blog/nope", "/en/blog/nope", "/id/blog/nope"]) {
      expect(rewritten(path), path).toBe(true);
    }
  });

  it("leaves real tools, real posts and other pages alone", () => {
    const slug = blogSlugs()[0];
    for (const path of [
      `/blog/${slug}`,
      `/id/blog/${slug}`,
      "/blog",
      "/en/blog",
      "/pricing",
      "/en/pricing",
    ]) {
      expect(rewritten(path), path).toBe(false);
    }
  });
});
