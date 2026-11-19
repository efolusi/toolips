import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { dictionaries } from "~/lib/i18n";

describe("404 document title", () => {
  it("is translated per locale, brand last", () => {
    expect(dictionaries.en.notFound.metaTitle).toBe("Page not found · Toolips");
    expect(dictionaries.id.notFound.metaTitle).toBe("Halaman tidak ditemukan · Toolips");
  });

  it("not-found.tsx resolves it per request instead of exporting a static title", () => {
    const src = readFileSync(fileURLToPath(new URL("../app/not-found.tsx", import.meta.url)), "utf8");
    expect(src).toMatch(/export async function generateMetadata/);
    expect(src).toMatch(/notFound\.metaTitle/);
    expect(src).not.toMatch(/export const metadata\b/);
  });
});
