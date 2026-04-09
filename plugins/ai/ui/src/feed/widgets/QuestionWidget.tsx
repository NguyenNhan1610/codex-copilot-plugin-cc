import type { SessionEvent } from "../../hooks/useEventStream";

export function QuestionWidget({ event }: { event: SessionEvent }) {
  const question = (event.input?.question as string) || event.message || "";
  const options = (event.input?.options as string[]) || [];
  const ts = event.ts ? new Date(event.ts).toLocaleTimeString() : "";

  return (
    <div
      style={{
        border: "1px solid var(--accent-purple)",
        borderRadius: "var(--radius)",
        padding: "8px 12px",
        background: "var(--bg-secondary)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 14 }}>&#x2753;</span>
        <span style={{ fontWeight: 600, fontSize: 12, color: "var(--accent-purple)" }}>
          Question
        </span>
        <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--text-muted)" }}>{ts}</span>
      </div>
      <div style={{ fontSize: 12, marginBottom: options.length > 0 ? 8 : 0 }}>{question}</div>
      {options.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {options.map((opt, i) => (
            <span
              key={i}
              style={{
                padding: "2px 8px",
                borderRadius: 10,
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border)",
                fontSize: 11,
                color: "var(--text-secondary)",
              }}
            >
              {opt}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
