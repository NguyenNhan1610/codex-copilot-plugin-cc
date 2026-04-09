import { useState, useEffect, useRef } from "react";

const SIGNAL_COLORS: Record<string, string> = {
  "[NEW]": "var(--accent-blue)",
  "[REVISION]": "var(--accent-orange)",
  "[ACCEPTED]": "var(--accent-green)",
  "[CONTINUE]": "var(--accent-gray)",
  "[QUESTION]": "var(--accent-purple)",
  "[INCOMPLETE]": "var(--accent-red)",
};

interface CascadeFeedProps {
  branch?: string;
}

export function CascadeFeed({ branch = "main" }: CascadeFeedProps) {
  const [content, setContent] = useState<string>("");
  const [autoScroll, setAutoScroll] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Poll for cascade updates
  useEffect(() => {
    const safeBranch = branch.replace(/[^a-zA-Z0-9._-]/g, "-");

    async function fetchCascade() {
      try {
        const res = await fetch(`/api/files/../cascades/${safeBranch}.md`);
        // Falls outside project dir scope — use a dedicated endpoint instead
        // For now, just show placeholder
      } catch { /* ignore */ }
    }

    fetchCascade();
    const interval = setInterval(fetchCascade, 2000);
    return () => clearInterval(interval);
  }, [branch]);

  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [content, autoScroll]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    setAutoScroll(el.scrollHeight - el.scrollTop - el.clientHeight < 50);
  };

  // Parse and render cascade content with highlighting
  const renderLine = (line: string, i: number) => {
    // Section headers with signal tags
    const headerMatch = line.match(/^## \[(\d{2}:\d{2}:\d{2})\] (\[(?:NEW|REVISION|ACCEPTED|CONTINUE|QUESTION|INCOMPLETE)\]) (.+)/);
    if (headerMatch) {
      const [, time, signal, text] = headerMatch;
      return (
        <div
          key={i}
          style={{
            padding: "8px 0 4px",
            borderTop: i > 0 ? "1px solid var(--border)" : "none",
            marginTop: i > 0 ? 8 : 0,
          }}
        >
          <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: 11 }}>[{time}]</span>
          {" "}
          <span
            style={{
              fontSize: 10,
              padding: "1px 6px",
              borderRadius: 10,
              background: SIGNAL_COLORS[signal] || "var(--accent-gray)",
              color: "#fff",
            }}
          >
            {signal.replace(/[\[\]]/g, "")}
          </span>
          {" "}
          <span style={{ fontWeight: 600 }}>{text}</span>
        </div>
      );
    }

    // File entries
    const entryMatch = line.match(/^- \[(\d{2}:\d{2}:\d{2})\] (CREATE|EDIT|REMOVE|MOVE|RUN) `(.+?)`(.*)/);
    if (entryMatch) {
      const [, time, action, file, rest] = entryMatch;
      const actionColors: Record<string, string> = {
        CREATE: "var(--accent-green)",
        EDIT: "var(--accent-blue)",
        REMOVE: "var(--accent-red)",
        MOVE: "var(--accent-orange)",
        RUN: "var(--accent-purple)",
      };
      return (
        <div key={i} style={{ padding: "1px 0", paddingLeft: 16, fontFamily: "var(--font-mono)", fontSize: 11 }}>
          <span style={{ color: "var(--text-muted)" }}>[{time}]</span>
          {" "}
          <span style={{ color: actionColors[action] || "var(--text-secondary)" }}>{action}</span>
          {" "}
          <span style={{ color: "var(--text-primary)" }}>`{file}`</span>
          {rest && <span style={{ color: "var(--text-muted)" }}>{rest}</span>}
        </div>
      );
    }

    // Blockquote (user prompt text)
    if (line.startsWith("> ")) {
      return (
        <div
          key={i}
          style={{
            padding: "2px 12px",
            borderLeft: "3px solid var(--border)",
            color: "var(--text-secondary)",
            fontStyle: "italic",
            fontSize: 12,
          }}
        >
          {line.substring(2)}
        </div>
      );
    }

    // Title
    if (line.startsWith("# ")) {
      return (
        <div key={i} style={{ fontWeight: 700, fontSize: 14, padding: "4px 0" }}>
          {line.substring(2)}
        </div>
      );
    }

    // Default
    if (line.trim()) {
      return (
        <div key={i} style={{ color: "var(--text-secondary)", fontSize: 12 }}>
          {line}
        </div>
      );
    }

    return <div key={i} style={{ height: 4 }} />;
  };

  const lines = content.split("\n");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          padding: "6px 12px",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-panel)",
          fontSize: 12,
          color: "var(--text-secondary)",
          flexShrink: 0,
        }}
      >
        Cascade Log: {branch}
      </div>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "8px 16px",
        }}
      >
        {content ? (
          lines.map((line, i) => renderLine(line, i))
        ) : (
          <div style={{ color: "var(--text-muted)", fontStyle: "italic", padding: 12 }}>
            No cascade data available. Changes will appear here as Claude Code works.
          </div>
        )}
      </div>
    </div>
  );
}
