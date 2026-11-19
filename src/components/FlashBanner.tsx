// Flash banner for post-redirect feedback (payment result, account deletion,
// etc.). FASE 4: thin adapter over meridian feedback/Banner — same props as
// before, so callers (Landing, PricingContent, AccountTabs) stay unchanged.
// Banner is a 'use client' module but purely presentational, so it renders
// fine from both server and client trees; the message still clears naturally
// on the next navigation.

import type { ReactNode } from "react";
import { Banner } from "@efolusi/meridian";

const TONE_MAP = {
  success: { tone: "brand", icon: "circle-check" },
  info: { tone: "neutral", icon: "info" },
  error: { tone: "danger", icon: "circle-alert" },
} as const;

export function FlashBanner({
  tone = "info",
  children,
}: {
  tone?: "success" | "info" | "error";
  children: ReactNode;
}) {
  const m = TONE_MAP[tone];
  return (
    <div style={{ maxWidth: 960, margin: "16px auto 0", padding: "0 20px" }}>
      <Banner tone={m.tone} icon={m.icon}>
        {children}
      </Banner>
    </div>
  );
}
