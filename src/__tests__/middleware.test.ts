import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { config, middleware } from "../middleware";

/**
 * Landing language routing, and the promise that it touches nothing else.
 *
 * The matcher here is deliberately broad because the CSP half of this
 * middleware needs every document response. That makes "only the landing routes
 * are redirected" a property of the body rather than of the matcher, so it is
 * asserted directly: a widened redirect would put a 307 in front of all 83 tool
 * pages, and nothing else in the build would notice.
 */

const ORIGIN = "https://toolips.xyz";

function request(
  path: string,
  init: { cookies?: Record<string, string>; country?: string; proto?: string } = {},
) {
  const headers = new Headers();
  if (init.proto) headers.set("x-forwarded-proto", init.proto);
  if (init.country) headers.set("cf-ipcountry", init.country);
  const cookie = Object.entries(init.cookies ?? {})
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
  if (cookie) headers.set("cookie", cookie);
  return new NextRequest(new URL(path, ORIGIN), { headers });
}

/** The path a response redirects to, failing the test if it does not redirect. */
function redirectPath(res: { headers: Headers }): string {
  const location = res.headers.get("location");
  expect(location, "expected a redirect").not.toBeNull();
  return new URL(location ?? "", ORIGIN).pathname;
}

describe("landing language routing", () => {
  it("sends a first-time Indonesian visitor to the Indonesian page", () => {
    const res = middleware(request("/", { country: "ID" }));
    expect(res.status).toBe(307);
    expect(redirectPath(res)).toBe("/id");
  });

  it("sends everyone else to English", () => {
    expect(redirectPath(middleware(request("/", { country: "SG" })))).toBe("/en");
    expect(redirectPath(middleware(request("/", { country: "US" })))).toBe("/en");
    // No country header at all: a direct hit that never passed Cloudflare.
    expect(redirectPath(middleware(request("/")))).toBe("/en");
  });

  it("lets a stored choice beat the country guess, in both directions", () => {
    // The failure this prevents: an Indonesian reader who switched to English is
    // thrown back to Indonesian on every later visit, and the reverse.
    expect(redirectPath(middleware(request("/", { country: "ID", cookies: { lang: "en" } })))).toBe(
      "/en",
    );
    expect(redirectPath(middleware(request("/", { country: "US", cookies: { lang: "id" } })))).toBe(
      "/id",
    );
  });

  it("ignores a cookie value that is not a locale", () => {
    expect(redirectPath(middleware(request("/", { country: "ID", cookies: { lang: "xx" } })))).toBe(
      "/id",
    );
  });

  it("leaves a signed-in visitor where they asked to be", () => {
    // '/' is a URL the product's own nav links to. Bouncing a customer between
    // language prefixes is the same bug from the other side.
    const res = middleware(request("/", { country: "ID", cookies: { "better-auth.session_token": "abc" } }));
    expect(res.headers.get("location")).toBeNull();
    // The page still needs to know which language to render.
    expect(res.status).toBe(200);
  });

  it("recognises the session cookie under its production name too", () => {
    // Over HTTPS better-auth prefixes it, so an exact-name check would silently
    // stop working in production only.
    const res = middleware(
      request("/", { country: "ID", cookies: { "__Secure-better-auth.session_token": "abc" } }),
    );
    expect(res.headers.get("location")).toBeNull();
  });

  it("remembers the language page being read, including a manual switch", () => {
    const res = middleware(request("/id", { cookies: { lang: "en" } }));
    expect(res.cookies.get("lang")?.value).toBe("id");
    expect(middleware(request("/en", { cookies: { lang: "id" } })).cookies.get("lang")?.value).toBe(
      "en",
    );
  });

  it("does not rewrite the cookie when it already matches", () => {
    expect(middleware(request("/id", { cookies: { lang: "id" } })).cookies.get("lang")).toBeUndefined();
  });

  it("redirects the landing route and nothing else", () => {
    for (const path of ["/pricing", "/docs", "/blog", "/sign-in", "/account", "/tool/word-counter", "/en", "/id"]) {
      const res = middleware(request(path, { country: "ID" }));
      expect(res.headers.get("location"), `${path} was redirected`).toBeNull();
    }
  });

  it("never writes the language cookie on unprefixed routes", () => {
    for (const path of ["/pricing", "/docs", "/tool/word-counter"]) {
      expect(middleware(request(path, { country: "ID" })).cookies.get("lang"), path).toBeUndefined();
    }
  });

  it("tells the layout which language the document is", () => {
    // This is what puts the right value in <html lang>. It is a request header
    // rather than a response header, so it is read back off the outgoing
    // request the middleware hands to the renderer.
    expect(middleware(request("/id")).headers.get("x-middleware-request-x-locale")).toBe("id");
    expect(middleware(request("/en")).headers.get("x-middleware-request-x-locale")).toBe("en");
    expect(middleware(request("/pricing")).headers.get("x-middleware-request-x-locale")).toBe("en");
    // '/' only gets here signed in, and then follows the same stored choice.
    const signedIn = { "better-auth.session_token": "abc" };
    expect(
      middleware(request("/", { country: "ID", cookies: signedIn })).headers.get(
        "x-middleware-request-x-locale",
      ),
    ).toBe("id");
  });

  it("still sets a Content-Security-Policy on every document it touches", () => {
    // The language work shares this middleware with the nonce CSP. An early
    // return in the wrong place would drop the header and nothing user-visible
    // would break until a security review.
    for (const path of ["/en", "/id", "/pricing"]) {
      expect(middleware(request(path)).headers.get("Content-Security-Policy"), path).toBeTruthy();
    }
  });

  it("keeps the matcher on all document routes", () => {
    // Narrowing it to the landing pages would silently disable the CSP half.
    expect(config.matcher).toEqual([
      "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
    ]);
  });
});

