import { useState } from "react";
import type { SessionEvent } from "../../hooks/useEventStream";

export function SearchResult({ event }: { event: SessionEvent }) {
  const [expanded, setExpanded] = useState(false);
  const pattern = (event.input?.pattern as string) || (event.input?.glob as string) || "";
  const output = (event.output?.output as string) || "";
  const ts = event.ts ? new Date(event.ts).toLocaleTimeString() : "";
  const isGrep = event.tool === "Grep";
  const lines = output.split("\n").filter(Boolean);

  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        overflow: "hidden",
        fontSize: 12,
      }}
    >
      <div
        style={{
          padding: "6px 10px",
          background: "var(--bg-secondary)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span>{isGrep ? "&#x1F50D;" : "&#x1F4C2;"}</span>
        <code style={{ flex: 1, color: "var(--accent-purple)" }}>{pattern}</code>
        <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
          {lines.length} results
        </span>
        <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{ts}</span>
      </div>
      {lines.length > 0 && (
        <div style={{ padding: "4px 10px", fontFamily: "var(--font-mono)", fontSize: 11 }}>
          {(expanded ? lines : lines.slice(0, 10)).map((line, i) => (
            <div key={i} style={{ color: "var(--text-secondary)", padding: "1px 0" }}>
              {line}
            </div>
          ))}
          {lines.length > 10 && (
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
              {expanded ? "Show less" : `Show all ${lines.length} results`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
