/**
 * Daily caps per plan: the numbers the quota module enforces and the pricing
 * page quotes. They live in tool-core (pure, no Node-only imports) so the web
 * app can read the exact values the API enforces instead of keeping its own
 * copy that drifts. @toolips/billing re-exports them as DEFAULT_LIMITS.
 *
 * File size and batch ceilings are NOT plan limits: every plan gets the same
 * execution contract in ./file-capabilities.
 */

export type Plan = "free" | "pro";

export interface Limits {
  downloadsPerDay: number;
  transcribeMinutesPerDay: number;
  scansPerDay: number;
  mcpCallsPerDay: number;
  aiCallsPerDay: number;
  /** PDF and image processing per day. */
  exportsPerDay: number;
}

export const PLAN_LIMITS: Readonly<Record<Plan, Readonly<Limits>>> = Object.freeze({
  free: Object.freeze({
    downloadsPerDay: 5,
    transcribeMinutesPerDay: 3,
    scansPerDay: 50,
    mcpCallsPerDay: 100,
    aiCallsPerDay: 10,
    exportsPerDay: 20,
  }),
  // Pro skips the daily counters entirely (see apps/api/src/lib/quota.ts and
  // packages/mcp/src/middleware/quota.ts); these ceilings only matter for a
  // crypto grant that carries per-grant overrides.
  pro: Object.freeze({
    downloadsPerDay: 9999,
    transcribeMinutesPerDay: 600,
    scansPerDay: 9999,
    mcpCallsPerDay: 999_999,
    aiCallsPerDay: 1000,
    exportsPerDay: 99_999,
  }),
});

/**
 * Pro prices, in whole US dollars, and the period each payment buys. The
 * checkout charges these (apps/api payswitch-checkout) and the pricing page,
 * terms and docs quote them (apps/web site-facts), so a price can only change
 * in one place.
 */
export const PRO_PRICES = Object.freeze({
  monthly: Object.freeze({ usd: 6, days: 30 }),
  annual: Object.freeze({ usd: 48, days: 365 }),
});
