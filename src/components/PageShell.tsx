// Header, the one <main id="main"> the skip link targets, and footer. Every page
// renders through this, so the skip link always lands on a focusable main.

import type { ReactNode } from "react";
import type { Locale } from "~/lib/i18n";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader, type NavKey } from "./SiteHeader";

export function PageShell({
  locale,
  active,
  notFound,
  children,
}: {
  locale: Locale;
  active?: NavKey;
  notFound?: boolean;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader locale={locale} active={active} notFound={notFound} />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
