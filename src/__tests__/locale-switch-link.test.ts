import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// /en/x and /id/x share one route, so next/link between them keeps the old
// language rendered (router cache + a root layout that never re-renders).
// Cross-locale links must be full document navigations.
const SRC = fileURLToPath(new URL("..", import.meta.url));

function sources(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return e.name === "__tests__" ? [] : sources(p);
    return /\.tsx$/.test(e.name) ? [p] : [];
  });
}

describe("cross-locale links", () => {
  it("LocaleSwitchLink renders a plain <a>, never next/link", () => {
    const src = readFileSync(join(SRC, "components/LocaleSwitchLink.tsx"), "utf8");
    expect(src).not.toMatch(/from\s+["']next\/link["']/);
    expect(src).toMatch(/<a\s/);
    expect(src).toMatch(/data-locale-switch/);
  });

  it("the header language switch goes through LocaleSwitchLink", () => {
    const nav = readFileSync(join(SRC, "components/HeaderBar.tsx"), "utf8");
    expect(nav).toMatch(/<LocaleSwitchLink\s+locale=\{p\.switchTo\}/);
  });

  it("no next/link anywhere targets the other locale", () => {
    const offenders = sources(SRC).filter((file) => {
      const src = readFileSync(file, "utf8");
      // <Link ... href={localizedPath(other…)} or otherLocale(...) inside a Link href
      return /<Link\b[^>]*href=\{[^}]*(localizedPath\(\s*other|otherLocale\()/s.test(src);
    });
    expect(offenders).toEqual([]);
  });
});
