# Pragmatic Method Template (Default)

Hybrid: tests first for critical paths, incremental delivery, feature flags.

## Phases

```
Pre-flight → Foundation → Core → Hardening → Observability → Rollout → Post-launch
```

## DAG Color Coding

| Track | Color | Purpose |
|-------|-------|---------|
| Foundation | Blue `#cce5ff` | DB, models, base infrastructure |
| Core | Green `#d4edda` | Business logic, API endpoints |
| Testing | Yellow `#fff3cd` | Unit, integration, load tests |
| Hardening | Red `#f8d7da` | Edge cases, error handling, security |
| Observability | Purple `#e2d5f1` | Metrics, logging, alerts |
| Rollout | Gray `#d6d8db` | Feature flags, deploy, canary |

## Task Format

```markdown
#### T{NN}: {title}
- **Track:** {track}
- **Depends on:** T{XX}, T{YY}
- **Effort:** {0.5d|1d|2d}
- **Files:** `{file1}`, `{file2}`
- **Done when:** {acceptance criteria}
```

## Critical Path

Highlight with `linkStyle` in Mermaid:
```
linkStyle {indices} stroke:#dc3545,stroke-width:3px
```
