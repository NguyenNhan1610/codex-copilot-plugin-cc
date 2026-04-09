import { useState } from "react";
import { Files } from "lucide-react";
import type { SessionEvent } from "../../hooks/useEventStream";

export function ReadGroup({ events, label }: { events: SessionEvent[]; label: string }) {
  const [expanded, setExpanded] = useState(false);

  const paths = events.map((e) => {
    const fp = (e.input?.file_path as string) || "";
    return fp.split("/").slice(-2).join("/");
  });

  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        overflow: "hidden",
        fontSize: "var(--text-sm)",
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          padding: "5px 10px",
          background: "var(--bg-panel)",
          border: "none",
          borderBottom: expanded ? "1px solid var(--border)" : "none",
          display: "flex",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
          color: "var(--text-secondary)",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-sm)",
          textAlign: "left",
        }}
      >
        <span style={{ fontSize: "var(--text-xs)" }}>{expanded ? "\u25BC" : "\u25B6"}</span>
        <Files size={12} style={{ color: "var(--text-muted)" }} />
        <span>{label}</span>
      </button>
      {expanded && (
        <div style={{ padding: "4px 10px", fontFamily: "var(--font-mono)" }}>
          {paths.map((p, i) => (
            <div key={i} style={{ padding: "1px 0", color: "var(--text-secondary)" }}>
              {p}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
