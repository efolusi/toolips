---
title: Welcome to Toolips
date: 2026-05-23
author: Toolips Team
category: Product
read: 4
block: 1
featured: true
summary: A single-app tools site built on TypeScript, shared PostgreSQL, Valkey, private object storage, and a real respect for your time.
---

Toolips used to be a swarm of products held together with submodules and Express servers. Today it's one TypeScript app, one Docker Compose stack, one design system, and one MCP endpoint.

## What's here

- **53 free utilities** for text, image, color, code, PDF, calculators, and security checks.
- **Security scanners**: DNS, TLS, headers, ports, CT logs. Sync results for the fast ones, queued jobs for the slow ones.
- **AI tools** powered through Efolusi Relay (Claude, GPT, open models; your pick).
- **MCP API** at `/api/mcp`: the same registry every tool runs on, exposed to your agents.

## Why one app

Operational sanity. One deployment, one DB, one design system. The MCP wrapper isn't a re-fetch of HTTP routes anymore. It calls the same handler the web pages do.

## What's next

We're shipping in the open. Expect a new tool every week, a changelog post every two, and the occasional opinionated essay on why your PDF compressor shouldn't upload your taxes to Estonia.