describe("locale-prefixed pages", () => {
  const header = (res: { headers: Headers }, name: string) =>
    res.headers.get(`x-middleware-request-${name}`);

  it("tells the renderer the language and the unprefixed route of every prefixed page", () => {
    for (const locale of ["en", "id"]) {
      for (const path of ["/pricing", "/docs", "/privacy", "/terms", "/status", "/blog", "/blog/hello", "/tool/word-counter", "/zzz"]) {
        const res = middleware(request(`/${locale}${path}`));
        expect(header(res, "x-locale"), `/${locale}${path}`).toBe(locale);
        expect(header(res, "x-locale-path")).toBe(path);
        expect(res.headers.get("Content-Security-Policy")).toBeTruthy();
      }
    }
  });

  it("never rewrites or redirects from middleware, with or without a TLS proxy in front", () => {
    // The trap: behind nginx (X-Forwarded-Proto: https) with the server bound to
    // 127.0.0.1, a middleware rewrite is treated as EXTERNAL, fetched over TLS
    // against a plain-http port and answered with a 500. The prefix is mapped
    // by next.config instead (locale-rewrites.mjs); this pins that decision.
    for (const proto of [undefined, "https"]) {
      for (const path of ["/id/pricing", "/en/tool/word-counter", "/id/zzz", "/id/en", "/pricing"]) {
        const res = middleware(request(path, { proto }));
        expect(res.headers.get("x-middleware-rewrite"), path).toBeNull();
        expect(res.headers.get("location"), path).toBeNull();
        expect(res.headers.get("x-middleware-next")).toBe("1");
      }
    }
  });

  it("lets the prefix beat the stored choice, and remembers it", () => {
    const res = middleware(request("/id/pricing", { cookies: { lang: "en" }, country: "US" }));
    expect(header(res, "x-locale")).toBe("id");
    expect(res.cookies.get("lang")?.value).toBe("id");
  });

  it("gives unprefixed pages the language their content uses", () => {
    // Pages used to read the cookie themselves while <html lang> said "en".
    expect(header(middleware(request("/pricing", { cookies: { lang: "id" } })), "x-locale")).toBe("id");
    expect(header(middleware(request("/pricing", { country: "ID" })), "x-locale")).toBe("id");
    expect(header(middleware(request("/pricing")), "x-locale")).toBe("en");
    expect(header(middleware(request("/pricing")), "x-locale-path")).toBe("/pricing");
  });
});
