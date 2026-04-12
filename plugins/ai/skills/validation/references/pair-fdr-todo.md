<!-- Validation fragment: FDR → TODO (skip-step)
     Checks whether TODO tracks FDR requirements without examining the intermediate IMPL. -->

## Extraction

### From upstream (FDR)
- **FAC table**: §Feature Acceptance Criteria — extract all FAC IDs
- **Edge cases**: §Edge Cases (all categories) — extract all E{N} IDs with severity
- **Risks**: §Risk Register — extract all R{N} IDs

### From downstream (TODO — YAML)
- **acceptance_trace.fac[]**: extract FAC IDs and status
- **tasks[]**: extract task references[] of type fdr_edge_case and fdr_risk

## Criteria

### C1: FAC in Acceptance Trace
For each FAC in FDR, verify it appears in TODO's acceptance_trace.fac[].
- **PASS**: Every FAC tracked
- **FAIL**: FAC missing from acceptance_trace

### C2: Edge Case Tracking
For each E{N} in FDR §Edge Cases, verify ≥1 TODO task has a reference of type fdr_edge_case pointing to it.
- **PASS**: Every edge case tracked
- **WARN**: Low-severity edge case missing
- **FAIL**: High/critical edge case missing

### C3: Risk Tracking
For each R{N} in FDR §Risk Register, verify ≥1 TODO task has a reference of type fdr_risk pointing to it.
- **PASS**: Every risk tracked
- **WARN**: Low-severity risk missing
- **FAIL**: High/critical risk missing
