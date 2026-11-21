// Where a plan button sends the reader to pay.
//
// Toolips takes payments only through Efolusi Pay, the central payment service
// (it holds Mayar and NOWPayments). This file is the ONE place that knows Pay's
// address and URL shape; every plan button on the site goes through it.
//
// TODO(pay consumer contract): the checkout URL shape is not decided yet. It
// comes with Pay's consumer contract (gap TL01, Cloud/Pay). Until then this
// builds `${PAY_URL}/checkout?product=toolips&plan=<planId>&lang=<locale>`.
// Change only this function when the contract lands.

import type { Locale } from "./i18n";

/** Pay's public origin. `NEXT_PUBLIC_PAY_URL` overrides it per environment. */
export const PAY_URL = process.env.NEXT_PUBLIC_PAY_URL || "https://pay.efolusi.com";

/** The plans the pricing page sells. */
export type PlanId = "pro-monthly" | "pro-annual";

export function payCheckoutUrl(planId: PlanId, locale: Locale): string {
  const url = new URL("/checkout", PAY_URL);
  url.searchParams.set("product", "toolips");
  url.searchParams.set("plan", planId);
  url.searchParams.set("lang", locale);
  return url.toString();
}
