import { describe, expect, it } from "vitest";

import { RUNNABLE_TOOLS } from "../tools";
import { fill, FREE_DAILY_EXPORTS, PRO_MONTHLY_USD, TOOL_COUNT } from "../site-facts";

describe("site facts", () => {
  it("derives the tool count from the runnable catalogue", () => {
    // Typed out by hand, this is the number that goes stale: the headline, the
    // search placeholder and the meta description all quote it. A coming-soon
    // tool is not something a reader can use, so it is not counted.
    expect(TOOL_COUNT).toBe(RUNNABLE_TOOLS.length);
    expect(TOOL_COUNT).toBeGreaterThan(0);
  });

  it("keeps the advertised limits as numbers, not prose", () => {
    expect(Number.isInteger(FREE_DAILY_EXPORTS)).toBe(true);
    expect(Number.isInteger(PRO_MONTHLY_USD)).toBe(true);
  });
});

describe("fill", () => {
  it("substitutes every token it is given", () => {
    expect(fill("{count} tools · ${price}/mo", { count: 83, price: 6 })).toBe("83 tools · $6/mo");
  });

  it("leaves an unknown token visible rather than blanking it", () => {
    // A silently dropped token reads as a typo in the copy; left in place it
    // reads as a bug and gets fixed.
    expect(fill("Search {count} tools", {})).toBe("Search {count} tools");
  });

  it("substitutes a token that appears more than once", () => {
    expect(fill("{n} of {n}", { n: 2 })).toBe("2 of 2");
  });
});
