// Markdown blog reader. Posts live in content/blog at the repo root and reach the
// build through scripts/bundle-blog.mjs (the Worker has no file system).
// gray-matter parses the front-matter; the body is rendered with a tiny inline
// markdown→html converter. Keep the supported grammar intentionally narrow so
// the resulting HTML is easy to audit before it is injected into the page.

import matter from "gray-matter";
import { escapeHtml, escapeHtmlAttribute } from "~/lib/core/escape";
import { BLOG_SOURCES, BLOG_SOURCES_ID } from "~/lib/blog-content.generated";
import type { Locale } from "~/lib/i18n";

export type BlogCategory = "Engineering" | "Design" | "Product" | "Changelog";
const CATEGORIES: BlogCategory[] = ["Engineering", "Design", "Product", "Changelog"];

export interface Post {
  slug: string;
  title: string;
  date: string;
  summary: string;
  html: string;
  category: BlogCategory;
  author: string;
  /** Minutes. */
  read: number;
  /** The language this copy of the post is written in. */
  lang: Locale;
}

/** Every post, newest first, in `locale` where a translation exists. */
export async function getAllPosts(locale: Locale = "en"): Promise<Post[]> {
  const posts = Object.keys(BLOG_SOURCES).map((slug) => readPost(slug, locale));
  return posts
    .filter((p): p is Post => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(slug: string, locale: Locale = "en"): Promise<Post | null> {
  return readPost(slug, locale);
}

function readPost(slug: string, locale: Locale): Post | null {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) return null;
  if (!Object.hasOwn(BLOG_SOURCES, slug)) return null;
  const translated = locale === "id" && Object.hasOwn(BLOG_SOURCES_ID, slug);
  const raw = (translated ? BLOG_SOURCES_ID[slug] : BLOG_SOURCES[slug]) ?? "";
  try {
    const { data, content } = matter(raw);
    const cat = String(data.category ?? "Engineering");
    return {
      slug,
      title: String(data.title ?? slug),
      date: String(data.date ?? ""),
      summary: String(data.summary ?? ""),
      html: tinyMd(content),
      category: CATEGORIES.includes(cat as BlogCategory) ? (cat as BlogCategory) : "Engineering",
      author: String(data.author ?? "Toolips Team"),
      read: Math.max(1, Number(data.read) || Math.ceil(content.split(/\s+/).length / 220)),
      lang: translated ? "id" : "en",
    };
  } catch {
    return null;
  }
}

function tinyMd(src: string): string {
  const links: string[] = [];
  const withLinkPlaceholders = src.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, text: string, href: string) => {
    if (!safeLinkScheme(href)) return text;
    const i = links.push(`<a href="${escapeHtmlAttribute(href.trim())}" rel="noopener noreferrer">${escapeHtml(text)}</a>`) - 1;
    return `\u0000LINK:${i}\u0000`;
  });

  return escapeHtml(withLinkPlaceholders)
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/_([^_]+)_/g, "<em>$1</em>")
    .replace(/\u0000LINK:(\d+)\u0000/g, (_m, i: string) => links[Number(i)] ?? "")
    .split(/\n\n+/)
    .map((block) => {
      if (block.match(/^<(h\d|ul|ol|pre)/)) return block;
      const lines = block.split("\n");
      if (lines.every((l) => l.startsWith("- "))) {
        return `<ul>${lines.map((l) => `<li>${l.slice(2)}</li>`).join("")}</ul>`;
      }
      return `<p>${block.replace(/\n/g, "<br/>")}</p>`;
    })
    .join("\n");
}

function safeLinkScheme(href: string): boolean {
  const h = href.trim();
  if (h.startsWith("#")) return true;
  if (h.startsWith("/")) return !h.startsWith("//") && !h.startsWith("/\\");
  try {
    const url = new URL(h);
    return url.protocol === "http:" || url.protocol === "https:" || url.protocol === "mailto:";
  } catch {
    return false;
  }
}
