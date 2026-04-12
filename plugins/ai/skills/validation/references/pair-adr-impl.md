<!-- Validation fragment: ADR → IMPL (skip-step)
     Checks AAC→EAC transitive coverage, optionally through intermediate FDR. -->

## Mode Detection

Check IMPL's `Source:` header field:
- If it references an FDR → **Mode A**: transitive through FDR (read the FDR too)
- If it references the ADR directly → **Mode B**: direct skip (no FDR)

## Extraction

### From upstream (ADR)
- **AAC table**: §Architectural Acceptance Criteria — extract all AAC IDs
- **Integration Points**: §Integration Point Signatures — extract boundary functions

### From intermediate (FDR — Mode A only)
- **FAC table**: §Feature Acceptance Criteria — extract FAC IDs and traces_to_aac

### From downstream (IMPL)
- **EAC table**: §Engineering Acceptance Criteria — extract EAC IDs and traces_to_fac

## Criteria

### C1: AAC → EAC Transitive Coverage

**Mode A (FDR exists):**
For each AAC, verify the chain: AAC → ≥1 FAC (via traces_to_aac) → ≥1 EAC (via traces_to_fac).
- **PASS**: Every AAC reaches ≥1 EAC through FAC
- **FAIL**: AAC has no transitive path to any EAC

**Mode B (no FDR):**
For each AAC, verify ≥1 EAC addresses it (by matching description or explicit reference).
- **PASS**: Every AAC addressed
- **FAIL**: AAC not addressed by any EAC

### C2: No Broken Chain Links (Mode A only)
Verify: every AAC→FAC link resolves, and every FAC→EAC link resolves.
- **PASS**: No broken references
- **FAIL**: List broken links

### C3: Integration Point → Task Coverage
For each integration point in ADR §Integration Point Signatures, verify ≥1 IMPL task addresses the boundary function.
- **PASS**: All integration points have tasks
- **FAIL**: Integration point not assigned
