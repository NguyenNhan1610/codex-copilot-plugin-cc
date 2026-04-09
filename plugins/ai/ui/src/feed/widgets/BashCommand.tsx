import { useState } from "react";
import type { SessionEvent } from "../../hooks/useEventStream";

export function BashCommand({ event }: { event: SessionEvent }) {
  const [expanded, setExpanded] = useState(false);
  const command = (event.input?.command as string) || "";
  const output = (event.output?.stdout as string) || (event.output?.output as string) || "";
  const stderr = (event.output?.stderr as string) || "";
  const exitCode = event.output?.exit_code as number | undefined;
  const ts = event.ts ? new Date(event.ts).toLocaleTimeString() : "";
  const isPending = event.type === "tool_call";

  const displayCmd = command.length > 120 ? command.slice(0, 120) + "..." : command;
  const lines = output.split("\n");
  const isLong = lines.length > 20;
  const displayOutput = isLong && !expanded ? lines.slice(0, 20).join("\n") + "\n..." : output;

  return (
    <div
      style={{
        background: "#0d1117",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        overflow: "hidden",
        fontFamily: "var(--font-mono)",
        fontSize: 12,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "6px 10px",
          background: "var(--bg-tertiary)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ color: "var(--accent-green)" }}>$</span>
        <span style={{ color: "var(--text-primary)", flex: 1 }}>{displayCmd}</span>
        {exitCode !== undefined && (
          <span
            style={{
              fontSize: 10,
              padding: "1px 6px",
              borderRadius: 10,
              background: exitCode === 0 ? "var(--accent-green)" : "var(--accent-red)",
              color: "#fff",
            }}
          >
            {exitCode}
          </span>
        )}
        {isPending && (
          <span style={{ color: "var(--accent-blue)", fontSize: 10 }}>running...</span>
        )}
        <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{ts}</span>
      </div>

      {/* Output */}
      {(output || stderr) && (
        <div style={{ padding: "8px 10px" }}>
          {output && (
            <pre
              style={{
                margin: 0,
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
                color: "var(--text-secondary)",
              }}
            >
              {displayOutput}
            </pre>
          )}
          {stderr && (
            <pre
              style={{
                margin: output ? "8px 0 0" : 0,
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
                color: "var(--accent-red)",
              }}
            >
              {stderr}
            </pre>
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
              {expanded ? "Show less" : `Show all ${lines.length} lines`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
