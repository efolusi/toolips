import { describe, expect, it } from "vitest";

import { TOOLS, CATEGORIES } from "../tools";
import { CATEGORY_COPY_ID, TOOL_COPY_ID, categoryLabel, toolCopy } from "../tool-copy";

/**
 * The catalog (tool-core) and this copy dictionary are two files edited by
 * different people at different times. These tests pin the seam: every tool the
 * catalog knows must have an Indonesian description here, every category chip
 * must have a label, and the descriptions must actually be translations rather
 * than the English column pasted across.
 */

describe("TOOL_COPY_ID", () => {
  it("covers every catalog tool with a non-empty Indonesian desc", () => {
    for (const tool of TOOLS) {
      const copy = TOOL_COPY_ID[tool.id];
      expect(copy, `no TOOL_COPY_ID entry for ${tool.id}`).toBeDefined();
      expect(copy?.desc, `empty desc for ${tool.id}`).toBeTruthy();
      expect(copy?.desc?.trim().length).toBeGreaterThan(0);
    }
  });

  it("has no orphan entries for tools the catalog no longer lists", () => {
    const ids = new Set(TOOLS.map((t) => t.id));
    for (const key of Object.keys(TOOL_COPY_ID)) {
      expect(ids.has(key), `TOOL_COPY_ID entry ${key} has no catalog tool`).toBe(true);
    }
  });

  it("actually translates: over 80% of descs differ from the English catalog", () => {
    const differing = TOOLS.filter((t) => TOOL_COPY_ID[t.id]?.desc !== t.desc);
    expect(differing.length / TOOLS.length).toBeGreaterThan(0.8);
  });
});

describe("CATEGORY_COPY_ID", () => {
  it("covers every category chip the hub renders", () => {
    for (const cat of CATEGORIES) {
      expect(CATEGORY_COPY_ID[cat.name], `no CATEGORY_COPY_ID for ${cat.name}`).toBeTruthy();
    }
  });
});

describe("helpers", () => {
  it("returns catalog copy untouched for English", () => {
    const tool = TOOLS[0]!;
    expect(toolCopy(tool, "en")).toEqual({ name: tool.name, desc: tool.desc });
    expect(categoryLabel("Image", "en")).toBe("Image");
  });

  it("returns Indonesian copy with name falling back to the catalog", () => {
    const untranslated = TOOLS.find((t) => !TOOL_COPY_ID[t.id]?.name);
    const translated = TOOLS.find((t) => TOOL_COPY_ID[t.id]?.name);
    expect(untranslated && toolCopy(untranslated, "id").name).toBe(untranslated?.name);
    expect(translated && toolCopy(translated, "id").name).toBe(TOOL_COPY_ID[translated!.id]!.name);
    expect(categoryLabel("Image", "id")).toBe("Gambar");
    expect(categoryLabel("Never-Heard-Of-It", "id")).toBe("Never-Heard-Of-It");
  });
});
