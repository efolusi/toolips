"use client";

// Route-level error boundary: a branded page instead of Next's default, with no
// stack sent to the client. It renders inside the root layout, so <html lang>
// already holds the request language; the copy follows it.

import { useEffect, useState } from "react";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle, Icon } from "@efolusi/meridian";
import { dictionaryFor } from "~/lib/i18n";
import { localizedPath } from "~/lib/locale-routing";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [lang, setLang] = useState("en");
  useEffect(() => {
    setLang(document.documentElement.lang);
    console.error("[route-error]", error);
  }, [error]);
  const d = dictionaryFor(lang);
  const t = d.error;

  return (
    <main id="main" tabIndex={-1} className="section wrap">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Icon name="triangle-alert" />
          </EmptyMedia>
          <EmptyTitle>{t.title}</EmptyTitle>
          <EmptyDescription>
            {t.lead}
            {error?.digest ? ` (${error.digest})` : ""}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="actions" style={{ marginTop: 0 }}>
            <button type="button" onClick={reset} className="ef-btn ef-btn--primary ef-btn--md">
              {t.retry}
            </button>
            <a href={localizedPath(d.htmlLang === "id" ? "id" : "en", "/")} className="ef-btn ef-btn--secondary ef-btn--md">
              {t.backHome}
            </a>
          </div>
        </EmptyContent>
      </Empty>
    </main>
  );
}
