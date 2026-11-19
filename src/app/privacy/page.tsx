import type { Metadata } from "next";
import { SiteNav, SiteFooter } from "~/components/SiteNav";
import { dictionaries } from "~/lib/i18n";
import { localeAlternates } from "~/lib/locale-routing";
import { requestLocale } from "~/lib/request-locale";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  const t = dictionaries[locale].legal;
  return {
    title: t.privacyTitle,
    description: t.privacyDescription,
    alternates: localeAlternates(locale, "/privacy"),
  };
}

const PRIVACY_EFFECTIVE_DATE = "October 16, 2026";

export default async function PrivacyPage() {
  const locale = await requestLocale();
  const t = dictionaries[locale].legal;
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
        <div className="eyebrow is-brand" style={{ marginBottom: 12 }}>
          Privacy
        </div>
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
          Privacy.
          <br />
          <span style={{ color: "var(--brand-700)" }}>Short version.</span>
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 17, marginBottom: 32 }}>
          Effective {PRIVACY_EFFECTIVE_DATE}. Last reviewed by a human, not auto-generated.
        </p>

        <div className="blog-prose" style={{ fontSize: 17, lineHeight: 1.7 }}>
          {/*
            Every claim below is a claim about code. Where it comes from:
              upload tools         packages/tool-core/src/file-capabilities.ts (server(...) entries)
              in memory, not kept  apps/api/src/lib/server-tools/image-ops.ts, pdf-ops.ts
              download retention   packages/tools-download/src/limits.ts (outputTtlMs),
                                   infra/minio/download-lifecycle.json
              SSO only             packages/auth/src/index.ts (emailAndPassword disabled)
              IP keyed hashes      apps/api/src/lib/usage-log.ts, packages/billing/src/quota.ts,
                                   packages/billing/src/rate-limit.ts
              90 day usage log     packages/db/src/maintenance.ts (USAGE_EVENTS_RETENTION_MS)
              account deletion     packages/auth/src/index.ts (user.deleteUser hooks)
            Change this page in the same commit as any of those.
          */}
          <h2>Who is responsible</h2>
          <p>
            Toolips is operated by PT Efolusi Dunia Teknologi, Bumi Cikande Indah, Blok D12 No
            15, Cikande, Kab. Serang, Banten 42186, Indonesia. We are the controller of the
            personal data described on this page and process it in line with Indonesia&apos;s
            Personal Data Protection Law (Law No. 27 of 2022). Reach us at{" "}
            <a href="mailto:privacy@toolips.xyz">privacy@toolips.xyz</a> or{" "}
            <a href="mailto:hi@efolusi.com">hi@efolusi.com</a>.
          </p>

          <h2>The honest summary</h2>
          <p>
            Many Toolips tools run entirely in your browser, and for those your file or text stays
            on your device. Other tools need our server, and for those your input is sent to
            api.toolips.xyz:
          </p>
          <ul>
            <li>
              <strong>Image and PDF tools.</strong> Merge, split, compress, rotate and watermark
              PDF, JPG to PDF, and the image compressor, resizer, converter, cropper, rotator,
              watermark, grayscale, batch resize and palette tools upload your file to our server.
              It is processed in memory and the result is sent straight back. The uploaded file
              and the result are not saved. PDF to JPG, image OCR and speech to text run in your
              browser instead.
            </li>
            <li>
              <strong>AI tools.</strong> The text you enter is sent through Efolusi Relay, our AI
              gateway, to the AI model that answers it. We do not store the text or the answer.
            </li>
            <li>
              <strong>Security and network tools.</strong> The domain, address or URL you enter is
              sent to our server, which looks it up or connects to it for you.
            </li>
            <li>
              <strong>Downloaders.</strong> When they are available, our server fetches the link you
              paste and keeps the downloaded file in private storage for up to 24 hours so you can
              collect it, then deletes it.
            </li>
          </ul>

          <h2>What we collect</h2>
          <ul>
            <li>
              <strong>Account info.</strong> You sign in with your Efolusi account at
              my.efolusi.com. Toolips never sees or stores a password. We keep the email address
              and display name your Efolusi account shares with us.
            </li>
            <li>
              <strong>Usage events.</strong> Tool name, timestamp, success or failure, and a SHA-256
              hash of your input (not the input itself). Signed-in usage is tied to your account.
              For anonymous use we keep a keyed hash of your IP address instead of the address.
              Usage events are deleted after 90 days.
            </li>
            <li>
              <strong>Free quota and rate limits.</strong> Daily free quotas and short rate limit
              windows are counted per account, or for anonymous use per keyed hash of your IP
              address. The raw address is not stored. Counters are removed once their day or window
              has passed.
            </li>
            <li>
              <strong>Billing data.</strong> Efolusi Pay handles hosted checkout and provider
              routing; Toolips never receives card numbers, wallet keys, or provider credentials. We
              store Pay transaction IDs and entitlement status.
            </li>
            <li>
              <strong>Newsletter signups.</strong> If you opt in, we store your email address until
              you unsubscribe or ask us to delete it.
            </li>
            <li>
              <strong>Cookies.</strong> The Efolusi SSO session cookie, a <code>lang</code> cookie
              that remembers your language, and a short lived cookie that shows a new API key to you
              once. No advertising or third-party tracking cookies.
            </li>
          </ul>

          <h2>What we don&apos;t collect</h2>
          <ul>
            <li>The files you process with the image and PDF tools. They are not kept after the request.</li>
            <li>Your AI prompts after the response is returned. We pass them through Efolusi Relay and forget them.</li>
            <li>
              Your IP address as a stored identifier. Signed-in sessions do not record IP
              addresses, and anonymous usage and quota records hold only a keyed hash of it.
            </li>
            <li>
              Anything for advertising. We don&apos;t run ads, we don&apos;t sell data, we don&apos;t have
              a &quot;data partner.&quot;
            </li>
          </ul>

          <h2>Sub-processors and other services</h2>
          <p>
            Toolips uses these services to operate. Their handling is governed by their own privacy
            policies:
          </p>
          <ul>
            <li>
              <strong>Efolusi Pay</strong>: hosted checkout and payment routing. Provider-specific
              processing is isolated behind Pay.
            </li>
            <li>
              <strong>Efolusi shared infrastructure</strong>: the server, PostgreSQL and private
              object storage operated by Efolusi, where the API and the server-side tools run.
            </li>
            <li>
              <strong>Efolusi Relay</strong>: our shared AI inference gateway, which passes AI tool
              requests to the model provider.
            </li>
            <li>
              <strong>Cloudflare</strong>: serves toolips.xyz and api.toolips.xyz as our content
              delivery network and protects them from attacks, so it sees your IP address and the
              requests you make, including uploads. It also tells us your country, which we use only
              to pick the page language.{" "}
              <a href="https://www.cloudflare.com/privacypolicy/">cloudflare.com/privacypolicy</a>
            </li>
            <li>
              <strong>Resend</strong>: transactional email.{" "}
              <a href="https://resend.com/legal/privacy-policy">resend.com/privacy</a>
            </li>
            <li>
              <strong>Sentry</strong>: error monitoring for our server and, when enabled, for this
              website in your browser. Reports are set up without IP addresses, cookies or request
              bodies.{" "}
              <a href="https://sentry.io/privacy/">sentry.io/privacy</a>
            </li>
          </ul>
          <p>Some tools also contact other services on your behalf:</p>
          <ul>
            <li>
              The WHOIS and certificate tools query IANA RDAP servers and crt.sh with the domain you
              enter.
            </li>
            <li>
              When they are available, downloaders fetch from the site you link, such as YouTube
              or TikTok, using yt-dlp.
            </li>
            <li>
              Speech to text runs in your browser, and on first use your browser downloads the model
              from Hugging Face and the runtime from the jsDelivr CDN.
            </li>
          </ul>

          <h2>Your rights</h2>
          <ul>
            <li>
              <strong>Access / export.</strong> Account, then Danger zone, then Export your data.
              Returns a JSON file of your Toolips activity, billing references, API key metadata and
              jobs. Your identity and sessions are exported from my.efolusi.com.
            </li>
            <li>
              <strong>Delete.</strong> Account, then Danger zone, then Delete account. This revokes
              your API keys, cancels and deletes your download jobs and files, and deletes your
              usage events, quota counters, newsletter signup and Toolips billing rows. Efolusi Pay
              keeps its own record of payments you made.
            </li>
            <li>
              <strong>Opt out of analytics.</strong> There is nothing to opt out of. We don&apos;t run
              analytics or third-party tracking scripts.
            </li>
          </ul>

          <h2>Contact</h2>
          <p>
            Email <a href="mailto:privacy@toolips.xyz">privacy@toolips.xyz</a> or open an issue on
            GitHub. We reply within 5 business days.
          </p>

          <h2>Changes</h2>
          <p>
            We post changes here. Material changes get an email to all account holders 30 days
            before they take effect.
          </p>
        </div>
      </article>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
