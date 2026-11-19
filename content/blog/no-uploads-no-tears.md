---
title: No uploads, no tears
slug: no-uploads-no-tears
date: 2026-04-20
author: Mira Sato
category: Engineering
read: 4
block: 1
featured: false
summary: The engineering pattern that lets us process 50MB PDFs in a browser tab without crashing it.
---

Toolips processes most files entirely in your browser. No upload, no server-side queue, no "your file expires in 24 hours."

For small files, this is trivial. For 50MB PDFs and 4K image batches, it's not.

Here's the pattern we landed on.

## The naive approach (don't)

```typescript
const file = e.target.files[0];
const buffer = await file.arrayBuffer();   // sits in JS memory
setBuffer(buffer);                          // and now in React state
const out = await processInWorker(buffer); // and now copied to the worker
download(out);                              // and now back in main thread
```

Four copies of your 50MB file. Tab crashes around the third batch.

## The pattern we use

1. **Never put the `ArrayBuffer` in React state.** Keep a `File` reference in `useRef`. State changes trigger re-renders that snapshot the buffer.
2. **Transfer, don't copy.** `worker.postMessage(buffer, [buffer])`: the second argument transfers ownership. The main thread loses its reference, the worker gains it. Zero copy.
3. **Stream the output.** Don't materialize a 200MB ZIP in memory. Use `WritableStream` + `streamSaver` to write directly to a download.
4. **Size the worker pool to `navigator.hardwareConcurrency`.** Don't spawn 8 workers on a 2-core Chromebook.

## What changed

Before: ~12 PDFs/sec batch, tab crashed at ~200MB total.
After: ~89 PDFs/sec on a M2, ~1.2GB total without a hiccup.

The change wasn't an algorithm. It was respecting the heap.

## When you do need a server

Some files are too big for any browser. Some operations (video transcoding, OCR at scale, ML inference) are too heavy. For those, we use a server-side job queue. The pattern there is similar: never load the full file in memory; stream chunks from private storage through the processor.

We'll write about the server-side pattern in the next post. For now, take this with you: **the file is not your state.**
