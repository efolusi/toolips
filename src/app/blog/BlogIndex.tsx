"use client";

// The post list with its category filter, and the newsletter sign-up. The form
// posts to the API, which redirects back here with ?newsletter=<status>.

import { useState } from "react";
import Link from "next/link";
import { Alert, Input } from "@efolusi/meridian";
import type { BlogCategory, Post } from "~/lib/blog";
import { apiUrl } from "~/lib/api";
import { formatDate } from "~/lib/dates";
import type { Dictionary, Locale } from "~/lib/i18n";
import { localizedPath } from "~/lib/locale-routing";
import { fill } from "~/lib/site-facts";

type BlogDict = Dictionary["blog"];
type Cat = "All" | BlogCategory;
const CATS: Cat[] = ["All", "Engineering", "Design", "Product", "Changelog"];
const STATUSES = ["subscribed", "invalid", "ratelimited", "toolarge", "error"] as const;
type NewsletterStatus = (typeof STATUSES)[number];

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

export function BlogIndex({
  posts,
  locale,
  t,
  newsletterStatus,
}: {
  posts: Post[];
  locale: Locale;
  t: BlogDict;
  newsletterStatus?: string;
}) {
  const [cat, setCat] = useState<Cat>("All");
  const shown = cat === "All" ? posts : posts.filter((p) => p.category === cat);
  const status = STATUSES.find((s) => s === newsletterStatus) as NewsletterStatus | undefined;

  return (
    <>
      <section className="section" style={{ paddingTop: 0 }} aria-label={t.metaTitle}>
        <div className="wrap">
          <div className="toolbar">
            <div className="filters" role="group" aria-label={t.filterLabel}>
              {CATS.filter((c) => c === "All" || posts.some((p) => p.category === c)).map((c) => (
                <button
                  key={c}
                  type="button"
                  className="ef-btn ef-btn--secondary ef-btn--sm"
                  aria-pressed={cat === c}
                  onClick={() => setCat(c)}
                >
                  {catLabel(c, t)}
                </button>
              ))}
            </div>
            <p className="muted" aria-live="polite">
              {fill(shown.length === 1 ? t.postCountOne : t.postCount, { count: shown.length })}
            </p>
          </div>
          {shown.length > 0 ? (
            <ul className="post-list">
              {shown.map((p) => (
                <li key={p.slug}>
                  <Link href={localizedPath(locale, `/blog/${p.slug}`)}>
                    <div className="post-meta">
                      <time dateTime={p.date}>{formatDate(p.date, locale)}</time>
                      <br />
                      {catLabel(p.category, t)}
                    </div>
                    <div lang={p.lang}>
                      <h2>{p.title}</h2>
                      <p>{p.summary}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty">
              <p>{t.emptyCategory}</p>
            </div>
          )}
        </div>
      </section>

      <section className="section section--rule" aria-labelledby="newsletter-title">
        <div className="wrap newsletter">
          <div>
            <h2 id="newsletter-title" className="display-2">{t.newsletter.title}</h2>
            <p className="lede">{t.newsletter.lead}</p>
          </div>
          <div>
            {status ? (
              <Alert variant={status === "subscribed" ? "default" : "danger"} role="status" style={{ marginBottom: "var(--space-4)" }}>
                {t.newsletter[status]}
              </Alert>
            ) : null}
            <form action={apiUrl("/api/newsletter")} method="post">
              <Input
                name="email"
                type="email"
                required
                size="lg"
                label={t.newsletter.emailLabel}
                placeholder={t.newsletter.emailPlaceholder}
                autoComplete="email"
              />
              <button type="submit" className="ef-btn ef-btn--primary ef-btn--lg">
                {t.newsletter.subscribe}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
