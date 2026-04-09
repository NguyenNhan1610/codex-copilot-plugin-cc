---
name: lint-check
description: Batch lint and typecheck for Python and TypeScript projects. Use when user asks to lint, typecheck, check code quality, run ruff, eslint, pyright, tsc, or wants to verify code before committing. Also triggers on Stop hook automatically.
user-invocable: true
---

# Lint & Typecheck

Batch lint and typecheck all recently changed files. Runs automatically on Stop hook, or on demand via `/ai:lint`.

## Automatic (Stop Hook)

When Claude finishes a task, the Stop hook:
1. Reads cascade log for files changed in the latest session segment
2. Deduplicates and filters (excludes tests, node_modules, .venv, etc.)
3. Runs appropriate linters in parallel
4. **Blocks stop if errors found** — Claude must fix before completing

## Manual Command

```bash
/ai:lint                  # Lint files from current cascade
/ai:lint --all            # Lint entire project
/ai:lint --fix            # Auto-fix safe issues (ruff --fix, eslint --fix)
/ai:lint src/api.py       # Lint specific files
```

## Tools Used

### Python (*.py)
| Tool | What | Speed |
|------|------|-------|
| `ruff check` | Lint, security (bandit), imports, style, bugbear | ~200ms |
| `pyright` | Type checking | ~5-10s |
| `python3 -m py_compile` | Syntax verification | ~50ms |

### TypeScript/JS (*.ts, *.tsx, *.js, *.jsx)
| Tool | What | Speed |
|------|------|-------|
| `eslint` | Lint, best practices, security | ~3-5s |
| `tsc --noEmit` | Type checking | ~5-15s |

## Bundled Configs

Production-level configs at `plugins/ai/lint-configs/`:
- `ruff.toml` — E, F, W, I, N, B, S, C4, DTZ, PIE, PT, RET, SIM, TCH, PERF, RUF rules
- `eslint.config.mjs` — errors, best practices, security, no-eval, eqeqeq, prefer-const
- `pyrightconfig.json` — standard mode, missing imports, optional access, unused vars
- `tsconfig.lint.json` — strict, noEmit, noUnusedLocals, noUncheckedIndexedAccess

Project configs take priority if they exist (eslintrc, tsconfig.json, pyproject.toml).

## Excluded from Linting

tests/, .venv/, node_modules/, .next/, dist/, build/, migrations/, __pycache__/, coverage/, *.min.js, *.lock
