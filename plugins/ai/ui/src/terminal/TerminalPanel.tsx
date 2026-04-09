import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import "@xterm/xterm/css/xterm.css";

interface TerminalPanelProps {
  onClose: () => void;
  onStatusChange?: (status: "connecting" | "connected" | "disconnected") => void;
}

export function TerminalPanel({ onClose: _onClose, onStatusChange }: TerminalPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);
  const fitRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const term = new Terminal({
      fontSize: 12,
      fontFamily: "var(--font-mono)",
      theme: {
        background: "#020617",
        foreground: "#F8FAFC",
        cursor: "#3B82F6",
        selectionBackground: "#1E293B",
        black: "#020617",
        red: "#EF4444",
        green: "#22C55E",
        yellow: "#F97316",
        blue: "#3B82F6",
        magenta: "#A78BFA",
        cyan: "#22D3EE",
        white: "#F8FAFC",
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

    // WebSocket
    const wsUrl = `ws://${window.location.host}/ws/terminal`;
    const ws = new WebSocket(wsUrl);
    onStatusChange?.("connecting");

    ws.onopen = () => {
      onStatusChange?.("connected");
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

    ws.onclose = () => onStatusChange?.("disconnected");
    ws.onerror = () => ws.close();

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
  }, [onStatusChange]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        padding: "4px 0",
        background: "#020617",
      }}
    />
  );
}
