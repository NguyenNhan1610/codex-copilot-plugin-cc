import { useState } from "react";
import type { SessionEvent } from "../../hooks/useEventStream";

export function AgentResult({ event }: { event: SessionEvent }) {
  const [expanded, setExpanded] = useState(false);
  const output = event.message || (event.output?.result as string) || "";
  const ts = event.ts ? new Date(event.ts).toLocaleTimeString() : "";
  const isLong = output.length > 300;

  return (
    <div
      style={{
        border: "1px solid var(--accent-green)",
        borderLeft: "3px solid var(--accent-green)",
        borderRadius: "var(--radius)",
        padding: "8px 12px",
        background: "var(--bg-secondary)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 14 }}>&#x2705;</span>
        <span style={{ fontWeight: 600, fontSize: 12, color: "var(--accent-green)" }}>
          Agent completed
        </span>
        <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--text-muted)" }}>{ts}</span>
      </div>
      {output && (
        <div
          style={{
            fontSize: 12,
            color: "var(--text-secondary)",
            whiteSpace: "pre-wrap",
            maxHeight: expanded ? "none" : 150,
            overflow: "hidden",
          }}
        >
          {output}
        </div>
      )}
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: "none",
            border: "none",
            color: "var(--accent-blue)",
            cursor: "pointer",
            fontSize: 11,
            padding: "4px 0",
          }}
        >
          {expanded ? "Collapse" : "Show full output"}
        </button>
      )}
    </div>
  );
}
