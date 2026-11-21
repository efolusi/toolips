// One page per catalog tool: what it does, its limits, and a link that runs it
// in the app (APP_URL/tool/<id>). Built from the bundled catalog, so nothing is
// fetched or read from disk at request time.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@efolusi/meridian";
import { ToolCard } from "~/components/ToolCard";
import { PageShell } from "~/components/PageShell";
import { ToolIcon } from "~/components/ToolIcon";
import { appUrl } from "~/lib/api";
import { dictionaries } from "~/lib/i18n";
import { localeAlternates, localizedPath } from "~/lib/locale-routing";
import { requestLocale } from "~/lib/request-locale";
import { fill, PRO_MONTHLY_USD } from "~/lib/site-facts";
import { categoryLabel, toolCopy } from "~/lib/tool-copy";
import { toolLimits } from "~/lib/tool-limits";
import { RUNNABLE_TOOLS, TOOLS, toolById } from "~/lib/tools";
import { btn } from "~/lib/ui";

// Unknown ids are rewritten to the 404 before this runs (unknown-slug-rewrites.mjs).
// dynamicParams stays at its default: false would make OpenNext 404 every tool.
export function generateStaticParams() {
  return TOOLS.map((tool) => ({ id: tool.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const tool = toolById(id);
  const locale = await requestLocale();
  if (!tool) return { robots: { index: false } };
  const copy = toolCopy(tool, locale);
  return {
    title: copy.name,
    description: `${copy.desc} ${fill(dictionaries[locale].toolPage.description, { name: copy.name })}`,
    alternates: localeAlternates(locale, `/tool/${tool.id}`),
    // A paused or planned tool keeps its URL but stays out of search results.
    robots: tool.status ? { index: false } : undefined,
  };
}

export default async function ToolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tool = toolById(id);
  if (!tool) notFound();
  const locale = await requestLocale();
  const d = dictionaries[locale];
  const t = d.toolPage;
  const copy = toolCopy(tool, locale);
  const category = categoryLabel(tool.category, locale);
  const related = RUNNABLE_TOOLS.filter((x) => x.category === tool.category && x.id !== tool.id).slice(0, 6);
  const home = localizedPath(locale, "/");

  return (
    <PageShell locale={locale} active="tools">
      <section className="page-head">
        <div className="wrap">
          <ol className="crumbs">
            <li>
              <Link href={`${home}#tools`}>{t.breadcrumbTools}</Link>
            </li>
            <li>{category}</li>
          </ol>
          <div className="tool-head">
            <span className="tool-icon tool-icon--lg" aria-hidden="true">
              <ToolIcon name={tool.icon} size={28} strokeWidth={2} />
            </span>
            <div>
              <h1 className="display-1">{copy.name}</h1>
              <p className="lede">{copy.desc}</p>
              {tool.status ? (
                <Alert className="notice">
                  <AlertTitle>{tool.status === "suspended" ? t.suspendedTitle : t.comingSoonTitle}</AlertTitle>
                  <AlertDescription>{tool.status === "suspended" ? t.suspendedBody : t.comingSoonBody}</AlertDescription>
                </Alert>
              ) : (
                <div className="actions">
                  <a href={appUrl(`/tool/${tool.id}`)} className={btn("primary", "lg")}>
                    {fill(t.run, { name: copy.name })}
                  </a>
                  {tool.tier === "pro" ? (
                    <Link href={`${localizedPath(locale, "/pricing")}#pro`} className={btn("secondary", "lg")}>
                      {fill(t.proCta, { price: PRO_MONTHLY_USD })}
                    </Link>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section section--rule" aria-labelledby="limits-title">
        <div className="wrap split">
          <div>
            <h2 id="limits-title" className="display-2">{t.limitsTitle}</h2>
            {tool.tier === "pro" ? <p className="lede">{t.proRequires}</p> : null}
          </div>
          <dl className="facts">
            {toolLimits(tool, t).map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="section section--rule" aria-labelledby="related-title">
          <div className="wrap">
            <h2 id="related-title" className="display-2" style={{ marginBottom: "var(--space-8)" }}>
              {fill(t.related, { category })}
            </h2>
            <ul className="tool-grid">
              {related.map((r) => (
                <li key={r.id}>
                  <ToolCard tool={r} locale={locale} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </PageShell>
  );
}
