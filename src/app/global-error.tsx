"use client";

// Last-resort boundary for errors thrown in the root layout itself. It REPLACES
// the layout (and globals.css), so styles are inline literals, not design tokens.
//
// FASE 4 decision: deliberately NOT migrated to meridian Alert/EmptyState.
// globals.css (which imports @efolusi/meridian/styles.css) is gone in this
// boundary, so ef-* classes and tokens would render completely unstyled. The
// inline-literal markup is the only thing guaranteed to look right here.
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "-apple-system, system-ui, sans-serif",
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          background: "Canvas",
          color: "CanvasText",
          textAlign: "center",
          padding: 32,
        }}
      >
        <div
          style={{
            fontWeight: 800,
            fontSize: 48,
            letterSpacing: 0,
            textTransform: "uppercase",
            lineHeight: 0.95,
          }}
        >
          Something broke.
        </div>
        <p style={{ color: "GrayText", maxWidth: 440 }}>
          An unexpected error occurred{error?.digest ? ` (ref ${error.digest})` : ""}. Try again, or
          head back to the homepage.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            onClick={reset}
            style={{
              background: "CanvasText",
              color: "Canvas",
              border: 0,
              padding: "12px 20px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          {/* global-error replaces the app router, so a plain full-reload anchor is intentional here (next/link would rely on the router we just lost). */}
          <a
            href="/"
            style={{
              background: "transparent",
              color: "CanvasText",
              border: "1.5px solid CanvasText",
              padding: "12px 20px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Homepage
          </a>
        </div>
      </body>
    </html>
  );
}
