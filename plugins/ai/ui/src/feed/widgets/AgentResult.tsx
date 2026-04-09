import { useState } from "react";
import { CheckCircle } from "lucide-react";
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
        background: "var(--bg-panel)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <CheckCircle size={14} style={{ color: "var(--accent-green)" }} />
        <span style={{ fontWeight: 600, fontSize: "var(--text-sm)", color: "var(--accent-green)" }}>Agent completed</span>
        <span style={{ marginLeft: "auto", fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{ts}</span>
      </div>
      {output && (
        <div style={{ fontSize: 12, color: "var(--text-secondary)", whiteSpace: "pre-wrap", maxHeight: expanded ? "none" : 150, overflow: "hidden" }}>
          {output}
        </div>
      )}
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{ background: "none", border: "none", color: "var(--accent-blue)", cursor: "pointer", fontSize: "var(--text-sm)", padding: "4px 0" }}
        >
          {expanded ? "Collapse" : "Show full output"}
        </button>
      )}
    </div>
  );
}
