import fs from "node:fs";
import type { EventBus } from "./event-bus.js";

export class FileWatcher {
  private projectDir: string;
  private bus: EventBus;
  private watcher: fs.FSWatcher | null = null;
  private debounceTimers = new Map<string, ReturnType<typeof setTimeout>>();
  private readonly DEBOUNCE_MS = 300;

  constructor(projectDir: string, bus: EventBus) {
    this.projectDir = projectDir;
    this.bus = bus;
  }

  start(): void {
    try {
      this.watcher = fs.watch(this.projectDir, { recursive: true }, (eventType, filename) => {
        if (!filename) return;
        this.handleChange(filename);
      });
    } catch {
      // Directory may not exist or not support recursive watch
    }
  }

  private handleChange(filename: string): void {
    const existing = this.debounceTimers.get(filename);
    if (existing) clearTimeout(existing);

    this.debounceTimers.set(
      filename,
      setTimeout(() => {
        this.debounceTimers.delete(filename);
        this.bus.emit({
          id: "",
          ts: new Date().toISOString(),
          type: "tool_result",
          tool: "FileWatcher",
          message: `File changed: ${filename}`,
          meta: { file: filename, source: "file_watcher" },
        });
      }, this.DEBOUNCE_MS)
    );
  }

  stop(): void {
    if (this.watcher) {
      try { this.watcher.close(); } catch {}
      this.watcher = null;
    }
    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer);
    }
    this.debounceTimers.clear();
  }
}
