"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { RUNNABLE_TOOLS, CATEGORIES } from "~/lib/tools";
import { ToolIcon } from "~/components/ToolIcon";
import { DEFAULT_LOCALE, dictionaries, type Locale } from "~/lib/i18n";
import { appUrl } from "~/lib/api";
import { categoryLabel, toolCopy } from "~/lib/tool-copy";
import { fill, FREE_TOOL_COUNT, PRO_TOOL_COUNT, TOOL_COUNT } from "~/lib/site-facts";

// The dictionary arrives as a prop rather than being looked up here, because
// this is a client component: React serialises the plain object across the
// boundary, and the locale is a fact about the route, which only the server
// knows. The category chips and the tool cards render through the tool-copy
// dictionary, so the catalogue reads in the page's language too — and search
// matches the copy the reader actually sees.
export function HubGrid({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const t = dictionaries[locale];
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const searchRef = useRef<HTMLInputElement | null>(null);

  // ⌘K / Ctrl+K focuses the search box — matches the kbd badge in the input.
  // Esc clears focus + selection.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      } else if (e.key === "Escape" && document.activeElement === searchRef.current) {
        searchRef.current?.blur();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Query first, category second: the chips show how many tools the CURRENT
  // query leaves in each category, so a chip never promises results it cannot show.
  const matched = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (q === "") return RUNNABLE_TOOLS;
    return RUNNABLE_TOOLS.filter((t) => {
      const copy = toolCopy(t, locale);
      return copy.name.toLowerCase().includes(q) || copy.desc.toLowerCase().includes(q);
    });
  }, [search, locale]);
  const filtered = useMemo(
    () => (cat === "All" ? matched : matched.filter((t) => t.category === cat)),
    [matched, cat],
  );
  const hasQuery = search.trim() !== "";
  const chipCount = (name: string, total: number) =>
    !hasQuery ? total : name === "All" ? matched.length : matched.filter((t) => t.category === name).length;

  const [lead, accent, trail] = t.hero.title;
  const [gLead, gAccent, gTrail] = t.grid.title;
  return (
    <>
      <section className="lp-hero">
        <div className="lp-wrap">
          <h1 className="lp-h1">
            {lead}
            <span className="lp-script">{accent}</span>
            {trail}
          </h1>
          <p className="lp-hero__sub">{fill(t.hero.lead, { count: TOOL_COUNT })}</p>
          <form
            className="lp-search"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              document.getElementById("tools")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            <div className="lp-search__field">
              <input
                ref={searchRef}
                type="search"
                className="lp-search__input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={fill(t.hero.searchPlaceholder, { count: TOOL_COUNT })}
                aria-label={t.hero.searchAria}
              />
              <kbd className="lp-search__kbd" aria-hidden="true">
                ⌘K
              </kbd>
            </div>
            <button type="submit" className="lp-pill lp-pill--primary">
              {t.hero.browse}
            </button>
          </form>
          <p className="lp-proof">
            <span className="lp-proof__dot" aria-hidden="true" />
            <span>{fill(t.hero.eyebrow, { free: FREE_TOOL_COUNT, pro: PRO_TOOL_COUNT })}</span>
          </p>
        </div>
      </section>

      <section id="tools" className="lp-section">
        <div className="lp-wrap">
          <div className="lp-head">
            <h2 className="lp-h2">
              {gLead}
              <span className="lp-script">{gAccent}</span>
              {gTrail}
            </h2>
            <p className="lp-lede">{t.grid.lede}</p>
          </div>

          <div className="lp-filters">
            {/* A category with nothing runnable (every downloader is suspended)
                gets no chip: a chip that can only show an empty grid is noise. */}
            {CATEGORIES.filter((c) => c.name === "All" || c.count > 0).map((c) => (
              <button
                key={c.name}
                type="button"
                className="lp-pill lp-pill--sm lp-pill--quiet"
                aria-pressed={cat === c.name}
                onClick={() => setCat(c.name)}
              >
                {categoryLabel(c.name, locale)}
                {(hasQuery || c.count > 0) && <span className="lp-count">{chipCount(c.name, c.count)}</span>}
              </button>
            ))}
          </div>
          <p className="lp-results" aria-live="polite">
            {fill(t.grid.resultCount, { count: filtered.length })}
          </p>

          {filtered.length > 0 ? (
            <div className="lp-grid">
              {filtered.map((tool) => {
                const copy = toolCopy(tool, locale);
                return (
                  <Link key={tool.id} href={appUrl(`/tool/${tool.id}`)} className="lp-card" data-tier={tool.tier}>
                    <div className="lp-card__top">
                      <span className="lp-card__icon" aria-hidden="true">
                        <ToolIcon name={tool.icon} size={20} strokeWidth={2} />
                      </span>
                      <span className={`lp-tag lp-tag--${tool.tier}`}>
                        {tool.tier === "free" ? t.toolPage.badgeFree : t.toolPage.badgePro}
                      </span>
                    </div>
                    <div>
                      <p className="lp-card__name">{copy.name}</p>
                      <p className="lp-card__desc">{copy.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="lp-empty">
              <h3>{hasQuery ? fill(t.grid.emptyFor, { query: search.trim() }) : t.grid.emptyTitle}</h3>
              <p>{t.grid.emptyBody}</p>
              {hasQuery && (
                <button
                  type="button"
                  className="lp-pill lp-pill--primary"
                  onClick={() => {
                    setSearch("");
                    setCat("All");
                    searchRef.current?.focus();
                  }}
                >
                  {t.grid.clearSearch}
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
