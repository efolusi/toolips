// Same-origin proxy for the status page: asks the Toolips API for its deep
// health and passes the answer on, with the time it took. Server-side, so the
// page does not depend on the API's CORS rules and the browser only ever talks
// to this site.

import { API_URL } from "~/lib/api";

export const dynamic = "force-dynamic";

const TIMEOUT_MS = 5_000;

export type StatusReport = {
  /** The API answered at all. */
  reachable: boolean;
  /** HTTP status and body both said ok. */
  ok: boolean;
  latencyMs: number;
  /** Dependency name to "ok" or an error string, as the API reports it. */
  checks: Record<string, string>;
};

export async function GET() {
  const started = Date.now();
  let report: StatusReport;
  try {
    const res = await fetch(`${API_URL}/api/health?deep=1`, {
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const body = (await res.json().catch(() => ({}))) as { ok?: boolean; checks?: Record<string, unknown> };
    const checks = Object.fromEntries(Object.entries(body.checks ?? {}).map(([k, v]) => [k, String(v)]));
    report = { reachable: true, ok: res.ok && body.ok === true, latencyMs: Date.now() - started, checks };
  } catch {
    report = { reachable: false, ok: false, latencyMs: Date.now() - started, checks: {} };
  }
  return Response.json(report, { headers: { "cache-control": "no-store" } });
}
