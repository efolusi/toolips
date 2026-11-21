"use client";

// Live status: asks /api/status on load and on "Check again". Four states:
// loading, error (no answer), empty (answer without checks), and the report.

import { useCallback, useEffect, useState } from "react";
import { Card, Skeleton, StatusDot } from "@efolusi/meridian";
import type { StatusReport } from "../api/status/route";
import type { Dictionary, Locale } from "~/lib/i18n";
import { fill } from "~/lib/site-facts";

type State =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; report: StatusReport; at: Date };

type Row = { key: string; name: string; state: "ok" | "degraded" | "down"; latencyMs: number | null; note?: string };

export function StatusBoard({ t, locale }: { t: Dictionary["status"]; locale: Locale }) {
  const [state, setState] = useState<State>({ kind: "loading" });

  const check = useCallback(async () => {
    setState({ kind: "loading" });
    try {
      const res = await fetch("/api/status", { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      const report = (await res.json()) as StatusReport;
      setState(report.reachable ? { kind: "ready", report, at: new Date() } : { kind: "error" });
    } catch {
      setState({ kind: "error" });
    }
  }, []);

  useEffect(() => {
    void check();
  }, [check]);

  const retry = (
    <button type="button" className="ef-btn ef-btn--secondary ef-btn--md" onClick={() => void check()}>
      {t.retry}
    </button>
  );

  if (state.kind === "loading") {
    return (
      <div aria-busy="true">
        <Card className="status-overall">
          <StatusDot status="neutral" />
          <span role="status">{t.checking}</span>
        </Card>
        <Skeleton style={{ height: "var(--space-32)", marginTop: "var(--space-6)" }} />
      </div>
    );
  }

  if (state.kind === "error") {
    return (
      <div role="alert">
        <Card className="status-overall">
          <StatusDot status="danger" />
          <span>{t.errorTitle}</span>
        </Card>
        <p className="muted">{t.errorBody}</p>
        {retry}
      </div>
    );
  }

  const { report, at } = state;
  const names: Record<string, string> = t.names;
  const deps: Row[] = Object.entries(report.checks).map(([key, value]) => ({
    key,
    name: names[key] ?? key,
    state: value === "ok" ? "ok" : "down",
    latencyMs: null,
    note: value === "ok" ? undefined : value,
  }));
  const rows: Row[] = [
    { key: "api", name: t.names.api, state: report.ok ? "ok" : "degraded", latencyMs: report.latencyMs },
    ...deps,
  ];
  const overall = rows.some((r) => r.state === "down") ? "down" : rows.some((r) => r.state === "degraded") ? "degraded" : "ok";
  const label = { ok: t.stateOk, degraded: t.stateDegraded, down: t.stateDown };
  const dot = { ok: "success", degraded: "warning", down: "danger" } as const;
  const time = at.toLocaleTimeString(locale === "id" ? "id-ID" : "en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <div>
      <Card className="status-overall">
        <StatusDot status={dot[overall]} />
        <span role="status">
          {overall === "ok" ? t.overallOk : overall === "degraded" ? t.overallDegraded : t.overallDown}
        </span>
      </Card>
      {deps.length === 0 ? (
        <div className="empty" style={{ marginTop: "var(--space-6)" }}>
          <h2 className="display-3">{t.emptyTitle}</h2>
          <p>{t.emptyBody}</p>
        </div>
      ) : null}
      <table className="status-table">
        <thead>
          <tr>
            <th scope="col">{t.service}</th>
            <th scope="col">{t.state}</th>
            <th scope="col">{t.latency}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key}>
              <td>
                {r.name}
                {r.note ? <div className="muted">{r.note}</div> : null}
              </td>
              <td>
                <StatusDot status={dot[r.state]} label={label[r.state]} />
              </td>
              <td>{r.latencyMs != null ? `${r.latencyMs} ms` : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="actions" style={{ alignItems: "center" }}>
        {retry}
        <span className="muted">{fill(t.checkedAt, { time })}</span>
      </div>
    </div>
  );
}
