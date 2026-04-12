
## AI Companion Project Structure

- `.claude/project/adr/` — Architecture Decision Records (ADR-XX-{slug}.md)
- `.claude/project/fdr/` — Feature Development Records (FDR-XX-{slug}.md)
- `.claude/project/test_plans/` — Test Plans with traceability matrices (TP-XX-{slug}.md)
- `.claude/project/implementation_plans/` — DAG task plans (IMPL-XX-{slug}.md)
- `.claude/project/cascades/` — Implementation records with traceability (REC-XX-{slug}.md)
- `.claude/project/validations/` — Pairwise validation reports (VAL-XX-{upstream}-to-{downstream}.md)
- `.claude/project/traces/` — Traceability reports with coverage verification (TRACE-XX-{slug}.md)
- `.claude/project/knowledge/` — Reusable knowledge: patterns, lessons, decisions, antipatterns
- `.claude/project/todos/` — Task tracking with status + tickets (TODO-XX-{slug}.yaml)
- `.claude/project/scripts/hypothesis/` — Hypothesis test scripts (H{NN}_{slug}.py + _result.json)
- `.claude/cascades/` — Auto-generated change log (timestamps + file:line, gitignored)
- `.claude/rules/` — On-demand coding rules by stack (install via /ai:setup --install-rules)

Document flow: ADR → FDR → TP → IMPL → TODO → code → test → lint → cascade → review
Pairwise validation: /ai:validate {upstream} {downstream} — checks coverage between any two stages
Acceptance hierarchy: AAC (ADR) → FAC (FDR) → TC (TP) → EAC (IMPL) → acceptance_trace (TODO)
Minimum viable chain: FDR → IMPL → TODO (lite mode — no ADR, no TP)

Scope flags: `--scope {backend|frontend|fullstack|api|data}[,lite]`
- Feature scope: backend (default), frontend, fullstack, api, data
- Flow modifier: `lite` = no ADR/TP in chain (FDR→IMPL→TODO only)
- Templates load only relevant fragments per scope (core + scope-frontend + flow-lite/full)
