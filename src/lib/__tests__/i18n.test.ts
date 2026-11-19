import { describe, expect, it } from "vitest";

import { dictionaries, dictionaryFor, isLocale, landingPath, LOCALES, otherLocale } from "../i18n";

/**
 * The failure this guards against is not a missing key, which TypeScript
 * already catches. It is a key that exists in BOTH dictionaries holding the
 * same English string, because whoever added it copied the English block and
 * meant to come back. That ships as a page which is bilingual everywhere except
 * the sentence nobody re-read, and no type error or build error says so.
 */

/** Every leaf string in a dictionary, keyed by its dotted path. */
function leaves(value: unknown, path = ""): Array<[string, string]> {
  if (typeof value === "string") return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((v, i) => leaves(v, `${path}[${i}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => leaves(v, path ? `${path}.${k}` : k));
  }
  return [];
}

describe("dictionaries", () => {
  it("defines every locale the router can route to", () => {
    for (const locale of LOCALES) {
      expect(dictionaries[locale], `no dictionary for ${locale}`).toBeDefined();
      expect(isLocale(locale)).toBe(true);
    }
  });

  it("rejects anything that is not a locale", () => {
    for (const value of ["EN", "id-ID", "", " ", "fr", undefined, null]) {
      expect(isLocale(value as string | undefined | null)).toBe(false);
    }
  });

  it("has the same shape in both languages", () => {
    const en = leaves(dictionaries.en).map(([k]) => k);
    const id = leaves(dictionaries.id).map(([k]) => k);
    expect(id).toEqual(en);
  });

  it("translates the hero rather than leaving it English", () => {
    // Called out by name because it is the copy a visitor reads first, and the
    // block most likely to be pasted across while the rest is being worked on.
    const en = dictionaries.en.hero;
    const id = dictionaries.id.hero;
    for (const key of ["proof", "lead", "searchPlaceholder", "searchLabel", "find"] as const) {
      expect(id[key], `hero.${key} is still English`).not.toBe(en[key]);
      expect(id[key].trim().length).toBeGreaterThan(0);
    }
    expect(id.title).not.toEqual(en.title);
    expect(id.title).toHaveLength(en.title.length);
  });

  it("leaves almost nothing untranslated overall", () => {
    // Not zero: some strings are legitimately identical across languages
    // ("API", "Blog", "Status"). The threshold catches a whole section copied
    // over, which is the mistake worth failing on.
    const en = new Map(leaves(dictionaries.en));
    const id = new Map(leaves(dictionaries.id));
    const identical = [...en].filter(([k, v]) => id.get(k) === v).map(([k]) => k);
    expect(identical.length / en.size, `identical strings: ${identical.join(", ")}`).toBeLessThan(0.2);
  });

  it("keeps every measured number out of the copy", () => {
    // Numbers live in lib/site-facts.ts and arrive as {tokens}. A digit that
    // slipped into a sentence here is a claim about the product that a
    // translator could change, which is exactly what this separation prevents.
    // Two-letter locale labels ("EN"/"ID") and currency symbols are not digits,
    // so nothing legitimate trips this.
    for (const locale of LOCALES) {
      for (const [path, value] of leaves(dictionaries[locale])) {
        expect(value, `${locale}.${path} contains a literal number: ${value}`).not.toMatch(/\d/);
      }
    }
  });

  it("declares a distinct html lang and og locale per language", () => {
    expect(dictionaries.en.htmlLang).toBe("en");
    expect(dictionaries.id.htmlLang).toBe("id");
    expect(dictionaries.en.ogLocale).not.toBe(dictionaries.id.ogLocale);
  });
});

describe("locale helpers", () => {
  it("falls back to English for anything unknown", () => {
    expect(dictionaryFor("id")).toBe(dictionaries.id);
    expect(dictionaryFor("en")).toBe(dictionaries.en);
    expect(dictionaryFor("fr")).toBe(dictionaries.en);
    expect(dictionaryFor(undefined)).toBe(dictionaries.en);
  });

  it("points the language switch at the other language's landing page", () => {
    expect(otherLocale("en")).toBe("id");
    expect(otherLocale("id")).toBe("en");
    expect(landingPath("id")).toBe("/id");
    expect(landingPath("en")).toBe("/en");
  });
});
