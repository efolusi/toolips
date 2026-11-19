// The Toolips tool catalog is canonical in ~/lib/core/catalog (FR-1.1)
// so the hub UI and the server-side registries/CI checks all reference one list.
// This module re-exports it unchanged for existing UI import sites
// (`~/lib/tools`), so nothing downstream needs to change.

export type { Tool, ToolSurface, ToolTier, ToolStatus, Category } from "~/lib/core/catalog";
export { TOOLS, RUNNABLE_TOOLS, CATEGORIES, isRunnableTool, toolById } from "~/lib/core/catalog";
