import { describe, expect, it } from "vitest";

import { DOWNLOADERS_SUSPENDED } from "~/lib/core/catalog";

import { dictionaries, LOCALES } from "../i18n";
import * as siteFacts from "../site-facts";

/** Every leaf string in a dictionary, keyed by its dotted path. */
function leaves(value: unknown, path = ""): Array<[string, string]> {
  if (typeof value === "string") return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((v, i) => leaves(v, `${path}[${i}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => leaves(v, path ? `${path}.${k}` : k));
  }
  return [];
}

// The Pro button posts straight to a paid checkout: Pay charges the first
// period immediately and nothing in billing grants a trial. A trial promise in
// the copy is therefore a promise the product breaks on the very first click.
describe("no free trial is promised", () => {
  it("keeps no trial length among the site facts", () => {
    expect("TRIAL_DAYS" in siteFacts).toBe(false);
  });

  it("never mentions a trial in either language", () => {
    const trial = /\btrial\b|coba gratis|uji coba|masa percobaan/i;
    for (const locale of LOCALES) {
      for (const [path, value] of leaves(dictionaries[locale])) {
        expect(value, `${locale}.${path} promises a trial: ${value}`).not.toMatch(trial);
      }
    }
  });

  it("labels the paid button as an upgrade in both languages", () => {
    for (const locale of LOCALES) {
      const label = dictionaries[locale].pricing.subscribe;
      expect(typeof label, `${locale}.pricing.subscribe is missing`).toBe("string");
      expect(label.trim().length).toBeGreaterThan(0);
    }
    expect(dictionaries.id.pricing.subscribe).not.toBe(dictionaries.en.pricing.subscribe);
  });

  it("keeps the refund window, which the terms do promise, as its own fact", () => {
    expect(siteFacts.REFUND_WINDOW_DAYS).toBe(14);
  });
});

// Every number the pricing page quotes must come from the limit the code
// actually enforces. The page used to promise 2 GB files, 500-file batches and
// a 5x priority queue while the server capped files at 50 MB, batches at 50,
// and had no queue priority at all.
describe("pricing claims come from the enforced limits", () => {
  const MiB = 1024 * 1024;

  it("quotes the file and batch caps the server enforces", async () => {
    const { FILE_PROCESSING_LIMITS } = await import("~/lib/core/file-capabilities");
    expect(siteFacts.PRICING_FACTS.mb).toBe(FILE_PROCESSING_LIMITS.maxFileBytes / MiB);
    expect(siteFacts.PRICING_FACTS.batch).toBe(FILE_PROCESSING_LIMITS.maxBatchImages);
  });

  it("quotes the free daily caps the quota module enforces", async () => {
    const { PLAN_LIMITS } = await import("~/lib/core/plan-limits");
    expect(siteFacts.PRICING_FACTS.exports).toBe(PLAN_LIMITS.free.exportsPerDay);
  });

  // Pro catalog tools (AI, downloaders, batch resize, Pro lookups) are now
  // refused to free callers on the server, so the free plan must not claim
  // "all tools" or a daily download allowance.
  it("promises the free plan only the free tools", () => {
    expect(siteFacts.PRICING_FACTS.free).toBe(siteFacts.FREE_TOOL_COUNT);
    expect("downloads" in siteFacts.PRICING_FACTS).toBe(false);
    for (const locale of LOCALES) {
      const features = dictionaries[locale].pricing.freeFeatures.join(" | ");
      expect(features, locale).toContain("{free}");
      expect(features, locale).not.toContain("{count}");
      expect(features, locale).not.toMatch(/download|unduhan/i);
    }
  });

  it("drops the facts that nothing in the code backs", () => {
    for (const unbacked of [
      "PRO_MAX_FILE_GB",
      "PRO_BATCH_FILES",
      "PRO_SPEED_MULTIPLIER",
      "PRO_API_MONTHLY_REQUESTS",
    ]) {
      expect(unbacked in siteFacts, `${unbacked} is still exported`).toBe(false);
    }
  });

  it("leaves no pricing token unfilled in either language", () => {
    for (const locale of LOCALES) {
      const t = dictionaries[locale].pricing;
      const lines = [
        ...t.freeFeatures,
        ...t.proFeatures,
        ...t.faq.map((item) => item.a),
        t.saveAnnual,
      ];
      for (const line of lines) {
        const filled = siteFacts.fill(line, siteFacts.PRICING_FACTS);
        expect(filled, `${locale}: unfilled token in "${line}"`).not.toMatch(/\{\w+\}/);
      }
    }
  });

  it("makes no claim about queue priority, gigabyte files, speedups, API caps or watermarks", () => {
    const unbacked = /priorit|\{gb\}|\bGB\b|\{speed\}|×|\{requests\}|soft.?cap|watermark/i;
    for (const locale of LOCALES) {
      const d = dictionaries[locale];
      for (const [path, value] of leaves({ pricing: d.pricing, upgrade: d.upgrade, docs: d.docs })) {
        expect(value, `${locale}.${path} makes an unbacked claim: ${value}`).not.toMatch(unbacked);
      }
    }
  });
});

describe("other surfaces repeat no unbacked plan claims", () => {
  const unbacked = /priority queu|2 GB|5× faster|soft-capped|1M (API calls|requests)|No watermarks/i;

  it.each([
    "src/lib/legal.ts",
    "content/blog/we-charge-four-dollars.md",
  ])("%s", async (relative) => {
    const { readFile } = await import("node:fs/promises");
    const { fileURLToPath } = await import("node:url");
    const source = await readFile(fileURLToPath(new URL(`../../../${relative}`, import.meta.url)), "utf8");
    expect(source).not.toMatch(unbacked);
  });
});

// Downloaders are switched off (DOWNLOADERS_SUSPENDED in @toolips/tool-core),
// so no copy may sell them. The tool page's own "paused" notice is the one
// place that names them, because it explains why the page does not run.
describe("no downloader is sold while the family is suspended", () => {
  it("leaves downloaders out of every dictionary string but the paused notice", () => {
    if (!DOWNLOADERS_SUSPENDED) return;
    const download = /downloader|pengunduh|unduhan|youtube|tiktok/i;
    for (const locale of LOCALES) {
      for (const [path, value] of leaves(dictionaries[locale])) {
        if (path === "toolPage.suspendedBody") continue;
        expect(value, `${locale}.${path} offers downloaders: ${value}`).not.toMatch(download);
      }
    }
  });
});
