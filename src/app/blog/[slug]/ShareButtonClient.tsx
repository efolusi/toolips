"use client";

import { useState } from "react";
import { Icon } from "@efolusi/meridian";

/** Copies the post's URL. The label changes for a moment to confirm it. */
export function ShareButtonClient({ share, copied: copiedLabel }: { share: string; copied: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard blocked: the address bar still has the link.
    }
  }
  return (
    <button type="button" onClick={copy} className="ef-btn ef-btn--secondary ef-btn--md" aria-live="polite">
      <Icon name={copied ? "check" : "link"} size={16} />
      {copied ? copiedLabel : share}
    </button>
  );
}
