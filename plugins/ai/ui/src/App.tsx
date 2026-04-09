import { useState, useCallback, useRef } from "react";
import { useEventStream } from "./hooks/useEventStream";
import { ChatFeed } from "./feed/ChatFeed";
import { Sidebar } from "./layout/Sidebar";
import { ResizeHandle } from "./layout/ResizeHandle";
import { TabbedPanel } from "./layout/TabbedPanel";
import { DocumentEditor } from "./editor/DocumentEditor";
import { TerminalPanel } from "./terminal/TerminalPanel";
import { initTheme, setTheme as applyTheme } from "./styles/theme";

const WS_URL = `ws://${window.location.host}/ws/events`;

const DEFAULT_EDITOR_PCT = 50;
const DEFAULT_RIGHT_PCT = 50;
const MIN_EDITOR_PX = 300;
const MIN_RIGHT_PX = 280;

export function App() {
  const { events, connected } = useEventStream(WS_URL);
  const [theme, setTheme] = useState<"dark" | "light">(() => initTheme());
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState<string>(() => localStorage.getItem("ui-active-tab") || "chat");
  const [terminalMounted, setTerminalMounted] = useState(false);
  const [terminalStatus, setTerminalStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");

  // Resize state (percentage of available space for editor)
  const [editorPct, setEditorPct] = useState(() => {
    const saved = localStorage.getItem("ui-editor-pct");
    return saved ? Number(saved) : DEFAULT_EDITOR_PCT;
  });
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      applyTheme(next);
      return next;
    });
  }, []);

  const handleFileSelect = useCallback((path: string) => {
    setActiveFile(path);
  }, []);

  const handleCloseEditor = useCallback(() => {
    setActiveFile(null);
  }, []);

  const handleTabChange = useCallback((id: string) => {
    setActiveTab(id);
    localStorage.setItem("ui-active-tab", id);
    if (id === "terminal" && !terminalMounted) {
      setTerminalMounted(true);
    }
  }, [terminalMounted]);

  const handleResize = useCallback((delta: number) => {
    if (!contentRef.current) return;
    const totalWidth = contentRef.current.clientWidth;
    const deltaPct = (delta / totalWidth) * 100;
    setEditorPct((prev) => {
      const next = Math.max(
        (MIN_EDITOR_PX / totalWidth) * 100,
        Math.min(100 - (MIN_RIGHT_PX / totalWidth) * 100, prev + deltaPct)
      );
      localStorage.setItem("ui-editor-pct", String(Math.round(next)));
      return next;
    });
  }, []);

  const handleResetResize = useCallback(() => {
    setEditorPct(DEFAULT_EDITOR_PCT);
    localStorage.setItem("ui-editor-pct", String(DEFAULT_EDITOR_PCT));
  }, []);

  // Keyboard shortcuts
  useState(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        setShowSidebar((v) => !v);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "1") {
        e.preventDefault();
        handleTabChange("chat");
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "2") {
        e.preventDefault();
        handleTabChange("terminal");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const tabs = [
    { id: "chat", label: "Chat", badge: events.length > 0 ? events.length : undefined },
    {
      id: "terminal",
      label: "Terminal",
      statusColor: terminalMounted
        ? terminalStatus === "connected" ? "var(--status-connected)"
        : terminalStatus === "connecting" ? "var(--status-connecting)"
        : "var(--status-disconnected)"
        : undefined,
    },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      {showSidebar && (
        <Sidebar
          connected={connected}
          activeFile={activeFile}
          onFileSelect={handleFileSelect}
          theme={theme}
          onThemeToggle={toggleTheme}
        />
      )}

      {/* Content: Editor + Right Panel */}
      <div ref={contentRef} style={{ flex: 1, display: "flex", minWidth: 0, overflow: "hidden" }}>
        {/* Editor panel */}
        <div style={{ width: `${editorPct}%`, minWidth: MIN_EDITOR_PX, overflow: "hidden" }}>
          <DocumentEditor filePath={activeFile} onClose={handleCloseEditor} />
        </div>

        {/* Resize handle */}
        <ResizeHandle onResize={handleResize} onDoubleClick={handleResetResize} />

        {/* Right panel: tabbed Chat + Terminal */}
        <div style={{ flex: 1, minWidth: MIN_RIGHT_PX, overflow: "hidden" }}>
          <TabbedPanel tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange}>
            {/* Chat tab */}
            <div style={{ display: activeTab === "chat" ? "flex" : "none", flexDirection: "column", height: "100%" }}>
              <ChatFeed events={events} connected={connected} />
            </div>

            {/* Terminal tab (lazy mount) */}
            <div style={{ display: activeTab === "terminal" ? "flex" : "none", flexDirection: "column", height: "100%" }}>
              {terminalMounted && (
                <TerminalPanel
                  onClose={() => handleTabChange("chat")}
                  onStatusChange={setTerminalStatus}
                />
              )}
            </div>
          </TabbedPanel>
        </div>
      </div>
    </div>
  );
}
