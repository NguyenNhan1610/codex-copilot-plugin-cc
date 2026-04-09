import type { FastifyInstance } from "fastify";
import type { EventBus } from "../lib/event-bus.js";
import type { EventType, SessionEvent } from "../../shared/types.js";
import { createEvent } from "../../shared/types.js";

const VALID_TYPES = new Set<EventType>([
  "user_prompt",
  "tool_call",
  "tool_result",
  "agent_start",
  "agent_stop",
  "stop_requested",
  "stop_blocked",
  "job_update",
  "session_start",
  "session_end",
]);

export function registerEventRoutes(app: FastifyInstance, bus: EventBus): void {
  // Receive events from hooks
  app.post("/api/events", async (request, reply) => {
    const body = request.body as Partial<SessionEvent> | null;

    if (!body || !body.type) {
      return reply.status(400).send({ error: "Missing type field" });
    }

    if (!VALID_TYPES.has(body.type)) {
      return reply.status(400).send({ error: `Unknown event type: ${body.type}` });
    }

    const event = createEvent(body.type, body);
    bus.emit(event);

    return reply.status(204).send();
  });

  // Batch events endpoint
  app.post("/api/events/batch", async (request, reply) => {
    const body = request.body as Partial<SessionEvent>[] | null;

    if (!Array.isArray(body)) {
      return reply.status(400).send({ error: "Expected array" });
    }

    for (const item of body) {
      if (item.type && VALID_TYPES.has(item.type)) {
        bus.emit(createEvent(item.type, item));
      }
    }

    return reply.status(204).send();
  });
}
