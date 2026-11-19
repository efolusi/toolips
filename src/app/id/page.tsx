import type { Metadata } from "next";
import { Landing } from "~/components/Landing";
import { dictionaries } from "~/lib/i18n";
import { fill, TOOL_COUNT } from "~/lib/site-facts";

/**
 * The Indonesian landing page. See ../en/page.tsx for why both are real routes.
 *
 * The tool pages, docs and blog behind this one are still English. That is
 * scoped rather than forgotten: see the note at the top of src/lib/i18n.ts.
 */
const t = dictionaries.id;

export const metadata: Metadata = {
  // Absolute: the root layout template appends " · Toolips" to every other page
  // title, and the landing title already carries the brand.
  title: { absolute: t.meta.title },
  description: fill(t.meta.description, { count: TOOL_COUNT }),
  alternates: { canonical: "/id", languages: { en: "/en", id: "/id", "x-default": "/" } },
  openGraph: {
    title: t.meta.title,
    description: fill(t.meta.description, { count: TOOL_COUNT }),
    url: "/id",
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

export default function IndonesianLandingPage() {
  return <Landing locale="id" />;
}
