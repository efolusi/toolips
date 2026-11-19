// Pricing page: server wrapper around the client-side PricingContent.
//
// A single route serves both languages: the locale comes from the reader's
// stored `lang` cookie, else Cloudflare's edge country, else English — the same
// order the middleware uses for "/", without putting a redirect on this page.

import type { Metadata } from "next";

import { SiteNav, SiteFooter } from "~/components/SiteNav";
import { dictionaries } from "~/lib/i18n";
import { localeAlternates, localizedPath } from "~/lib/locale-routing";
import { requestLocale } from "~/lib/request-locale";
import { annualBillingEnabled, fill, PRO_MONTHLY_USD } from "~/lib/site-facts";
import { PricingContent } from "./PricingContent";


export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  const t = dictionaries[locale].pricing;
  return {
    alternates: localeAlternates(locale, "/pricing"),
    title: { absolute: t.metaTitle },
    description: fill(t.metaDescription, { price: PRO_MONTHLY_USD }),
  };
}

// Rendered per-request so the public annual-offer flag is not frozen by a
// build-time placeholder.
export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const locale = await requestLocale();
  return (
    <div style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <SiteNav active="pricing" locale={locale} />
      <main id="main" tabIndex={-1}>
      <PricingContent
        annualEnabled={annualBillingEnabled()}
        t={dictionaries[locale].pricing}
        homeHref={localizedPath(locale, "/")}
      />
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
