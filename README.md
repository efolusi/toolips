# Toolips site

The website of Toolips: the home page with the tool list, pricing, docs, the blog, privacy and terms, in English and Indonesian.
It is a Next.js site built with OpenNext and served by the Cloudflare Worker `toolips` (`wrangler.jsonc`).

The tools themselves, sign-in and the account live in the Toolips app (`NEXT_PUBLIC_APP_URL`, default `https://toolips.xyz`).
The pricing page posts checkout to the Toolips API (`NEXT_PUBLIC_API_URL`).

- `src/app/`: the pages.
- `content/blog/`: the posts. `scripts/bundle-blog.mjs` bundles them into the build, because the Worker has no file system.
- `src/lib/core/`: the tool catalog, plan limits, file limits and HTML escaping, copied from the Toolips tool-core package.

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

## License

Efolusi Reference License, see [LICENSE](LICENSE). You may read this site and run it locally as a sample of Meridian. You may not copy it into another product. The product name and logo are not part of that grant. Meridian itself remains Apache-2.0.
