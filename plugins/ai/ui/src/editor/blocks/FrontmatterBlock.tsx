import { useState, useEffect } from "react";

interface FrontmatterProps {
  content: string;
  onChange: (content: string) => void;
  readOnly?: boolean;
}

interface FrontmatterField {
  key: string;
  value: string;
}

function parseFrontmatter(content: string): { fields: FrontmatterField[]; body: string } | null {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return null;

  const fields: FrontmatterField[] = [];
  for (const line of match[1].split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0) {
      fields.push({
        key: line.substring(0, colonIdx).trim(),
        value: line.substring(colonIdx + 1).trim(),
      });
    }
  }

  return { fields, body: match[2] };
}

function serializeFrontmatter(fields: FrontmatterField[]): string {
  return "---\n" + fields.map((f) => `${f.key}: ${f.value}`).join("\n") + "\n---\n";
}

const STATUS_OPTIONS = ["Proposed", "Accepted", "Deprecated", "Superseded", "In Progress", "Completed"];

export function FrontmatterBlock({ content, onChange, readOnly }: FrontmatterProps) {
  const parsed = parseFrontmatter(content);
  const [fields, setFields] = useState<FrontmatterField[]>(parsed?.fields || []);

  useEffect(() => {
    const p = parseFrontmatter(content);
    if (p) setFields(p.fields);
  }, [content]);

  if (!parsed) return null;

  const updateField = (index: number, value: string) => {
    if (readOnly) return;
    const updated = [...fields];
    updated[index] = { ...updated[index], value };
    setFields(updated);
    onChange(serializeFrontmatter(updated) + parsed.body);
  };

  const isStatusField = (key: string) => /status/i.test(key);
  const isDateField = (key: string) => /date|created|updated/i.test(key);
  const isReadOnlyField = (key: string) => /^(name|id|title)$/i.test(key);

  return (
    <div
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "10px 14px",
        marginBottom: 12,
      }}
    >
      <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8 }}>
        Frontmatter
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {fields.map((field, i) => (
          <div key={field.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label style={{ width: 100, fontSize: 11, color: "var(--text-secondary)", flexShrink: 0 }}>
              {field.key}
            </label>
            {isStatusField(field.key) ? (
              <select
                value={field.value}
                onChange={(e) => updateField(i, e.target.value)}
                disabled={readOnly}
                style={{
                  flex: 1,
                  padding: "3px 6px",
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  color: "var(--text-primary)",
                  fontSize: 12,
                }}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : isDateField(field.key) ? (
              <input
                type="date"
                value={field.value}
                onChange={(e) => updateField(i, e.target.value)}
                disabled={readOnly}
                style={{
                  flex: 1,
                  padding: "3px 6px",
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  color: "var(--text-primary)",
                  fontSize: 12,
                }}
              />
            ) : (
              <input
                type="text"
                value={field.value}
                onChange={(e) => updateField(i, e.target.value)}
                disabled={readOnly || isReadOnlyField(field.key)}
                style={{
                  flex: 1,
                  padding: "3px 6px",
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  color: isReadOnlyField(field.key) ? "var(--text-muted)" : "var(--text-primary)",
                  fontSize: 12,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
