---
name: implementation-plan
description: Generate DAG-based implementation plans from FDR or ADR documents. Use when user wants to create an implementation checklist, break down a feature into tasks with dependencies, identify critical path, plan parallel work tracks, or convert an FDR/ADR into actionable tasks.
user-invocable: true
---

# Implementation Plans

Transform FDR/ADR documents into DAG-based task plans with dependencies, parallel tracks, and critical path analysis.

## Command

```bash
/ai:implement --from .claude/project/fdr/FDR-03-session-caching.md
/ai:implement --from .claude/project/adr/ADR-05-redis.md
/ai:implement --from .claude/project/fdr/FDR-03-session-caching.md --method tdd
/ai:implement --from .claude/project/fdr/FDR-03-session-caching.md --method agile
```

## Methods

| Method | Description |
|--------|-------------|
| `pragmatic` (default) | Tests first for critical paths, incremental delivery, feature flags |
| `tdd` | Every task paired with test-first: red → green → refactor |
| `agile` | Sprint-sized user stories with acceptance criteria |
| `kanban` | Flat prioritized backlog with WIP limits |
| `shape-up` | 6-week appetite with scopes and hill charts |

## Output

Saved to `.claude/project/implementation_plans/IMPL-{NN}-{slug}.md` with:
- Task DAG rendered as Mermaid (SVG + raw source)
- Critical path identified and highlighted
- Parallel tracks mapped
- Per-task details: ID, files, dependencies, effort, done criteria
- Risk mitigation traceability back to source FDR/ADR

## References

- `references/impl-template.md` — full output format with examples
- `references/method-pragmatic.md` — default hybrid method
- `references/method-tdd.md` — test-driven development
- `references/method-agile.md` — scrum/sprint planning
- `references/method-kanban.md` — flow-based with WIP limits
- `references/method-shape-up.md` — fixed appetite, variable scope
