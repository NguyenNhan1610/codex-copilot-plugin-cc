import { useState, useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({ startOnLoad: false, theme: "dark", securityLevel: "strict" });

interface MermaidBlockProps {
  code: string;
  onChange?: (code: string) => void;
  readOnly?: boolean;
}

export function MermaidBlock({ code, onChange, readOnly }: MermaidBlockProps) {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [editing, setEditing] = useState(false);
  const [localCode, setLocalCode] = useState(code);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderIdRef = useRef(0);

  useEffect(() => {
    setLocalCode(code);
  }, [code]);

  useEffect(() => {
    const id = ++renderIdRef.current;
    const timerId = setTimeout(async () => {
      if (id !== renderIdRef.current) return;
      try {
        const result = await mermaid.render(`mermaid-${id}-${Date.now()}`, localCode);
        if (id === renderIdRef.current) {
          setSvg(result.svg);
          setError("");
        }
      } catch (err) {
        if (id === renderIdRef.current) {
          setError(err instanceof Error ? err.message : "Invalid Mermaid syntax");
          setSvg("");
        }
      }
    }, 500);
    return () => clearTimeout(timerId);
  }, [localCode]);

  const handleCodeChange = (value: string) => {
    setLocalCode(value);
    onChange?.(value);
  };

  const copySvg = () => {
    if (svg) navigator.clipboard.writeText(svg);
  };

  return (
    <div
      style={{
        border: `1px solid ${error ? "var(--accent-red)" : "var(--border)"}`,
        borderRadius: "var(--radius)",
        overflow: "hidden",
        marginBottom: 8,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "4px 10px",
          background: "var(--bg-secondary)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 11,
        }}
      >
        <span style={{ color: "var(--accent-purple)" }}>Mermaid</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          {!readOnly && (
            <button
              onClick={() => setEditing(!editing)}
              style={{
                padding: "2px 6px",
                background: "var(--bg-tertiary)",
                border: "none",
                borderRadius: "var(--radius)",
                color: "var(--text-secondary)",
                cursor: "pointer",
                fontSize: 10,
              }}
            >
              {editing ? "Preview" : "Edit"}
            </button>
          )}
          {svg && (
            <button
              onClick={copySvg}
              style={{
                padding: "2px 6px",
                background: "var(--bg-tertiary)",
                border: "none",
                borderRadius: "var(--radius)",
                color: "var(--text-secondary)",
                cursor: "pointer",
                fontSize: 10,
              }}
            >
              Copy SVG
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ display: "flex", minHeight: 120 }}>
        {/* Code editor */}
        {editing && (
          <div style={{ flex: 1, borderRight: "1px solid var(--border)" }}>
            <textarea
              value={localCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              style={{
                width: "100%",
                height: "100%",
                minHeight: 120,
                padding: 8,
                background: "#0d1117",
                color: "var(--text-primary)",
                border: "none",
                resize: "vertical",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                outline: "none",
              }}
            />
          </div>
        )}

        {/* Preview */}
        <div
          ref={containerRef}
          style={{
            flex: 1,
            padding: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--bg-primary)",
            overflow: "auto",
          }}
        >
          {error ? (
            <div style={{ color: "var(--accent-red)", fontSize: 11, fontFamily: "var(--font-mono)" }}>
              {error}
            </div>
          ) : svg ? (
            <div dangerouslySetInnerHTML={{ __html: svg }} />
          ) : (
            <div style={{ color: "var(--text-muted)", fontSize: 11 }}>Rendering...</div>
          )}
        </div>
      </div>
    </div>
  );
}
