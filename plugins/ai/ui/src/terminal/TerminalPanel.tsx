import { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import "@xterm/xterm/css/xterm.css";

interface TerminalPanelProps {
  onClose: () => void;
}

export function TerminalPanel({ onClose }: TerminalPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const fitRef = useRef<FitAddon | null>(null);
  const [status, setStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");

  useEffect(() => {
    if (!containerRef.current) return;

    const term = new Terminal({
      fontSize: 12,
      fontFamily: "var(--font-mono)",
      theme: {
        background: "#0d1117",
        foreground: "#e6edf3",
        cursor: "#58a6ff",
        selectionBackground: "#264f78",
        black: "#0d1117",
        red: "#f85149",
        green: "#3fb950",
        yellow: "#d29922",
        blue: "#58a6ff",
        magenta: "#bc8cff",
        cyan: "#39c5cf",
        white: "#e6edf3",
      },
      cursorBlink: true,
      scrollback: 5000,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(new WebLinksAddon());

    term.open(containerRef.current);
    fitAddon.fit();
    termRef.current = term;
    fitRef.current = fitAddon;

    // Connect WebSocket
    const wsUrl = `ws://${window.location.host}/ws/terminal`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("connected");
      // Send initial size
      ws.send(JSON.stringify({ type: "resize", cols: term.cols, rows: term.rows }));
    };

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === "output" && typeof msg.data === "string") {
          term.write(msg.data);
        }
      } catch { /* ignore */ }
    };

    ws.onclose = () => setStatus("disconnected");
    ws.onerror = () => ws.close();

    // Forward user input to server
    term.onData((data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "input", data }));
      }
    });

    // Resize observer
    const observer = new ResizeObserver(() => {
      fitAddon.fit();
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "resize", cols: term.cols, rows: term.rows }));
      }
    });
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      ws.close();
      term.dispose();
    };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#0d1117" }}>
      {/* Toolbar */}
      <div
        style={{
          padding: "3px 10px",
          background: "var(--bg-tertiary)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 11,
          flexShrink: 0,
        }}
      >
        <span style={{ color: "var(--text-secondary)" }}>Terminal</span>
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: status === "connected" ? "var(--accent-green)" : status === "connecting" ? "var(--accent-orange)" : "var(--accent-red)",
          }}
        />
        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          <button
            onClick={() => termRef.current?.clear()}
            style={{
              padding: "1px 6px",
              background: "var(--bg-secondary)",
              border: "none",
              borderRadius: "var(--radius)",
              color: "var(--text-muted)",
              cursor: "pointer",
              fontSize: 10,
            }}
          >
            Clear
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "1px 6px",
              background: "var(--bg-secondary)",
              border: "none",
              borderRadius: "var(--radius)",
              color: "var(--text-muted)",
              cursor: "pointer",
              fontSize: 10,
            }}
          >
            Close
          </button>
        </div>
      </div>

      {/* Terminal */}
      <div ref={containerRef} style={{ flex: 1, padding: "4px 0" }} />
    </div>
  );
}
