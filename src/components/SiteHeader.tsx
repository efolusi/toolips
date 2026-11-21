// The site header: brand, page links, language switch, theme, sign-in, Pro.
// Server half: reads the current route from the middleware so the language
// switch lands on this same page in the other language.

import { headers } from "next/headers";
import { appUrl } from "~/lib/api";
import { dictionaries, otherLocale, type Locale } from "~/lib/i18n";
import { localizedPath, PATH_HEADER } from "~/lib/locale-routing";
import { HeaderBar } from "./HeaderBar";

export type NavKey = "tools" | "pricing" | "docs" | "blog";

export async function SiteHeader({
  locale,
  active,
  notFound = false,
}: {
  locale: Locale;
  active?: NavKey;
  /** A 404 has no counterpart in the other language, so its switch goes home. */
  notFound?: boolean;
}) {
  const t = dictionaries[locale].nav;
  const here = notFound ? "/" : ((await headers()).get(PATH_HEADER) ?? "/");
  const links = (
    [
      ["tools", `${localizedPath(locale, "/")}#tools`, t.tools],
      ["pricing", localizedPath(locale, "/pricing"), t.pricing],
      ["docs", localizedPath(locale, "/docs"), t.docs],
      ["blog", localizedPath(locale, "/blog"), t.blog],
    ] as const
  ).map(([key, href, label]) => ({ key, href, label, current: key === active }));

  return (
    <HeaderBar
      home={localizedPath(locale, "/")}
      links={links}
      switchTo={otherLocale(locale)}
      switchPath={here}
      switchLabel={t.otherLanguage}
      switchAria={t.otherLanguageAria}
      signInHref={appUrl("/sign-in")}
      signIn={t.signIn}
      proHref={localizedPath(locale, "/pricing")}
      goPro={t.goPro}
      openMenu={t.openMenu}
      closeMenu={t.closeMenu}
      toDark={t.themeToDark}
      toLight={t.themeToLight}
    />
  );
}
