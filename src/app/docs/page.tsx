// Docs page: single route, two languages. The locale comes from the reader's
// stored `lang` cookie, else Cloudflare's edge country, else English — the same
// order as /pricing (see that page for the pattern this copies).

import Link from "next/link";
import { appUrl } from "~/lib/api";
import type { Metadata } from "next";
import { Zap, Code2, Boxes, ArrowRight, BookOpen } from "lucide-react";

import { SiteNav, SiteFooter } from "~/components/SiteNav";
import { dictionaries, type Dictionary } from "~/lib/i18n";
import { localeAlternates, localizedPath } from "~/lib/locale-routing";
import { requestLocale } from "~/lib/request-locale";
import { fill, FREE_DAILY_EXPORTS, TOOL_COUNT } from "~/lib/site-facts";


export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  const t = dictionaries[locale].docs;
  return { alternates: localeAlternates(locale, "/docs"), title: { absolute: t.metaTitle }, description: t.metaDescription };
}

// The values behind the {tokens} in the reference copy. `429` and `x402` (the {status} and {xpay} tokens) are
// protocol constants rather than site facts, but the i18n test refuses digits
// in dictionary strings, so they arrive the same way the measured numbers do.
const REFERENCE_FACTS = {
  count: TOOL_COUNT,
  status: 429,
  limit: FREE_DAILY_EXPORTS,
  xpay: "x402",
} as const;

type DocCard = {
  icon: React.ReactNode;
  copy: Dictionary["docs"]["cards"]["web"];
  href: string;
  block: 1 | 2 | 3;
};

export default async function DocsPage() {
  const locale = await requestLocale();
  const t = dictionaries[locale].docs;

  const cards: DocCard[] = [
    { icon: <Zap size={22} strokeWidth={2} />, copy: t.cards.web, href: localizedPath(locale, "/"), block: 1 },
    { icon: <Code2 size={22} strokeWidth={2} />, copy: t.cards.api, href: appUrl("/account/api"), block: 2 },
    { icon: <Boxes size={22} strokeWidth={2} />, copy: t.cards.mcp, href: appUrl("/account/api"), block: 3 },
  ];

  const sections = [t.reference.auth, t.reference.tools, t.reference.limits];

  return (
    <div style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <SiteNav active="docs" locale={locale} />
      <main id="main" tabIndex={-1}>

      {/* Hero */}
      <div className="tlp-page-hero" style={{ paddingInline: 32, maxWidth: 1180, margin: "0 auto" }}>
        <div className="eyebrow is-brand" style={{ marginBottom: 12, display: "inline-flex", alignItems: "center", gap: 8 }}>
          <BookOpen size={14} strokeWidth={2} />
          {t.eyebrow}
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "var(--text-5xl)",
            letterSpacing: 0,
            lineHeight: 0.92,
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          {t.title[0]}
          <br />
          <span style={{ color: "var(--brand-700)" }}>{t.title[1]}</span>
          <br />
          {t.title[2]}
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 18, marginTop: 18, maxWidth: 620 }}>
          {t.lead}
        </p>
      </div>

      {/* Three big block cards */}
      <div className="tlp-page-section" style={{ paddingInline: 32, maxWidth: 1180, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {cards.map((c) => (
            <Link
              key={c.copy.title}
              href={c.href}
              style={{
                background: `var(--block-${c.block})`,
                color: `var(--block-${c.block}-fg)`,
                border: "1.5px solid var(--text-primary)",
                padding: 24,
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                minHeight: 220,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: "var(--text-primary)",
                  color: "var(--text-inv)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {c.icon}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: 0,
                  textTransform: "uppercase",
                  opacity: 0.85,
                }}
              >
                {c.copy.eyebrow}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: 28,
                  letterSpacing: 0,
                  textTransform: "uppercase",
                  lineHeight: 1,
                }}
              >
                {c.copy.title}
              </div>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, flex: 1 }}>{c.copy.body}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 13 }}>
                {t.open}
                <ArrowRight size={14} strokeWidth={2.5} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Reference grid */}
      <div className="tlp-page-section" style={{ paddingInline: 32, maxWidth: 1180, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 36,
            letterSpacing: 0,
            textTransform: "uppercase",
            margin: "0 0 24px",
          }}
        >
          {t.referenceTitle}
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {sections.map((sec) => (
            <div
              key={sec.title}
              style={{
                background: "var(--bg-card)",
                border: "1.5px solid var(--border)",
                padding: 24,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: 22,
                  letterSpacing: 0,
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                {sec.title}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                {sec.items.map((it) => (
                  <li key={it.name}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{fill(it.name, REFERENCE_FACTS)}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 2 }}>
                      {fill(it.desc, REFERENCE_FACTS)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Sample request */}
      <div className="tlp-page-section" style={{ paddingInline: 32, maxWidth: 1180, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 36,
            letterSpacing: 0,
            textTransform: "uppercase",
            margin: "0 0 16px",
          }}
        >
          {t.sampleTitle}
        </h2>
        <div
          style={{
            background: "var(--ink-900)",
            color: "var(--paper-100)",
            border: "1.5px solid var(--text-primary)",
            padding: 24,
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            lineHeight: 1.7,
            overflowX: "auto",
          }}
        >
          <div style={{ color: "var(--butter-400)", marginBottom: 8 }}>$ POST /api/tools/word-counter</div>
          <div>{"curl -X POST https://toolips.xyz/api/tools/word-counter \\"}</div>
          <div>{"  -H 'authorization: Bearer tlp_live_…' \\"}</div>
          <div>{"  -H 'content-type: application/json' \\"}</div>
          <div>{"  -d '{\"text\": \"hello world\"}'"}</div>
          <div style={{ color: "var(--brand-300)", marginTop: 16 }}>{"// → { \"words\": 2, \"chars\": 11, \"lines\": 1 }"}</div>
        </div>
      </div>

      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
