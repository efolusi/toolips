// The home page, in one language: the search and the tool list, the three ways
// in, and the Pro band. /, /en and /id all render this.

import Link from "next/link";
import { Alert, Icon } from "@efolusi/meridian";
import { PageShell } from "./PageShell";
import { ToolFinder } from "./ToolFinder";
import { Accented } from "./Accented";
import { appUrl } from "~/lib/api";
import { dictionaries, type Locale } from "~/lib/i18n";
import { localizedPath } from "~/lib/locale-routing";
import { btn } from "~/lib/ui";
import { fill, FREE_DAILY_EXPORTS, PRO_MONTHLY_USD } from "~/lib/site-facts";

export function HomePage({ locale, deleted = false }: { locale: Locale; deleted?: boolean }) {
  const t = dictionaries[locale];
  const ways = [
    { key: "web", icon: "globe", href: `${localizedPath(locale, "/")}#tools`, copy: t.ways.web },
    { key: "api", icon: "code", href: appUrl("/account/api"), copy: t.ways.api },
    { key: "mcp", icon: "plug", href: `${localizedPath(locale, "/docs")}#mcp`, copy: t.ways.mcp },
  ];
  return (
    <PageShell locale={locale} active="tools">
      {deleted ? (
        <div className="wrap" style={{ paddingTop: "var(--space-6)" }}>
          <Alert>{t.accountDeleted}</Alert>
        </div>
      ) : null}
      <ToolFinder locale={locale} />

      <section className="section section--rule" aria-labelledby="ways-title">
        <div className="wrap split">
          <div>
            <h2 id="ways-title" className="display-2">
              <Accented parts={t.ways.title} />
            </h2>
            <p className="lede">{t.ways.lede}</p>
          </div>
          <ul className="rows">
            {ways.map((w) => (
              <li key={w.key}>
                <span className="tool-icon" aria-hidden="true">
                  <Icon name={w.icon} size={18} />
                </span>
                <div>
                  <h3>{w.copy.title}</h3>
                  <p>{w.copy.body}</p>
                  <Link href={w.href} className="text-link">
                    {w.copy.cta}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band" aria-labelledby="upgrade-title">
        <div className="wrap band__row">
          <div>
            <h2 id="upgrade-title" className="display-2">
              {fill(t.upgrade.title, { limit: FREE_DAILY_EXPORTS })}
            </h2>
            <p className="lede">{t.upgrade.body}</p>
          </div>
          <div className="actions">
            <Link href={localizedPath(locale, "/pricing")} className={btn("primary", "lg", "btn-on-brand")}>
              {fill(t.upgrade.cta, { price: PRO_MONTHLY_USD })}
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
