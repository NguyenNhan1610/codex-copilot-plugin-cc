import { useState } from "react";
import { User } from "lucide-react";
import type { SessionEvent } from "../../hooks/useEventStream";

const SIGNAL_COLORS: Record<string, string> = {
  "[NEW]": "var(--accent-blue)",
  "[REVISION]": "var(--accent-orange)",
  "[ACCEPTED]": "var(--accent-green)",
  "[CONTINUE]": "var(--accent-gray)",
  "[QUESTION]": "var(--accent-purple)",
  "[INCOMPLETE]": "var(--accent-red)",
};

export function UserPrompt({ event }: { event: SessionEvent }) {
  const [expanded, setExpanded] = useState(false);
  const message = event.message || "(empty prompt)";
  const signal = event.signal as string | undefined;
  const isLong = message.length > 200;
  const displayText = isLong && !expanded ? message.slice(0, 200) + "..." : message;
  const ts = event.ts ? new Date(event.ts).toLocaleTimeString() : "";

  return (
    <div
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "10px 14px",
        maxWidth: "85%",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <User size={14} style={{ color: "var(--text-secondary)" }} />
        <span style={{ fontWeight: 600, fontSize: "var(--text-sm)" }}>You</span>
        {signal && (
          <span
            style={{
              fontSize: "var(--text-xs)",
              fontWeight: 600,
              padding: "1px 6px",
              borderRadius: 10,
              background: SIGNAL_COLORS[signal] || "var(--accent-gray)",
              color: "#fff",
            }}
          >
            {signal.replace(/[\[\]]/g, "")}
          </span>
        )}
        <span style={{ marginLeft: "auto", fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>{ts}</span>
      </div>
      <div
        style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: "var(--text-base)", lineHeight: "var(--leading-relaxed)", cursor: isLong ? "pointer" : "default" }}
        onClick={() => isLong && setExpanded(!expanded)}
      >
        {displayText}
      </div>
    </div>
  );
}
