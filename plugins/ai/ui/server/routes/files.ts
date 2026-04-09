import type { FastifyInstance } from "fastify";
import fs from "node:fs";
import path from "node:path";
import type { FileEntry } from "../../shared/types.js";

const MAX_FILE_SIZE = 1024 * 1024; // 1MB

function isPathSafe(projectDir: string, requestedPath: string): boolean {
  const resolved = path.resolve(projectDir, requestedPath);
  return resolved.startsWith(projectDir + path.sep) || resolved === projectDir;
}

function buildTree(dir: string, basePath: string = ""): FileEntry[] {
  const entries: FileEntry[] = [];

  let items: fs.Dirent[];
  try {
    items = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return entries;
  }

  for (const item of items.sort((a, b) => a.name.localeCompare(b.name))) {
    if (item.name.startsWith(".")) continue;

    const fullPath = path.join(dir, item.name);
    const relativePath = path.join(basePath, item.name);

    if (item.isDirectory()) {
      entries.push({
        name: item.name,
        type: "dir",
        path: relativePath,
        children: buildTree(fullPath, relativePath),
      });
    } else if (item.isFile()) {
      const stat = fs.statSync(fullPath);
      entries.push({
        name: item.name,
        type: "file",
        path: relativePath,
        size: stat.size,
        modified: stat.mtime.toISOString(),
      });
    }
  }

  return entries;
}

export function registerFileRoutes(app: FastifyInstance, projectDir: string): void {
  // File tree
  app.get("/api/files/tree", async () => {
    if (!fs.existsSync(projectDir)) {
      return [];
    }
    return buildTree(projectDir);
  });

  // Read file
  app.get("/api/files/*", async (request, reply) => {
    const filePath = (request.params as { "*": string })["*"];
    if (!filePath || !isPathSafe(projectDir, filePath)) {
      return reply.status(403).send({ error: "Path not allowed" });
    }

    const fullPath = path.resolve(projectDir, filePath);
    if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
      return reply.status(404).send({ error: "File not found" });
    }

    const content = fs.readFileSync(fullPath, "utf8");
    return reply.type("text/plain").send(content);
  });

  // Write file
  app.put("/api/files/*", async (request, reply) => {
    const filePath = (request.params as { "*": string })["*"];
    if (!filePath || !isPathSafe(projectDir, filePath)) {
      return reply.status(403).send({ error: "Path not allowed" });
    }

    const content = request.body as string;
    if (typeof content !== "string") {
      return reply.status(400).send({ error: "Body must be string" });
    }
    if (Buffer.byteLength(content) > MAX_FILE_SIZE) {
      return reply.status(413).send({ error: "File too large (max 1MB)" });
    }

    const fullPath = path.resolve(projectDir, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, "utf8");

    return reply.status(204).send();
  });

  // Delete file
  app.delete("/api/files/*", async (request, reply) => {
    const filePath = (request.params as { "*": string })["*"];
    if (!filePath || !isPathSafe(projectDir, filePath)) {
      return reply.status(403).send({ error: "Path not allowed" });
    }

    const fullPath = path.resolve(projectDir, filePath);
    if (!fs.existsSync(fullPath)) {
      return reply.status(404).send({ error: "Not found" });
    }

    fs.rmSync(fullPath, { recursive: true });
    return reply.status(204).send();
  });

  // Create directory
  app.post("/api/files/mkdir/*", async (request, reply) => {
    const dirPath = (request.params as { "*": string })["*"];
    if (!dirPath || !isPathSafe(projectDir, dirPath)) {
      return reply.status(403).send({ error: "Path not allowed" });
    }

    const fullPath = path.resolve(projectDir, dirPath);
    fs.mkdirSync(fullPath, { recursive: true });

    return reply.status(201).send({ path: dirPath });
  });
}
