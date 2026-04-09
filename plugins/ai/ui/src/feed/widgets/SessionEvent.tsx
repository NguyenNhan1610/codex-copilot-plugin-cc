import type { SessionEvent } from "../../hooks/useEventStream";

const LABELS: Record<string, string> = {
  session_start: "Session started",
  session_end: "Session ended",
  stop_requested: "Claude stopped",
  stop_blocked: "Stop blocked",
};

export function SessionEventWidget({ event }: { event: SessionEvent }) {
  const label = LABELS[event.type] || event.type;
  const ts = event.ts ? new Date(event.ts).toLocaleTimeString() : "";
  const isBlocked = event.type === "stop_blocked";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "4px 0",
        color: isBlocked ? "var(--accent-orange)" : "var(--text-muted)",
        fontSize: 11,
      }}
    >
      <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
      <span>
        {label} {ts}
        {event.message && ` — ${event.message}`}
      </span>
      <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
    </div>
  );
}
