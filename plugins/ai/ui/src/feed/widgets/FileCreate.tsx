import { useState } from "react";
import type { SessionEvent } from "../../hooks/useEventStream";

export function FileCreate({ event }: { event: SessionEvent }) {
  const [expanded, setExpanded] = useState(false);
  const filePath = (event.input?.file_path as string) || "";
  const content = (event.input?.content as string) || "";
  const ts = event.ts ? new Date(event.ts).toLocaleTimeString() : "";
  const shortPath = filePath.split("/").slice(-3).join("/");
  const lines = content.split("\n");
  const preview = expanded ? content : lines.slice(0, 20).join("\n");

  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "6px 10px",
          background: "var(--bg-panel)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontFamily: "var(--font-mono)",
          fontSize: 12,
        }}
      >
        <span style={{ color: "var(--accent-green)", fontWeight: 600 }}>+</span>
        <span style={{ flex: 1 }} title={filePath}>{shortPath}</span>
        <span
          style={{
            fontSize: 10,
            padding: "1px 6px",
            borderRadius: 10,
            background: "var(--accent-green)",
            color: "#fff",
          }}
        >
          NEW
        </span>
        <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{ts}</span>
      </div>
      {content && (
        <div style={{ padding: "4px 0" }}>
          <pre
            style={{
              margin: 0,
              padding: "4px 10px",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              color: "var(--text-secondary)",
              maxHeight: expanded ? "none" : 300,
              overflow: "hidden",
            }}
          >
            {preview}
          </pre>
          {lines.length > 20 && (
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                background: "none",
                border: "none",
                color: "var(--accent-blue)",
                cursor: "pointer",
                fontSize: 11,
                padding: "4px 10px",
              }}
            >
              {expanded ? "Collapse" : `Show all ${lines.length} lines`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
