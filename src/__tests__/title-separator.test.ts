import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { dictionaries } from "~/lib/i18n";

// House convention: "Page · Brand", middle dot, brand last. Never a pipe.
describe("document title separator", () => {
  it("the root layout template uses the middle dot", () => {
    const src = readFileSync(fileURLToPath(new URL("../app/layout.tsx", import.meta.url)), "utf8");
    expect(src).toContain('template: "%s · Toolips"');
  });

  it("no dictionary string joins the brand with a pipe", () => {
    expect(JSON.stringify(dictionaries)).not.toMatch(/\| Toolips|Toolips \|/);
  });

  it("sub-page titles end with the brand", () => {
    for (const d of Object.values(dictionaries)) {
      for (const title of [d.pricing.metaTitle, d.docs.metaTitle, d.notFound.metaTitle]) {
        expect(title).toMatch(/ · Toolips$/);
      }
    }
  });
});
