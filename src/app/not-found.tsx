// The 404 page, in the reader's language.
//
// A server component: the locale comes from the middleware, so /id/zzz is an
// Indonesian 404 and /zzz follows the stored choice, then the country. Reading
// headers() here is safe because SiteNav already does, so this route renders
// per-request rather than from a prerender.

import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav, SiteFooter } from "~/components/SiteNav";
import { dictionaries } from "~/lib/i18n";
import { localizedPath } from "~/lib/locale-routing";
import { requestLocale } from "~/lib/request-locale";
import { fill } from "~/lib/site-facts";

// The title follows the request locale like the body does; a static `metadata`
// export would leave /id/zzz with an English tab title.
export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  return { title: { absolute: dictionaries[locale].notFound.metaTitle }, robots: { index: false } };
}

export default async function NotFound() {
  const locale = await requestLocale();
  const t = dictionaries[locale].notFound;

  const [lead, accent, trail] = t.title;
  return (
    <div style={{ background: "var(--bg-base)", color: "var(--text-primary)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SiteNav locale={locale} notFound />
      <main id="main" tabIndex={-1} className="lp-404 lp-hero">
        <div className="lp-wrap">
          <p className="lp-proof" style={{ marginTop: 0, marginBottom: 16 }}>
            {fill(t.eyebrow, { code: 404 })}
          </p>
          <h1 className="lp-h1">
            {lead}
            <span className="lp-script">{accent}</span>
            {trail}
          </h1>
          <p className="lp-hero__sub">{t.lead}</p>
          <div className="lp-actions-row">
            <Link href={localizedPath(locale, "/")} className="lp-pill lp-pill--primary">
              {t.backHome}
            </Link>
            <Link href={localizedPath(locale, "/docs")} className="lp-pill lp-pill--outline">
              {t.readDocs}
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
