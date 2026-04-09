# Kanban Method Template

Flat prioritized backlog with WIP limits. Pull-based.

## Board Columns

```
Backlog → In Progress (WIP: 3) → Review (WIP: 2) → Done
```

## Task Format

```markdown
### T{NN}: {title}
**Priority:** P0 | P1 | P2
**Track:** {track name}
**Blocked by:** T{XX} (or "none")
**WIP note:** {track} has max 2 in-progress
```

## Prioritized Backlog

| Priority | Task | Track | Blocked by |
|----------|------|-------|-----------|
| P0 | T02: DB migration | Foundation | — |
| P0 | T03: Write model tests | Testing | — |
| P0 | T01: Feature flag | Rollout | — |
| P1 | T04: Implement model | Foundation | T02, T03 |
| P1 | T06: Service layer | Core | T04 |
| P2 | T10: Metrics | Observability | T08 |

## Rule

Pick the highest-priority unblocked task. Never exceed WIP limit per track.
