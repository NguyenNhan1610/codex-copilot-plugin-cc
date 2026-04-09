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
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        fontSize: 11,
        fontFamily: "var(--font-mono)",
        color: "var(--text-secondary)",
        maxWidth: "100%",
      }}
    >
      <span style={{ color: "var(--text-muted)" }}>&#x1F4C4;</span>
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={filePath}>
        {shortPath}
      </span>
      <span style={{ color: "var(--text-muted)", fontSize: 10 }}>{ts}</span>
    </div>
  );
}
