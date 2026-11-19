// The ONLY way to link from one language to the other.
//
// `/en/x` and `/id/x` are rewritten to the same route, so a client-side
// next/link navigation between them reuses the router cache and keeps the old
// language on screen; and <html lang> lives in the root layout, which never
// re-renders on a client navigation. A cross-locale link therefore has to be a
// full document load: a plain <a>, never next/link. Same-locale links stay
// <Link>. Guarded by src/__tests__/locale-switch-link.test.ts.
import type { AnchorHTMLAttributes } from "react";

import type { Locale } from "~/lib/i18n";
import { localizedPath } from "~/lib/locale-routing";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "hrefLang"> & {
  /** The language to switch TO. */
  locale: Locale;
  /** The current page, prefixed or not. */
  path: string;
};

export function LocaleSwitchLink({ locale, path, children, ...rest }: Props) {
  return (
    <a {...rest} href={localizedPath(locale, path)} hrefLang={locale} data-locale-switch={locale}>
      {children}
    </a>
  );
}
