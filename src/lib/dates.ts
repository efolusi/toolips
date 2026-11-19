import type { Locale } from "./i18n";

/** A post date in the reader's language, e.g. "May 23, 2026" or "23 Mei 2026". */
export function formatDate(d: string, locale: Locale): string {
  const dt = new Date(d);
  if (!d || Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
