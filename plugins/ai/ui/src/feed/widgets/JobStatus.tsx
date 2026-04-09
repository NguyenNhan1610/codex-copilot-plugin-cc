import type { SessionEvent } from "../../hooks/useEventStream";

const STATUS_COLORS: Record<string, string> = {
  running: "var(--accent-blue)",
  completed: "var(--accent-green)",
  failed: "var(--accent-red)",
  cancelled: "var(--accent-gray)",
  queued: "var(--accent-orange)",
};

export function JobStatus({ event }: { event: SessionEvent }) {
  const meta = event.meta || {};
  const jobId = (meta.jobId as string) || "unknown";
  const kind = (meta.kind as string) || "";
  const status = (meta.status as string) || "unknown";
  const phase = (meta.phase as string) || "";
  const summary = (meta.summary as string) || event.message || "";
  const elapsed = meta.elapsed as number | undefined;
  const color = STATUS_COLORS[status] || "var(--text-muted)";
  const ts = event.ts ? new Date(event.ts).toLocaleTimeString() : "";

  const formatElapsed = (ms: number) => {
    const s = Math.floor(ms / 1000);
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    return `${m}m ${s % 60}s`;
  };

  return (
    <div
      style={{
        border: `1px solid ${color}`,
        borderRadius: "var(--radius)",
        padding: "8px 12px",
        background: "var(--bg-secondary)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 13 }}>&#x26A1;</span>
        <span style={{ fontWeight: 600, fontSize: 12 }}>
          {kind || "Job"} <code style={{ fontSize: 10, color: "var(--text-muted)" }}>{jobId.slice(0, 20)}</code>
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            padding: "1px 6px",
            borderRadius: 10,
            background: color,
            color: "#fff",
          }}
        >
          {status}
        </span>
        {phase && <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{phase}</span>}
        {elapsed !== undefined && (
          <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{formatElapsed(elapsed)}</span>
        )}
        <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--text-muted)" }}>{ts}</span>
      </div>

      {/* Progress bar for running */}
      {status === "running" && (
        <div
          style={{
            height: 3,
            background: "var(--border)",
            borderRadius: 2,
            overflow: "hidden",
            marginBottom: 6,
          }}
        >
          <div
            style={{
              height: "100%",
              background: color,
              width: "60%",
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
        </div>
      )}

      {summary && (
        <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{summary}</div>
      )}
    </div>
  );
}
