import Fastify from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import fastifyStatic from "@fastify/static";
import fastifyCors from "@fastify/cors";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import { EventBus } from "./lib/event-bus.js";
import { JobWatcher } from "./lib/job-watcher.js";
import { FileWatcher } from "./lib/file-watcher.js";
import { registerEventRoutes } from "./routes/events.js";
import { registerFileRoutes } from "./routes/files.js";
import { registerTerminalRoutes } from "./routes/terminal.js";

// --- CLI args ---

function parseArgs(argv: string[]) {
  let projectRoot = process.cwd();
  let port = 0;

  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--project-root" && argv[i + 1]) {
      projectRoot = path.resolve(argv[++i]);
    } else if (argv[i] === "--port" && argv[i + 1]) {
      port = parseInt(argv[++i], 10);
    }
  }

  return { projectRoot, port };
}

// --- Main ---

async function main() {
  const { projectRoot, port } = parseArgs(process.argv);
  const portFile = path.join(projectRoot, ".claude", ".ui-port");
  const projectDir = path.join(projectRoot, ".claude", "project");

  const app = Fastify({ logger: false });

  await app.register(fastifyCors, { origin: true });
  await app.register(fastifyWebsocket);

  // Serve built client if available — check multiple possible locations
  const candidateDirs = [
    path.join(import.meta.dirname, "..", "client"),       // built server: dist/server/../client
    path.join(import.meta.dirname, "..", "dist", "client"), // dev: server/../dist/client
  ];
  const clientDir = candidateDirs.find((d) => fs.existsSync(path.join(d, "index.html")));
  if (clientDir) {
    await app.register(fastifyStatic, {
      root: clientDir,
      prefix: "/",
      wildcard: false,
    });

    // SPA fallback
    app.setNotFoundHandler((_req, reply) => {
      reply.sendFile("index.html");
    });
  }

  // Event bus
  const bus = new EventBus();

  // Routes
  registerEventRoutes(app, bus);
  registerFileRoutes(app, projectDir);

  // Health
  app.get("/api/health", async () => ({
    status: "ok",
    projectRoot,
    uptime: process.uptime(),
  }));

  // WebSocket event stream
  app.register(async (instance) => {
    instance.get("/ws/events", { websocket: true }, (socket) => {
      bus.subscribe(socket);
      socket.on("close", () => bus.unsubscribe(socket));
    });
  });

  // Terminal
  await registerTerminalRoutes(app, projectRoot);

  // Job watcher
  const pluginData = process.env.CLAUDE_PLUGIN_DATA;
  let jobWatcher: JobWatcher | null = null;
  if (pluginData) {
    jobWatcher = new JobWatcher(pluginData, bus);
    jobWatcher.start();
  }

  // File watcher
  let fileWatcher: FileWatcher | null = null;
  if (fs.existsSync(projectDir)) {
    fileWatcher = new FileWatcher(projectDir, bus);
    fileWatcher.start();
  }

  // Start
  const address = await app.listen({ port, host: "127.0.0.1" });
  const actualPort = (app.server.address() as { port: number }).port;

  // Write port file
  fs.mkdirSync(path.dirname(portFile), { recursive: true });
  fs.writeFileSync(portFile, String(actualPort), "utf8");

  console.log(`Dashboard: ${address}`);
  console.log(`Port file: ${portFile}`);

  // Cleanup
  function shutdown() {
    try { fs.unlinkSync(portFile); } catch {}
    jobWatcher?.stop();
    fileWatcher?.stop();
    app.close().then(() => process.exit(0));
  }

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
