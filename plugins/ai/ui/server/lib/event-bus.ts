import type { WebSocket } from "@fastify/websocket";
import type { SessionEvent } from "../../shared/types.js";
import { createEvent } from "../../shared/types.js";

const MAX_HISTORY = 500;

export class EventBus {
  private clients = new Set<WebSocket>();
  private history: SessionEvent[] = [];

  emit(event: SessionEvent): void {
    // Ensure id and ts
    if (!event.id || !event.ts) {
      event = createEvent(event.type, event);
    }

    // Ring buffer
    this.history.push(event);
    if (this.history.length > MAX_HISTORY) {
      this.history.shift();
    }

    // Broadcast
    const data = JSON.stringify(event);
    for (const client of this.clients) {
      try {
        client.send(data);
      } catch {
        this.clients.delete(client);
      }
    }
  }

  subscribe(ws: WebSocket): void {
    this.clients.add(ws);

    // Replay history as batch
    if (this.history.length > 0) {
      try {
        ws.send(JSON.stringify({ type: "history", events: this.history }));
      } catch {
        this.clients.delete(ws);
      }
    }
  }

  unsubscribe(ws: WebSocket): void {
    this.clients.delete(ws);
  }

  getHistory(): SessionEvent[] {
    return this.history;
  }

  clear(): void {
    this.history = [];
  }
}
