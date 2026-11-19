import type { Metadata } from "next";
import { SiteNav, SiteFooter } from "~/components/SiteNav";
import { dictionaries } from "~/lib/i18n";
import { localeAlternates, localizedPath } from "~/lib/locale-routing";
import { requestLocale } from "~/lib/request-locale";
import {
  annualBillingEnabled,
  PRO_MONTHLY_USD,
  proPriceTerms,
  REFUND_WINDOW_DAYS,
  TOOL_COUNT,
} from "~/lib/site-facts";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  const t = dictionaries[locale].legal;
  return {
    title: t.termsTitle,
    description: t.termsDescription,
    alternates: localeAlternates(locale, "/terms"),
  };
}

// Rendered per request, like /pricing, so the annual-plan flag is read at run
// time and the terms never quote a plan the pricing page does not offer.
export const dynamic = "force-dynamic";

// The date these terms last changed. Bump it in the same commit as any change
// to the text below; it must never be computed at render time.
const TERMS_EFFECTIVE_DATE = "October 16, 2026";

export default async function TermsPage() {
  const locale = await requestLocale();
  const t = dictionaries[locale].legal;
  const annual = annualBillingEnabled();
  return (
    <div style={{ background: "var(--bg-base)", color: "var(--text-primary)", minHeight: "100vh" }}>
      <SiteNav locale={locale} />
      <main id="main" tabIndex={-1}>
      <article lang="en" className="tlp-page" style={{ paddingInline: 32, maxWidth: 760, margin: "0 auto" }}>
        {t.englishOnly ? (
          <p lang={locale} style={{ color: "var(--text-muted)", fontSize: 14, margin: "0 0 16px" }}>
            {t.englishOnly}
          </p>
        ) : null}
        <div className="eyebrow is-brand" style={{ marginBottom: 12 }}>Terms</div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "var(--text-4xl)",
            letterSpacing: 0,
            textTransform: "uppercase",
            margin: "0 0 18px",
            lineHeight: 0.92,
          }}
        >
          Terms.
          <br />
          <span style={{ color: "var(--brand-700)" }}>Plain English.</span>
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 17, marginBottom: 32 }}>
          Effective {TERMS_EFFECTIVE_DATE}.
        </p>

        <div className="blog-prose" style={{ fontSize: 17, lineHeight: 1.7 }}>
          <h2>1. What this is</h2>
          <p>Toolips is a website with {TOOL_COUNT} utility tools. You can use the free tier without an account; the Pro tier removes the daily limits and adds AI tools, batch processing, and API access with no daily cap.</p>

          <h2>2. Your account</h2>
          <p>You sign in with your Efolusi account, and you're responsible for everything that happens under it. Don't share access. If you suspect compromise, sign out everywhere from Account → Sessions.</p>

          <h2>3. Acceptable use</h2>
          <p>Don't use Toolips to:</p>
          <ul>
            <li>Break a law in your jurisdiction or ours.</li>
            <li>Infringe someone else's copyright. Don't process content you don't have rights to.</li>
            <li>Run security scans against systems you don't own or have permission to test.</li>
            <li>Spam, harass, or defraud people via AI-generated content.</li>
            <li>Try to overwhelm our infrastructure (the rate limits are there; respect them).</li>
          </ul>
          <p>We reserve the right to suspend accounts that abuse the service. We'll explain why, and refund unused paid time if we do.</p>

          <h2>4. Pricing</h2>
          <p>{proPriceTerms(annual)} Payments use Efolusi Pay hosted checkout. Provider routing is handled by Pay and Toolips never receives provider credentials. You keep Pro until the paid period ends.</p>
          <p>We won't raise prices on existing subscribers. If you're paying ${PRO_MONTHLY_USD} a month today, you'll keep paying ${PRO_MONTHLY_USD}.</p>

          <h2>5. Refunds</h2>
          <p>Full refund within {REFUND_WINDOW_DAYS} days, no questions. After {REFUND_WINDOW_DAYS} days we'll prorate the unused time if you cancel for a real reason. Email <a href="mailto:hello@toolips.xyz">hello@toolips.xyz</a>.</p>

          <h2>6. Service availability</h2>
          <p>We aim for 99.5% monthly uptime. We don't currently offer SLA credits. If that matters to you, hold off until we do. Status updates: <a href={localizedPath(locale, "/status")}>toolips.xyz/status</a>.</p>

          <h2>7. Your content</h2>
          <p>You own what you put in. We claim no rights over your files, prompts, or outputs. Server-side tools may temporarily store job outputs in private storage so you can download them, and deleting your account removes account-tied job data.</p>

          <h2>8. Our content</h2>
          <p>The Toolips code, design system, and blog posts are © Toolips. The MIT-licensed parts (the open-source tool handlers in <code>@toolips/tools-utility</code>) are MIT-licensed. Use them in your own projects; attribution appreciated.</p>

          <h2>9. Warranties</h2>
          <p>We provide Toolips "as is." We don't warrant that every tool will work for every file, that AI outputs will be correct, or that the service will never go down. Verify important outputs yourself.</p>

          <h2>10. Liability</h2>
          <p>To the extent allowed by law, our total liability to you for any claim arising from Toolips is capped at the amount you've paid us in the past 12 months (zero for free users).</p>

          <h2>11. Termination</h2>
          <p>You can delete your account anytime. We can terminate accounts that violate the acceptable-use policy or that have been inactive for 24+ months on the free tier (we'll email first).</p>

          <h2>12. Governing law</h2>
          <p>These terms are governed by the laws of the Republic of Indonesia, the same as the <a href="https://efolusi.com/en/terms">Efolusi Platform Terms</a>.</p>
          <p>If you have a complaint or a dispute, write to <a href="mailto:hello@toolips.xyz">hello@toolips.xyz</a> first. We will try to resolve it with you within 30 days.</p>
          <p>Nothing here takes away your right as a consumer to use the dispute channels that Indonesian law gives you, such as the Consumer Dispute Settlement Body (BPSK).</p>

          <h2>13. Changes</h2>
          <p>We can update these terms. Material changes get email + 30 days' notice. Trivial changes (typos, contact info) we just push.</p>

          <h2>Contact</h2>
          <p>Toolips is operated by PT Efolusi Dunia Teknologi, Bumi Cikande Indah, Blok D12 No 15, Cikande, Kab. Serang, Banten 42186, Indonesia.</p>
          <p>Email <a href="mailto:hello@toolips.xyz">hello@toolips.xyz</a>. We reply within 5 business days.</p>
        </div>
      </article>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
