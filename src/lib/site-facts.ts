// The measured numbers the landing page claims, in one place.
//
// They live here rather than in src/lib/i18n.ts on purpose: a dictionary is
// edited by whoever is doing the translation, and a number embedded in a
// sentence is a claim about the product that a translation must not be able to
// change. The copy carries {count}, {limit} and {price} tokens; this module
// supplies the values, and both languages therefore say the same thing.
//
// TOOL_COUNT is derived rather than typed out, so adding a tool updates the
// headline, the search placeholder and the meta description at once. The file,
// batch and daily caps are derived the same way, from the limits the API
// enforces (@toolips/tool-core), so a pricing claim cannot outgrow the code.

import { FILE_PROCESSING_LIMITS } from "~/lib/core/file-capabilities";
import { PLAN_LIMITS, PRO_PRICES } from "~/lib/core/plan-limits";
import { RUNNABLE_TOOLS } from "~/lib/tools";

/** Tools a reader can run today. A coming-soon tool is not counted. */
export const TOOL_COUNT = RUNNABLE_TOOLS.length;

/** Tools on the free tier, and tools that need Pro. Derived, like TOOL_COUNT. */
export const FREE_TOOL_COUNT = RUNNABLE_TOOLS.filter((t) => t.tier === "free").length;
export const PRO_TOOL_COUNT = TOOL_COUNT - FREE_TOOL_COUNT;

/** Pro, monthly, in USD: what the checkout charges (tool-core PRO_PRICES). */
export const PRO_MONTHLY_USD = PRO_PRICES.monthly.usd;

/** Pro, one year paid at once, in USD. */
export const PRO_ANNUAL_USD = PRO_PRICES.annual.usd;

/** Pro on the annual plan, expressed per month, in USD. */
export const PRO_ANNUAL_MONTHLY_USD = PRO_ANNUAL_USD / 12;

/** What the annual plan saves against paying monthly, as a whole percent. */
export const ANNUAL_SAVINGS_PERCENT = Math.round((1 - PRO_ANNUAL_USD / (PRO_MONTHLY_USD * 12)) * 100);

/**
 * Whether the annual plan is offered. The pricing page and the terms read the
 * same public build flag, so neither can quote a plan the other hides.
 */
export function annualBillingEnabled(
  env: Record<string, string | undefined> = { NEXT_PUBLIC_ANNUAL_BILLING: process.env.NEXT_PUBLIC_ANNUAL_BILLING },
): boolean {
  return env.NEXT_PUBLIC_ANNUAL_BILLING === "true";
}

/**
 * The price sentence of the (English-only) terms. It names the yearly plan
 * only when the pricing page offers it.
 */
export function proPriceTerms(annualEnabled: boolean): string {
  const monthly = `Pro is $${PRO_MONTHLY_USD}/month`;
  return annualEnabled
    ? `${monthly}, or $${PRO_ANNUAL_USD}/year billed annually (about ${ANNUAL_SAVINGS_PERCENT}% off).`
    : `${monthly}.`;
}

/**
 * Free-tier PDF/image exports per day: the cap the quota module enforces, and
 * the daily limit the hub's upgrade strip and the docs quote. (Downloads are
 * Pro only, so there is no free download allowance to quote.)
 */
export const FREE_DAILY_EXPORTS = PLAN_LIMITS.free.exportsPerDay;

/**
 * Upload ceiling per file, in megabytes. Every plan gets the same cap: it is
 * the server's file contract, not a plan perk, so Pro claims nothing bigger.
 */
export const MAX_FILE_MB = FILE_PROCESSING_LIMITS.maxFileBytes / (1024 * 1024);

/** Images per batch-resize request: the cap the image processor enforces. */
export const MAX_BATCH_IMAGES = FILE_PROCESSING_LIMITS.maxBatchImages;

/**
 * The refund window the terms promise, in days. There is no free trial: the
 * Pro button starts a paid checkout and Pay charges the first period at once.
 */
export const REFUND_WINDOW_DAYS = 14;

/**
 * Every value the pricing page's feature lists and FAQ quote, in one bag. The
 * copy lives in src/lib/i18n.ts and carries {tokens}; the values come from the
 * limits the code enforces, so both languages make identical, true claims.
 */
export const PRICING_FACTS = Object.freeze({
  count: TOOL_COUNT,
  free: FREE_TOOL_COUNT,
  exports: FREE_DAILY_EXPORTS,
  mb: MAX_FILE_MB,
  batch: MAX_BATCH_IMAGES,
  days: REFUND_WINDOW_DAYS,
  pct: ANNUAL_SAVINGS_PERCENT,
});

/**
 * Substitutes {token} placeholders in a dictionary string.
 *
 * Deliberately dumb: no formatting, no pluralisation, no locale-aware number
 * shaping. Every token this site uses is a small integer that reads the same in
 * both languages, and a formatter here would be a second place for a claim to
 * drift.
 */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
