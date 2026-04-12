---
name: feature-development-record
description: Generate Feature Development Records with edge cases, risk assessment against existing codebase, impact analysis, and Mermaid diagrams. Use when user wants to plan a new feature, analyze implementation impact, assess risks of new feature on existing code, create a feature spec, or asks about feature planning, risk assessment, edge case analysis, or implementation impact.
user-invocable: true
---

# Feature Development Records

Plan features with deep codebase analysis, systematic edge case enumeration, risk assessment against existing codebase, and visual implementation roadmaps.

## Command

```bash
/ai:feature-development-record Add multi-tenant session caching
/ai:feature-development-record --scope api Add rate limiting to the public API
/ai:feature-development-record --scope frontend Add real-time notifications to the dashboard
/ai:feature-development-record --scope fullstack Add user impersonation for support agents
/ai:feature-development-record --scope data Migrate from SQL to event sourcing for orders
/ai:feature-development-record --scope backend,lite Add session caching (no ADR, lite flow)
/ai:feature-development-record --scope frontend,lite Add notifications (no ADR, lite flow)
```

## Scopes

The `--scope` flag is composable: `{feature_scope}[,lite]`

| Scope | Focus |
|-------|-------|
| `backend` (default) | Server-side feature implementation |
| `frontend` | Client/UI feature |
| `fullstack` | Spans client and server |
| `api` | API endpoint or contract changes |
| `data` | Data model or storage changes |

| Flow Modifier | Effect |
|--------------|--------|
| *(default)* | Full flow: inherits AAC from source ADR, produces TP reference |
| `lite` | Lite flow: no ADR/TP, self-defines Lite Invariants, FAC traces_to_aac = "—" |

## Process

1. **Map** — explore codebase: dependencies, API surface, test coverage, existing patterns
2. **Design** — propose implementation with affected code paths and new components
3. **Stress-test** — enumerate edge cases: input boundaries, concurrency, auth, scale, external deps
4. **Assess** — risk matrix covering both feature-specific risks AND risks to existing codebase (regressions, contract breaks, perf degradation, dependency conflicts)
5. **Plan** — implementation steps, testing strategy, rollout plan, observability

## Output

Saved to `.claude/project/fdr/FDR-{NN}-{slug}.md` with:
- **Feature Acceptance Criteria (FAC)** table tracing to source ADR's AAC (or standalone with Lite Invariants)
- **Function Contracts** with exact signatures for all new/modified functions (FDR-REQ-1)
- **State Transition I/O Tables** — each row is one test case (FDR-REQ-2)
- **Code references** with line numbers and current signatures (FDR-REQ-3)
- **Edge cases** with concrete test data and unique IDs (FDR-REQ-4)
- **ASCII Wireframes** for each key screen/view with element-to-FAC mapping (if UI in scope)
- **UI Component Props & Test Selectors** derived from wireframes (FDR-REQ-5, if applicable)
- **Canonical Test Fixtures** shared by tests and implementation (FDR-REQ-6)
- Dependency graph + data flow diagrams (Mermaid, embedded inline)
- Edge case table by category (input, concurrency, auth, external, scale)
- **Risks to existing codebase** — regressions, contract breaks, perf degradation, dependency conflicts, data migration risks
- Risk assessment matrix with quadrant chart (feature-specific + existing codebase risks)
- Backward compatibility analysis
- Testing strategy with priority levels
- Implementation timeline (Gantt chart)
- Rollout plan with canary metrics and rollback triggers
- Observability plan (metrics, logs, alerts, dashboards)

## References

- `references/fdr-template.md` — core FDR output format (always loaded)
- `references/scope-frontend.md` — wireframes + UI component props (frontend/fullstack only)
- `references/flow-full.md` — ADR inheritance guidance (full flow, default)
- `references/flow-lite.md` — lite invariants + "—" field guidance (lite flow)
