// Shared site nav. Sign in, account and status live in the Toolips app (APP_URL).
//
// Used by: hub, pricing, docs, blog, 404. Tool pages use their own slim nav
// (back arrow + wordmark + ⌘K + Go Pro) so they're not included here.
//
// `locale` decides the labels AND the destinations: every public href goes
// through localizedPath(), so a reader on /id stays under /id.

import { MenuDismiss } from "./MenuDismiss";
import Link from "next/link";
import { headers } from "next/headers";
import { Menu } from "lucide-react";
import BrandMark from "~/components/BrandMark";
import { appUrl } from "~/lib/api";
import {
  DEFAULT_LOCALE,
  dictionaries,
  otherLocale,
  type Dictionary,
  type Locale,
} from "~/lib/i18n";
import { localizedPath, PATH_HEADER } from "~/lib/locale-routing";
import { LocaleSwitchLink } from "./LocaleSwitchLink";

type NavKey = "tools" | "pricing" | "api" | "docs" | "blog";

function navLinks(t: Dictionary, locale: Locale): { key: NavKey; href: string; label: string }[] {
  return [
    { key: "tools", href: localizedPath(locale, "/"), label: t.nav.tools },
    { key: "pricing", href: localizedPath(locale, "/pricing"), label: t.nav.pricing },
    { key: "api", href: appUrl("/account/api"), label: t.nav.api },
    { key: "docs", href: localizedPath(locale, "/docs"), label: t.nav.docs },
    { key: "blog", href: localizedPath(locale, "/blog"), label: t.nav.blog },
  ];
}

export async function SiteNav({
  active,
  locale = DEFAULT_LOCALE,
  notFound = false,
}: {
  active?: NavKey;
  locale?: Locale;
  /** Set by the 404 page, whose URL has no counterpart in the other language. */
  notFound?: boolean;
}) {
  const t = dictionaries[locale];
  const LINKS = navLinks(t, locale);
  const other = otherLocale(locale);
  const headerStore = await headers();
  // The language switch lands on THIS page in the other language, not on the
  // other landing page. The middleware supplies the unprefixed path; a 404 has
  // no counterpart, so its switch goes home.
  const here = notFound ? "/" : (headerStore.get(PATH_HEADER) ?? "/");
  const home = localizedPath(locale, "/");
  const pricing = localizedPath(locale, "/pricing");

  // Efolusi flagship header: 1200px container, 64px bar (the hairline is an
  // inset shadow so it sits inside the height), 40px pills, 36px icon buttons
  // (44px at ≤640 for touch). Nav destinations fold into a CSS-only <details>
  // menu at ≤900 so this stays a server component with zero client JS; at
  // ≤640 the Sign in / Go Pro pills move into that menu too.
  return (
    <header className="lp-header">
      <div className="lp-wrap lp-header__row">
        <Link href={home} className="lp-brand" aria-label="Toolips">
          <BrandMark size={24} />
          <span className="wordmark">
            <span>toolips</span>
            <span className="wordmark-dot" />
          </span>
        </Link>
        <nav className="lp-nav" aria-label="Toolips">
          {LINKS.map((l) => (
            <Link
              key={l.key}
              href={l.href}
              aria-current={l.key === active ? "page" : undefined}
              className="lp-pill lp-pill--sm lp-pill--quiet"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="lp-actions">
          {/* Language switch. A plain link to the other landing page, not a
              client-side toggle: the copy has to be in the HTML for search
              engines, and following it writes the `lang` cookie in middleware.
              It must be a full page load, hence LocaleSwitchLink and not Link. */}
          <LocaleSwitchLink locale={other} path={here} aria-label={t.nav.otherLanguageAria} className="lp-iconbtn">
            {t.nav.otherLanguage}
          </LocaleSwitchLink>
          <a href={appUrl("/sign-in")} className="lp-pill lp-pill--sm lp-pill--outline">
            {t.nav.signIn}
          </a>
          <Link href={`${pricing}#pro`} aria-label={t.nav.goProAria} className="lp-pill lp-pill--sm lp-pill--primary">
            {t.nav.goPro}
          </Link>
          <MenuDismiss />
          <details className="lp-menu">
            <summary aria-label={t.nav.openMenu} className="lp-iconbtn">
              <Menu size={18} strokeWidth={2} aria-hidden="true" />
            </summary>
            <div className="lp-menu__panel">
              {LINKS.map((l) => (
                <Link key={l.key} href={l.href} aria-current={l.key === active ? "page" : undefined}>
                  {l.label}
                </Link>
              ))}
              <a href={appUrl("/sign-in")} className="lp-menu__only-sm">
                {t.nav.signIn}
              </a>
              <Link href={pricing} className="lp-menu__only-sm">
                {t.nav.goPro}
              </Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter({ locale = DEFAULT_LOCALE }: { locale?: Locale } = {}) {
  const t = dictionaries[locale];
  const cols = [
    {
      title: t.footer.colProduct,
      links: [
        { label: t.nav.tools, href: localizedPath(locale, "/") },
        { label: t.footer.pricing, href: localizedPath(locale, "/pricing") },
        { label: t.footer.api, href: appUrl("/account/api") },
      ],
    },
    {
      title: t.footer.colResources,
      links: [
        { label: t.footer.docs, href: localizedPath(locale, "/docs") },
        { label: t.footer.blog, href: localizedPath(locale, "/blog") },
        { label: t.footer.status, href: appUrl("/status") },
      ],
    },
    {
      title: t.footer.colLegal,
      links: [
        { label: t.footer.privacy, href: localizedPath(locale, "/privacy") },
        { label: t.footer.terms, href: localizedPath(locale, "/terms") },
      ],
    },
  ];
  return (
    <footer className="lp-footer">
      <div className="lp-wrap">
        <div className="lp-footer__top">
          <div className="lp-footer__brand">
            <Link href={localizedPath(locale, "/")} className="lp-brand" aria-label="Toolips">
              <BrandMark size={20} />
              <span className="wordmark">
                <span>toolips</span>
                <span className="wordmark-dot" />
              </span>
            </Link>
            <p className="lp-footer__tagline">{t.footer.tagline}</p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4>{c.title}</h4>
              <ul>
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="lp-footer__bottom">
          <span>
            © {new Date().getFullYear()} PT Efolusi Dunia Teknologi. {t.footer.rights}
          </span>
          <span>
            {t.footer.productBy}{" "}
            <a href="https://efolusi.com" target="_blank" rel="noopener noreferrer">
              Efolusi
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
