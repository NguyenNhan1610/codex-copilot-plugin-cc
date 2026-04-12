---
name: architecture-decision-record
description: Generate deep technical Architecture Decision Records with Mermaid diagrams. Use when user wants to document an architecture decision, compare design alternatives, evaluate trade-offs, create ADR, or asks about architecture decisions, system design documentation, or technical decision records.
user-invocable: true
---

# Architecture Decision Records

Generate comprehensive, evidence-based ADRs with visual Mermaid diagrams grounded in your actual codebase.

## Command

```bash
/ai:architecture-decision-record Should we use Redis or Memcached for session caching?
/ai:architecture-decision-record --scope api Should we use REST or GraphQL for the mobile API?
/ai:architecture-decision-record --scope data Should we normalize the orders table or use JSONB?
/ai:architecture-decision-record --scope system Should we move to microservices or keep the monolith?
/ai:architecture-decision-record --scope infra Should we use ECS or Kubernetes for container orchestration?
/ai:architecture-decision-record --scope module Should we extract the auth logic into a separate service?
```

## Scopes

| Scope | Focus |
|-------|-------|
| `module` (default) | Component/module-level decisions |
| `system` | System-wide architecture |
| `api` | API design (REST, GraphQL, gRPC, protocols) |
| `data` | Data model, storage, schema design |
| `infra` | Infrastructure, deployment, operations |

## What You Get

1. **Context** grounded in your actual code (not generic advice)
2. **Decision drivers** tied to real metrics or constraints
3. **2-3 options** with deep technical analysis, pros/cons, risks, migration cost
4. **Comparison table** across quality attributes
5. **3 Mermaid diagrams** rendered as SVG + raw code:
   - Current state architecture
   - Proposed state architecture
   - Comparison/diff diagram
6. **Implementation plan** with affected files and rollback strategy
7. **Architectural Acceptance Criteria (AAC)** — system-level invariants as testable predicates, traced by downstream FDRs
8. **Existing System Contracts** — types, interfaces, signatures that must not break (ADR-REQ-1)
9. **Integration Point Signatures** — exact function signatures at module boundaries (ADR-REQ-2)
10. **Invariants as Executable Assertions** — runnable predicates, not just prose (ADR-REQ-3)
11. **New Public Interface Types** — canonical types imported by both tests and impl (ADR-REQ-4)
12. **Module Boundary & File Path Map** — exact paths for correct imports (ADR-REQ-5)

## ADR Format

Follows the standard ADR template: Context, Decision Drivers, Current Architecture, **Existing Contracts, Integration Points, Invariants,** Options, Comparison, Decision, Consequences, **AAC Table, New Types, Module Paths,** Implementation Plan, References.

Every claim is grounded in the codebase. Files and line numbers are referenced. Diagrams include raw Mermaid source in collapsible `<details>` blocks for future editing.

## Template Reference

See `references/adr-template.md` for the complete ADR output format with:
- Full section structure with examples for every field
- Example Mermaid diagrams (current state, proposed state, comparison)
- Comparison table format with quality attributes
- Implementation plan with rollback strategy and verification criteria
- Guidance on specificity (no vague assessments — every claim needs evidence)
