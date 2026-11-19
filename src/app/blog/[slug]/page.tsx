// One blog post. On /id a post with an Indonesian version shows it; any other
// post shows a one-line note that it is in English, and its body is lang="en".

import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "~/components/PageShell";
import { getAllPosts, getPost } from "~/lib/blog";
import { formatDate } from "~/lib/dates";
import { dictionaries } from "~/lib/i18n";
import { localeAlternates, localizedPath } from "~/lib/locale-routing";
import { requestLocale } from "~/lib/request-locale";
import { fill } from "~/lib/site-facts";
import { ShareButtonClient } from "./ShareButtonClient";

// Unknown slugs are rewritten to the 404 before this runs
// (unknown-slug-rewrites.mjs). dynamicParams = false would make OpenNext 404
// every post, so it stays at the default.
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await requestLocale();
  const post = await getPost(slug, locale);
  if (!post) return { title: { absolute: dictionaries[locale].blog.post.notFoundTitle } };
  return {
    alternates: localeAlternates(locale, `/blog/${post.slug}`),
    title: post.title,
    description: post.summary || undefined,
    openGraph: { title: post.title, description: post.summary || undefined, type: "article", authors: [post.author], publishedTime: post.date },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await requestLocale();
  const t = dictionaries[locale].blog;
  const post = await getPost(slug, locale);
  if (!post) notFound();
  const more = (await getAllPosts(locale)).filter((p) => p.slug !== post.slug).slice(0, 3);
  const note = post.lang !== locale ? t.englishNote : "";

  return (
    <PageShell locale={locale} active="blog">
      <article className="section wrap wrap--text">
        <ol className="crumbs">
          <li>
            <Link href={localizedPath(locale, "/blog")}>{t.post.back}</Link>
          </li>
        </ol>
        {note ? <p className="eyebrow">{note}</p> : null}
        <div lang={post.lang}>
          <h1 className="display-1">{post.title}</h1>
          <p className="post-meta" style={{ marginTop: "var(--space-4)" }}>
            {post.author} · <time dateTime={post.date}>{formatDate(post.date, locale)}</time> ·{" "}
            {fill(t.minRead, { min: post.read })}
          </p>
          {/* Rendered by tinyMd in lib/blog.ts, which escapes everything first. */}
          <div className="prose" style={{ marginTop: "var(--space-8)" }} dangerouslySetInnerHTML={{ __html: post.html }} />
        </div>
        <ShareButtonClient share={t.post.share} copied={t.post.copied} />
      </article>

      {more.length > 0 ? (
        <section className="section section--rule" aria-labelledby="more-title">
          <div className="wrap">
            <h2 id="more-title" className="display-2" style={{ marginBottom: "var(--space-6)" }}>
              {t.post.keepReading}
            </h2>
            <ul className="post-list">
              {more.map((p) => (
                <li key={p.slug}>
                  <Link href={localizedPath(locale, `/blog/${p.slug}`)}>
                    <div className="post-meta">
                      <time dateTime={p.date}>{formatDate(p.date, locale)}</time>
                    </div>
                    <div lang={p.lang}>
                      <h3 className="display-3">{p.title}</h3>
                      <p>{p.summary}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </PageShell>
  );
}
