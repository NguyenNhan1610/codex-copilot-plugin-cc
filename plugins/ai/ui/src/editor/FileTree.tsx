import { useState, useEffect, useCallback } from "react";

interface FileEntry {
  name: string;
  type: "file" | "dir";
  path: string;
  size?: number;
  modified?: string;
  children?: FileEntry[];
}

const ICON_MAP: Record<string, string> = {
  ".md": "\u{1F4DD}",
  ".yaml": "\u{1F4CA}",
  ".yml": "\u{1F4CA}",
  ".svg": "\u{1F5BC}",
  ".json": "\u{1F4CB}",
};

function getFileIcon(name: string): string {
  const ext = name.substring(name.lastIndexOf("."));
  return ICON_MAP[ext] || "\u{1F4C4}";
}

interface FileTreeProps {
  onFileSelect: (path: string) => void;
  activeFile: string | null;
}

export function FileTree({ onFileSelect, activeFile }: FileTreeProps) {
  const [tree, setTree] = useState<FileEntry[]>([]);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const fetchTree = useCallback(async () => {
    try {
      const res = await fetch("/api/files/tree");
      if (res.ok) setTree(await res.json());
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchTree();
    const interval = setInterval(fetchTree, 5000);
    return () => clearInterval(interval);
  }, [fetchTree]);

  const toggleDir = (path: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  function renderEntry(entry: FileEntry, depth: number = 0): React.ReactNode {
    const isDir = entry.type === "dir";
    const isCollapsed = collapsed.has(entry.path);
    const isActive = entry.path === activeFile;

    return (
      <div key={entry.path}>
        <button
          onClick={() => isDir ? toggleDir(entry.path) : onFileSelect(entry.path)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            width: "100%",
            padding: "3px 8px",
            paddingLeft: 8 + depth * 16,
            background: isActive ? "var(--bg-tertiary)" : "transparent",
            border: "none",
            borderLeft: isActive ? "2px solid var(--accent-blue)" : "2px solid transparent",
            color: "var(--text-primary)",
            cursor: "pointer",
            fontSize: 12,
            textAlign: "left",
            borderRadius: 0,
          }}
          onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "var(--bg-tertiary)"; }}
          onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
        >
          {isDir && (
            <span style={{ fontSize: 10, width: 12, textAlign: "center", color: "var(--text-muted)" }}>
              {isCollapsed ? "\u25B6" : "\u25BC"}
            </span>
          )}
          {!isDir && <span style={{ width: 12 }} />}
          <span style={{ fontSize: 12 }}>{isDir ? "\u{1F4C1}" : getFileIcon(entry.name)}</span>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {entry.name}
          </span>
        </button>
        {isDir && !isCollapsed && entry.children?.map((child) => renderEntry(child, depth + 1))}
      </div>
    );
  }

  if (tree.length === 0) {
    return (
      <div style={{ padding: 12, color: "var(--text-muted)", fontSize: 11, fontStyle: "italic" }}>
        No project files yet. Run /ai:setup --init
      </div>
    );
  }

  return <div style={{ paddingTop: 4 }}>{tree.map((entry) => renderEntry(entry))}</div>;
}
