# Debug & Rescue Commands

## `/ai:debug` — Hypothesis-Based Debugging

```bash
/ai:debug The API returns 500 with special characters
/ai:debug --type performance The dashboard takes 8s to load
/ai:debug --type flaky The registration test fails randomly in CI
/ai:debug --type behavior Users see stale data after profile update
```

Types: `bug` (default), `performance`, `flaky`, `behavior`

Process:
1. **Observe** — Claude agents explore codebase (grep, read, git log)
2. **Hypothesize** — generate 3-5 ranked theories with testable predictions
3. **Test** — Codex agents write and run test scripts (parallel)
4. **Conclude** — Mermaid decision tree + structured diagnosis report

Read-only. Does not apply fixes.

### Investigate a Bug
```bash
/ai:debug The login page shows blank after OAuth redirect
```

## `/ai:rescue` — Delegate to Codex

```bash
/ai:rescue investigate why the tests are failing
/ai:rescue fix the failing test with the smallest safe patch
/ai:rescue --resume apply the top fix
/ai:rescue --model gpt-5.4-mini --effort medium investigate the flaky test
/ai:rescue --background investigate the regression
```

Flags: `--model provider:model`, `--effort level`, `--resume`, `--fresh`, `--background`, `--wait`

Write-capable by default.

### Delegate a Fix
```bash
/ai:rescue fix the N+1 query in the dashboard endpoint
/ai:status
/ai:result
```
