"use client";

// The hero search and the tool list. One client component because the search
// box in the hero filters the list below it. Each tool links to its own page
// on this site (/tool/<id>), which links on into the app.

import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@efolusi/meridian";
import { CATEGORIES, RUNNABLE_TOOLS } from "~/lib/tools";
import { ToolCard } from "./ToolCard";
import { Accented } from "./Accented";
import { dictionaries, type Locale } from "~/lib/i18n";
import { categoryLabel, toolCopy } from "~/lib/tool-copy";
import { fill, FREE_TOOL_COUNT, PRO_TOOL_COUNT, TOOL_COUNT } from "~/lib/site-facts";

export function ToolFinder({ locale }: { locale: Locale }) {
  const t = dictionaries[locale];
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const searchRef = useRef<HTMLInputElement | null>(null);

  // Ctrl+K or Cmd+K focuses the search box from anywhere on the page.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Query first, category second: each chip counts what the current query
  // leaves in it, so a chip never promises results it cannot show.
  const matched = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (q === "") return RUNNABLE_TOOLS;
    return RUNNABLE_TOOLS.filter((tool) => {
      const copy = toolCopy(tool, locale);
      return copy.name.toLowerCase().includes(q) || copy.desc.toLowerCase().includes(q);
    });
  }, [search, locale]);
  const shown = cat === "All" ? matched : matched.filter((tool) => tool.category === cat);
  const hasQuery = search.trim() !== "";
  const countIn = (name: string) => (name === "All" ? matched.length : matched.filter((x) => x.category === name).length);

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <h1 className="display-1">
            <Accented parts={t.hero.title} />
          </h1>
          <p className="lede">{fill(t.hero.lead, { count: TOOL_COUNT })}</p>
          <form
            className="hero-search"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              document.getElementById("tools")?.scrollIntoView({ block: "start" });
            }}
          >
            <Input
              ref={searchRef}
              type="search"
              size="lg"
              iconLeft="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={fill(t.hero.searchPlaceholder, { count: TOOL_COUNT })}
              aria-label={t.hero.searchLabel}
            />
            <button type="submit" className="ef-btn ef-btn--primary ef-btn--lg">
              {t.hero.find}
            </button>
          </form>
          <p className="hero-proof">{fill(t.hero.proof, { free: FREE_TOOL_COUNT, pro: PRO_TOOL_COUNT })}</p>
        </div>
      </section>

      <section id="tools" className="section section--rule" aria-labelledby="tools-title">
        <div className="wrap">
          <div className="section-head">
            <h2 id="tools-title" className="display-2">
              <Accented parts={t.grid.title} />
            </h2>
            <p className="lede">{t.grid.lede}</p>
          </div>

          <div className="toolbar">
            {/* A category with nothing runnable gets no chip: it could only
                show an empty list. */}
            <div className="filters" role="group" aria-label={t.hero.searchLabel}>
              {CATEGORIES.filter((c) => c.name === "All" || c.count > 0).map((c) => (
                <button
                  key={c.name}
                  type="button"
                  className="ef-btn ef-btn--secondary ef-btn--sm"
                  aria-pressed={cat === c.name}
                  onClick={() => setCat(c.name)}
                >
                  {categoryLabel(c.name, locale)} <span className="muted">{countIn(c.name)}</span>
                </button>
              ))}
            </div>
            <p className="muted" aria-live="polite">
              {fill(t.grid.resultCount, { count: shown.length })}
            </p>
          </div>

          {shown.length > 0 ? (
            <ul className="tool-grid">
              {shown.map((tool) => (
                <li key={tool.id}>
                  <ToolCard tool={tool} locale={locale} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty">
              <h3 className="display-3">{hasQuery ? fill(t.grid.emptyFor, { query: search.trim() }) : t.grid.emptyTitle}</h3>
              <p>{t.grid.emptyBody}</p>
              <button
                type="button"
                className="ef-btn ef-btn--primary ef-btn--md"
                onClick={() => {
                  setSearch("");
                  setCat("All");
                  searchRef.current?.focus();
                }}
              >
                {t.grid.clearSearch}
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
