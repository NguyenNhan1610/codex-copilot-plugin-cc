import type { FastifyInstance } from "fastify";
import { PtyManager } from "../lib/pty.js";
import { PtyFallback } from "../lib/pty-fallback.js";

type TerminalBackend = PtyManager | PtyFallback;

export async function registerTerminalRoutes(app: FastifyInstance, projectRoot: string): Promise<void> {
  // Try node-pty first, fall back to basic PTY
  const ptyManager = new PtyManager(projectRoot);
  const hasPty = await ptyManager.init();

  let backend: TerminalBackend;
  if (hasPty) {
    backend = ptyManager;
  } else {
    backend = new PtyFallback(projectRoot);
  }

  // Status endpoint
  app.get("/api/terminal/status", async () => ({
    available: true,
    backend: hasPty ? "node-pty" : "fallback",
  }));

  // WebSocket terminal
  app.register(async (instance) => {
    instance.get("/ws/terminal", { websocket: true }, (socket) => {
      // Spawn terminal if not running
      backend.spawn();

      // Forward PTY output to WebSocket
      const cleanup = backend.onData((data: string) => {
        try {
          socket.send(JSON.stringify({ type: "output", data }));
        } catch { /* client disconnected */ }
      });

      // Handle client messages
      socket.on("message", (raw: Buffer | string) => {
        try {
          const msg = JSON.parse(typeof raw === "string" ? raw : raw.toString());
          if (msg.type === "input" && typeof msg.data === "string") {
            backend.write(msg.data);
          } else if (msg.type === "resize" && typeof msg.cols === "number" && typeof msg.rows === "number") {
            backend.resize(msg.cols, msg.rows);
          }
        } catch { /* ignore malformed */ }
      });

      socket.on("close", () => {
        cleanup();
        // Keep terminal alive for reconnection
      });
    });
  });

  // Cleanup on server close
  app.addHook("onClose", async () => {
    backend.kill();
  });
}
