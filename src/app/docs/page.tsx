// Docs: the three ways to run a tool, one sample request, and the reference.

import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock, Icon } from "@efolusi/meridian";
import { PageShell } from "~/components/PageShell";
import { Accented } from "~/components/Accented";
import { API_URL, appUrl } from "~/lib/api";
import { dictionaries } from "~/lib/i18n";
import { localeAlternates, localizedPath } from "~/lib/locale-routing";
import { requestLocale } from "~/lib/request-locale";
import { fill, FREE_DAILY_EXPORTS, TOOL_COUNT } from "~/lib/site-facts";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  const t = dictionaries[locale].docs;
  return { title: { absolute: t.metaTitle }, description: t.metaDescription, alternates: localeAlternates(locale, "/docs") };
}

const TOKENS = { count: TOOL_COUNT, limit: FREE_DAILY_EXPORTS, status: 429, xpay: "x402" };

const SAMPLE = `curl -X POST ${API_URL}/api/tools/word-counter \\
  -H 'authorization: Bearer tlp_live_…' \\
  -H 'content-type: application/json' \\
  -d '{"text": "hello world"}'

# → { "words": 2, "chars": 11, "lines": 1 }`;

export default async function DocsPage() {
  const locale = await requestLocale();
  const t = dictionaries[locale].docs;
  const paths = [
    { id: "web", icon: "globe", copy: t.paths.web, href: `${localizedPath(locale, "/")}#tools` },
    { id: "api", icon: "code", copy: t.paths.api, href: appUrl("/account/api") },
    { id: "mcp", icon: "plug", copy: t.paths.mcp, href: appUrl("/account/api") },
  ];
  const refs = [t.reference.auth, t.reference.tools, t.reference.limits];

  return (
    <PageShell locale={locale} active="docs">
      <section className="page-head">
        <div className="wrap">
          <h1 className="display-1">
            <Accented parts={t.title} />
          </h1>
          <p className="lede">{t.lead}</p>
        </div>
      </section>

      <section className="section section--rule" aria-label={t.metaTitle}>
        <div className="wrap split">
          <ul className="rows">
            {paths.map((p) => (
              <li key={p.id} id={p.id}>
                <span className="tool-icon" aria-hidden="true">
                  <Icon name={p.icon} size={18} />
                </span>
                <div>
                  <h2 className="display-3">{p.copy.title}</h2>
                  <p>{p.copy.body}</p>
                  {p.href.startsWith("/") ? (
                    <Link href={p.href} className="text-link">{p.copy.cta}</Link>
                  ) : (
                    <a href={p.href} className="text-link">{p.copy.cta}</a>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div>
            <h2 className="display-3">{t.sampleTitle}</h2>
            <p className="muted">{t.sampleLead}</p>
            <CodeBlock lang="bash">{SAMPLE}</CodeBlock>
          </div>
        </div>
      </section>

      <section className="section section--rule" aria-labelledby="ref-title">
        <div className="wrap">
          <h2 id="ref-title" className="display-2" style={{ marginBottom: "var(--space-10)" }}>
            {t.referenceTitle}
          </h2>
          <div className="ref-grid">
            {refs.map((group) => (
              <div key={group.title}>
                <h3>{group.title}</h3>
                <dl className="facts">
                  {group.items.map((item) => (
                    <div key={item.name}>
                      <dt>{fill(item.name, TOKENS)}</dt>
                      <dd>{fill(item.desc, TOKENS)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
