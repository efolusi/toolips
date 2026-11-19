// @ts-expect-error Next ships this compiled dependency without types.
import { pathToRegexp } from "next/dist/compiled/path-to-regexp";
import { describe, expect, it } from "vitest";

import { LOCALE_REWRITE_SOURCE, localeRewrites } from "../../locale-rewrites.mjs";
import { isUnprefixedOnly, splitLocalePath } from "../lib/locale-routing";

/**
 * The next.config rewrite that serves /en/... and /id/... from the unprefixed
 * routes. Compiled with the same path-to-regexp Next uses, so a pattern that
 * Next would read differently fails here rather than in production.
 */
const re: RegExp = pathToRegexp(LOCALE_REWRITE_SOURCE);

describe("locale rewrite", () => {
  it("maps every prefixed public page onto its unprefixed route", () => {
    expect(localeRewrites()).toEqual([{ source: LOCALE_REWRITE_SOURCE, destination: "/:path" }]);
    for (const locale of ["en", "id"]) {
      for (const path of ["/pricing", "/docs", "/privacy", "/terms", "/status", "/blog", "/blog/a-post", "/tool/merge-pdf", "/zzz", "/ideas", "/accounting"]) {
        const match = re.exec(`/${locale}${path}`);
        expect(match, `/${locale}${path}`).not.toBeNull();
        expect(match?.[1]).toBe(locale);
        expect(`/${match?.[2]}`).toBe(path);
      }
    }
  });

  it("leaves the landing routes, unprefixed pages and other languages alone", () => {
    for (const path of ["/en", "/id", "/pricing", "/tool/merge-pdf", "/fr/pricing", "/ideas/pricing"]) {
      expect(re.exec(path), path).toBeNull();
    }
  });

  it("refuses doubled prefixes and unprefixed-only sections, in step with locale-routing.ts", () => {
    for (const path of ["/id/en", "/id/id/pricing", "/en/account", "/en/account/api", "/id/sign-in", "/id/api/health", "/id/_next/x"]) {
      expect(re.exec(path), path).toBeNull();
      const rest = splitLocalePath(path).path;
      expect(splitLocalePath(rest).locale !== null || isUnprefixedOnly(rest), path).toBe(true);
    }
  });
});
