---
title: Toolips 2.0 changelog
slug: v2-changelog
date: 2026-05-05
author: Toolips Team
category: Changelog
read: 3
block: 2
featured: false
summary: The full rewrite shipped. Here's what changed, what stayed the same, and what we deleted on purpose.
---

Toolips 2.0 is the rewrite we've been working on since January. Same product, very different insides.

## What's new

- **Single-app architecture.** Web, REST API, and MCP server are one Next.js codebase. No more submodule swarm.
- **TypeScript end-to-end.** Every tool handler is type-safe from form validation to DB write.
- **Shared PostgreSQL + Valkey + private object storage.** Drizzle for the schema, BullMQ for jobs, and product-scoped MinIO for large files.
- **Better Auth.** Session cookies for the web, API keys for the REST + MCP API. Same identity everywhere.
- **Pro billing.** Pro tier at $6/mo or $48/yr. Checkout now runs through Efolusi Pay. Cancel from your account.
- **Dark mode.** Auto-detects `prefers-color-scheme`. Override via the theme toggle.
- **OG cards.** Every page renders an Open Graph image. Sharable links don't show as naked URLs anymore.

## What's faster

- **Cold start.** ~480ms for the hub on a M2 vs ~1.8s on the old stack.
- **PDF compression.** 89 docs/sec batch vs 12/sec on 1.x. Web Worker pool + streaming ZIP.
- **DNS lookup.** 90ms vs 600ms, because we cache results for 5 minutes server-side.

## What we deleted

- **Ollama support.** Local models were cool but introduced a third inference path we couldn't keep tuned. Efolusi Relay handles routing for us now.
- **The legacy `/v1/*` API routes.** The supported API surface now lives under `/api/tools`, `/api/jobs`, and `/api/mcp`.
- **Custom CSS animations.** Down from 18 to 5. The blog post about easing curves was a sign that we'd over-invested.
- **Email confirmation flow.** Replaced with magic links + Better Auth. One click, no inbox bouncing.

## What's coming in 2.1

- **Webhooks** on every tool run (for Pro).
- **Native macOS app** wrapping the web app. Same code, packaged.
- **HTTP inspector refinements** for safer request debugging.

That's the changelog. Onward.
