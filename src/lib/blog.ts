// Markdown blog reader. Posts live in content/blog at the repo root and reach the
// build through scripts/bundle-blog.mjs (the Worker has no file system).
// gray-matter parses the front-matter; the body is rendered with a tiny inline
// markdown→html converter. Keep the supported grammar intentionally narrow so
// the resulting HTML is easy to audit before it is injected into the page.

import matter from "gray-matter";
import { escapeHtml, escapeHtmlAttribute } from "~/lib/core/escape";
import { BLOG_SOURCES } from "~/lib/blog-content.generated";

export type BlockColor = 1 | 2 | 3;
export type BlogCategory = "Engineering" | "Design" | "Product" | "Changelog";

export interface Post {
  slug: string;
  title: string;
  date: string;
  summary: string;
  html: string;
  // Editorial fields — added in design v2. All optional for backward compat.
  category: BlogCategory;
  author: string;
  read: number;          // minutes
  block: BlockColor;     // 1=teal, 2=butter, 3=clay (for hero block)
  featured: boolean;
}

export async function getAllPosts(): Promise<Post[]> {
  const posts = await Promise.all(Object.keys(BLOG_SOURCES).map((slug) => readPost(slug)));
  return posts
    .filter((p): p is Post => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(slug: string): Promise<Post | null> {
  return readPost(slug);
}

async function readPost(slug: string): Promise<Post | null> {
  // A slug must be a simple kebab token and a known post.
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) return null;
  const raw = Object.hasOwn(BLOG_SOURCES, slug) ? BLOG_SOURCES[slug] : undefined;
  if (raw === undefined) return null;
  try {
    const { data, content } = matter(raw);
    const cat = String(data.category ?? "Engineering");
    const validCats: BlogCategory[] = ["Engineering", "Design", "Product", "Changelog"];
    const category = (validCats.includes(cat as BlogCategory) ? cat : "Engineering") as BlogCategory;
    const block = ([1, 2, 3].includes(Number(data.block)) ? Number(data.block) : 1) as BlockColor;
    return {
      slug,
      title: String(data.title ?? slug),
      date: String(data.date ?? ""),
      summary: String(data.summary ?? ""),
      html: tinyMd(content),
      category,
      author: String(data.author ?? "Toolips Team"),
      read: Math.max(1, Number(data.read) || Math.ceil(content.split(/\s+/).length / 220)),
      block,
      featured: Boolean(data.featured),
    };
  } catch {
    return null;
  }
}

// Minimal markdown to HTML — paragraphs, headings, bold, italic, code, links.
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
    .map((block) => (block.match(/^<(h\d|ul|ol|pre)/) ? block : `<p>${block.replace(/\n/g, "<br/>")}</p>`))
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
