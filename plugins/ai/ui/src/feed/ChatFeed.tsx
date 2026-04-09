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
  const [showReads, setShowReads] = useState(false);

  // Filter reads locally
  const filteredEvents = useMemo(() => {
    if (showReads) return events;
    return events.filter((e) => e.tool !== "Read");
  }, [events, showReads]);

  const grouped = useMemo(() => groupEvents(filteredEvents), [filteredEvents]);

  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [grouped.length, autoScroll]);

  function handleScroll() {
    const el = containerRef.current;
    if (!el) return;
    setAutoScroll(el.scrollHeight - el.scrollTop - el.clientHeight < 50);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minWidth: 0 }}>
      {/* Event stream */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px 12px",
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
              fontSize: "var(--text-base)",
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

      {/* Scroll-to-bottom + reads toggle */}
      <div
        style={{
          padding: "4px 12px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: "var(--text-xs)",
          color: "var(--text-muted)",
          flexShrink: 0,
          background: "var(--bg-panel)",
        }}
      >
        <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={showReads}
            onChange={(e) => setShowReads(e.target.checked)}
            style={{ accentColor: "var(--accent-blue)" }}
          />
          Show reads
        </label>
        <span style={{ marginLeft: "auto" }}>{filteredEvents.length} events</span>
        {!autoScroll && (
          <button
            onClick={() => {
              setAutoScroll(true);
              containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
            }}
            style={{
              padding: "2px 8px",
              background: "var(--accent-blue)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius)",
              cursor: "pointer",
              fontSize: "var(--text-xs)",
            }}
          >
            Scroll to bottom
          </button>
        )}
      </div>
    </div>
  );
}
