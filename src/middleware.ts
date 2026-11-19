// Edge middleware — two jobs on one pass.
//
// 1. A per-request nonce-based Content-Security-Policy on document responses
//    (NFR-SEC-1) so script-src can drop 'unsafe-inline' in production.
// 2. Language routing: a first-time Indonesian visitor to '/' lands on /id,
//    everyone else on /en, and a reader's own choice outlives both. Every
//    public page also answers under /en/... and /id/...: this middleware
//    passes the prefix's language along in x-locale, and the rewrite in
//    locale-rewrites.mjs maps the URL onto the one unprefixed route. The
//    rewrite is NOT done here on purpose; that file says why.
//
// Auth rate limiting used to live here too. It moved to apps/api alongside the
// auth endpoints themselves: limiting at this layer would now only see requests
// to the Worker, while the browser talks to api.toolips.xyz directly.

import { NextResponse, type NextRequest } from "next/server";
import { buildCsp, generateNonce } from "./lib/csp";
import { isLocale, LANG_COOKIE, resolveLocale, type Locale } from "./lib/i18n";
import { LOCALE_HEADER, PATH_HEADER, splitLocalePath } from "./lib/locale-routing";

const isProduction = process.env.NODE_ENV === "production";

const YEAR_SECONDS = 60 * 60 * 24 * 365;

/**
 * Is this request carrying a session?
 *
 * Matched by suffix rather than by an exact name because better-auth prefixes
 * the cookie with `__Secure-` over HTTPS and scopes it to the shared parent
 * domain in the split deployment, so the literal name differs between local dev
 * and production. Presence only: validity is the API's business, and a second
 * opinion here would be a second thing to keep correct. The cost of getting it
 * wrong is one unnecessary redirect on a marketing page.
 */
function hasSession(req: NextRequest): boolean {
  return req.cookies.getAll().some((c) => c.name.endsWith("session_token"));
}

/**
 * Which landing page a visitor with no explicit choice should get.
 *
 * Cloudflare resolves the country at the edge (`cf-ipcountry`), so this costs no
 * lookup and no third-party call. The stored choice is checked FIRST and wins
 * forever after: an Indonesian reader who switched to English must not be thrown
 * back to Indonesian on every visit, and vice versa.
 */
function guessLocale(req: NextRequest): Locale {
  const stored = req.cookies.get(LANG_COOKIE)?.value;
  if (isLocale(stored)) return stored;
  const country = req.headers.get("cf-ipcountry");
  if (country) return country === "ID" ? "id" : "en";
  // No cookie and no geo header (e.g. direct hits that bypass Cloudflare):
  // fall back to the browser's Accept-Language. Indonesian → /id, else /en.
  const accept = req.headers.get("accept-language") ?? "";
  return /(^|,)\s*(id|in)([-;_]|\s*(,|$))/i.test(accept) ? "id" : "en";
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Language routing runs before the CSP work: a redirect carries no document,
  // so it needs no nonce. It touches ONLY '/'. Widening it would put a redirect
  // in front of every tool page; dropping it turns geo-detect off entirely.
  if (pathname === "/") {
    // A signed-in visitor is left alone. They arrived at a URL the product's own
    // nav links to, and bouncing a customer between language prefixes is a bug
    // wearing a feature's clothes.
    if (!hasSession(req)) {
      // 307: the destination depends on who is asking and must not be cached as
      // a fact about this URL. The target is built from the PUBLIC host headers:
      // behind the proxy req.nextUrl is https://localhost:3105, and
      // NextResponse.redirect() prints its URL into the response body
      // (and middleware rejects a relative Location).
      const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
      const proto = req.headers.get("x-forwarded-proto") ?? "https";
      const target = new URL(
        `/${guessLocale(req)}${req.nextUrl.search}`,
        host ? `${proto}://${host}` : req.nextUrl.origin,
      );
      return NextResponse.redirect(target, 307);
    }
  }

  // The language of the document about to be rendered, and the route that
  // renders it. A prefix is an explicit choice and wins. Without one the stored
  // choice, then the country, decide, which is exactly what the pages used to
  // work out for themselves; now <html lang> gets the same answer they do.
  const { locale: prefix, path } = splitLocalePath(pathname);
  const locale: Locale =
    prefix ??
    (pathname === "/"
      ? guessLocale(req)
      : resolveLocale(req.cookies.get(LANG_COOKIE)?.value, req.headers.get("cf-ipcountry")));
  // Generate a nonce and expose it to the App Router via the request CSP header
  // (Next reads it and nonces its own inline scripts); mirror the CSP onto the
  // response so the browser enforces it. In dev buildCsp() omits the nonce and
  // keeps 'unsafe-inline', so we skip the request-header dance there.
  const nonce = isProduction ? generateNonce() : undefined;
  const csp = buildCsp({ nonce, isProduction });

  const requestHeaders = new Headers(req.headers);
  if (nonce) {
    requestHeaders.set("x-nonce", nonce);
    requestHeaders.set("content-security-policy", csp);
  }
  // Read by the root layout for <html lang>. A header rather than a cookie
  // because it describes THIS response, not the reader's standing preference.
  requestHeaders.set(LOCALE_HEADER, locale);
  // The unprefixed route, so the language switch can point at this same page.
  requestHeaders.set(PATH_HEADER, path);

  const res = NextResponse.next({ request: { headers: requestHeaders } });
  res.headers.set("Content-Security-Policy", csp);

  // Remember whichever language prefix is being read, including a manual switch
  // via the header link. Writing it only on change keeps the Set-Cookie off
  // every repeat view.
  if (prefix) {
    if (req.cookies.get(LANG_COOKIE)?.value !== locale) {
      res.cookies.set(LANG_COOKIE, locale, {
        maxAge: YEAR_SECONDS,
        path: "/",
        sameSite: "lax",
      });
    }
  }

  return res;
}

export const config = {
  matcher: [
    // All document routes. Exclude Next static assets, the image optimizer, and
    // common static files — they don't need a nonce CSP and skipping them keeps
    // middleware cheap.
    //
    // This stays broad because the CSP half needs every document. The language
    // half narrows itself to '/', '/en' and '/id' in the body above, which is
    // where that constraint is tested.
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
