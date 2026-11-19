---
title: MCP-first, not MCP-only
slug: mcp-first-not-mcp-only
date: 2026-05-15
author: Mira Sato
category: Engineering
read: 5
block: 3
featured: false
summary: We built the MCP server first and made the web app a thin client over it. Here's what that bought us, and the one place it bit us.
---

When we started rewriting Toolips, the first thing we wrote wasn't a page. It was an MCP server.

The MCP server is just a JSON-RPC wrapper that exposes every tool as a `tool.call` handler. Same input shape, same output shape, same error codes as the REST API. The web page is just a UI on top of the same handlers.

That sounds purist. The benefits were real.

## What it bought us

- **Three surfaces, one implementation.** Web app, REST API, MCP server: same handler. Bug fix in one place fixes all three.
- **Real validation.** Every tool has a Zod schema. The web form generates from it, the REST API validates against it, the MCP tool advertises it. No drift.
- **Free tool catalog for agents.** Claude or Cursor mounts the MCP server, gets the Toolips catalog, no integration work.
- **Pricing parity.** Pro tier on the web is the same Pro tier from the API is the same Pro tier from MCP. One quota, one entitlement check.

## The place it bit us

Web UIs sometimes want stateful flows, like the PDF batch processor that lets you reorder files before merging. MCP doesn't have stateful sessions. So the batch flow is web-only, and the API equivalent takes a pre-ordered array.

We considered shoehorning MCP into supporting it. We decided not to. Some interactions are inherently UI-shaped, and that's fine.

## The takeaway

Build the protocol layer first if you want it to be a real product. If you build the web app first, "MCP support" becomes a leaky abstraction that re-fetches HTTP routes and pretends. We've shipped that. Don't.
