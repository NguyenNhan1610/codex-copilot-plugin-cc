import { Bot } from "lucide-react";
import type { SessionEvent } from "../../hooks/useEventStream";

export function AgentStart({ event }: { event: SessionEvent }) {
  const description = (event.input?.description as string) || "Agent";
  const prompt = (event.input?.prompt as string) || "";
  const truncatedPrompt = prompt.length > 150 ? prompt.slice(0, 150) + "..." : prompt;
  const ts = event.ts ? new Date(event.ts).toLocaleTimeString() : "";

  return (
    <div
      style={{
        border: "1px solid var(--accent-cyan)",
        borderLeft: "3px solid var(--accent-cyan)",
        borderRadius: "var(--radius)",
        padding: "8px 12px",
        background: "var(--bg-panel)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <Bot size={14} className="spinner" style={{ color: "var(--accent-cyan)" }} />
        <span style={{ fontWeight: 600, fontSize: "var(--text-sm)", color: "var(--accent-cyan)" }}>{description}</span>
        <span style={{ marginLeft: "auto", fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{ts}</span>
      </div>
      {truncatedPrompt && (
        <div style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", fontStyle: "italic" }}>{truncatedPrompt}</div>
      )}
    </div>
  );
}
