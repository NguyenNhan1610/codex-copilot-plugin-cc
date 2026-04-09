import { useState, useEffect } from "react";

interface TodoTask {
  id: string;
  title: string;
  status: string;
  priority?: string;
  track?: string;
  description?: string;
}

interface TodoBlockProps {
  content: string;
  onChange: (content: string) => void;
  readOnly?: boolean;
}

const STATUS_COLUMNS = ["pending", "in_progress", "complete", "blocked"];

const STATUS_COLORS: Record<string, string> = {
  pending: "var(--text-muted)",
  in_progress: "var(--accent-blue)",
  complete: "var(--accent-green)",
  blocked: "var(--accent-red)",
  cancelled: "var(--accent-gray)",
};

const PRIORITY_COLORS: Record<string, string> = {
  P0: "var(--accent-red)",
  P1: "var(--accent-orange)",
  P2: "var(--accent-blue)",
  P3: "var(--text-muted)",
};

function parseYamlTasks(content: string): TodoTask[] {
  const tasks: TodoTask[] = [];
  const taskRegex = /- id:\s*(\S+)\s*\n\s*title:\s*(.*)\n\s*status:\s*(\S+)(?:\n\s*priority:\s*(\S+))?(?:\n\s*track:\s*(\S+))?/g;
  let match;
  while ((match = taskRegex.exec(content)) !== null) {
    tasks.push({
      id: match[1],
      title: match[2].trim().replace(/^["']|["']$/g, ""),
      status: match[3],
      priority: match[4],
      track: match[5],
    });
  }
  return tasks;
}

function updateTaskStatus(content: string, taskId: string, newStatus: string): string {
  const regex = new RegExp(`(- id:\\s*${taskId}\\s*\\n\\s*title:.*\\n\\s*status:\\s*)\\S+`);
  return content.replace(regex, `$1${newStatus}`);
}

export function TodoBlock({ content, onChange, readOnly }: TodoBlockProps) {
  const [tasks, setTasks] = useState<TodoTask[]>([]);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  useEffect(() => {
    setTasks(parseYamlTasks(content));
  }, [content]);

  const handleStatusChange = (taskId: string, newStatus: string) => {
    if (readOnly) return;
    const updated = updateTaskStatus(content, taskId, newStatus);
    onChange(updated);
  };

  const columns = STATUS_COLUMNS.map((status) => ({
    status,
    tasks: tasks.filter((t) => t.status === status),
  }));

  return (
    <div style={{ display: "flex", gap: 12, overflowX: "auto", padding: "8px 0" }}>
      {columns.map((col) => (
        <div
          key={col.status}
          style={{
            flex: 1,
            minWidth: 180,
            background: "var(--bg-panel)",
            borderRadius: "var(--radius)",
            padding: 8,
          }}
        >
          {/* Column header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 8,
              paddingBottom: 6,
              borderBottom: `2px solid ${STATUS_COLORS[col.status] || "var(--border)"}`,
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: "capitalize" }}>
              {col.status.replace("_", " ")}
            </span>
            <span
              style={{
                fontSize: 10,
                padding: "0 5px",
                borderRadius: 8,
                background: "var(--bg-elevated)",
                color: "var(--text-muted)",
              }}
            >
              {col.tasks.length}
            </span>
          </div>

          {/* Task cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {col.tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                style={{
                  padding: "6px 8px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  cursor: "pointer",
                  fontSize: 11,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                  <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)", fontSize: 10 }}>
                    {task.id}
                  </span>
                  {task.priority && (
                    <span
                      style={{
                        fontSize: 9,
                        padding: "0 4px",
                        borderRadius: 6,
                        background: PRIORITY_COLORS[task.priority] || "var(--text-muted)",
                        color: "#fff",
                      }}
                    >
                      {task.priority}
                    </span>
                  )}
                </div>
                <div style={{ color: "var(--text-primary)", lineHeight: 1.3 }}>{task.title}</div>
                {task.track && (
                  <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>{task.track}</div>
                )}

                {/* Expanded: status change buttons */}
                {expandedTask === task.id && !readOnly && (
                  <div style={{ marginTop: 6, display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {STATUS_COLUMNS.filter((s) => s !== task.status).map((s) => (
                      <button
                        key={s}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(task.id, s);
                        }}
                        style={{
                          padding: "2px 6px",
                          fontSize: 9,
                          background: "var(--bg-elevated)",
                          border: "1px solid var(--border)",
                          borderRadius: "var(--radius)",
                          color: STATUS_COLORS[s],
                          cursor: "pointer",
                          textTransform: "capitalize",
                        }}
                      >
                        {s.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {col.tasks.length === 0 && (
              <div style={{ padding: 8, color: "var(--text-muted)", fontSize: 10, textAlign: "center", fontStyle: "italic" }}>
                Empty
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
