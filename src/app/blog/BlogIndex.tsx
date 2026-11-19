"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@efolusi/meridian";
import { Input } from "@efolusi/meridian";
import type { Post } from "~/lib/blog";
import { apiUrl } from "~/lib/api";
import type { Dictionary, Locale } from "~/lib/i18n";
import { localizedPath } from "~/lib/locale-routing";
import { fill } from "~/lib/site-facts";

// Filter values match the `category` field in post front matter and never
// change with the locale; only their display labels are translated.
const CATS = ["All", "Engineering", "Design", "Product", "Changelog"] as const;
type Cat = (typeof CATS)[number];
type BlogDict = Dictionary["blog"];
type NewsletterStatus = "subscribed" | "invalid" | "ratelimited" | "toolarge" | "error";

function catLabel(c: Cat, t: BlogDict): string {
  const labels: Record<Cat, string> = {
    All: t.categories.all,
    Engineering: t.categories.engineering,
    Design: t.categories.design,
    Product: t.categories.product,
    Changelog: t.categories.changelog,
  };
  return labels[c];
}

function newsletterMessages(
  t: BlogDict,
): Record<NewsletterStatus, { tone: "success" | "error"; text: string }> {
  return {
    subscribed: { tone: "success", text: t.newsletter.subscribed },
    invalid: { tone: "error", text: t.newsletter.invalid },
    ratelimited: { tone: "error", text: t.newsletter.ratelimited },
    toolarge: { tone: "error", text: t.newsletter.toolarge },
    error: { tone: "error", text: t.newsletter.error },
  };
}

