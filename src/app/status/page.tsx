import type { Metadata } from "next";
import { PageShell } from "~/components/PageShell";
import { Accented } from "~/components/Accented";
import { dictionaries } from "~/lib/i18n";
import { localeAlternates } from "~/lib/locale-routing";
import { requestLocale } from "~/lib/request-locale";
import { StatusBoard } from "./StatusBoard";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  const t = dictionaries[locale].status;
  return { title: { absolute: t.metaTitle }, description: t.metaDescription, alternates: localeAlternates(locale, "/status") };
}

export default async function StatusPage() {
  const locale = await requestLocale();
  const t = dictionaries[locale].status;
  return (
    <PageShell locale={locale}>
      <section className="section wrap wrap--text">
        <h1 className="display-1">
          <Accented parts={t.title} />
        </h1>
        <p className="lede" style={{ marginBottom: "var(--space-8)" }}>{t.lead}</p>
        <StatusBoard t={t} locale={locale} />
      </section>
    </PageShell>
  );
}
