import { useRef, useEffect, useState, useMemo } from "react";
import type { SessionEvent } from "../hooks/useEventStream";
import { groupEvents } from "./EventGrouper";
import { EventRouter } from "./EventRouter";
import { ReadGroup } from "./widgets/ReadGroup";
import { SearchGroup } from "./widgets/SearchGroup";

interface ChatFeedProps {
  events: SessionEvent[];
  connected: boolean;
}

export function ChatFeed({ events, connected }: ChatFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const grouped = useMemo(() => groupEvents(events), [events]);

  // Auto-scroll on new events
  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [grouped.length, autoScroll]);

  // Detect user scroll position
  function handleScroll() {
    const el = containerRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
    setAutoScroll(atBottom);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minWidth: 0 }}>
      {/* Connection status */}
      <div
        style={{
          padding: "6px 16px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 12,
          color: "var(--text-secondary)",
          background: "var(--bg-secondary)",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: connected ? "var(--accent-green)" : "var(--accent-red)",
            display: "inline-block",
          }}
        />
        {connected ? "Connected" : "Reconnecting..."}
        <span style={{ marginLeft: "auto" }}>{events.length} events</span>
      </div>

      {/* Event stream */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {events.length === 0 ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "var(--text-muted)",
              fontStyle: "italic",
            }}
          >
            Waiting for session events...
          </div>
        ) : (
          grouped.map((group, i) => {
            if (group.type === "read_group") {
              return <ReadGroup key={`rg-${i}`} events={group.events} label={group.label!} />;
            }
            if (group.type === "search_group") {
              return <SearchGroup key={`sg-${i}`} events={group.events} label={group.label!} />;
            }
            const event = group.events[0];
            return <EventRouter key={event.id || `e-${i}`} event={event} />;
          })
        )}
      </div>

      {/* Scroll indicator */}
      {!autoScroll && (
        <button
          onClick={() => {
            setAutoScroll(true);
            containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
          }}
          style={{
            position: "absolute",
            bottom: 16,
            right: 24,
            padding: "6px 12px",
            background: "var(--accent-blue)",
            color: "#fff",
            border: "none",
            borderRadius: "var(--radius)",
            cursor: "pointer",
            fontSize: 12,
            zIndex: 10,
          }}
        >
          Scroll to bottom
        </button>
      )}
    </div>
  );
}
