import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { dictionaries } from "~/lib/i18n";

const read = (path: string) =>
  readFileSync(fileURLToPath(new URL(`../${path}`, import.meta.url)), "utf8");
const css = read("app/globals.css");

describe("skip link", () => {
  it("is the first element in <body> and targets #main", () => {
    expect(read("app/layout.tsx")).toMatch(
      /<body>\s*<SkipLink label=\{dict\.nav\.skipToContent\} \/>\s*\{children\}/,
    );
    expect(read("components/SkipLink.tsx")).toMatch(/className="tlp-skip" href="#main"/);
  });

  it("is labelled in both languages", () => {
    expect(dictionaries.en.nav.skipToContent).toBe("Skip to content");
    expect(dictionaries.id.nav.skipToContent).toBe("Lewati ke konten");
  });

  it('lands on a focusable <main id="main"> on every page', () => {
    // Every page (or the component it renders) under the root layout. global-error
    // replaces the layout, so it carries no skip link and needs no target.
    const files = [
      "components/Landing.tsx",
      "app/not-found.tsx",
      "app/error.tsx",
      "app/pricing/page.tsx",
      "app/docs/page.tsx",
      "app/blog/page.tsx",
      "app/blog/[slug]/page.tsx",
      "app/terms/page.tsx",
      "app/privacy/page.tsx",
    ];
    for (const file of files) {
      const mains =
        read(file)
          .replace(/\s+/g, " ")
          .match(/<main\b[^>]*>/g) ?? [];
      expect(mains, file).toHaveLength(1);
      expect(mains[0], file).toMatch(/id="main" tabIndex=\{-1\}/);
    }
  });

  it("stays in the focus order while hidden and paints above the sticky header", () => {
    const rule = css.match(/\.tlp-skip \{[^}]*\}/)?.[0] ?? "";
    expect(rule).toMatch(/clip-path: inset\(50%\)/);
    expect(rule).toMatch(/z-index: var\(--z-modal, 1300\)/);
    expect(rule).not.toMatch(/display: none|visibility: hidden/);
    expect(css).toMatch(/\.tlp-skip:focus \{ clip-path: none;/);
  });
});

describe("coarse-pointer touch targets", () => {
  const block = css.slice(css.indexOf("@media (pointer: coarse) {"), css.indexOf("/* Skip link"));

  it("grow the painted control instead of adding invisible overlays", () => {
    expect(block.length).toBeGreaterThan(100);
    expect(block).not.toMatch(/::after \{ content: "";/);
    // The fine-pointer header overlays are switched off so grown controls never overlap.
    expect(block).toMatch(
      /\.lp-header \.lp-pill--sm::after, \.lp-header \.lp-iconbtn::after \{ content: none; \}/,
    );
  });

  it("covers every control the 768px touch audit found under 44px", () => {
    for (const rule of [
      ".lp-header .lp-pill--sm { height: var(--tap-min); }",
      ".lp-iconbtn, .lp-avatar { width: var(--tap-min); height: var(--tap-min); }",
      ".lp-brand, .wordmark-lockup, .lp-link { min-height: var(--tap-min); }",
      ".lp-filters .lp-pill--sm { height: var(--tap-min); }",
      ".chip, .chip--md { min-height: var(--tap-min); }",
      ".tlp-tool-chrome .icon-btn--md { flex: none; width: var(--tap-min); height: var(--tap-min); }",
      ".lp-footer li a { display: inline-flex; align-items: center; min-width: var(--tap-min); min-height: var(--tap-min); }",
    ]) {
      expect(block).toContain(rule);
    }
    expect(block).toMatch(
      /\.ef-breadcrumb__link \{[^}]*min-width: var\(--tap-min\); min-height: var\(--tap-min\);/,
    );
    expect(block).toMatch(
      /\.lp-footer__bottom a \{[^}]*min-width: var\(--tap-min\); min-height: var\(--tap-min\); margin-block: calc\(\(19\.5px - var\(--tap-min\)\) \/ 2\);/,
    );
  });

  it("leaves mouse-driven sizes alone", () => {
    expect(css).toMatch(/\.lp-pill--sm \{ height: 40px;/);
    expect(css).toMatch(/\.lp-iconbtn \{\s*box-sizing: border-box; width: 36px; height: 36px;/);
  });
});
