// Blog index. A post with an Indonesian version lists in Indonesian on /id;
// the others keep their English title and are marked lang="en".

import type { Metadata } from "next";
import { PageShell } from "~/components/PageShell";
import { Accented } from "~/components/Accented";
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

export default async function BlogIndexPage({ searchParams }: { searchParams: Promise<{ newsletter?: string }> }) {
  const { newsletter } = await searchParams;
  const locale = await requestLocale();
  const t = dictionaries[locale].blog;
  const posts = await getAllPosts(locale);
  return (
    <PageShell locale={locale} active="blog">
      <section className="page-head">
        <div className="wrap">
          <h1 className="display-1">
            <Accented parts={t.title} />
          </h1>
          <p className="lede">{t.lead}</p>
        </div>
      </section>
      <BlogIndex posts={posts} newsletterStatus={newsletter} locale={locale} t={t} />
    </PageShell>
  );
}
