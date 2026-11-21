import type { Metadata } from "next";
import { HomePage } from "~/components/HomePage";
import { homeMetadata } from "~/lib/home-metadata";

// The English home page. Both languages live under their own prefix, so the
// copy is in the HTML for search engines and a shared link opens in its language.
export const metadata: Metadata = homeMetadata("en");

export default function EnglishHome() {
  return <HomePage locale="en" />;
}
