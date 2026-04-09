import { File } from "lucide-react";
import type { SessionEvent } from "../../hooks/useEventStream";

export function FileRead({ event }: { event: SessionEvent }) {
  const filePath = (event.input?.file_path as string) || "";
  const shortPath = filePath.split("/").slice(-3).join("/");
  const ts = event.ts ? new Date(event.ts).toLocaleTimeString() : "";

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 10px",
        background: "var(--bg-panel)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        fontSize: "var(--text-sm)",
        fontFamily: "var(--font-mono)",
        color: "var(--text-secondary)",
        maxWidth: "100%",
      }}
    >
      <File size={12} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={filePath}>
        {shortPath}
      </span>
      <span style={{ color: "var(--text-muted)", fontSize: "var(--text-xs)" }}>{ts}</span>
    </div>
  );
}
