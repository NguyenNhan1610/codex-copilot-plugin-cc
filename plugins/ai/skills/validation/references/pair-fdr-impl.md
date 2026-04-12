<!-- Validation fragment: FDR → IMPL
     Checks whether the Implementation Plan covers all FDR requirements. -->

## Extraction

### From upstream (FDR)
- **FAC table**: §Feature Acceptance Criteria — extract all FAC IDs
- **Function Contracts**: §Function Contracts — extract function names
- **I/O table rows**: §State Transition I/O Tables — extract all B-{N} row IDs
- **Edge cases**: §Edge Cases (all categories) — extract all E{N} IDs with severity
- **Risks**: §Risk Register — extract all R{N} IDs

### From downstream (IMPL)
- **EAC table**: §Engineering Acceptance Criteria — extract EAC IDs and `traces_to_fac` column
- **Task details**: all T{NN} blocks — extract `Acceptance criteria`, `Function ref`, `Behavior rows` fields
- **Risk mitigations**: §Risk Mitigations from Source — extract risk-to-task mappings

## Criteria

### C1: FAC → EAC Coverage
For each FAC ID in FDR, verify ≥1 EAC in IMPL has `traces_to_fac` matching it.
- **PASS**: Every FAC has ≥1 EAC
- **FAIL**: List FACs with zero EACs

### C2: Function Contract → Task Mapping
For each function in FDR §Function Contracts, verify ≥1 IMPL task has `Function ref` matching it.
- **PASS**: Every function has a task
- **FAIL**: Function not assigned to any task

### C3: Edge Case → Task Coverage
For each E{N} in FDR §Edge Cases, verify an IMPL task addresses it (via task description, hardening track, or explicit edge case reference).
- **PASS**: Every edge case addressed
- **WARN**: Low-severity edge case missing
- **FAIL**: High/critical edge case missing

### C4: Risk Mitigation → Task Assignment
For each R{N} in FDR §Risk Register, verify it appears in IMPL §Risk Mitigations from Source with a task assignment.
- **PASS**: Every risk has a task
- **FAIL**: Risk not assigned

### C5: I/O Row → Behavior Row Coverage
For each B-{N} in FDR §I/O Tables, verify ≥1 IMPL task has `Behavior rows` including it.
- **PASS**: Every row covered
- **FAIL**: Row not assigned to any task

### C6: No Orphan EAC Traces
For each EAC's `traces_to_fac`, verify the referenced FAC exists in the FDR.
- **PASS**: All traces resolve
- **FAIL**: EAC references nonexistent FAC
