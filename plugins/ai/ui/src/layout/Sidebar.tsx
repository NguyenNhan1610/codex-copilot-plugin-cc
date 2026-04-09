import { useState } from "react";
import type { SessionEvent } from "../hooks/useEventStream";

interface FilterState {
  prompts: boolean;
  tools: boolean;
  agents: boolean;
  jobs: boolean;
  system: boolean;
  reads: boolean;
}

interface SidebarProps {
  events: SessionEvent[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  connected: boolean;
  theme: "dark" | "light";
  onThemeToggle: () => void;
}

export function Sidebar({ events, filters, onFilterChange, connected, theme, onThemeToggle }: SidebarProps) {
  const [search, setSearch] = useState("");

  const toggle = (key: keyof FilterState) => {
    onFilterChange({ ...filters, [key]: !filters[key] });
  };

  // Stats
  const counts = {
    prompts: events.filter((e) => e.type === "user_prompt").length,
    tools: events.filter((e) => e.type === "tool_call" || e.type === "tool_result").length,
    agents: events.filter((e) => e.type === "agent_start" || e.type === "agent_stop").length,
    jobs: events.filter((e) => e.type === "job_update").length,
    system: events.filter((e) => ["session_start", "session_end", "stop_requested", "stop_blocked"].includes(e.type)).length,
  };

  const filterButtons: { key: keyof FilterState; label: string; count: number }[] = [
    { key: "prompts", label: "Prompts", count: counts.prompts },
    { key: "tools", label: "Tools", count: counts.tools },
    { key: "agents", label: "Agents", count: counts.agents },
    { key: "jobs", label: "Jobs", count: counts.jobs },
    { key: "system", label: "System", count: counts.system },
    { key: "reads", label: "Show Reads", count: 0 },
  ];

  return (
    <div
      style={{
        width: 220,
        borderRight: "1px solid var(--border)",
        background: "var(--bg-secondary)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 14px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 13 }}>AI Companion</span>
        <button
          onClick={onThemeToggle}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 16,
            padding: 0,
          }}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? "\u2600\uFE0F" : "\uD83C\uDF19"}
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: "8px 14px" }}>
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "5px 8px",
            background: "var(--bg-primary)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            color: "var(--text-primary)",
            fontSize: 12,
            outline: "none",
          }}
        />
      </div>

      {/* Filters */}
      <div style={{ padding: "4px 14px", display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 4 }}>
          Filters
        </div>
        {filterButtons.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => toggle(key)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "4px 8px",
              background: filters[key] ? "var(--bg-tertiary)" : "transparent",
              border: "1px solid",
              borderColor: filters[key] ? "var(--accent-blue)" : "transparent",
              borderRadius: "var(--radius)",
              color: filters[key] ? "var(--text-primary)" : "var(--text-secondary)",
              cursor: "pointer",
              fontSize: 12,
              textAlign: "left",
            }}
          >
            <span>{label}</span>
            {count > 0 && (
              <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ marginTop: "auto", padding: "12px 14px", borderTop: "1px solid var(--border)" }}>
        <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 6 }}>
          Session
        </div>
        <div style={{ fontSize: 11, color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Events</span>
            <span>{events.length}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Status</span>
            <span style={{ color: connected ? "var(--accent-green)" : "var(--accent-red)" }}>
              {connected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { FilterState };
