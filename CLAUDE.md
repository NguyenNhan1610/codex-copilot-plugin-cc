
## AI Companion Project Structure

- `.claude/project/adr/` — Architecture Decision Records (ADR-XX-{slug}.md)
- `.claude/project/fdr/` — Feature Development Records (FDR-XX-{slug}.md)
- `.claude/project/implementation_plans/` — DAG task plans (IMPL-XX-{slug}.md)
- `.claude/project/cascades/` — Implementation records with traceability (REC-XX-{slug}.md)
- `.claude/project/traces/` — Traceability reports with coverage verification (TRACE-XX-{slug}.md)
- `.claude/project/knowledge/` — Reusable knowledge: patterns, lessons, decisions, antipatterns
- `.claude/project/todos/` — Task tracking with status + tickets (TODO-XX-{slug}.yaml)
- `.claude/project/scripts/hypothesis/` — Hypothesis test scripts (H{NN}_{slug}.py + _result.json)
- `.claude/cascades/` — Auto-generated change log (timestamps + file:line, gitignored)
- `.claude/rules/` — On-demand coding rules by stack (install via /ai:setup --install-rules)

Document flow: ADR → FDR → IMPL → TODO → code → test → lint → cascade → review
