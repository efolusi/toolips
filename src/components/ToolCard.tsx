// One tool in a list: icon, name, a Pro badge when it needs Pro, description.
// Links to the tool's page on this site.

import Link from "next/link";
import { Badge } from "@efolusi/meridian";
import { ToolIcon } from "./ToolIcon";
import type { Tool } from "~/lib/tools";
import { dictionaries, type Locale } from "~/lib/i18n";
import { localizedPath } from "~/lib/locale-routing";
import { toolCopy } from "~/lib/tool-copy";

export function ToolCard({ tool, locale }: { tool: Tool; locale: Locale }) {
  const copy = toolCopy(tool, locale);
  return (
    <Link href={localizedPath(locale, `/tool/${tool.id}`)} className="ef-card ef-card--interactive tool-card">
      <span className="tool-icon" aria-hidden="true">
        <ToolIcon name={tool.icon} size={18} strokeWidth={2} />
      </span>
      <span>
        <span className="tool-card__name">
          {copy.name}
          {tool.tier === "pro" ? <Badge variant="secondary">{dictionaries[locale].toolPage.badgePro}</Badge> : null}
        </span>
        <span className="tool-card__desc">{copy.desc}</span>
      </span>
    </Link>
  );
}
