<!-- Validation fragment: TP → IMPL
     Checks whether the IMPL properly references and back-fills the TP. -->

## Extraction

### From upstream (TP)
- **TC table**: §Test Cases — extract all TC IDs and `traces_to_eac` column
- **Fixtures**: §Shared Test Fixtures — extract fixture IDs

### From downstream (IMPL)
- **EAC table**: §Engineering Acceptance Criteria — extract `traces_to_tc` column
- **Task details**: check for fixture references

## Criteria

### C1: TC → EAC Back-fill Complete
For each TC in TP, verify `traces_to_eac` is populated (not "—"). This confirms IMPL has back-filled the TP.
- **PASS**: Every TC has ≥1 EAC reference
- **WARN**: `traces_to_eac` still "—" — IMPL may not have been generated yet, or back-fill was skipped
- **FAIL**: N/A (WARN is the worst case for unfilled back-references)

### C2: No Orphan TCs
For each TC in TP, verify ≥1 EAC in IMPL has `traces_to_tc` referencing it.
- **PASS**: Every TC is referenced by an EAC
- **FAIL**: TC not referenced — test exists but no EAC validates against it

### C3: Fixture Consistency
For each fixture in TP §Shared Test Fixtures, verify it is referenced in at least one IMPL task description or file list.
- **PASS**: All fixtures referenced
- **WARN**: Fixture not explicitly mentioned but related files in scope
- **FAIL**: Fixture completely absent from IMPL
