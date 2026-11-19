"use client";

// Route-level error boundary: catches uncaught render/server-component throws so
// users get a branded screen (not Next's default) and stacks never reach the client.
//
// The full-page error uses Meridian's composable Empty primitives. An Alert is
// intentionally omitted because this is already the page state; stacking both
// would duplicate the message.
import Link from "next/link";
import { useEffect } from "react";
import {
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Icon,
} from "@efolusi/meridian";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[route-error]", error);
  }, [error]);

  return (
    <main
      id="main"
      tabIndex={-1}
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
      }}
    >
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Icon name="triangle-alert" />
          </EmptyMedia>
          <EmptyTitle>Something broke.</EmptyTitle>
          <EmptyDescription>
            An unexpected error hit this page. It&apos;s been logged
            {error?.digest ? ` (ref ${error.digest})` : ""}. You can retry or head back to the
            tools.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div style={{ display: "flex", gap: 10 }}>
            <Button type="button" onClick={reset} variant="primary">
              Try again
            </Button>
            {/* Anchor stays an anchor: meridian Button has no href (established FASE 1-3 pattern). */}
            <Link
              href="/"
              className="tlp-btn tlp-btn--secondary"
              style={{ textDecoration: "none" }}
            >
              Back to tools
            </Link>
          </div>
        </EmptyContent>
      </Empty>
    </main>
  );
}
