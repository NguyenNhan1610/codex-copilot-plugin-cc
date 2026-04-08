/**
 * Codex backend implementation.
 *
 * Wraps the existing codex.mjs library functions into the Backend interface
 * so they can be dispatched generically by the ai-companion script.
 */

import {
  buildPersistentTaskThreadName,
  DEFAULT_CONTINUE_PROMPT,
  findLatestTaskThread,
  getCodexAvailability,
  getCodexLoginStatus,
  getSessionRuntimeStatus,
  interruptAppServerTurn,
  parseStructuredOutput,
  readOutputSchema,
  runAppServerReview,
  runAppServerTurn
} from "../codex.mjs";

/**
 * Create and return the Codex backend object.
 * @returns {import("../backend.mjs").Backend}
 */
export function createCodexBackend() {
  return {
    name: "codex",
    displayName: "Codex",
    commandPrefix: "codex",
    supportsNativeReview: true,

    getAvailability(cwd) {
      return getCodexAvailability(cwd);
    },

    getLoginStatus(cwd) {
      return getCodexLoginStatus(cwd);
    },

    getSessionRuntimeStatus(env, cwd) {
      return getSessionRuntimeStatus(env, cwd);
    },

    async runReview(cwd, options) {
      return runAppServerReview(cwd, options);
    },

    async runTurn(cwd, options) {
      return runAppServerTurn(cwd, options);
    },

    async interruptTurn(cwd, { threadId, turnId }) {
      return interruptAppServerTurn(cwd, { threadId, turnId });
    },

    async findLatestTaskThread(cwd) {
      return findLatestTaskThread(cwd);
    },

    ensureReady(cwd) {
      const authStatus = getCodexLoginStatus(cwd);
      if (!authStatus.available) {
        throw new Error(
          "Codex CLI is not installed or is missing required runtime support. Install it with `npm install -g @openai/codex`, then rerun `/ai:setup`."
        );
      }
      if (!authStatus.loggedIn) {
        throw new Error("Codex CLI is not authenticated. Run `!codex login` and retry.");
      }
    },

    parseStructuredOutput(rawOutput, fallback) {
      return parseStructuredOutput(rawOutput, fallback);
    },

    readOutputSchema(schemaPath) {
      return readOutputSchema(schemaPath);
    },

    buildPersistentTaskThreadName(prompt) {
      return buildPersistentTaskThreadName(prompt);
    },

    DEFAULT_CONTINUE_PROMPT
  };
}
