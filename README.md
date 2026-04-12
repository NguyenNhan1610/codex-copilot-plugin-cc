# AI Companion Plugin for Claude Code

Use **Codex** or **GitHub Copilot** from inside Claude Code for code reviews, multi-agent discussions, hypothesis debugging, architecture decisions, feature planning, test planning, task tracking, and auto-installable coding rules — with deep support for FastAPI, Next.js, Django, Flutter, and more.

**Author:** [NguyenNhan1610](https://github.com/NguyenNhan1610)
**Version:** 4.3.1

## Document Flow

```
ADR → FDR → TP → IMPL → TODO → code → test → lint → cascade → review
 ↑                                ↑      ↑       ↑      ↑       ↑
 └────────────────────────────────┴──────┴───────┴──────┴───────┘
                              (all trace back)

Acceptance hierarchy:  AAC (ADR) → FAC (FDR) → TC (TP) → EAC (IMPL) → acceptance_trace (TODO)
Pairwise validation:   /ai:validate {upstream} {downstream}
Minimum viable chain:  FDR → IMPL → TODO  (lite mode — no ADR, no TP)

              /ai:knowledge extract
                       ↓
       patterns · lessons · decisions · antipatterns
                       ↓
          Auto-suggested on next ADR/FDR/IMPL/debug

              /ai:trace --verify FDR-03
                       ↓
        READY TO SHIP / NOT READY / NEEDS REVIEW
```

## What's New in This Fork

A high-quality fork of [openai/codex-plugin-cc](https://github.com/openai/codex-plugin-cc) with significant enhancements.

| Feature | Original | This Fork |
|---------|----------|-----------|
| Code review | Diff-based only | **Full codebase** + aspect-based (security, performance, architecture, antipatterns) |
| Language support | Generic | **Python, TypeScript, Dart** with techstack variants (FastAPI, Django, Next.js, Flutter) |
| Multi-agent | None | **`/ai:council`** — parallel agents discuss, debate, synthesize |
| Debugging | None | **`/ai:debug`** — hypothesis-based with Mermaid decision trees |
| Architecture | None | **`/ai:architecture-decision-record`** — ADRs with diagrams + acceptance criteria |
| Feature planning | None | **`/ai:feature-development-record`** — FDRs with edge cases, risk assessment, scope flags |
| Test planning | None | **`/ai:test-plan`** — structured test plans with FAC/AAC traceability matrices |
| Implementation | None | **`/ai:implement`** — DAG-based task plans with EAC traceability |
| Task tracking | None | **`/ai:todo`** — YAML tasks with status, tickets, evidence, acceptance trace |
| Stage validation | None | **`/ai:validate`** — pairwise coverage checks between any two planning documents |
| Handoff records | None | **`/ai:cascade`** — implementation records tracing back to all documents |
| Lint/typecheck | None | **`/ai:lint`** — batch ruff + pyright + eslint + tsc on Stop hook |
| Diagrams | None | **`/ai:mermaid`** — validate and render Mermaid.js diagrams |
| Coding rules | None | **`/ai:setup --install-rules`** — auto-install rules into `.claude/rules/` |
| Cascade logging | None | **PostToolUse + UserPromptSubmit hooks** — timestamps + file:line |
| Knowledge base | None | **`/ai:knowledge`** — extract, index, search reusable knowledge + auto-suggest |
| Traceability | None | **`/ai:trace`** — verify completeness with 3 parallel sub-agents + ship/no-ship verdict |
| Project init | None | **`/ai:setup --init`** — creates project dirs + appends to CLAUDE.md |

## Commands (20)

### Review & Analysis

| Command | Description |
|---------|-------------|
| `/ai:review` | Standard or aspect-based code review |
| `/ai:review security` | Full codebase security audit |
| `/ai:review python/fastapi:performance` | FastAPI-specific performance review |
| `/ai:adversarial-review` | Challenge review that questions design choices |
| `/ai:council --roles security,performance` | Multi-agent discussion with debate |
| `/ai:debug` | Hypothesis-based debugging with Mermaid decision trees |
| `/ai:lint` | Batch lint/typecheck (ruff, pyright, eslint, tsc) |

### Planning & Documentation

| Command | Description |
|---------|-------------|
| `/ai:architecture-decision-record` | Architecture Decision Records with Mermaid diagrams |
| `/ai:feature-development-record` | Feature Development Records with edge cases + risk assessment |
| `/ai:test-plan` | Structured test plans from FDR with traceability matrices |
| `/ai:implement` | DAG-based implementation plans from FDR/ADR |
| `/ai:todo` | Task tracking with status, tickets, and traceability |
| `/ai:validate` | Pairwise stage validation: check if downstream doc fulfills upstream |
| `/ai:cascade` | Handoff records with traceability to all documents |
| `/ai:knowledge` | Extract, index, search reusable knowledge from project docs |
| `/ai:trace` | Traceability report: verify completeness across all documents |
| `/ai:mermaid` | Validate and render Mermaid.js diagrams |

### Delegation & Management

| Command | Description |
|---------|-------------|
| `/ai:rescue` | Delegate investigation or fix to Codex |
| `/ai:status` | Check job progress |
| `/ai:result` | Get finished job output |
| `/ai:cancel` | Cancel a running job |
| `/ai:setup` | Backend readiness, init project, install rules/mermaid, review gate |

## Requirements

- **Node.js 18.18 or later**
- **One or both backends:**
  - **Codex** (default): ChatGPT subscription (incl. Free) or OpenAI API key — [pricing](https://developers.openai.com/codex/pricing)
  - **Copilot**: GitHub Copilot CLI — [install guide](https://docs.github.com/copilot/how-tos/copilot-cli)

## Install

```bash
/plugin marketplace add NguyenNhan1610/ai-companion
/plugin install ai@ai-backends
/reload-plugins
/ai:setup
```

**Codex backend:** If not installed, `/ai:setup` will offer to install Codex for you (requires npm). If not authenticated, run `!codex login`.

**Copilot backend:** Run `/ai:setup --provider copilot` to check readiness. If not authenticated, run `!copilot login`. Use `--model copilot:claude-opus-4.5` to select Copilot for individual commands.

### Full Project Setup

```bash
/ai:setup --init                          # Init project dirs + CLAUDE.md
/ai:setup --install-rules fastapi,nextjs  # Install coding rules
/ai:setup --install-mermaid               # Install Mermaid CLI
```

## Project Structure

After `/ai:setup --init`:

```
.claude/project/
├── adr/                      ← /ai:architecture-decision-record — Architecture Decision Records
├── fdr/                      ← /ai:feature-development-record — Feature Development Records
├── test_plans/               ← /ai:test-plan — Test Plans with traceability matrices
├── implementation_plans/     ← /ai:implement — DAG task plans
├── todos/                    ← /ai:todo — Task tracking (YAML)
├── validations/              ← /ai:validate — Pairwise validation reports
├── cascades/                 ← /ai:cascade — Implementation records
├── scripts/hypothesis/       ← /ai:debug — Hypothesis test scripts + results
├── traces/                   ← /ai:trace — Traceability verification reports
├── knowledge/                ← /ai:knowledge — Patterns, lessons, decisions, antipatterns
│   ├── index.yaml            ← Master index for retrieval + trigger patterns
│   ├── patterns/             ← Reusable implementation approaches
│   ├── lessons/              ← What went wrong/right and why
│   ├── decisions/            ← ADR outcome summaries
│   └── antipatterns/         ← Project-specific bad patterns
├── guidelines/               ← Team guidelines
└── workflows/                ← Team workflows

.claude/cascades/             ← Auto-generated change log (gitignored)
.claude/rules/                ← On-demand coding rules by stack
```

## Scope Flags

Planning commands (`/ai:feature-development-record`, `/ai:implement`, `/ai:todo`) support composable scope flags:

```bash
/ai:feature-development-record --scope backend Add caching        # Full flow, backend (default)
/ai:feature-development-record --scope frontend,lite Add widget   # Lite flow, frontend
/ai:feature-development-record --scope fullstack Add notifications # Full flow, fullstack
```

**Feature scope:** `backend` (default), `frontend`, `fullstack`, `api`, `data`
**Flow modifier:** `lite` — skips ADR and TP stages (FDR → IMPL → TODO only)

Templates load only relevant fragments per scope, keeping context lean.

## Aspect-Based Code Review

Review the full codebase through a specific lens with deep, language-specific expertise.

```bash
/ai:review security                        # Generic security audit
/ai:review python:performance              # Python performance review
/ai:review python/fastapi:security         # FastAPI-specific security
/ai:review typescript/nextjs:performance   # Next.js App Router performance
/ai:review dart/flutter:architecture       # Flutter architecture review
/ai:review --base main                     # Diff-based review (no aspect)
```

**Aspects:** `security`, `performance`, `architecture`, `antipatterns`

**28 prompt templates** across 3 languages (Python, TypeScript, Dart) and 5 techstacks (FastAPI, Django, Next.js, Flutter + generic).

## Hypothesis Debugging

Structured debugging using the scientific method.

```bash
/ai:debug The API returns 500 with special characters
/ai:debug --type performance The dashboard takes 8s to load
/ai:debug --type flaky The registration test fails randomly in CI
/ai:debug --type behavior Users see stale data after profile update
```

**Process:** Observe → Hypothesize → Test → Conclude

- Claude agents explore the codebase for evidence
- Generates 3-5 ranked hypotheses with testable predictions
- Codex agents write and run test scripts (saved to `scripts/hypothesis/`)
- Produces Mermaid decision tree with color-coded results

## Multi-Agent Council

Multiple agents analyze independently, debate findings, and synthesize.

```bash
/ai:council --roles security,performance Analyze the auth flow
/ai:council --roles attacker,defender,judge Is our rate limiting sufficient?
```

**Roles:** `security`, `performance`, `architecture`, `antipatterns`, `attacker`, `defender`, `judge` (+ custom freeform)

**Model:** Round 1 (parallel exploration) → Round 2 (debate) → Synthesis

## Architecture Decision Records

```bash
/ai:architecture-decision-record Should we use Redis or Memcached for caching?
/ai:architecture-decision-record --scope api REST vs GraphQL for the mobile API
/ai:architecture-decision-record --scope data Normalize orders table or use JSONB?
```

**Scopes:** `module`, `system`, `api`, `data`, `infra`

Outputs 3 Mermaid diagrams (current, proposed, comparison) + comparison table + AAC (Architectural Acceptance Criteria) + implementation plan. Saved to `.claude/project/adr/ADR-{NN}-{slug}.md`.

## Feature Development Records

```bash
/ai:feature-development-record Add multi-tenant session caching
/ai:feature-development-record --scope api Add rate limiting to the public API
/ai:feature-development-record --scope fullstack Add real-time notifications
/ai:feature-development-record --scope frontend,lite Add dashboard widget
```

**Scopes:** `backend`, `frontend`, `fullstack`, `api`, `data` — add `,lite` for minimal flow

Includes: FAC (Feature Acceptance Criteria), function contracts, I/O tables, edge case tables with concrete test data, risk matrix, risks to existing codebase, backward compatibility, testing strategy, rollout plan with Mermaid diagrams. Saved to `.claude/project/fdr/FDR-{NN}-{slug}.md`.

## Test Plans

```bash
/ai:test-plan --from FDR-03
/ai:test-plan --from FDR-03 --adr ADR-05
```

Derives test cases from FDR I/O tables, edge cases, and risks. Builds traceability matrices: FAC→TC, AAC→TC, Edge→TC, Risk→TC. Saved to `.claude/project/test_plans/TP-{NN}-{slug}.md`.

## Implementation Plans

```bash
/ai:implement --from .claude/project/fdr/FDR-03-session-caching.md
/ai:implement --from .claude/project/adr/ADR-05-redis.md --method tdd
```

**Methods:** `pragmatic` (default), `tdd`, `agile`, `kanban`, `shape-up`

Produces DAG of tasks with dependencies, critical path, parallel tracks, EAC (Engineering Acceptance Criteria) tracing to FAC and TC. Saved to `.claude/project/implementation_plans/IMPL-{NN}-{slug}.md`.

## Stage Validation

```bash
/ai:validate ADR-05 FDR-03              # Check ADR→FDR coverage
/ai:validate FDR-03 IMPL-03            # Check FDR→IMPL coverage
/ai:validate FDR-03                     # Auto-discover upstream from header
/ai:validate ADR-05 IMPL-03            # Skip-step validation
```

**Valid pairs:** ADR→FDR, FDR→TP, FDR→IMPL, TP→IMPL, IMPL→TODO, ADR→IMPL (skip), FDR→TODO (skip)

Fast structural check — reads two docs, cross-references tables, reports coverage gaps. Saved to `.claude/project/validations/VAL-{NN}-{upstream}-to-{downstream}.md`.

## Task Tracking

```bash
/ai:todo                              # Kanban board view
/ai:todo --from IMPL-03               # Generate from IMPL plan
/ai:todo update T06 --status complete # Update status
/ai:todo update T06 --ticket JIRA-125 # Link ticket
/ai:todo --sync                       # Auto-sync from cascade
```

YAML schema: status, priority, track, assignee, ticket, evidence (file:line), references (IMPL/FDR/ADR), tests, dependencies, acceptance_trace (EAC/FAC/AAC). Saved to `.claude/project/todos/TODO-{NN}-{slug}.yaml`.

## Handoff Records

```bash
/ai:cascade                                # Analyze all cascade changes
/ai:cascade Add session caching feature    # With context label
/ai:cascade --since 2h                     # Last 2 hours only
```

Traces implementation back to ADR/FDR/IMPL. Includes task completion status, edge case coverage, risk mitigation evidence, file:line citations. Saved to `.claude/project/cascades/REC-{NN}-{slug}.md`.

## Knowledge Base

Extract reusable knowledge from project experience and retrieve it when starting new work.

```bash
/ai:knowledge extract                       # Scan all docs, extract knowledge
/ai:knowledge extract --from FDR-03         # From specific document
/ai:knowledge search django performance     # Keyword search
/ai:knowledge search --tag python,security  # Filter by tags
/ai:knowledge suggest                       # What's relevant for current task?
/ai:knowledge list                          # All entries
```

**Types:** `pattern` (reusable code), `lesson` (what went wrong/right), `decision` (ADR outcome), `antipattern` (bad pattern discovered)

**Auto-suggestion:** FDR, ADR, IMPL, and debug agents automatically check the knowledge index and surface relevant past experience before starting analysis.

## Traceability Reports

Verify feature completeness by tracing decisions through plans, code, tests, and knowledge.

```bash
/ai:trace FDR-03                    # Trace feature from plan to code
/ai:trace ADR-05                    # Trace decision downstream
/ai:trace --verify FDR-03           # Ship/no-ship verdict
/ai:trace --query "Is session caching fully implemented?"
```

Uses 3 parallel sub-agents for fast evidence collection. Checks: document chain, acceptance criteria chain (AAC→FAC→EAC→TC), edge case coverage, risk mitigation, task completion, test coverage, knowledge applied. Produces gap analysis with severity classification and overall coverage percentage. Saved to `.claude/project/traces/TRACE-{NN}-{slug}.md`.

## Lint & Typecheck

```bash
/ai:lint                  # Lint files from cascade
/ai:lint --all            # Lint entire project
/ai:lint --fix            # Auto-fix safe issues
```

**Automatic Stop hook** — blocks Claude from stopping if lint errors found in changed files.

**Tools:** ruff + pyright (Python), eslint + tsc (TypeScript). Production configs bundled.

## Cascade Change Tracking

PostToolUse + UserPromptSubmit hooks auto-log every change with timestamps and line locations:

```markdown
# Cascade: main

## [09:20:15] User: Add multi-tenant session caching

- [09:20:30] CREATE `services/cache_service.py`
- [09:20:45] EDIT `api/views/users.py` L45-67
- [09:21:02] EDIT `config/settings.py` L12

## [09:25:00] User: Fix the failing test

- [09:25:10] EDIT `services/cache_service.py` L23-25
```

## Mermaid Diagrams

```bash
/ai:mermaid validate graph TD; A-->B; B-->C
/ai:mermaid render graph TD; A[Start]-->B{Decision}; B-->|Yes|C[End]
/ai:mermaid render --format png -o docs/arch.png graph TD; A-->B
/ai:setup --install-mermaid               # Install mmdc if needed
```

## Coding Rules

```bash
/ai:setup --install-rules fastapi,nextjs
```

17 production-level rule files covering security, performance, architecture, antipatterns for Python/FastAPI/Django and TypeScript/Next.js. Load on-demand when Claude reads matching files.

## Setup & Configuration

### Supported Backends

| Feature | Codex (Default) | Copilot |
|---------|-----------------|---------|
| Type | Persistent app server | Stateless CLI |
| Native reviews | Yes | No (task-based) |
| Auth | `~/.codex/config.toml` | GitHub Copilot CLI |
| Models | gpt-5.4, gpt-5.4-mini | Via Copilot CLI |

### Codex Configuration

```toml
# ~/.codex/config.toml or .codex/config.toml
model = "gpt-5.4-mini"
model_reasoning_effort = "xhigh"
```

### Review Gate

```bash
/ai:setup --enable-review-gate    # Codex reviews Claude's work before stop
/ai:setup --disable-review-gate
```

> **Warning:** Can create long-running loops and drain usage limits.

## FAQ

### Do I need a separate Codex account?

If you're already signed into Codex, it works immediately. Run `/ai:setup` to check, `!codex login` to authenticate.

### Can I use Copilot instead of Codex?

Yes. Use `--model copilot:model-name` on any command, or `/ai:setup --provider copilot`.

### Does the plugin modify my code?

Reviews, council, debug, ADR, FDR, test-plan, implement, validate, trace are **read-only**. Only `/ai:rescue` can make changes. `/ai:lint --fix` auto-fixes safe issues.

### Can I resume work in Codex?

Yes. `/ai:result` includes the Codex session ID. Run `codex resume <session-id>`.

### What's the difference from the original?

This fork adds 20 commands (vs 7), aspect-based reviews (28 templates, 3 languages, 5 techstacks), multi-agent council, hypothesis debugging, full document flow (ADR/FDR/TP/IMPL/TODO) with acceptance criteria hierarchy, pairwise stage validation, knowledge extraction with auto-suggestion, cascade tracking with timestamps, batch lint on Stop, Mermaid rendering, and coding rules. The original only supports diff-based reviews.

## License

Apache 2.0
