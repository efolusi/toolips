"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, Check } from "lucide-react";
import { Button } from "@efolusi/meridian";
import { FlashBanner } from "~/components/FlashBanner";
import { apiUrl } from "~/lib/api";
import type { Dictionary } from "~/lib/i18n";
import {
  fill,
  PRICING_FACTS as FACTS,
  PRO_ANNUAL_MONTHLY_USD,
  PRO_MONTHLY_USD,
} from "~/lib/site-facts";

export function PricingContent({
  annualEnabled,
  homeHref = "/",
  t,
}: {
  annualEnabled: boolean;
  /** The hub in the reader's language. */
  homeHref?: string;
  t: Dictionary["pricing"];
}) {
  // Default to the cheaper annual plan when it's actually offered; otherwise
  // monthly is the only option, so the price shown always equals what's charged.
  const [billing, setBilling] = useState<"Monthly" | "Yearly">(
    annualEnabled ? "Yearly" : "Monthly",
  );
  const interval = billing === "Yearly" ? "annual" : "monthly";

  const freeFeatures = t.freeFeatures.map((f) => fill(f, FACTS));
  const proFeatures = t.proFeatures.map((f) => fill(f, FACTS));

  // Post-redirect feedback so a failed/canceled checkout isn't a silent dead-end.
  const sp = useSearchParams();
  const billingParam = sp.get("billing");
  const flash =
    sp.get("canceled") === "1" || billingParam === "cancel"
      ? { tone: "info" as const, msg: t.flashCanceled }
      : billingParam === "unavailable"
        ? { tone: "error" as const, msg: t.flashCardUnavailable }
        : billingParam === "crypto-unavailable"
          ? { tone: "error" as const, msg: t.flashCryptoUnavailable }
          : billingParam === "error"
            ? { tone: "error" as const, msg: t.flashError }
            : null;

  return (
    <>
      {flash ? <FlashBanner tone={flash.tone}>{flash.msg}</FlashBanner> : null}
      {/* Hero */}
      <div className="pricing-hero">
        <span
          className="eyebrow is-pro"
          style={{
            background: "var(--bg-card)",
            padding: "5px 12px",
            border: "1.5px solid var(--text-primary)",
          }}
        >
          {t.eyebrow}
        </span>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "var(--pricing-title-size, var(--text-5xl))",
            letterSpacing: 0,
            textTransform: "uppercase",
            margin: "20px 0 0",
            lineHeight: 0.9,
          }}
        >
          {t.title[0]}
          <br />
          {t.title[1]}
        </h1>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: 18,
            maxWidth: 560,
            margin: "20px auto 32px",
          }}
        >
          {t.lead}
        </p>
        {annualEnabled && (
          <>
            <div style={{ display: "inline-flex" }}>
              <div className="tlp-segmented">
                {(["Monthly", "Yearly"] as const).map((o) => (
                  <button key={o} aria-pressed={billing === o} onClick={() => setBilling(o)}>
                    {o === "Monthly" ? t.monthly : t.yearly}
                  </button>
                ))}
              </div>
            </div>
            <div
              style={{
                marginTop: 8,
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--success)",
                textTransform: "uppercase",
                letterSpacing: 0,
              }}
            >
              {billing === "Yearly" ? fill(t.saveAnnual, FACTS) : t.switchYearly}
            </div>
          </>
        )}
      </div>

      {/* Plan cards */}
      <div
        className="tlp-page-section"
        style={{
          paddingInline: 32,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
          maxWidth: 920,
          margin: "0 auto",
        }}
      >
        {/* Free */}
        <div className="plan-card" data-tier="free">
          <span className="tlp-badge tlp-badge--free">{t.freeBadge}</span>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 36,
              marginTop: 14,
              letterSpacing: 0,
              lineHeight: 1,
              color: "var(--text-primary)",
            }}
          >
            {t.freeHeading}
          </div>
          <div className="pricing-price-row">
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 72,
                fontWeight: 800,
                letterSpacing: 0,
                lineHeight: 1,
              }}
            >
              $0
            </span>
            <span style={{ color: "var(--text-muted)", fontSize: 13 }}>{t.freeTagline}</span>
          </div>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {freeFeatures.map((f) => (
              <li
                key={f}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: "var(--text-secondary)",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    background: "var(--text-primary)",
                    color: "var(--text-inv)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Check size={12} strokeWidth={2.75} />
                </span>
                {f}
              </li>
            ))}
          </ul>
          <div className="plan-card__actions">
            <Link href={homeHref} className="ef-btn ef-btn--secondary ef-btn--lg">
              {t.browseTools}
            </Link>
          </div>
        </div>

        {/* Pro */}
        <div id="pro" className="plan-card" data-tier="pro" data-theme="dark" style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: -16,
              right: 24,
              background: "var(--gold-500)",
              color: "var(--ink-900)",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 0,
              textTransform: "uppercase",
              padding: "5px 10px",
            }}
          >
            {t.mostPopular}
          </div>
          <span className="tlp-badge tlp-badge--pro">{t.proBadge}</span>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 36,
              marginTop: 14,
              letterSpacing: 0,
              lineHeight: 1,
              color: "var(--paper-100)",
            }}
          >
            {t.proHeading}
          </div>
          <div className="pricing-price-row">
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 72,
                fontWeight: 800,
                letterSpacing: 0,
                lineHeight: 1,
                color: "var(--gold-500)",
              }}
            >
              ${billing === "Yearly" ? PRO_ANNUAL_MONTHLY_USD : PRO_MONTHLY_USD}
            </span>
            <span style={{ color: "rgba(250,247,242,0.7)", fontSize: 13 }}>
              {billing === "Yearly" ? t.perMonthYearly : t.perMonthMonthly}
            </span>
          </div>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {proFeatures.map((f) => (
              <li
                key={f}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: "var(--paper-100)",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    background: "var(--gold-500)",
                    color: "var(--ink-900)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Check size={12} strokeWidth={2.75} />
                </span>
                {f}
              </li>
            ))}
          </ul>
          {/* Real subscribe flow: POST to checkout. Each route redirects to
              /sign-in?next=/pricing when logged out, else to Efolusi Pay hosted
              checkout, which charges the first period at once. There is no
              trial, so the button must never promise one. */}
          <div className="plan-card__actions">
            <form action={apiUrl("/api/billing/checkout")} method="post">
              <input type="hidden" name="interval" value={interval} />
              <Button type="submit" variant="primary" size="lg" className="tlp-btn--pro">
                <Sparkles size={14} strokeWidth={2} />
                {t.subscribe}
              </Button>
            </form>
            <form action={apiUrl("/api/billing/checkout/crypto")} method="post">
              <input type="hidden" name="interval" value={interval} />
              <Button type="submit" variant="secondary" size="lg">
                {t.payCrypto}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="tlp-page-section" style={{ paddingInline: 32, maxWidth: 720, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 32,
            letterSpacing: 0,
            margin: "0 0 16px",
            textTransform: "uppercase",
          }}
        >
          {t.faqTitle}
        </h2>
        {t.faq.map((item, i) => (
          <div key={i} style={{ padding: "18px 0", borderTop: "1.5px solid var(--border)" }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 18,
                letterSpacing: 0,
              }}
            >
              {item.q}
            </div>
            <div style={{ color: "var(--text-muted)", marginTop: 4, fontSize: 14 }}>
              {fill(item.a, FACTS)}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
