import { type ReactNode } from "react";

interface Tab {
  id: string;
  label: string;
  badge?: string | number;
  statusColor?: string;
}

interface TabbedPanelProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  children: ReactNode;
}

export function TabbedPanel({ tabs, activeTab, onTabChange, children }: TabbedPanelProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          height: 32,
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-panel)",
          flexShrink: 0,
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                padding: "0 16px",
                background: "transparent",
                border: "none",
                borderBottom: isActive ? "2px solid var(--tab-active)" : "2px solid transparent",
                color: isActive ? "var(--text-primary)" : "var(--tab-inactive)",
                fontSize: "var(--text-sm)",
                fontWeight: isActive ? 600 : 400,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "color 150ms ease, border-color 120ms ease",
              }}
            >
              {tab.label}
              {tab.badge !== undefined && (
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--text-muted)",
                    fontWeight: 400,
                  }}
                >
                  ({tab.badge})
                </span>
              )}
              {tab.statusColor && (
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: tab.statusColor,
                    flexShrink: 0,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflow: "hidden" }}>{children}</div>
    </div>
  );
}
