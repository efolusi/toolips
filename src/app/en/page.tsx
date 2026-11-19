import type { Metadata } from "next";
import { Landing } from "~/components/Landing";
import { dictionaries } from "~/lib/i18n";
import { fill, TOOL_COUNT } from "~/lib/site-facts";

/**
 * The English landing page.
 *
 * Both languages live under their own prefix, /en and /id, so neither is a
 * special case and every canonical and alternate has an obvious shape. A real
 * route rather than a client-side toggle: the copy has to be in the HTML for
 * search engines, and a reader arriving from a shared link must get their
 * language without a flash of the other one first.
 */
const t = dictionaries.en;

export const metadata: Metadata = {
  // Absolute: the root layout template appends " · Toolips" to every other page
  // title, and the landing title already carries the brand.
  title: { absolute: t.meta.title },
  description: fill(t.meta.description, { count: TOOL_COUNT }),
  alternates: { canonical: "/en", languages: { en: "/en", id: "/id", "x-default": "/" } },
  openGraph: {
    title: t.meta.title,
    description: fill(t.meta.description, { count: TOOL_COUNT }),
    url: "/en",
    locale: t.ogLocale,
    type: "website",
    siteName: "Toolips",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: t.meta.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: t.meta.title,
    description: fill(t.meta.description, { count: TOOL_COUNT }),
    images: ["/opengraph-image.png"],
  },
};

export default function EnglishLandingPage() {
  return <Landing locale="en" />;
}
