import { useState, useEffect, useCallback } from "react";
import { Folder, FolderOpen, FileText, FileCode, Image, File } from "lucide-react";

interface FileEntry {
  name: string;
  type: "file" | "dir";
  path: string;
  size?: number;
  modified?: string;
  children?: FileEntry[];
}

function getFileIcon(name: string, size = 13) {
  const ext = name.substring(name.lastIndexOf("."));
  switch (ext) {
    case ".md": return <FileText size={size} style={{ color: "var(--text-muted)", flexShrink: 0 }} />;
    case ".yaml":
    case ".yml": return <FileCode size={size} style={{ color: "var(--accent-orange)", flexShrink: 0 }} />;
    case ".svg":
    case ".png": return <Image size={size} style={{ color: "var(--accent-purple)", flexShrink: 0 }} />;
    default: return <File size={size} style={{ color: "var(--text-muted)", flexShrink: 0 }} />;
  }
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

  // Auto-expand parent when active file changes
  useEffect(() => {
    if (!activeFile) return;
    const parts = activeFile.split("/");
    if (parts.length > 1) {
      setCollapsed((prev) => {
        const next = new Set(prev);
        let path = "";
        for (let i = 0; i < parts.length - 1; i++) {
          path = path ? `${path}/${parts[i]}` : parts[i];
          next.delete(path);
        }
        return next;
      });
    }
  }, [activeFile]);

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
            gap: 5,
            width: "100%",
            padding: "3px 8px",
            paddingLeft: 8 + depth * 12,
            background: isActive ? "var(--bg-elevated)" : "transparent",
            border: "none",
            borderLeft: isActive ? "2px solid var(--accent-blue)" : "2px solid transparent",
            color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
            cursor: "pointer",
            fontSize: "var(--text-sm)",
            textAlign: "left",
            borderRadius: 0,
            transition: "background 150ms ease",
          }}
          onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "var(--bg-elevated)"; }}
          onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
        >
          {isDir ? (
            <>
              <span style={{ fontSize: "var(--text-xs)", width: 10, textAlign: "center", color: "var(--text-muted)" }}>
                {isCollapsed ? "\u25B6" : "\u25BC"}
              </span>
              {isCollapsed
                ? <Folder size={13} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                : <FolderOpen size={13} style={{ color: "var(--accent-blue)", flexShrink: 0 }} />
              }
            </>
          ) : (
            <>
              <span style={{ width: 10 }} />
              {getFileIcon(entry.name)}
            </>
          )}
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
      <div style={{ padding: 12, color: "var(--text-muted)", fontSize: "var(--text-sm)", fontStyle: "italic" }}>
        No project files yet
      </div>
    );
  }

  return <div style={{ paddingTop: 2 }}>{tree.map((entry) => renderEntry(entry))}</div>;
}
