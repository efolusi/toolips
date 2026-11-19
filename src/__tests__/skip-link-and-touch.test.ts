import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { dictionaries } from "~/lib/i18n";

const read = (path: string) =>
  readFileSync(fileURLToPath(new URL(`../${path}`, import.meta.url)), "utf8");
const css = read("app/globals.css");

describe("skip link", () => {
  it("is Meridian's SkipLink, first in <body>, targeting #main", () => {
    const layout = read("app/layout.tsx");
    expect(layout).toMatch(/import \{ SkipLink \} from "@efolusi\/meridian"/);
    expect(layout).toMatch(/<body>\s*<SkipLink href="#main">\{dict\.nav\.skipToContent\}<\/SkipLink>\s*\{children\}/);
  });

  it("is labelled in both languages", () => {
    expect(dictionaries.en.nav.skipToContent).toBe("Skip to content");
    expect(dictionaries.id.nav.skipToContent).toBe("Lewati ke konten");
  });

  it('lands on the one focusable <main id="main"> that every page renders', () => {
    // PageShell holds the only <main>; every page renders through it. The error
    // boundary renders outside the shell, so it carries its own.
    for (const file of ["components/PageShell.tsx", "app/error.tsx"]) {
      const mains = read(file).replace(/\s+/g, " ").match(/<main\b[^>]*>/g) ?? [];
      expect(mains, file).toHaveLength(1);
      expect(mains[0], file).toMatch(/id="main" tabIndex=\{-1\}/);
    }
    for (const file of [
      "components/HomePage.tsx",
      "app/not-found.tsx",
      "app/pricing/page.tsx",
      "app/docs/page.tsx",
      "app/status/page.tsx",
      "app/tool/[id]/page.tsx",
      "app/blog/page.tsx",
      "app/blog/[slug]/page.tsx",
      "app/terms/page.tsx",
      "app/privacy/page.tsx",
    ]) {
      const src = read(file);
      expect(src, file).toMatch(/<PageShell\b/);
      expect(src, file).not.toMatch(/<main\b/);
    }
  });
});

describe("touch targets", () => {
  it("give every page link outside running text at least the tap minimum", () => {
    for (const selector of [".brand", ".text-link", ".crumbs a", ".toc a", ".site-footer li a"]) {
      const rule = css.match(new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^{]*\\{[^}]*\\}`))?.[0] ?? "";
      expect(rule, selector).toMatch(/min-height: var\(--tap-min\)/);
    }
    expect(css).toMatch(/\.mobile-menu a \{\s*height: var\(--tap-min\);/);
  });

  it("draws nothing invisible over controls to fake a bigger target", () => {
    expect(css).not.toMatch(/::after \{\s*content: "";/);
  });
});
