import { useState } from "react";
import type { SessionEvent } from "../../hooks/useEventStream";

export function CodeDiff({ event }: { event: SessionEvent }) {
  const [expanded, setExpanded] = useState(false);
  const filePath = (event.input?.file_path as string) || "";
  const oldStr = (event.input?.old_string as string) || "";
  const newStr = (event.input?.new_string as string) || "";
  const ts = event.ts ? new Date(event.ts).toLocaleTimeString() : "";
  const isPending = event.type === "tool_call";
  const shortPath = filePath.split("/").slice(-3).join("/");

  const oldLines = oldStr.split("\n");
  const newLines = newStr.split("\n");
  const totalLines = oldLines.length + newLines.length;
  const isLong = totalLines > 30;

  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        overflow: "hidden",
        fontSize: 12,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "6px 10px",
          background: "var(--bg-panel)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontFamily: "var(--font-mono)",
        }}
      >
        <span style={{ color: "var(--accent-blue)" }}>
          {isPending ? "..." : event.tool === "MultiEdit" ? "M" : "E"}
        </span>
        <span style={{ color: "var(--text-primary)", flex: 1 }} title={filePath}>
          {shortPath}
        </span>
        {oldLines.length > 0 && (
          <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
            {oldLines.length}L
          </span>
        )}
        <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{ts}</span>
      </div>

      {/* Diff */}
      {!isPending && (oldStr || newStr) && (
        <div
          style={{
            padding: "4px 0",
            fontFamily: "var(--font-mono)",
            maxHeight: expanded ? "none" : 300,
            overflow: expanded ? "visible" : "hidden",
          }}
        >
          {oldStr &&
            (isLong && !expanded ? oldLines.slice(0, 10) : oldLines).map((line, i) => (
              <div
                key={`old-${i}`}
                style={{
                  padding: "0 10px",
                  background: "rgba(248,81,73,0.1)",
                  color: "var(--accent-red)",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                }}
              >
                - {line}
              </div>
            ))}
          {newStr &&
            (isLong && !expanded ? newLines.slice(0, 10) : newLines).map((line, i) => (
              <div
                key={`new-${i}`}
                style={{
                  padding: "0 10px",
                  background: "rgba(63,185,80,0.1)",
                  color: "var(--accent-green)",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                }}
              >
                + {line}
              </div>
            ))}
          {isLong && (
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
              {expanded ? "Collapse" : `Show all ${totalLines} lines`}
            </button>
          )}
        </div>
      )}

      {isPending && (
        <div style={{ padding: "8px 10px", color: "var(--text-muted)", fontStyle: "italic" }}>
          Editing...
        </div>
      )}
    </div>
  );
}
