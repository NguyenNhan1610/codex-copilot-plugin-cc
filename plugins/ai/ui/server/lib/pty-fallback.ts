import { spawn, type ChildProcess } from "node:child_process";

/**
 * Fallback terminal when node-pty is not available.
 * Uses child_process.spawn with script command for basic PTY emulation.
 * Limitations: no resize, no raw mode, basic I/O only.
 */
export class PtyFallback {
  private proc: ChildProcess | null = null;
  private projectRoot: string;
  private listeners: Set<(data: string) => void> = new Set();

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
  }

  spawn(): boolean {
    if (this.proc) return true;

    const shell = process.env.SHELL || "/bin/bash";

    // Use script command for basic PTY emulation on Unix
    this.proc = spawn("script", ["-q", "/dev/null", shell], {
      cwd: this.projectRoot,
      env: { ...process.env, TERM: "xterm-256color" },
      stdio: ["pipe", "pipe", "pipe"],
    });

    this.proc.stdout?.on("data", (data: Buffer) => {
      const str = data.toString();
      for (const listener of this.listeners) {
        try { listener(str); } catch { /* ignore */ }
      }
    });

    this.proc.stderr?.on("data", (data: Buffer) => {
      const str = data.toString();
      for (const listener of this.listeners) {
        try { listener(str); } catch { /* ignore */ }
      }
    });

    this.proc.on("exit", (code) => {
      for (const listener of this.listeners) {
        try { listener(`\r\n[Process exited with code ${code ?? 0}]\r\n`); } catch { /* ignore */ }
      }
      this.proc = null;
    });

    return true;
  }

  write(data: string): void {
    this.proc?.stdin?.write(data);
  }

  resize(_cols: number, _rows: number): void {
    // Not supported in fallback mode
  }

  onData(callback: (data: string) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  kill(): void {
    if (this.proc) {
      try { this.proc.kill(); } catch { /* ignore */ }
      this.proc = null;
    }
    this.listeners.clear();
  }
}
