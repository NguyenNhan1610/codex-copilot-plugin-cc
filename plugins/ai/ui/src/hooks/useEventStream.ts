import { useState, useEffect, useRef, useCallback } from "react";

export interface SessionEvent {
  id: string;
  ts: string;
  type: string;
  tool?: string;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  signal?: string;
  blocked?: boolean;
  message?: string;
  meta?: Record<string, unknown>;
}

interface HistoryMessage {
  type: "history";
  events: SessionEvent[];
}

export function useEventStream(url: string) {
  const [events, setEvents] = useState<SessionEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const retryRef = useRef(0);

  const clear = useCallback(() => setEvents([]), []);

  useEffect(() => {
    let unmounted = false;
    let retryTimer: ReturnType<typeof setTimeout>;

    function connect() {
      if (unmounted) return;

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        retryRef.current = 0;
      };

      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);

          // History replay batch
          if (data.type === "history" && Array.isArray((data as HistoryMessage).events)) {
            setEvents((prev) => [...prev, ...(data as HistoryMessage).events]);
            return;
          }

          // Single event
          setEvents((prev) => [...prev, data as SessionEvent]);
        } catch {
          // Ignore malformed messages
        }
      };

      ws.onclose = () => {
        setConnected(false);
        wsRef.current = null;

        if (!unmounted) {
          const delay = Math.min(1000 * 2 ** retryRef.current, 30000);
          retryRef.current++;
          retryTimer = setTimeout(connect, delay);
        }
      };

      ws.onerror = () => {
        ws.close();
      };
    }

    connect();

    return () => {
      unmounted = true;
      clearTimeout(retryTimer);
      wsRef.current?.close();
    };
  }, [url]);

  return { events, connected, clear };
}
