---
name: todo-tracking
description: Track implementation tasks with status, tickets, evidence, and traceability to IMPL/FDR/ADR documents. Use when user wants to track task progress, create todos, update task status, view kanban board, sync from cascade, link tickets, or asks about task tracking, todos, progress, blockers.
user-invocable: true
---

# Task Tracking

Structured TODO management with status, evidence, external ticket links, and full traceability to planning documents.

## Command

```bash
/ai:todo                              # Show Kanban board
/ai:todo board                        # Same as above
/ai:todo --from IMPL-03               # Generate TODOs from IMPL plan
/ai:todo update T06 --status complete # Update task status
/ai:todo update T06 --ticket JIRA-125 # Link external ticket
/ai:todo --sync                       # Auto-sync from cascade log
```

## Task Schema

Each task has:
- **status**: `pending` | `in-progress` | `complete` | `blocked` | `cancelled`
- **priority**: `P0` (must do) | `P1` (should do) | `P2` (nice to have)
- **track**: foundation | core | testing | hardening | observability | rollout
- **evidence**: file:line citations proving completion
- **references**: links to IMPL tasks, FDR edge cases, FDR risks
- **tests**: test coverage with pass/fail status
- **ticket**: external issue tracker link (JIRA, GitHub, Linear)
- **depends_on / blocked_by**: task dependency tracking

## Document Flow

```
IMPL (task DAG) → /ai:todo --from IMPL-03 → TODO (live tracking)
                                                ↓
code changes → cascade log → /ai:todo --sync → auto-update status
                                                ↓
                                          /ai:todo board → Kanban view
```

## Files

- `.claude/project/todos/TODO-{NN}-{slug}.yaml` — task tracking files
- `.claude/project/todos/board.svg` — rendered Kanban board

## Schema Reference

See `references/todo-schema.yaml` for the full YAML schema with field types, valid values, status transitions, and examples.
