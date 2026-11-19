"use client";

// Light and dark theme switch. public/theme-init.js applies the stored or
// system theme before first paint; this button flips it and stores the choice
// under `tlp-theme`. Labels come from the dictionary, so both languages read.

import { useEffect, useState } from "react";
import { Icon } from "@efolusi/meridian";

export const THEME_STORAGE_KEY = "tlp-theme";

export function ThemeToggle({ toDark, toLight }: { toDark: string; toLight: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private mode: the choice lasts for this page only.
    }
  }

  return (
    <button
      type="button"
      className="ef-btn ef-btn--ghost ef-btn--icon"
      onClick={toggle}
      aria-label={theme === "dark" ? toLight : toDark}
    >
      <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
    </button>
  );
}
