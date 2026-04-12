# VAL-{NN}: {Upstream ID} → {Downstream ID}

**Date:** {YYYY-MM-DD}
**Upstream:** {full path to upstream document}
**Downstream:** {full path to downstream document}
**Pair type:** {adr-fdr | fdr-tp | fdr-impl | tp-impl | impl-todo | adr-impl | fdr-todo}
**Verdict:** {PASS | PARTIAL | FAIL}
**Coverage:** {N}% — {covered}/{total} criteria passed

---

## Verdict

**{PASS / PARTIAL / FAIL}**

{One paragraph: what's covered, what's missing, recommended action.}

---

## Criteria Results

| # | Criterion | Verdict | Covered | Total | Gaps |
|---|-----------|---------|---------|-------|------|
| C1 | {name} | {PASS/FAIL/WARN} | {N} | {M} | {gap list or "—"} |

## Coverage Detail

### C1: {Criterion Name}

| Upstream Item | Downstream Item(s) | Status |
|---------------|--------------------|---------| 
| {ID} | {downstream refs} | PASS |
| {ID} | — | **FAIL** — no downstream coverage |

<!-- Repeat for each criterion -->

## Gaps Summary

| # | Gap | Criterion | Upstream Item | Severity | Action Needed |
|---|-----|-----------|---------------|----------|---------------|
| G{N} | {description} | C{N} | {item ID} | {High/Med/Low} | {specific action} |

## Coverage Summary

| Dimension | Covered | Total | Percentage |
|-----------|---------|-------|-----------|
| {criterion name} | {N} | {M} | {%} |
| **Overall** | **{N}** | **{M}** | **{%}** |

---

**Next steps:**
- {Action items based on verdict}
