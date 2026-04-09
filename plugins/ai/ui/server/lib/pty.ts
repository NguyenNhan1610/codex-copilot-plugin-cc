import type { IPty } from "node-pty";

export class PtyManager {
  private pty: IPty | null = null;
  private projectRoot: string;
  private listeners: Set<(data: string) => void> = new Set();
  private available = false;
  private spawnFn: typeof import("node-pty").spawn | null = null;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
  }

  async init(): Promise<boolean> {
    try {
      const nodePty = await import("node-pty");
      this.spawnFn = nodePty.spawn;
      this.available = true;
      return true;
    } catch {
      console.warn("node-pty not available — terminal will use basic fallback");
      this.available = false;
      return false;
    }
  }

  isAvailable(): boolean {
    return this.available;
  }

  spawn(): boolean {
    if (!this.spawnFn || this.pty) return !!this.pty;

    const shell = process.env.SHELL || "/bin/bash";
    this.pty = this.spawnFn(shell, [], {
      name: "xterm-256color",
      cols: 120,
      rows: 30,
      cwd: this.projectRoot,
      env: { ...process.env, TERM: "xterm-256color" } as Record<string, string>,
    });

    this.pty.onData((data: string) => {
      for (const listener of this.listeners) {
        try { listener(data); } catch { /* ignore */ }
      }
    });

    this.pty.onExit(({ exitCode }: { exitCode: number }) => {
      for (const listener of this.listeners) {
        try { listener(`\r\n[Process exited with code ${exitCode}]\r\n`); } catch { /* ignore */ }
      }
      this.pty = null;
    });

    return true;
  }

  write(data: string): void {
    this.pty?.write(data);
  }

  resize(cols: number, rows: number): void {
    this.pty?.resize(cols, rows);
  }

  onData(callback: (data: string) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  kill(): void {
    if (this.pty) {
      try { this.pty.kill(); } catch { /* ignore */ }
      this.pty = null;
    }
    this.listeners.clear();
  }
}
