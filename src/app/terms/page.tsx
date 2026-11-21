import type { Metadata } from "next";
import { LegalDocument } from "~/components/LegalDocument";
import { PageShell } from "~/components/PageShell";
import { dictionaries } from "~/lib/i18n";
import { termsDoc } from "~/lib/legal";
import { localeAlternates } from "~/lib/locale-routing";
import { requestLocale } from "~/lib/request-locale";
import { annualBillingEnabled } from "~/lib/site-facts";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  const t = dictionaries[locale].legal;
  return { title: t.termsTitle, description: t.termsDescription, alternates: localeAlternates(locale, "/terms") };
}

// Per request, like /pricing, so the terms never quote a plan the pricing page hides.
export const dynamic = "force-dynamic";

export default async function TermsPage() {
  const locale = await requestLocale();
  return (
    <PageShell locale={locale}>
      <LegalDocument doc={termsDoc(locale, annualBillingEnabled())} locale={locale} />
    </PageShell>
  );
}
