// The 404 page, in the reader's language. The locale comes from the middleware,
// so /id/zzz is an Indonesian 404 and /zzz follows the stored choice, then the
// country.

import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "~/components/PageShell";
import { Accented } from "~/components/Accented";
import { dictionaries } from "~/lib/i18n";
import { localizedPath } from "~/lib/locale-routing";
import { requestLocale } from "~/lib/request-locale";
import { fill } from "~/lib/site-facts";
import { btn } from "~/lib/ui";

// Per request, like the body: a static `metadata` export would leave /id/zzz
// with an English tab title.
export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  return { title: { absolute: dictionaries[locale].notFound.metaTitle }, robots: { index: false } };
}

export default async function NotFound() {
  const locale = await requestLocale();
  const t = dictionaries[locale].notFound;
  return (
    <PageShell locale={locale} notFound>
      <section className="hero">
        <div className="wrap">
          <p className="eyebrow">{fill(t.eyebrow, { code: 404 })}</p>
          <h1 className="display-1">
            <Accented parts={t.title} />
          </h1>
          <p className="lede">{t.lead}</p>
          <div className="actions" style={{ justifyContent: "center" }}>
            <Link href={`${localizedPath(locale, "/")}#tools`} className={btn("primary", "lg")}>
              {t.backHome}
            </Link>
            <Link href={localizedPath(locale, "/docs")} className={btn("secondary", "lg")}>
              {t.readDocs}
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
