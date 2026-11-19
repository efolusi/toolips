import { describe, expect, it } from "vitest";

import {
  isUnprefixedOnly,
  localeAlternates,
  localizedPath,
  splitLocalePath,
} from "../locale-routing";

describe("splitLocalePath", () => {
  it("separates the prefix from the route it stands for", () => {
    expect(splitLocalePath("/id/pricing")).toEqual({ locale: "id", path: "/pricing" });
    expect(splitLocalePath("/en/tool/word-counter")).toEqual({ locale: "en", path: "/tool/word-counter" });
    expect(splitLocalePath("/id")).toEqual({ locale: "id", path: "/" });
    expect(splitLocalePath("/id/")).toEqual({ locale: "id", path: "/" });
  });

  it("leaves unprefixed paths alone, including ones that merely start like a locale", () => {
    expect(splitLocalePath("/pricing")).toEqual({ locale: null, path: "/pricing" });
    expect(splitLocalePath("/")).toEqual({ locale: null, path: "/" });
    expect(splitLocalePath("/ideas")).toEqual({ locale: null, path: "/ideas" });
    expect(splitLocalePath("/fr/pricing")).toEqual({ locale: null, path: "/fr/pricing" });
  });
});

describe("localizedPath", () => {
  it("prefixes public pages and keeps query and hash", () => {
    expect(localizedPath("id", "/")).toBe("/id");
    expect(localizedPath("id", "/pricing")).toBe("/id/pricing");
    expect(localizedPath("en", "/tool/word-counter")).toBe("/en/tool/word-counter");
    expect(localizedPath("id", "/?cat=pdf")).toBe("/id?cat=pdf");
    expect(localizedPath("id", "/docs#mcp")).toBe("/id/docs#mcp");
  });

  it("swaps an existing prefix instead of stacking a second one", () => {
    expect(localizedPath("en", "/id/pricing")).toBe("/en/pricing");
    expect(localizedPath("id", "/id")).toBe("/id");
  });

  it("never prefixes the signed-in product, sign-in, the API or external URLs", () => {
    for (const path of ["/account", "/account/api", "/sign-in", "/api/jobs", "https://efolusi.com", "//x.y", "#tools"]) {
      expect(localizedPath("id", path), path).toBe(path);
    }
    expect(isUnprefixedOnly("/accounting")).toBe(false);
  });
});

describe("localeAlternates", () => {
  it("canonicalises to the rendered language and offers both plus x-default", () => {
    expect(localeAlternates("id", "/pricing")).toEqual({
      canonical: "/id/pricing",
      languages: { en: "/en/pricing", id: "/id/pricing", "x-default": "/pricing" },
    });
  });
});
