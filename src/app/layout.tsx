import "./globals.css";
import type { Metadata } from "next";
import type { Viewport } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import type { ReactNode } from "react";
import { SITE_URL } from "~/lib/api";
import { DEFAULT_LOCALE, dictionaries, isLocale } from "~/lib/i18n";
import { fill, TOOL_COUNT } from "~/lib/site-facts";
import { SkipLink } from "@efolusi/meridian";

const SITE_NAME = "Toolips";
// English defaults. Every page sets its own title, description and alternates
// in the request language.
const TITLE = dictionaries.en.meta.title;
const DESCRIPTION = fill(dictionaries.en.meta.description, { count: TOOL_COUNT });
const BASE = new URL(SITE_URL);

export const metadata: Metadata = {
  metadataBase: BASE,
  title: { default: TITLE, template: "%s · Toolips" },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Efolusi", url: "https://efolusi.com" }],
  creator: "Efolusi",
  publisher: "Efolusi",
  keywords: [
    "PDF tools",
    "image tools",
    "DNS lookup",
    "MCP server",
    "API",
    "utilities",
  ],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    url: BASE.toString(),
    locale: dictionaries.en.ogLocale,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: "@toolips",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF9F6" },
    { media: "(prefers-color-scheme: dark)", color: "#191512" },
  ],
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Nonce set by middleware (production CSP). Passed to the beforeInteractive
  // theme script so it satisfies the nonce-based script-src.
  const headerList = await headers();
  const nonce = headerList.get("x-nonce") ?? undefined;
  // Set by middleware.ts, which is the only thing that knows the route. Falls
  // back to English so a document rendered outside the middleware matcher (or
  // in a unit test) still declares a language rather than none.
  const localeHeader = headerList.get("x-locale");
  const dict = dictionaries[isLocale(localeHeader) ? localeHeader : DEFAULT_LOCALE];
  const lang = dict.htmlLang;
  return (
    // suppressHydrationWarning: /theme-init.js sets data-theme on <html> before
    // hydration (FOUC prevention), so the server HTML (no data-theme) and the
    // client tree intentionally differ on this one element.
    <html lang={lang} suppressHydrationWarning>
      <head>
        <Script src="/theme-init.js" strategy="beforeInteractive" nonce={nonce} />
      </head>
      <body>
        <SkipLink href="#main">{dict.nav.skipToContent}</SkipLink>
        {children}
      </body>
    </html>
  );
}
