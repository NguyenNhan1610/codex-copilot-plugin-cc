import type { SessionEvent } from "../../hooks/useEventStream";

export function AgentStart({ event }: { event: SessionEvent }) {
  const description = (event.input?.description as string) || "Agent";
  const prompt = (event.input?.prompt as string) || "";
  const truncatedPrompt = prompt.length > 150 ? prompt.slice(0, 150) + "..." : prompt;
  const ts = event.ts ? new Date(event.ts).toLocaleTimeString() : "";

  return (
    <div
      style={{
        border: "1px solid var(--accent-blue)",
        borderLeft: "3px solid var(--accent-blue)",
        borderRadius: "var(--radius)",
        padding: "8px 12px",
        background: "var(--bg-secondary)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span className="spinner" style={{ fontSize: 14 }}>&#x2699;&#xFE0F;</span>
        <span style={{ fontWeight: 600, fontSize: 12, color: "var(--accent-blue)" }}>
          {description}
        </span>
        <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--text-muted)" }}>{ts}</span>
      </div>
      {truncatedPrompt && (
        <div style={{ fontSize: 11, color: "var(--text-secondary)", fontStyle: "italic" }}>
          {truncatedPrompt}
        </div>
      )}
    </div>
  );
}
