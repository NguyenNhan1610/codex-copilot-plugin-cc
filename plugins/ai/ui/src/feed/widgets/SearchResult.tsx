import { useState } from "react";
import { Search, FolderSearch } from "lucide-react";
import type { SessionEvent } from "../../hooks/useEventStream";

export function SearchResult({ event }: { event: SessionEvent }) {
  const [expanded, setExpanded] = useState(false);
  const pattern = (event.input?.pattern as string) || (event.input?.glob as string) || "";
  const output = (event.output?.output as string) || "";
  const ts = event.ts ? new Date(event.ts).toLocaleTimeString() : "";
  const isGrep = event.tool === "Grep";
  const lines = output.split("\n").filter(Boolean);
  const Icon = isGrep ? Search : FolderSearch;

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", fontSize: 12 }}>
      <div
        style={{
          padding: "6px 10px",
          background: "var(--bg-panel)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Icon size={13} style={{ color: "var(--accent-purple)", flexShrink: 0 }} />
        <code style={{ flex: 1, color: "var(--accent-purple)" }}>{pattern}</code>
        <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{lines.length} results</span>
        <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{ts}</span>
      </div>
      {lines.length > 0 && (
        <div style={{ padding: "4px 10px", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)" }}>
          {(expanded ? lines : lines.slice(0, 10)).map((line, i) => (
            <div key={i} style={{ color: "var(--text-secondary)", padding: "1px 0" }}>{line}</div>
          ))}
          {lines.length > 10 && (
            <button
              onClick={() => setExpanded(!expanded)}
              style={{ background: "none", border: "none", color: "var(--accent-blue)", cursor: "pointer", fontSize: "var(--text-sm)", padding: "4px 0" }}
            >
              {expanded ? "Show less" : `Show all ${lines.length} results`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
