import type { Metadata } from "next";
import { HomePage } from "~/components/HomePage";
import { homeMetadata } from "~/lib/home-metadata";

// The Indonesian home page.
export const metadata: Metadata = homeMetadata("id");

export default function IndonesianHome() {
  return <HomePage locale="id" />;
}
