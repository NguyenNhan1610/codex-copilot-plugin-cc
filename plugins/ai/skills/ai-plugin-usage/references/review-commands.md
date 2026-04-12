# Review Commands

## `/ai:review` — Standard & Aspect-Based Review

```bash
/ai:review                              # Review uncommitted changes (native)
/ai:review --base main                  # Review branch vs main
/ai:review security                     # Full codebase security audit
/ai:review python:performance           # Python performance review
/ai:review python/fastapi:security      # FastAPI-specific security
/ai:review typescript/nextjs:performance # Next.js performance
/ai:review dart/flutter:architecture    # Flutter architecture
/ai:review --background security        # Run in background
```

Aspects: `security`, `performance`, `architecture`, `antipatterns`
Languages: `python`, `typescript`, `dart`
Techstacks: `fastapi`, `django`, `nextjs`, `flutter`

Read-only. Aspect reviews analyze the full codebase. No-aspect reviews use native diff-based review.

## `/ai:adversarial-review` — Challenge Review

```bash
/ai:adversarial-review
/ai:adversarial-review --base main challenge the caching design
/ai:adversarial-review --background look for race conditions
```

Read-only. Steerable — accepts free-form focus text.

## `/ai:council` — Multi-Agent Discussion

```bash
/ai:council --roles security,performance Analyze the auth flow
/ai:council --roles attacker,defender,judge Is our rate limiting sufficient?
/ai:council --roles architecture,antipatterns --background
```

Roles: `security`, `performance`, `architecture`, `antipatterns`, `attacker`, `defender`, `judge` (custom freeform also accepted)

Process: Round 1 (parallel exploration) -> Round 2 (debate) -> Synthesis (final verdict)

Cost: `2*N+1` backend calls (3 roles = 7 calls). Max 7 roles.

## Common Workflows

### Review Before Shipping
```bash
/ai:review security
/ai:review --base main
```

### Deep Multi-Perspective Review
```bash
/ai:council --roles security,performance,architecture Analyze the codebase
```
