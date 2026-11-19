// The bare hub URL.
//
// Middleware redirects a signed-out visitor to /en or /id before this renders,
// so in practice this serves signed-in visitors and anything that reaches '/'
// with a session cookie. It still renders the full landing rather than
// redirecting on its own: '/' is what the product's nav links to, and old
// links, shared URLs and the sitemap must not 404 if the middleware is ever
// bypassed.
//
// The locale comes from the x-locale header the middleware sets, which is the
// same value the root layout puts in <html lang>, so the markup and the
// attribute cannot disagree.

import { headers } from "next/headers";
import { Landing } from "~/components/Landing";
import { isLocale, DEFAULT_LOCALE } from "~/lib/i18n";

export default async function HubPage({ searchParams }: { searchParams: Promise<{ deleted?: string }> }) {
  const { deleted } = await searchParams;
  const header = (await headers()).get("x-locale");
  const locale = isLocale(header) ? header : DEFAULT_LOCALE;
  return <Landing locale={locale} deleted={Boolean(deleted)} />;
}
