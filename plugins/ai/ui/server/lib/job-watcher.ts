import fs from "node:fs";
import path from "node:path";
import type { EventBus } from "./event-bus.js";

export class JobWatcher {
  private pluginData: string;
  private bus: EventBus;
  private watchers: fs.FSWatcher[] = [];
  private debounceTimers = new Map<string, ReturnType<typeof setTimeout>>();
  private readonly DEBOUNCE_MS = 500;

  constructor(pluginData: string, bus: EventBus) {
    this.pluginData = pluginData;
    this.bus = bus;
  }

  start(): void {
    // Find state directories
    const stateDir = path.join(this.pluginData, "state");
    if (!fs.existsSync(stateDir)) return;

    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(stateDir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const jobsDir = path.join(stateDir, entry.name, "jobs");
      if (!fs.existsSync(jobsDir)) continue;

      try {
        const watcher = fs.watch(jobsDir, (eventType, filename) => {
          if (!filename) return;
          this.handleChange(jobsDir, filename);
        });
        this.watchers.push(watcher);
      } catch {
        // Directory may disappear
      }
    }
  }

  private handleChange(jobsDir: string, filename: string): void {
    // Debounce per file
    const key = `${jobsDir}/${filename}`;
    const existing = this.debounceTimers.get(key);
    if (existing) clearTimeout(existing);

    this.debounceTimers.set(
      key,
      setTimeout(() => {
        this.debounceTimers.delete(key);
        this.emitJobUpdate(jobsDir, filename);
      }, this.DEBOUNCE_MS)
    );
  }

  private emitJobUpdate(jobsDir: string, filename: string): void {
    const filePath = path.join(jobsDir, filename);
    if (!fs.existsSync(filePath)) return;

    try {
      const content = fs.readFileSync(filePath, "utf8");

      // Try to parse as JSON state file
      if (filename.endsWith(".json")) {
        const state = JSON.parse(content);
        this.bus.emit({
          id: "",
          ts: new Date().toISOString(),
          type: "job_update",
          meta: {
            jobId: state.jobId ?? filename.replace(".json", ""),
            kind: state.kind ?? "unknown",
            status: state.status ?? "unknown",
            phase: state.phase ?? "",
            summary: state.summary ?? "",
            elapsed: state.elapsed ?? 0,
            sessionId: state.sessionId ?? null,
          },
        });
        return;
      }

      // For .log files, extract last few lines for progress
      if (filename.endsWith(".log")) {
        const lines = content.split("\n").filter(Boolean);
        const lastLines = lines.slice(-5);
        const jobId = filename.replace(".log", "");

        this.bus.emit({
          id: "",
          ts: new Date().toISOString(),
          type: "job_update",
          meta: {
            jobId,
            progress: lastLines,
          },
        });
      }
    } catch {
      // Ignore parse errors
    }
  }

  stop(): void {
    for (const watcher of this.watchers) {
      try { watcher.close(); } catch {}
    }
    this.watchers = [];
    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer);
    }
    this.debounceTimers.clear();
  }
}
