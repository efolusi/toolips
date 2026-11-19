// Pricing: Free and Pro. Every Pro button goes to Efolusi Pay's checkout
// (src/lib/pay.ts); nothing on this site takes a card or a wallet.

import type { Metadata } from "next";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Icon } from "@efolusi/meridian";
import { PageShell } from "~/components/PageShell";
import { Accented } from "~/components/Accented";
import { dictionaries } from "~/lib/i18n";
import { localeAlternates, localizedPath } from "~/lib/locale-routing";
import { payCheckoutUrl } from "~/lib/pay";
import { requestLocale } from "~/lib/request-locale";
import { btn } from "~/lib/ui";
import {
  annualBillingEnabled,
  fill,
  PRICING_FACTS,
  PRO_ANNUAL_USD,
  PRO_MONTHLY_USD,
} from "~/lib/site-facts";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  const t = dictionaries[locale].pricing;
  return {
    alternates: localeAlternates(locale, "/pricing"),
    title: { absolute: t.metaTitle },
    description: fill(t.metaDescription, { price: PRO_MONTHLY_USD }),
  };
}

// Per request, so the public annual-plan flag is read at run time.
export const dynamic = "force-dynamic";

function Checks({ items }: { items: string[] }) {
  return (
    <ul className="checks">
      {items.map((item) => (
        <li key={item}>
          <Icon name="check" size={20} />
          <span>{fill(item, PRICING_FACTS)}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function PricingPage() {
  const locale = await requestLocale();
  const t = dictionaries[locale].pricing;
  const annual = annualBillingEnabled();

  return (
    <PageShell locale={locale} active="pricing">
      <section className="page-head">
        <div className="wrap">
          <h1 className="display-1">
            <Accented parts={t.title} />
          </h1>
          <p className="lede">{t.lead}</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }} aria-label={t.metaTitle}>
        <div className="wrap plans">
          <article className="ef-card plan" aria-labelledby="plan-free">
            <h2 id="plan-free">{t.freeHeading}</h2>
            <p className="muted">{t.freeTagline}</p>
            <p className="price">
              <strong>$0</strong>
            </p>
            <Checks items={t.freeFeatures} />
            <div className="actions">
              <Link href={`${localizedPath(locale, "/")}#tools`} className={btn("secondary", "lg")}>
                {t.browseTools}
              </Link>
            </div>
          </article>

          <article id="pro" className="ef-card plan plan--pro" aria-labelledby="plan-pro">
            <h2 id="plan-pro">{t.proHeading}</h2>
            <p className="muted">{t.proTagline}</p>
            <p className="price">
              <strong>${PRO_MONTHLY_USD}</strong>
              <span className="muted">{t.perMonth}</span>
            </p>
            {annual ? (
              <p className="price" style={{ marginTop: "var(--space-2)" }}>
                <strong style={{ fontSize: "var(--text-3xl)" }}>${PRO_ANNUAL_USD}</strong>
                <span className="muted">
                  {t.perYear}. {fill(t.saveAnnual, PRICING_FACTS)}
                </span>
              </p>
            ) : null}
            <Checks items={t.proFeatures} />
            <div className="actions">
              <a href={payCheckoutUrl("pro-monthly", locale)} className={btn("primary", "lg", "btn-on-brand")}>
                {t.subscribe}
              </a>
              {annual ? (
                <a href={payCheckoutUrl("pro-annual", locale)} className={btn("secondary", "lg", "btn-on-brand")}>
                  {t.subscribeYearly}
                </a>
              ) : null}
            </div>
            <p className="plan__note">{t.payNote}</p>
          </article>
        </div>
      </section>

      <section className="section section--rule" aria-labelledby="faq-title">
        <div className="wrap faq">
          <h2 id="faq-title" className="display-2" style={{ marginBottom: "var(--space-6)" }}>
            {t.faqTitle}
          </h2>
          <Accordion type="single" collapsible>
            {t.faq.map((item, i) => (
              <AccordionItem key={item.q} value={`q${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{fill(item.a, PRICING_FACTS)}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </PageShell>
  );
}
