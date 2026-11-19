// Content-Security-Policy construction (NFR-SEC-1). In production we emit a
// per-request nonce and drop 'unsafe-inline' from script-src, so an injected
// inline <script> won't execute (the largest open XSS-mitigation gap). Next's
// App Router reads the nonce from the request CSP header set by middleware and
// stamps it onto its own hydration/data scripts automatically; our one external
// script (/theme-init.js) is allowed by 'self'.
//
// In development we keep 'unsafe-inline'/'unsafe-eval' (Next's dev tooling emits
// un-nonced inline scripts and needs eval for source maps) and DO NOT set a
// nonce — a nonce would make browsers ignore 'unsafe-inline' and break dev.

export function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

// The API is a sibling origin (api.toolips.xyz) in the split deployment, so it
// has to be named explicitly in connect-src and form-action — 'self' is only
// the Worker origin. Empty string when unset (single-origin dev), where 'self'
// already covers it.
const API_ORIGIN = (() => {
  const raw = process.env.NEXT_PUBLIC_API_URL;
  if (!raw) return "";
  try {
    return new URL(raw).origin;
  } catch {
    return "";
  }
})();

export function buildCsp(opts: { nonce?: string; isProduction: boolean }): string {
  const { nonce, isProduction } = opts;
  const api = API_ORIGIN ? ` ${API_ORIGIN}` : "";
  const scriptSrc = isProduction
    ? ["'self'", nonce ? `'nonce-${nonce}'` : "", "'wasm-unsafe-eval'"].filter(Boolean).join(" ")
    : "'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'";

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "worker-src 'self' blob:",
    // style-src keeps 'unsafe-inline': the app uses React inline style objects
    // heavily and style nonces are impractical. Styles are a far weaker XSS
    // vector than scripts, which are now nonce-gated.
    "style-src 'self' 'unsafe-inline'",
    // Fonts are self-hosted via Meridian; data: covers inlined icon fonts.
    "font-src 'self' data:",
    "img-src 'self' data: blob:",
    // jsdelivr + huggingface: the stt tool streams the Whisper model + ONNX
    // runtime from these CDNs. Narrowing this to 'self' is tracked separately
    // and blocked on self-hosting the model (PRD §9 Q2) — until then these are
    // a data-fetch surface (connect-src only, no script execution).
    `connect-src 'self'${api} https://*.sentry.io https://cdn.jsdelivr.net https://huggingface.co https://*.huggingface.co https://*.hf.co`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    `form-action 'self'${api}`,
    "object-src 'none'",
  ].join("; ");
}
