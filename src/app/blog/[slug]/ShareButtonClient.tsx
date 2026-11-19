"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@efolusi/meridian";

export function ShareButtonClient({
  share,
  copied: copiedLabel,
}: {
  share: string;
  copied: string;
}) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  }
  return (
    <Button type="button" onClick={copy} variant="secondary" size="sm">
      {copied ? <Check size={13} strokeWidth={2.5} /> : <Copy size={13} strokeWidth={2.5} />}
      {copied ? copiedLabel : share}
    </Button>
  );
}
