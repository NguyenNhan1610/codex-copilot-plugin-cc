import { Sun, Moon } from "lucide-react";
import { FileTree } from "../editor/FileTree";

interface SidebarProps {
  connected: boolean;
  activeFile: string | null;
  onFileSelect: (path: string) => void;
  theme: "dark" | "light";
  onThemeToggle: () => void;
}

export function Sidebar({ connected, activeFile, onFileSelect, theme, onThemeToggle }: SidebarProps) {
  const ThemeIcon = theme === "dark" ? Sun : Moon;

  return (
    <div
      style={{
        width: 200,
        background: "var(--bg-sidebar)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "10px 12px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ fontWeight: 700, fontSize: "var(--text-base)", flex: 1 }}>AI Companion</span>
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: connected ? "var(--status-connected)" : "var(--status-disconnected)",
            flexShrink: 0,
          }}
          title={connected ? "Connected" : "Disconnected"}
        />
        <button
          onClick={onThemeToggle}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 2,
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
          }}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          <ThemeIcon size={14} />
        </button>
      </div>

      {/* Section label */}
      <div
        style={{
          padding: "8px 12px 4px",
          fontSize: "var(--text-xs)",
          fontWeight: 600,
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        Project Files
      </div>

      {/* File tree */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <FileTree onFileSelect={onFileSelect} activeFile={activeFile} />
      </div>
    </div>
  );
}
