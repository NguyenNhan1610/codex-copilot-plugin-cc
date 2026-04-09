import type { SessionEvent } from "../../hooks/useEventStream";

export function GenericEvent({ event }: { event: SessionEvent }) {
  const ts = event.ts ? new Date(event.ts).toLocaleTimeString() : "";

  return (
    <div
      style={{
        padding: "4px 10px",
        fontSize: 11,
        color: "var(--text-muted)",
        fontFamily: "var(--font-mono)",
        display: "flex",
        gap: 8,
      }}
    >
      <span>{ts}</span>
      <span style={{ color: "var(--text-secondary)" }}>{event.type}</span>
      {event.tool && <span>{event.tool}</span>}
      {event.message && (
        <span style={{ color: "var(--text-secondary)" }}>
          {event.message.length > 80 ? event.message.slice(0, 80) + "..." : event.message}
        </span>
      )}
    </div>
  );
}
