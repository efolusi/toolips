---
title: Why we build client-side first
slug: why-client-side-first
date: 2026-05-20
author: Aria Vance
category: Engineering
read: 6
block: 2
featured: false
summary: If a tool can run in the user's browser, it probably should. Here's the rule, and the four times we've broken it.
---

We have one rule we keep coming back to: **if the tool can run in the user's browser, it probably should.**

That rule is why most Toolips utilities never touch our servers. You drop a PDF, we shrink it in your tab, you download it. No upload. No round-trip. No "your file will be available for 24 hours, lol."

## The four reasons it's better

1. **Privacy by default.** Your tax return doesn't need to visit Estonia to get a watermark.
2. **Speed.** No upload time, no queue, no server roundtrip. Cold cache to compressed PDF in 800ms on a M2.
3. **Cost.** Egress bandwidth is the killer. Doing work on the client means we can charge $6/mo for Pro instead of $40.
4. **Reliability.** Your tab is up. Our server may not be. The tool still works.

## When we break the rule

Four times. Be honest about it.

- **AI tools.** Claude doesn't run in your browser yet. So Pro AI features (paraphraser, hooks, captions) call our server through Efolusi Relay. We don't keep the prompts.
- **Heavy ML.** OCR via Tesseract works in-browser, but Whisper does not. STT goes to the server.
- **Network scans.** Your browser can't open a TCP socket. DNS, SSL, ports: server-side.
- **Video downloads.** YouTube blocks browser-only `yt-dlp` flows. So the downloaders were built to run as a job on our worker, upload to product-scoped private object storage, and hand you a signed URL. They are paused for now.

That's it. Everything else runs in your tab.

## How to tell which is which

Look at the tool card. If it's labeled **FREE**, it almost certainly runs locally. If it's **PRO** _and_ in the "AI" or "Security" categories, it's server-side.

We'll add a tiny icon for this in 2.1.
