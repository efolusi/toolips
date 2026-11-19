import { getAllPosts } from "~/lib/blog";
import { SITE_URL } from "~/lib/api";
import { LOCALES } from "~/lib/i18n";
import { localizedPath } from "~/lib/locale-routing";
import type { MetadataRoute } from "next";

type Entry = MetadataRoute.Sitemap[number];

/**
 * One public route, three URLs: the unprefixed one that picks a language for
 * the reader, and one per locale. Each entry names the other two as hreflang
 * alternates, so a crawler sees a set of translations rather than duplicates.
 */
function localized(base: string, path: string, lastModified: Date): Entry[] {
  const languages = {
    ...Object.fromEntries(LOCALES.map((l) => [l, `${base}${localizedPath(l, path)}`])),
    "x-default": `${base}${path === "/" ? "" : path}`,
  };
  return [path, ...LOCALES.map((l) => localizedPath(l, path))].map((p) => ({
    url: `${base}${p === "/" ? "" : p}`,
    lastModified,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL;
  const now = new Date();

  const pages = ["/", "/pricing", "/docs", "/blog", "/privacy", "/terms"].flatMap((p) =>
    localized(base, p, now),
  );
  const posts = (await getAllPosts()).flatMap((p) =>
    localized(base, `/blog/${p.slug}`, p.date ? new Date(p.date) : now),
  );

  return [
    ...pages,
    ...posts,
  ];
}
