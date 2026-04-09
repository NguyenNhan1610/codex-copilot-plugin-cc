import { useState, useEffect, useRef, useCallback } from "react";
import { BlockNoteEditor } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

interface DocumentEditorProps {
  filePath: string | null;
  onClose: () => void;
}

export function DocumentEditor({ filePath, onClose }: DocumentEditorProps) {
  const [content, setContent] = useState<string>("");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentRef = useRef<string>("");

  const editor = useCreateBlockNote();

  // Load file content
  useEffect(() => {
    if (!filePath) return;
    setLoading(true);
    setDirty(false);

    // REC-*.md files are read-only
    const isReadOnly = /REC-\d+/.test(filePath);
    setReadOnly(isReadOnly);

    fetch(`/api/files/${filePath}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.text();
      })
      .then(async (text) => {
        setContent(text);
        contentRef.current = text;
        // Convert markdown to blocks
        const blocks = await editor.tryParseMarkdownToBlocks(text);
        editor.replaceBlocks(editor.document, blocks);
      })
      .catch(() => setContent(""))
      .finally(() => setLoading(false));
  }, [filePath, editor]);

  // Save function
  const save = useCallback(async () => {
    if (!filePath || readOnly) return;
    setSaving(true);
    try {
      const markdown = await editor.blocksToMarkdownLossy(editor.document);
      await fetch(`/api/files/${filePath}`, {
        method: "PUT",
        headers: { "Content-Type": "text/plain" },
        body: markdown,
      });
      setDirty(false);
    } catch (err) {
      console.error("Save failed:", err);
    }
    setSaving(false);
  }, [filePath, editor, readOnly]);

  // Ctrl+S handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [save]);

  // Auto-save on change (2s debounce)
  const handleChange = useCallback(() => {
    if (readOnly) return;
    setDirty(true);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => save(), 2000);
  }, [save, readOnly]);

  if (!filePath) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 16,
          padding: 32,
          background: "var(--bg-panel)",
        }}
      >
        <div style={{ fontSize: "var(--text-xl)", fontWeight: 700, color: "var(--text-primary)" }}>
          AI Companion Dashboard
        </div>
        <div style={{ fontSize: "var(--text-base)", color: "var(--text-muted)", textAlign: "center" }}>
          Select a file from the sidebar to start editing
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          {["ADR", "FDR", "IMPL"].map((type) => (
            <button
              key={type}
              onClick={async () => {
                const dir = type === "IMPL" ? "implementation_plans" : type.toLowerCase();
                const prefix = type === "IMPL" ? "IMPL" : type;
                const path = `${dir}/${prefix}-XX-new.md`;
                try {
                  await fetch(`/api/files/${path}`, { method: "PUT", headers: { "Content-Type": "text/plain" }, body: `# ${prefix}-XX: New ${type}\n\n` });
                  onClose();
                } catch { /* ignore */ }
              }}
              style={{
                padding: "6px 14px",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                color: "var(--text-secondary)",
                cursor: "pointer",
                fontSize: "var(--text-sm)",
              }}
            >
              + New {type}
            </button>
          ))}
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: "var(--text-sm)",
            color: "var(--text-muted)",
            fontFamily: "var(--font-mono)",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <div><kbd style={{ color: "var(--text-secondary)" }}>Ctrl+S</kbd> Save</div>
          <div><kbd style={{ color: "var(--text-secondary)" }}>Ctrl+B</kbd> Toggle sidebar</div>
          <div><kbd style={{ color: "var(--text-secondary)" }}>Ctrl+1</kbd> Chat tab</div>
          <div><kbd style={{ color: "var(--text-secondary)" }}>Ctrl+2</kbd> Terminal tab</div>
        </div>
      </div>
    );
  }

  const shortPath = filePath.split("/").slice(-2).join("/");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Editor toolbar */}
      <div
        style={{
          padding: "6px 12px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "var(--bg-panel)",
          flexShrink: 0,
          fontSize: 12,
        }}
      >
        <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)" }} title={filePath}>
          {shortPath}
        </span>
        {dirty && <span style={{ color: "var(--accent-orange)", fontSize: 10 }}>Modified</span>}
        {saving && <span style={{ color: "var(--accent-blue)", fontSize: 10 }}>Saving...</span>}
        {readOnly && (
          <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 10, background: "var(--accent-gray)", color: "#fff" }}>
            Read-only
          </span>
        )}
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          <button
            onClick={save}
            disabled={!dirty || readOnly}
            style={{
              padding: "3px 10px",
              background: dirty ? "var(--accent-blue)" : "var(--bg-elevated)",
              color: dirty ? "#fff" : "var(--text-muted)",
              border: "none",
              borderRadius: "var(--radius)",
              cursor: dirty ? "pointer" : "default",
              fontSize: 11,
            }}
          >
            Save
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "3px 8px",
              background: "var(--bg-elevated)",
              color: "var(--text-secondary)",
              border: "none",
              borderRadius: "var(--radius)",
              cursor: "pointer",
              fontSize: 11,
            }}
          >
            Close
          </button>
        </div>
      </div>

      {/* Editor body */}
      <div style={{ flex: 1, overflow: "auto", background: "var(--bg-app)" }}>
        {loading ? (
          <div style={{ padding: 24, color: "var(--text-muted)" }}>Loading...</div>
        ) : (
          <BlockNoteView
            editor={editor}
            editable={!readOnly}
            onChange={handleChange}
            theme="dark"
          />
        )}
      </div>
    </div>
  );
}
