import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import * as siteFacts from "../site-facts";

const source = (relative: string) =>
  readFile(fileURLToPath(new URL(`../../${relative}`, import.meta.url)), "utf8");

describe("the terms quote the prices the pricing page shows", () => {
  it("derives every price from the shared plan prices", async () => {
    const { PRO_PRICES } = await import("~/lib/core/plan-limits");
    expect(siteFacts.PRO_MONTHLY_USD).toBe(PRO_PRICES.monthly.usd);
    expect(siteFacts.PRO_ANNUAL_USD).toBe(PRO_PRICES.annual.usd);
    expect(siteFacts.PRO_ANNUAL_MONTHLY_USD).toBe(PRO_PRICES.annual.usd / 12);
    expect(siteFacts.ANNUAL_SAVINGS_PERCENT).toBe(
      Math.round((1 - PRO_PRICES.annual.usd / (PRO_PRICES.monthly.usd * 12)) * 100),
    );
  });

  it("mentions the yearly plan only when it is offered", () => {
    const monthlyOnly = siteFacts.proPriceTerms(false);
    expect(monthlyOnly).toContain(`$${siteFacts.PRO_MONTHLY_USD}/month`);
    expect(monthlyOnly).not.toMatch(/year|annual/i);
    const withAnnual = siteFacts.proPriceTerms(true);
    expect(withAnnual).toContain(`$${siteFacts.PRO_ANNUAL_USD}/year`);
    expect(withAnnual).toContain(`${siteFacts.ANNUAL_SAVINGS_PERCENT}%`);
  });

  it("reads the same switch the pricing page reads", () => {
    expect(siteFacts.annualBillingEnabled({ NEXT_PUBLIC_ANNUAL_BILLING: "true" })).toBe(true);
    expect(siteFacts.annualBillingEnabled({})).toBe(false);
    expect(siteFacts.annualBillingEnabled({ NEXT_PUBLIC_ANNUAL_BILLING: "1" })).toBe(false);
  });

  it("hardcodes no price or tool count in the terms page", async () => {
    const terms = await source("lib/legal.ts");
    expect(terms).not.toMatch(/\$\d/);
    expect(terms).not.toMatch(/\b83\b/);
    expect(terms).toMatch(/proPriceTerms\(/);
  });
});
