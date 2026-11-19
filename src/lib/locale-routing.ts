/**
 * Locale-prefixed URLs: the pure half.
 *
 * Every public page is reachable three ways: `/pricing`, `/en/pricing` and
 * `/id/pricing`. There is ONE page component per route. The middleware strips
 * the prefix, rewrites to the unprefixed route and tells the renderer which
 * language was asked for through the `x-locale` request header, so nothing is
 * duplicated under app/en and app/id beyond the two landing pages that were
 * already there.
 *
 * Nothing here touches next/headers, so middleware (edge), server components,
 * client components and unit tests can all import it.
 */

import { isLocale, type Locale } from "./i18n";

/** Request headers the middleware sets for the renderer. */
export const LOCALE_HEADER = "x-locale";
/** The path WITHOUT its locale prefix, e.g. `/pricing` for `/id/pricing`. */
export const PATH_HEADER = "x-locale-path";

/**
 * Sections that stay outside the locale prefixes: the signed-in product and the
 * sign-in flow (auth callbacks and emails link to the bare URLs), plus anything
 * that is not a document. `/id/account` is a 404, not a second way in. Keep in
 * step with the pattern in locale-rewrites.mjs.
 */
const UNPREFIXED_ONLY = ["/account", "/sign-in", "/api", "/_next"];

export function isUnprefixedOnly(path: string): boolean {
  return UNPREFIXED_ONLY.some((p) => path === p || path.startsWith(`${p}/`));
}

/** Split `/id/pricing` into its locale and the route it stands for. */
export function splitLocalePath(pathname: string): { locale: Locale | null; path: string } {
  const match = /^\/([^/]+)(\/.*)?$/.exec(pathname);
  if (!match || !isLocale(match[1])) return { locale: null, path: pathname };
  const rest = (match[2] ?? "").replace(/\/+$/, "");
  return { locale: match[1], path: rest === "" ? "/" : rest };
}

/**
 * The URL of `path` in `locale`. Paths that only exist unprefixed, external
 * URLs and anything already prefixed are returned untouched, so this is safe to
 * wrap around every internal href.
 */
export function localizedPath(locale: Locale, path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  const cut = path.search(/[?#]/);
  const pathname = cut < 0 ? path : path.slice(0, cut);
  const tail = cut < 0 ? "" : path.slice(cut);
  if (isUnprefixedOnly(pathname)) return path;
  const bare = splitLocalePath(pathname).path;
  return `/${locale}${bare === "/" ? "" : bare}${tail}`;
}

/**
 * Canonical and hreflang for a page rendered in `locale` at `path` (the
 * unprefixed route). The canonical is always the prefixed URL of the language
 * actually rendered; the unprefixed URL is x-default, because it is the one that
 * picks a language for the reader.
 */
export function localeAlternates(locale: Locale, path: string) {
  return {
    canonical: localizedPath(locale, path),
    languages: {
      en: localizedPath("en", path),
      id: localizedPath("id", path),
      "x-default": path,
    },
  };
}
