// Locale prefixes, the routing half: /en/pricing and /id/pricing are served by
// the ONE route at /pricing.
//
// This is a next.config rewrite and deliberately NOT a middleware rewrite. A
// middleware rewrite is only internal when its origin equals the one Next built
// for the request, and under `next start -H 127.0.0.1` behind nginx (how
// ecosystem.config.cjs runs this app) it never does: NextURL normalises the
// loopback IP to "localhost", so Next fetches https://localhost:<port> for real
// and answers 500 (EPROTO), or, downgraded to http, proxies to itself and loses
// the language on the way. A config rewrite is matched on the path alone, after
// the middleware has already put the language in the x-locale request header.
//
// Not rewritten, so they 404: a doubled prefix (/id/en/...) and the sections
// that only exist unprefixed. Keep this list equal to UNPREFIXED_ONLY in
// src/lib/locale-routing.ts; src/__tests__/locale-rewrites.test.ts checks it.

export const LOCALE_REWRITE_SOURCE =
  "/:locale(en|id)/:path((?!(?:en|id|account|sign-in|api|_next)(?:/|$)).+)";

export function localeRewrites() {
  return [{ source: LOCALE_REWRITE_SOURCE, destination: "/:path" }];
}
