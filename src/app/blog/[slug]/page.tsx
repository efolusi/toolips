import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPost } from "~/lib/blog";
import { SiteNav, SiteFooter } from "~/components/SiteNav";
import { dictionaries, type Locale } from "~/lib/i18n";
import { localeAlternates, localizedPath } from "~/lib/locale-routing";
import { requestLocale } from "~/lib/request-locale";
import { fill } from "~/lib/site-facts";
import { ShareButtonClient } from "./ShareButtonClient";

// Only the page chrome (breadcrumb, byline labels, author bio, "keep reading",
// share button) is localized. The post body itself is written content — its
// language is the author's call, not the dictionary's — so it renders as-is.


// Known slugs are prerendered. Unknown ones never reach this page: the rewrites in
// unknown-slug-rewrites.mjs send them to the 404, and readPost still rejects any
// slug that fails its regex. dynamicParams = false would make OpenNext 404 every post.

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  const locale = await requestLocale();
  // Absolute: these titles already carry the brand, so skip the layout template.
  if (!post) return { title: { absolute: dictionaries[locale].blog.post.notFoundTitle } };
  return {
    alternates: localeAlternates(locale, `/blog/${post.slug}`),
    title: { absolute: `${post.title} · Toolips Blog` },
    description: post.summary || undefined,
    openGraph: {
      title: post.title,
      description: post.summary || undefined,
      type: "article",
      authors: [post.author],
      publishedTime: post.date,
    },
  };
}

function fmtDate(d: string, locale: Locale): string {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function blockVar(n: 1 | 2 | 3): string {
  return n === 1 ? "var(--block-1)" : n === 2 ? "var(--block-2)" : "var(--block-3)";
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const locale = await requestLocale();
  const t = dictionaries[locale];
  const all = await getAllPosts();
  const related = all.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div style={{ background: "var(--bg-base)", color: "var(--text-primary)", minHeight: "100vh" }}>
      <SiteNav active="blog" locale={locale} />
      <main id="main" tabIndex={-1}>

      <article className="tlp-page" style={{ paddingInline: 32, maxWidth: 760, margin: "0 auto" }}>
        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "var(--text-muted)",
            marginBottom: 24,
            textTransform: "uppercase",
            letterSpacing: 0,
          }}
        >
          <Link href={localizedPath(locale, "/blog")} style={{ color: "var(--text-muted)", textDecoration: "none" }}>
            {t.nav.blog}
          </Link>
          <span>/</span>
          <span style={{ color: "var(--text-primary)", fontWeight: 700 }}>{post.category}</span>
        </div>

        {/* Title — sentence case, not uppercase, per design */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "var(--text-4xl)",
            letterSpacing: 0,
            textTransform: "none",
            margin: "0 0 20px",
            lineHeight: 1.02,
          }}
        >
          {post.title}
        </h1>

        {/* Author + date + read */}
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            letterSpacing: 0,
            textTransform: "uppercase",
            color: "var(--text-muted)",
            marginBottom: 32,
            flexWrap: "wrap",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 28,
                height: 28,
                background: "var(--text-primary)",
                color: "var(--text-inv)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 10,
              }}
            >
              {initials(post.author)}
            </span>
            {post.author}
          </span>
          <span>·</span>
          <span>{fmtDate(post.date, locale)}</span>
          <span>·</span>
          <span>{fill(t.blog.minRead, { min: post.read })}</span>
        </div>

        {/* Hero block */}
        <div
          style={{
            background: blockVar(post.block),
            padding: 48,
            marginBottom: 40,
            display: "flex",
            justifyContent: "center",
            borderRadius: 18,
          }}
          aria-hidden
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "60px 60px 60px",
              gridTemplateRows: "60px 60px",
              gap: 8,
            }}
          >
            <div style={{ background: "var(--ink-900)" }} />
            <div style={{ background: "var(--gold-500)" }} />
            <div style={{ background: "var(--paper-100)", borderRadius: "50%" }} />
            <div style={{ background: "var(--gold-500)", borderRadius: "50%" }} />
            <div style={{ background: "var(--paper-100)" }} />
            <div style={{ background: "var(--ink-900)" }} />
          </div>
        </div>

        {/* Excerpt (drop cap style) */}
        {post.summary && (
          <p
            style={{
              margin: "0 0 24px",
              fontSize: 22,
              color: "var(--text-secondary)",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              letterSpacing: 0,
              lineHeight: 1.35,
            }}
          >
            {post.summary}
          </p>
        )}

        {/* Body */}
        <div
          className="blog-prose"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 18,
            lineHeight: 1.7,
            color: "var(--text-primary)",
          }}
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        {/* Author / share footer */}
        <div
          style={{
            marginTop: 56,
            padding: 24,
            border: "1.5px solid var(--border)",
            borderRadius: 18,
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            gap: 16,
            alignItems: "center",
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
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            {initials(post.author)}
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, letterSpacing: 0 }}>
              {post.author}
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
              {t.blog.post.authorBio}
            </div>
          </div>
          <ShareButtonClient share={t.blog.post.share} copied={t.blog.post.copied} />
        </div>

        {/* Keep reading */}
        {related.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: 24,
                letterSpacing: 0,
                textTransform: "uppercase",
                margin: "0 0 16px",
              }}
            >
              {t.blog.post.keepReading}
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 12,
              }}
            >
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={localizedPath(locale, `/blog/${p.slug}`)}
                  className="tool-card"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    background: "var(--bg-card)",
                    border: "1.5px solid var(--border)",
                    padding: 16,
                    borderRadius: 14,
                  }}
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
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      fontSize: 17,
                      letterSpacing: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    {p.title}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
