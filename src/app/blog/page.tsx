// Blog index: single route, two languages. Only the chrome (headings, labels,
// newsletter, dates) is localized — post titles, summaries and bodies are
// written content and stay in the language they were written in.

import type { Metadata } from "next";

import { SiteNav, SiteFooter } from "~/components/SiteNav";
import { dictionaries } from "~/lib/i18n";
import { localeAlternates } from "~/lib/locale-routing";
import { requestLocale } from "~/lib/request-locale";
import { getAllPosts } from "~/lib/blog";
import { BlogIndex } from "./BlogIndex";


export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  const t = dictionaries[locale].blog;
  return { alternates: localeAlternates(locale, "/blog"), title: { absolute: t.metaTitle }, description: t.metaDescription };
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ newsletter?: string }>;
}) {
  const { newsletter } = await searchParams;
  const locale = await requestLocale();
  const posts = await getAllPosts();
  return (
    <div style={{ background: "var(--bg-base)", color: "var(--text-primary)", minHeight: "100vh" }}>
      <SiteNav active="blog" locale={locale} />
      <main id="main" tabIndex={-1}>
      <BlogIndex posts={posts} newsletterStatus={newsletter} locale={locale} t={dictionaries[locale].blog} />
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
