// The limits a tool page lists, read from the code that enforces them.
//
// Every row comes from a constant the API checks (file-capabilities.ts,
// plan-limits.ts). A tool with no enforced limit of a kind gets no row for it:
// the page never states a limit nothing enforces.

import { FILE_PROCESSING_LIMITS, FILE_TOOL_CAPABILITIES } from "~/lib/core/file-capabilities";
import { PLAN_LIMITS } from "~/lib/core/plan-limits";
import type { Tool } from "~/lib/core/catalog";
import type { Dictionary } from "~/lib/i18n";
import { fill, MAX_FILE_MB } from "~/lib/site-facts";

export type LimitRow = { label: string; value: string };

export function toolLimits(tool: Tool, t: Dictionary["toolPage"]): LimitRow[] {
  const rows: LimitRow[] = [{ label: t.plan, value: tool.tier === "free" ? t.planFree : t.planPro }];
  const file = FILE_TOOL_CAPABILITIES[tool.id];

  if (file) {
    rows.push({ label: t.runsIn, value: file.runtime === "browser-local" ? t.runsBrowser : t.runsServer });
    rows.push({ label: t.fileSize, value: fill(t.fileSizeValue, { mb: MAX_FILE_MB }) });
    if (tool.id === "batch-resize") {
      rows.push({ label: t.batch, value: fill(t.batchValue, { batch: FILE_PROCESSING_LIMITS.maxBatchImages }) });
    }
    if (tool.id === "merge-pdf") {
      rows.push({ label: t.batch, value: fill(t.mergeValue, { merge: FILE_PROCESSING_LIMITS.maxMergePdfs }) });
    }
    if (file.server?.family === "pdf") {
      rows.push({ label: t.pages, value: fill(t.pagesValue, { pages: FILE_PROCESSING_LIMITS.maxPdfPages }) });
    }
  }

  // The free file cap is the one daily limit the docs and pricing page quote.
  if (tool.tier === "free" && file?.runtime === "server-multipart") {
    rows.push({ label: t.freeDaily, value: fill(t.freeDailyExports, { exports: PLAN_LIMITS.free.exportsPerDay }) });
  }
  rows.push({ label: t.proDaily, value: t.proDailyValue });
  return rows;
}
