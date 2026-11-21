# Toolips site

The website of Toolips: the home page with the tool list, a page per tool, pricing, docs, the blog, status, privacy and terms, in English and Indonesian.
It is a Next.js site built with OpenNext and served by the Cloudflare Worker `toolips` (`wrangler.jsonc`).

The tools themselves, sign-in and the account live in the Toolips app (`NEXT_PUBLIC_APP_URL`, default `https://toolips.xyz`).
The pricing page links to Efolusi Pay's checkout (`NEXT_PUBLIC_PAY_URL`, default `https://pay.efolusi.com`; the URL shape lives in `src/lib/pay.ts`).
The status page and the newsletter form talk to the Toolips API (`NEXT_PUBLIC_API_URL`).

- `src/app/`: the pages.
- `content/blog/`: the posts; `content/blog/id/` holds Indonesian versions of the short ones. `scripts/bundle-blog.mjs` bundles them into the build, because the Worker has no file system.
- `src/lib/core/`: the tool catalog, plan limits, file limits and HTML escaping, copied from the Toolips tool-core package.
- `src/app/globals.css`: the page layout only. Components and tokens come from `@efolusi/meridian`.

## Develop

Node 26.13.1 and pnpm 11.24.0 (`npm install -g pnpm@11.24.0`).

```bash
pnpm install
pnpm dev        # http://localhost:3100
pnpm test
pnpm preview    # builds with OpenNext and serves it with wrangler, the way Cloudflare runs it
```

## Deploy

`.github/workflows/deploy.yml` deploys from a `v*` tag on `main`, with the `CLOUDFLARE_API_TOKEN` secret and the
`CLOUDFLARE_ACCOUNT_ID` variable of the `production` environment. Every change reaches `main` through a pull request.
