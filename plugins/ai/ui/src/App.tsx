import { useState, useMemo, useCallback } from "react";
import { useEventStream } from "./hooks/useEventStream";
import { ChatFeed } from "./feed/ChatFeed";
import { Sidebar, type FilterState } from "./layout/Sidebar";
import { FileTree } from "./editor/FileTree";
import { DocumentEditor } from "./editor/DocumentEditor";
import { TerminalPanel } from "./terminal/TerminalPanel";
import { initTheme, setTheme as applyTheme } from "./styles/theme";

const WS_URL = `ws://${window.location.host}/ws/events`;

const DEFAULT_FILTERS: FilterState = {
  prompts: true,
  tools: true,
  agents: true,
  jobs: true,
  system: true,
  reads: false,
};

export function App() {
  const { events, connected } = useEventStream(WS_URL);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [theme, setTheme] = useState<"dark" | "light">(() => initTheme());
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      applyTheme(next);
      return next;
    });
  }, []);

  const handleFileSelect = useCallback((path: string) => {
    setActiveFile(path);
    setShowEditor(true);
  }, []);

  const handleCloseEditor = useCallback(() => {
    setActiveFile(null);
    setShowEditor(false);
  }, []);

  // Keyboard shortcuts
  useState(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        setShowSidebar((v) => !v);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "e") {
        e.preventDefault();
        setShowEditor((v) => !v);
      }
      if (e.ctrlKey && e.key === "`") {
        e.preventDefault();
        setShowTerminal((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  // Apply filters
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (e.type === "user_prompt") return filters.prompts;
      if (e.type === "tool_call" || e.type === "tool_result") {
        if (e.tool === "Read" && !filters.reads) return false;
        return filters.tools;
      }
      if (e.type === "agent_start" || e.type === "agent_stop") return filters.agents;
      if (e.type === "job_update") return filters.jobs;
      if (["session_start", "session_end", "stop_requested", "stop_blocked"].includes(e.type)) return filters.system;
      return true;
    });
  }, [events, filters]);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar: filters + file tree */}
      {showSidebar && (
        <div style={{ display: "flex", flexDirection: "column", borderRight: "1px solid var(--border)", width: 240, flexShrink: 0 }}>
          <Sidebar
            events={events}
            filters={filters}
            onFilterChange={setFilters}
            connected={connected}
            theme={theme}
            onThemeToggle={toggleTheme}
          />
          {/* File tree below sidebar */}
          <div
            style={{
              borderTop: "1px solid var(--border)",
              flex: 1,
              overflow: "auto",
              background: "var(--bg-secondary)",
            }}
          >
            <div
              style={{
                padding: "6px 14px",
                fontSize: 10,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span>Project Files</span>
              <button
                onClick={() => setShowEditor((v) => !v)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--accent-blue)",
                  cursor: "pointer",
                  fontSize: 10,
                }}
              >
                {showEditor ? "Hide" : "Show"} Editor
              </button>
            </div>
            <FileTree onFileSelect={handleFileSelect} activeFile={activeFile} />
          </div>
        </div>
      )}

      {/* Main content: feed + optional editor */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
          {/* Chat feed */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden", minWidth: 300 }}>
            <ChatFeed events={filteredEvents} connected={connected} />
          </div>

          {/* Editor panel */}
          {showEditor && (
            <div
              style={{
                width: "45%",
                maxWidth: 700,
                minWidth: 300,
                borderLeft: "1px solid var(--border)",
                overflow: "hidden",
              }}
            >
              <DocumentEditor filePath={activeFile} onClose={handleCloseEditor} />
            </div>
          )}
        </div>

        {/* Terminal panel (docked bottom) */}
        {showTerminal && (
          <div
            style={{
              height: 250,
              borderTop: "1px solid var(--border)",
              flexShrink: 0,
            }}
          >
            <TerminalPanel onClose={() => setShowTerminal(false)} />
          </div>
        )}

        {/* Bottom bar */}
        <div
          style={{
            padding: "3px 12px",
            borderTop: "1px solid var(--border)",
            background: "var(--bg-secondary)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 11,
            color: "var(--text-muted)",
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setShowSidebar((v) => !v)}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 11 }}
            title="Toggle sidebar (Ctrl+B)"
          >
            {showSidebar ? "\u25C0" : "\u25B6"} Sidebar
          </button>
          <button
            onClick={() => setShowTerminal((v) => !v)}
            style={{ background: "none", border: "none", color: showTerminal ? "var(--accent-blue)" : "var(--text-muted)", cursor: "pointer", fontSize: 11 }}
            title="Toggle terminal (Ctrl+`)"
          >
            {showTerminal ? "\u25BC" : "\u25B2"} Terminal
          </button>
          <span style={{ marginLeft: "auto" }}>
            {events.length} events | {connected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>
    </div>
  );
}
