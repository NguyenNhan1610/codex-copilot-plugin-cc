/**
 * Copilot backend implementation.
 *
 * Implements the Backend interface for the GitHub Copilot CLI (`copilot`).
 * Unlike Codex, Copilot uses a stateless CLI model: each invocation spawns
 * `copilot -p <prompt>` with `--output-format json`.
 */

import fs from "node:fs";
import path from "node:path";

import { binaryAvailable, runCommand } from "../process.mjs";
import { readJsonFile } from "../fs.mjs";
import { runCopilotPrompt } from "./copilot-cli.mjs";

const DEFAULT_CONTINUE_PROMPT =
  "Continue from where you left off. Pick the next highest-value step and follow through until the task is resolved.";

/**
 * Create and return the Copilot backend object.
 * @returns {import("../backend.mjs").Backend}
 */
export function createCopilotBackend() {
  return {
    name: "copilot",
    displayName: "Copilot",
    commandPrefix: "copilot",
    supportsNativeReview: false,

    getAvailability(cwd) {
      return binaryAvailable("copilot", ["--version"], { cwd });
    },

    getLoginStatus(cwd) {
      const availability = binaryAvailable("copilot", ["--version"], { cwd });
      if (!availability.available) {
        return {
          available: false,
          loggedIn: false,
          detail: availability.detail
        };
      }

      // Check auth by running `copilot login` with no-op to see status.
      // The copilot CLI stores credentials in ~/.copilot/ config.
      const configDir = path.join(process.env.HOME || process.env.USERPROFILE || "~", ".copilot");
      const hasConfig = fs.existsSync(configDir);

      if (!hasConfig) {
        return {
          available: true,
          loggedIn: false,
          detail: "No Copilot configuration found. Run `!copilot login` to authenticate."
        };
      }

      // Try a lightweight probe to verify auth is valid
      const result = runCommand("copilot", ["version"], { cwd });
      if (result.error) {
        return {
          available: true,
          loggedIn: false,
          detail: result.error.message
        };
      }

      return {
        available: true,
        loggedIn: true,
        detail: `${availability.detail}; authenticated`
      };
    },

    getSessionRuntimeStatus() {
      return {
        mode: "direct",
        label: "direct invocation",
        detail: "Copilot CLI runs on demand. Each command spawns a new process.",
        endpoint: null
      };
    },

    async runReview(cwd, options) {
      const onProgress = options.onProgress;
      if (onProgress) {
        onProgress({ message: "Starting Copilot review.", phase: "starting" });
      }

      const result = await runCopilotPrompt(cwd, {
        prompt: options.prompt || "",
        model: options.model,
        allowAllTools: true,
        silent: true,
        onProgress: onProgress ? (msg) => onProgress({ message: msg, phase: "reviewing" }) : null
      });

      return {
        status: result.status,
        threadId: result.sessionId,
        sourceThreadId: null,
        turnId: null,
        reviewText: result.stdout,
        stderr: result.stderr,
        reasoningSummary: [],
        finalMessage: result.stdout,
        error: result.status !== 0 ? { message: result.stderr || "Copilot review failed." } : null
      };
    },

    async runTurn(cwd, options) {
      const onProgress = options.onProgress;
      if (onProgress) {
        onProgress({ message: "Starting Copilot task.", phase: "starting" });
      }

      const result = await runCopilotPrompt(cwd, {
        prompt: options.prompt || options.defaultPrompt || "",
        model: options.model,
        effort: options.effort,
        allowAllTools: true,
        silent: true,
        resumeSessionId: options.resumeThreadId || null,
        onProgress: onProgress ? (msg) => onProgress({ message: msg, phase: "running" }) : null
      });

      return {
        status: result.status,
        threadId: result.sessionId,
        turnId: null,
        finalMessage: result.stdout,
        stderr: result.stderr,
        reasoningSummary: [],
        touchedFiles: [],
        error: result.status !== 0 ? { message: result.stderr || "Copilot task failed." } : null
      };
    },

    async interruptTurn() {
      return {
        attempted: false,
        interrupted: false,
        transport: null,
        detail: "Copilot CLI does not support turn interruption. Kill the process instead."
      };
    },

    async findLatestTaskThread() {
      // Copilot doesn't expose thread listing via CLI
      return null;
    },

    ensureReady(cwd) {
      const availability = binaryAvailable("copilot", ["--version"], { cwd });
      if (!availability.available) {
        throw new Error(
          "Copilot CLI is not installed. Install it from https://docs.github.com/copilot/how-tos/copilot-cli, then rerun `/ai:setup`."
        );
      }
      // For Copilot, we check config directory existence as a login proxy
      const configDir = path.join(process.env.HOME || process.env.USERPROFILE || "~", ".copilot");
      if (!fs.existsSync(configDir)) {
        throw new Error("Copilot CLI is not authenticated. Run `!copilot login` and retry.");
      }
    },

    parseStructuredOutput(rawOutput, fallback) {
      if (!rawOutput || typeof rawOutput !== "string") {
        return {
          parsed: null,
          rawOutput: rawOutput ?? "",
          parseError: fallback?.failureMessage || "No output received."
        };
      }

      try {
        const parsed = JSON.parse(rawOutput);
        return { parsed, rawOutput, parseError: null };
      } catch {
        return { parsed: null, rawOutput, parseError: null };
      }
    },

    readOutputSchema(schemaPath) {
      return readJsonFile(schemaPath);
    },

    buildPersistentTaskThreadName(prompt) {
      if (!prompt) return null;
      const short = prompt.length > 60 ? `${prompt.slice(0, 57)}...` : prompt;
      return `Copilot Companion Task: ${short}`;
    },

    DEFAULT_CONTINUE_PROMPT
  };
}
