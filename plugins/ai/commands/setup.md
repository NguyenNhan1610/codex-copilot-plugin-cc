---
description: Check whether the AI backend CLI is ready and optionally toggle the stop-time review gate
argument-hint: '[--provider codex|copilot] [--enable-review-gate|--disable-review-gate]'
allowed-tools: Bash(node:*), Bash(npm:*), AskUserQuestion
---

Run:

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/ai-companion.mjs" setup --json $ARGUMENTS
```

Use `--provider codex` or `--provider copilot` to check a specific backend. Without `--provider`, the default provider from config is checked.

If the result says the backend is unavailable and npm is available:
- For Codex: use `AskUserQuestion` to ask whether Claude should install Codex now via `npm install -g @openai/codex`.
- For Copilot: tell the user to install from https://docs.github.com/copilot/how-tos/copilot-cli

If the backend is installed but not authenticated:
- For Codex: preserve the guidance to run `!codex login`.
- For Copilot: preserve the guidance to run `!copilot login`.

Output rules:
- Present the final setup output to the user.
