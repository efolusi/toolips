"use client";

// The header's interactive half: the menu toggle, the menu panel and the theme
// button. SiteHeader (server) works out every href and label and passes them in.

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@efolusi/meridian";
import BrandMark from "./BrandMark";
import { LocaleSwitchLink } from "./LocaleSwitchLink";
import { ThemeToggle } from "./ThemeToggle";
import type { Locale } from "~/lib/i18n";

export type NavLink = { key: string; href: string; label: string; current: boolean };

export type HeaderBarProps = {
  home: string;
  links: NavLink[];
  switchTo: Locale;
  switchPath: string;
  switchLabel: string;
  switchAria: string;
  signInHref: string;
  signIn: string;
  proHref: string;
  goPro: string;
  openMenu: string;
  closeMenu: string;
  toDark: string;
  toLight: string;
};

export function HeaderBar(p: HeaderBarProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="wrap site-header__row">
        <Link href={p.home} className="brand" onClick={close}>
          <BrandMark size={24} />
          Toolips
        </Link>
        <nav className="site-nav" aria-label="Toolips">
          {p.links.map((l) => (
            <Link key={l.key} href={l.href} aria-current={l.current ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <LocaleSwitchLink
            locale={p.switchTo}
            path={p.switchPath}
            aria-label={p.switchAria}
            className="ef-btn ef-btn--ghost ef-btn--md"
          >
            {p.switchLabel}
          </LocaleSwitchLink>
          <ThemeToggle toDark={p.toDark} toLight={p.toLight} />
          <a href={p.signInHref} className="ef-btn ef-btn--secondary ef-btn--md hide-sm">
            {p.signIn}
          </a>
          <Link href={p.proHref} className="ef-btn ef-btn--primary ef-btn--md hide-sm">
            {p.goPro}
          </Link>
          <button
            type="button"
            className="ef-btn ef-btn--ghost ef-btn--icon menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? p.closeMenu : p.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "x" : "menu"} size={20} />
          </button>
        </div>
      </div>
      <div id="mobile-menu" className={`mobile-menu${open ? " is-open" : ""}`}>
        <nav className="wrap" aria-label="Toolips">
          {p.links.map((l) => (
            <Link key={l.key} href={l.href} aria-current={l.current ? "page" : undefined} onClick={close}>
              {l.label}
            </Link>
          ))}
          <a href={p.signInHref} className="menu-only-sm">
            {p.signIn}
          </a>
          <Link href={p.proHref} className="menu-only-sm" onClick={close}>
            {p.goPro}
          </Link>
        </nav>
      </div>
    </header>
  );
}
