import type { Metadata } from "next";
import { dictionaries, type Locale } from "./i18n";
import { fill, TOOL_COUNT } from "./site-facts";

/** Title, description, alternates and share tags of the home page in `locale`. */
export function homeMetadata(locale: Locale): Metadata {
  const t = dictionaries[locale];
  const description = fill(t.meta.description, { count: TOOL_COUNT });
  return {
    // Absolute: the layout template would append the brand a second time.
    title: { absolute: t.meta.title },
    description,
    alternates: { canonical: `/${locale}`, languages: { en: "/en", id: "/id", "x-default": "/" } },
    openGraph: {
      title: t.meta.title,
      description,
      url: `/${locale}`,
      locale: t.ogLocale,
      type: "website",
      siteName: "Toolips",
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: t.meta.title }],
    },
    twitter: { card: "summary_large_image", title: t.meta.title, description, images: ["/opengraph-image.png"] },
  };
}
