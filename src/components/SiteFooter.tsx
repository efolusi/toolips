// The site footer: the brand line, two short link groups, and the operator.

import Link from "next/link";
import BrandMark from "./BrandMark";
import { appUrl } from "~/lib/api";
import { dictionaries, type Locale } from "~/lib/i18n";
import { localizedPath } from "~/lib/locale-routing";

export function SiteFooter({ locale }: { locale: Locale }) {
  const d = dictionaries[locale];
  const t = d.footer;
  const at = (path: string) => localizedPath(locale, path);
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <div>
            <Link href={at("/")} className="brand">
              <BrandMark size={20} />
              Toolips
            </Link>
            <p className="muted">{t.tagline}</p>
          </div>
          <nav aria-labelledby="footer-product">
            <h2 id="footer-product">{t.productHead}</h2>
            <ul>
              <li><Link href={`${at("/")}#tools`}>{d.nav.tools}</Link></li>
              <li><Link href={at("/pricing")}>{d.nav.pricing}</Link></li>
              <li><Link href={at("/docs")}>{d.nav.docs}</Link></li>
              <li><Link href={at("/blog")}>{d.nav.blog}</Link></li>
              <li><a href={appUrl("/account/api")}>{t.api}</a></li>
            </ul>
          </nav>
          <nav aria-labelledby="footer-about">
            <h2 id="footer-about">{t.aboutHead}</h2>
            <ul>
              <li><Link href={at("/status")}>{t.status}</Link></li>
              <li><Link href={at("/privacy")}>{t.privacy}</Link></li>
              <li><Link href={at("/terms")}>{t.terms}</Link></li>
            </ul>
          </nav>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} PT Efolusi Dunia Teknologi. {t.rights}</p>
          <p>
            {t.productBy}
            <a href="https://efolusi.com" target="_blank" rel="noopener noreferrer">Efolusi</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