function fmtDate(d: string, locale: Locale): string {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function blockVar(n: 1 | 2 | 3): string {
  return n === 1 ? "var(--block-1)" : n === 2 ? "var(--block-2)" : "var(--block-3)";
}

function BauhausGrid({ size = 60, cols = 2 }: { size?: number; cols?: 2 | 3 }) {
  // The little block + circle pattern that appears in every post card.
  const cells =
    cols === 2
      ? [
          { bg: "var(--ink-900)" },
          { bg: "var(--gold-500)" },
          { bg: "var(--paper-100)", round: true },
          { bg: "var(--ink-900)" },
        ]
      : [
          { bg: "var(--ink-900)" },
          { bg: "var(--gold-500)" },
          { bg: "var(--paper-100)", round: true },
          { bg: "var(--gold-500)", round: true },
          { bg: "var(--paper-100)" },
          { bg: "var(--ink-900)" },
        ];
  return (
    <div
      aria-hidden
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, ${size}px)`,
        gridTemplateRows: `repeat(${cols === 2 ? 2 : 2}, ${size}px)`,
        gap: 8,
      }}
    >
      {cells.map((c, i) => (
        <div key={i} style={{ background: c.bg, borderRadius: c.round ? "50%" : 0 }} />
      ))}
    </div>
  );
}

export function BlogIndex({
  posts,
  newsletterStatus,
  locale,
  t,
}: {
  posts: Post[];
  newsletterStatus?: string;
  locale: Locale;
  t: BlogDict;
}) {
  const [cat, setCat] = useState<Cat>("All");
  const newsletterMessage = isNewsletterStatus(newsletterStatus)
    ? newsletterMessages(t)[newsletterStatus]
    : null;
  const filtered = useMemo(
    () => (cat === "All" ? posts : posts.filter((p) => p.category === cat)),
    [posts, cat],
  );
  const featured = posts.find((p) => p.featured) ?? null;
  const rest = useMemo(
    () => filtered.filter((p) => !(cat === "All" && p === featured)),
    [filtered, featured, cat],
  );

  return (
    <div className="tlp-page" style={{ paddingInline: 32, maxWidth: 1180, margin: "0 auto" }}>
      <div className="eyebrow is-brand" style={{ marginBottom: 8 }}>
        Blog · {fill(posts.length === 1 ? t.postCountOne : t.postCount, { count: posts.length })}
      </div>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "var(--text-5xl)",
          letterSpacing: 0,
          textTransform: "uppercase",
          margin: "0 0 16px",
          lineHeight: 0.9,
        }}
      >
        {t.title}
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: 18, maxWidth: 580, margin: "0 0 40px" }}>
        {t.lead}
      </p>

      {/* Category chips */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
        {CATS.map((c) => (
          <button
            key={c}
            className="chip"
            aria-pressed={cat === c}
            onClick={() => setCat(c)}
            type="button"
          >
            {catLabel(c, t)}
          </button>
        ))}
      </div>

      {/* Featured post — only when "All" filter is active */}
      {cat === "All" && featured && (
        <Link
          href={localizedPath(locale, `/blog/${featured.slug}`)}
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: 0,
            marginBottom: 48,
            background: "var(--bg-card)",
            border: "2px solid var(--text-primary)",
            borderRadius: 22,
            overflow: "hidden",
            textDecoration: "none",
            color: "inherit",
          }}
          className="tlp-blog-featured"
        >
          <div
            style={{
              background: blockVar(featured.block),
              minHeight: 320,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 32,
            }}
          >
            <BauhausGrid size={60} cols={2} />
          </div>
          <div
            style={{
              padding: "32px 28px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 14,
            }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span
                style={{
                  background: "var(--text-primary)",
                  color: "var(--text-inv)",
                  padding: "3px 9px",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 0,
                  textTransform: "uppercase",
                  borderRadius: 4,
                }}
              >
                {t.featured}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: 0,
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                }}
              >
                {featured.category}
              </span>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "var(--text-2xl)",
                letterSpacing: 0,
                lineHeight: 1.05,
                margin: 0,
              }}
            >
              {featured.title}
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: 16, margin: 0, lineHeight: 1.5 }}>
              {featured.summary}
            </p>
            <div
              style={{
                display: "flex",
                gap: 12,
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: 0,
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginTop: 8,
              }}
            >
              <span>{featured.author}</span>
              <span>·</span>
              <span>{fmtDate(featured.date, locale)}</span>
              <span>·</span>
              <span>{fill(t.minRead, { min: featured.read })}</span>
            </div>
          </div>
        </Link>
      )}

      {/* Grid */}
      {rest.length === 0 ? (
        <div
          style={{
            background: "var(--bg-card)",
            border: "1.5px dashed var(--border)",
            padding: 56,
            textAlign: "center",
            color: "var(--text-muted)",
            borderRadius: 14,
          }}
        >
          {t.emptyCategory}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {rest.map((p) => (
            <Link
              key={p.slug}
              href={localizedPath(locale, `/blog/${p.slug}`)}
              className="tool-card"
              style={{
                textDecoration: "none",
                color: "var(--text-primary)",
                padding: 0,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                background: "var(--bg-card)",
                border: "1.5px solid var(--border)",
                borderRadius: 14,
              }}
            >
              <div
                style={{
                  background: blockVar(p.block),
                  height: 140,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 20,
                }}
              >
                <BauhausGrid size={32} cols={2} />
              </div>
              <div
                style={{ padding: 18, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: 0,
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                  }}
                >
                  {p.category}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: 19,
                    letterSpacing: 0,
                    lineHeight: 1.15,
                    margin: 0,
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: 14,
                    lineHeight: 1.5,
                    margin: 0,
                    flex: 1,
                  }}
                >
                  {p.summary}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: 0,
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    marginTop: 4,
                  }}
                >
                  <span>{fmtDate(p.date, locale)}</span>
                  <span>{fill(t.minShort, { min: p.read })}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Newsletter strip */}
      <form
        action={apiUrl("/api/newsletter")}
        method="post"
        style={{
          marginTop: 48,
          padding: 28,
          background: "var(--ink-900)",
          color: "var(--paper-100)",
          border: "2px solid var(--gold-500)",
          borderRadius: 22,
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 24,
          alignItems: "center",
        }}
        className="tlp-blog-newsletter"
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 28,
              letterSpacing: 0,
              textTransform: "uppercase",
              color: "var(--paper-100)",
            }}
          >
            {t.newsletter.title}
          </div>
          <div style={{ color: "rgba(250,247,242,0.7)", marginTop: 6 }}>{t.newsletter.lead}</div>
          {newsletterMessage && (
            <div
              role="status"
              style={{
                color: newsletterMessage.tone === "success" ? "var(--gold-500)" : "var(--danger)",
                fontSize: 13,
                fontWeight: 700,
                marginTop: 10,
              }}
            >
              {newsletterMessage.text}
            </div>
          )}
        </div>
        <div className="tlp-blog-newsletter-row" style={{ display: "flex", gap: 8 }}>
          <Input
            name="email"
            type="email"
            required
            placeholder={t.newsletter.emailPlaceholder}
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "var(--paper-100)",
              borderColor: "rgba(250,247,242,0.2)",
              minWidth: 220,
            }}
          />
          <Button
            type="submit"
            variant="primary"
            className="tlp-btn--pro"
            style={{ whiteSpace: "nowrap" }}
          >
            <Sparkles size={14} strokeWidth={2} />
            {t.newsletter.subscribe}
          </Button>
        </div>
      </form>
    </div>
  );
}

function isNewsletterStatus(value: string | undefined): value is NewsletterStatus {
  return (
    value === "subscribed" ||
    value === "invalid" ||
    value === "ratelimited" ||
    value === "toolarge" ||
    value === "error"
  );
}
