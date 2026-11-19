// The hub landing page, in one language.
//
// Extracted from app/page.tsx so /en, /id and the bare / render the identical
// tree with a different dictionary. Server component: the nav reads the session
// and the copy has to be in the HTML for search engines, so nothing here is a
// client-side language swap. Only the searchable catalogue (HubGrid) is client.

import Link from "next/link";
import { appUrl } from "~/lib/api";
import { ArrowRight, Code2, Globe, Plug } from "lucide-react";
import { SiteNav, SiteFooter } from "~/components/SiteNav";
import { FlashBanner } from "~/components/FlashBanner";
import { HubGrid } from "~/app/HubGrid";
import { dictionaries, type Locale } from "~/lib/i18n";
import { localizedPath } from "~/lib/locale-routing";
import { fill, FREE_DAILY_EXPORTS, PRO_MONTHLY_USD } from "~/lib/site-facts";

export function Landing({ locale, deleted }: { locale: Locale; deleted?: boolean }) {
  const t = dictionaries[locale];
  const [wLead, wAccent, wTrail] = t.ways.title;
  const ways = [
    { key: "web", icon: Globe, href: "#tools", copy: t.ways.web },
    { key: "api", icon: Code2, href: appUrl("/account/api"), copy: t.ways.api },
    { key: "mcp", icon: Plug, href: localizedPath(locale, "/docs"), copy: t.ways.mcp },
  ] as const;
  return (
    <div style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <SiteNav active="tools" locale={locale} />
      {deleted ? <FlashBanner tone="info">{t.accountDeleted}</FlashBanner> : null}
      <main id="main" tabIndex={-1}>
        <HubGrid locale={locale} />

        <section className="lp-section">
          <div className="lp-wrap">
            <div className="lp-head">
              <h2 className="lp-h2">
                {wLead}
                <span className="lp-script">{wAccent}</span>
                {wTrail}
              </h2>
              <p className="lp-lede">{t.ways.lede}</p>
            </div>
            <div className="lp-ways">
              {ways.map(({ key, icon: Icon, href, copy }) => (
                <div key={key} className="lp-way">
                  <span className="lp-card__icon" aria-hidden="true">
                    <Icon size={22} strokeWidth={2} />
                  </span>
                  <h3>{copy.title}</h3>
                  <p>{copy.body}</p>
                  <Link href={href} className="lp-link">
                    {copy.cta}
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="lp-band">
          <div className="lp-wrap">
            <h2 className="lp-h2">{fill(t.upgrade.title, { limit: FREE_DAILY_EXPORTS })}</h2>
            <p>{t.upgrade.body}</p>
            <Link href={localizedPath(locale, "/pricing")} className="lp-pill lp-pill--cream">
              {fill(t.upgrade.cta, { price: PRO_MONTHLY_USD })}
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
