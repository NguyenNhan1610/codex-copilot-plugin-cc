/**
 * Copilot CLI wrapper.
 *
 * Spawns `copilot` as a child process in non-interactive prompt mode
 * and handles JSONL output parsing, streaming, and process lifecycle.
 */

import { spawn } from "node:child_process";
import { createInterface } from "node:readline";

const MAX_ARG_PROMPT_LENGTH = 64 * 1024;

/**
 * Run a Copilot CLI command in non-interactive prompt mode.
 *
 * @param {string} cwd - Working directory
 * @param {object} options
 * @param {string} options.prompt - The prompt text
 * @param {string | null} [options.model] - Model override
 * @param {string | null} [options.effort] - Reasoning effort level
 * @param {boolean} [options.allowAllTools] - Whether to allow all tools
 * @param {boolean} [options.silent] - Silent mode (only agent output)
 * @param {string | null} [options.resumeSessionId] - Session ID to resume
 * @param {((update: string | object) => void) | null} [options.onProgress] - Progress callback
 * @returns {Promise<{ status: number, stdout: string, stderr: string, sessionId: string | null }>}
 */
export async function runCopilotPrompt(cwd, options = {}) {
  const args = [];
  const prompt = options.prompt || "";
  const useStdin = prompt.length > MAX_ARG_PROMPT_LENGTH;

  if (options.resumeSessionId) {
    args.push(`--resume=${options.resumeSessionId}`);
  }

  if (!useStdin) {
    args.push("-p", prompt);
  }

  args.push("--output-format", "json");

  if (options.allowAllTools !== false) {
    args.push("--allow-all-tools");
  }

  if (options.silent !== false) {
    args.push("-s");
  }

  if (options.model) {
    args.push("--model", options.model);
  }

  if (options.effort) {
    args.push("--effort", options.effort);
  }

  return new Promise((resolve, reject) => {
    const child = spawn("copilot", args, {
      cwd,
      env: process.env,
      stdio: [useStdin ? "pipe" : "ignore", "pipe", "pipe"],
      windowsHide: true
    });

    if (useStdin) {
      child.stdin.on("error", () => {});
      child.stdin.write(prompt);
      child.stdin.end();
    }

    let stdoutBuffer = "";
    let stderrBuffer = "";
    let sessionId = null;
    let lastMessage = "";

    let messageBuffer = "";

    const rl = createInterface({ input: child.stdout });
    rl.on("line", (line) => {
      stdoutBuffer += `${line}\n`;
      try {
        const event = JSON.parse(line);
        if (event.data?.sessionId) {
          sessionId = event.data.sessionId;
        }
        // Accumulate assistant message deltas
        if (event.type === "assistant.message_delta" && event.data?.deltaContent) {
          messageBuffer += event.data.deltaContent;
          if (options.onProgress) {
            options.onProgress(event.data.deltaContent);
          }
        }
        // Tool calls and command output as progress
        if (event.type === "assistant.tool.start" && event.data?.name) {
          if (options.onProgress) {
            options.onProgress(`Running tool: ${event.data.name}`);
          }
        }
        // Turn end: finalize
        if (event.type === "assistant.turn_end") {
          if (messageBuffer) {
            lastMessage = messageBuffer;
          }
        }
        // Legacy format compatibility
        if (event.type === "message" && event.content) {
          lastMessage = event.content;
        }
        if (event.type === "result" && event.content) {
          lastMessage = event.content;
        }
      } catch {
        // Non-JSON line, accumulate as raw output
        if (line.trim()) {
          if (!lastMessage) {
            lastMessage = line;
          }
        }
      }
    });

    child.stderr.on("data", (chunk) => {
      stderrBuffer += chunk.toString();
    });

    child.on("error", (error) => {
      reject(error);
    });

    child.on("close", (code) => {
      rl.close();
      // Use accumulated message delta if turn_end wasn't received
      if (!lastMessage && messageBuffer) {
        lastMessage = messageBuffer;
      }
      resolve({
        status: code ?? 1,
        stdout: lastMessage || stdoutBuffer.trim(),
        stderr: stderrBuffer.trim(),
        sessionId
      });
    });
  });
}
