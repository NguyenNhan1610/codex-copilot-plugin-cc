/**
 * Claude CLI wrapper.
 *
 * Spawns `claude` as a child process in non-interactive prompt mode
 * (`-p` with `--output-format json`). Each invocation is stateless
 * unless options.resumeSessionId is provided.
 *
 * The `claude -p --output-format json` envelope looks like:
 * {
 *   "type": "result",
 *   "subtype": "success",
 *   "is_error": false,
 *   "session_id": "...",
 *   "result": "<assistant final text>",
 *   "usage": {...}
 * }
 */

import { spawn } from "node:child_process";

const MAX_ARG_PROMPT_LENGTH = 64 * 1024;

/**
 * Run a Claude CLI command in non-interactive prompt mode.
 *
 * @param {string} cwd - Working directory
 * @param {object} options
 * @param {string} options.prompt - The prompt text
 * @param {string | null} [options.model] - Model override (e.g. claude-sonnet-4-6)
 * @param {boolean} [options.allowAllTools] - Pass --dangerously-skip-permissions so the
 *                                            CLI can use tools without interactive prompts.
 *                                            Set false for pure text-generation (review, council).
 * @param {string | null} [options.resumeSessionId] - Session ID to resume
 * @returns {Promise<{ status: number, stdout: string, stderr: string, sessionId: string | null }>}
 */
export async function runClaudePrompt(cwd, options = {}) {
  const args = [];
  const prompt = options.prompt || "";
  const useStdin = prompt.length > MAX_ARG_PROMPT_LENGTH;

  if (options.resumeSessionId) {
    args.push("--resume", options.resumeSessionId);
  }

  if (useStdin) {
    args.push("-p");
  } else {
    args.push("-p", prompt);
  }

  args.push("--output-format", "json");

  if (options.allowAllTools) {
    args.push("--dangerously-skip-permissions");
  }

  if (options.model) {
    args.push("--model", options.model);
  }

  return new Promise((resolve, reject) => {
    const child = spawn("claude", args, {
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

    child.stdout.on("data", (chunk) => {
      stdoutBuffer += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderrBuffer += chunk.toString();
    });

    child.on("error", (error) => {
      reject(error);
    });

    child.on("close", (code) => {
      let sessionId = null;
      let finalText = "";
      let parseError = null;

      const trimmed = stdoutBuffer.trim();
      if (trimmed) {
        try {
          const envelope = JSON.parse(trimmed);
          sessionId = envelope.session_id || null;
          finalText = typeof envelope.result === "string" ? envelope.result : "";
          if (envelope.is_error) {
            parseError = `Claude reported error: ${finalText || envelope.error || "unknown"}`;
          }
        } catch (err) {
          parseError = `Failed to parse Claude JSON output: ${err.message}`;
          finalText = trimmed;
        }
      } else {
        parseError = "Claude produced no output.";
      }

      const status = code !== 0 ? (code ?? 1) : (parseError ? 1 : 0);
      const stderr = stderrBuffer.trim() || (parseError || "");

      resolve({
        status,
        stdout: finalText,
        stderr,
        sessionId
      });
    });
  });
}
