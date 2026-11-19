import type { Metadata } from "next";
import { LegalDocument } from "~/components/LegalDocument";
import { PageShell } from "~/components/PageShell";
import { dictionaries } from "~/lib/i18n";
import { privacyDoc } from "~/lib/legal";
import { localeAlternates } from "~/lib/locale-routing";
import { requestLocale } from "~/lib/request-locale";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  const t = dictionaries[locale].legal;
  return { title: t.privacyTitle, description: t.privacyDescription, alternates: localeAlternates(locale, "/privacy") };
}

export default async function PrivacyPage() {
  const locale = await requestLocale();
  return (
    <PageShell locale={locale}>
      <LegalDocument doc={privacyDoc(locale)} locale={locale} />
    </PageShell>
  );
}
