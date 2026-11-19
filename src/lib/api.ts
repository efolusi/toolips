// Where the site points. The site is static; everything signed-in (tools, account,
// API keys, checkout) lives in the Toolips app on its own domain.

/** Public origin of this site, used for canonical URLs, robots and the sitemap. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://toolips.efolusi.com";

/** The Toolips app: tool pages, sign-in, account. */
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://toolips.xyz";

/** The Toolips API, used only by the pricing page's checkout forms. */
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolips.xyz";

export function appUrl(path: string): string {
  return `${APP_URL}${path}`;
}

export function apiUrl(path: string): string {
  return `${API_URL}${path}`;
}
