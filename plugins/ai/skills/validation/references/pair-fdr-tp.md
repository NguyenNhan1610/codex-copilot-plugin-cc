<!-- Validation fragment: FDR → TP
     Checks whether the Test Plan covers all FDR requirements. -->

## Extraction

### From upstream (FDR)
- **FAC table**: §Feature Acceptance Criteria — extract all FAC IDs
- **I/O table rows**: §State Transition I/O Tables — extract all B-{N} row IDs
- **Edge cases**: §Edge Cases (all categories) — extract all E{N} IDs
- **Risks**: §Risk Register — extract all R{N} IDs
- **Fixtures**: §Canonical Test Fixtures — extract all FIX-{N} IDs

### From downstream (TP)
- **TC table**: §Test Cases — extract TC IDs and `traces_to_fac` column
- **FAC→TC matrix**: §FAC → TC Coverage
- **Edge→TC matrix**: §Edge Case → TC Coverage
- **Risk→TC matrix**: §Risk → TC Coverage
- **I/O mapping**: §I/O Table Test Mapping — extract B-{N} → TC mappings
- **Fixtures**: §Shared Test Fixtures — extract fixture IDs

## Criteria

### C1: FAC → TC Coverage
For each FAC ID in FDR, verify ≥1 TC in TP has `traces_to_fac` matching it.
- **PASS**: Every FAC has ≥1 TC
- **FAIL**: List FACs with zero TCs

### C2: I/O Row → TC Mapping
For each B-{N} row in FDR §I/O Tables, verify a TC exists in TP §I/O Table Test Mapping.
- **PASS**: Every row mapped
- **FAIL**: List unmapped rows

### C3: Edge Case → TC Coverage
For each E{N} in FDR §Edge Cases, verify a TC exists in TP §Edge Case → TC Coverage.
- **PASS**: Every edge case has a TC
- **WARN**: Low-severity edge case missing (severity = low/medium)
- **FAIL**: High/critical edge case missing

### C4: Risk → TC Coverage
For each R{N} in FDR §Risk Register, verify a TC exists in TP §Risk → TC Coverage.
- **PASS**: Every risk has a TC
- **WARN**: Low-severity risk missing
- **FAIL**: High/critical risk missing

### C5: Fixture Alignment
For each FIX-{N} in FDR §Canonical Test Fixtures, verify it appears in TP §Shared Test Fixtures.
- **PASS**: All fixtures present
- **FAIL**: Fixture missing from TP

### C6: No Orphan TC Traces
For each TC's `traces_to_fac`, verify the referenced FAC exists in the FDR.
- **PASS**: All traces resolve
- **FAIL**: TC references nonexistent FAC
