"use client";

import { useEffect } from "react";

/**
 * The phone menu is a native <details>, which the browser never closes on
 * Escape. This adds only that: Escape closes any open `.lp-menu` and hands
 * focus back to its <summary>. It renders nothing, so SiteNav stays a server
 * component and the menu keeps working without JavaScript.
 */
export function MenuDismiss() {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      const open = document.querySelector<HTMLDetailsElement>("details.lp-menu[open]");
      if (!open) return;
      open.open = false;
      open.querySelector("summary")?.focus();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  return null;
}
