// The language of the document being rendered, for server components.
//
// middleware.ts is the single place that decides it (URL prefix, else stored
// choice, else country) and hands it over in `x-locale`. The cookie/country
// fallback only runs for a render that never passed the middleware.

import { cookies, headers } from "next/headers";
import { isLocale, LANG_COOKIE, resolveLocale, type Locale } from "./i18n";
import { LOCALE_HEADER, PATH_HEADER } from "./locale-routing";

export async function requestLocale(): Promise<Locale> {
  const headerStore = await headers();
  const fromMiddleware = headerStore.get(LOCALE_HEADER);
  if (isLocale(fromMiddleware)) return fromMiddleware;
  const cookieStore = await cookies();
  return resolveLocale(cookieStore.get(LANG_COOKIE)?.value, headerStore.get("cf-ipcountry"));
}

/** The unprefixed path of this request, e.g. `/pricing` on `/id/pricing`. */
export async function requestPath(): Promise<string> {
  return (await headers()).get(PATH_HEADER) ?? "/";
}
