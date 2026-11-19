import { afterEach, describe, expect, it, vi } from "vitest";

/** The site is static: the app, sign-in and checkout live on their own origins. */
describe("site links", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("points app links at the configured app origin", async () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://app.example.test");
    vi.resetModules();
    const { appUrl } = await import("../api");
    expect(appUrl("/tool/word-counter")).toBe("https://app.example.test/tool/word-counter");
  });

  it("falls back to the production hosts, never a relative path", async () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "");
    vi.stubEnv("NEXT_PUBLIC_API_URL", "");
    vi.resetModules();
    const { appUrl, apiUrl } = await import("../api");
    expect(appUrl("/sign-in")).toBe("https://toolips.xyz/sign-in");
    expect(apiUrl("/api/billing/checkout")).toBe("https://api.toolips.xyz/api/billing/checkout");
  });
});
