<!-- Validation fragment: ADR → FDR
     Checks whether the FDR fulfills the ADR's architectural requirements. -->

## Extraction

### From upstream (ADR)
- **AAC table**: §Architectural Acceptance Criteria — extract all AAC IDs and invariants
- **Existing System Contracts**: §Existing System Contracts — extract contract names where Must Not Break = Yes
- **Integration Point Signatures**: §Integration Point Signatures — extract boundary function names
- **New Public Interface Types**: §New Public Interface Types — extract type names (ADR-REQ-4)
- **Module Boundary & File Path Map**: §Module Boundary & File Path Map — extract module paths

### From downstream (FDR)
- **FAC table**: §Feature Acceptance Criteria — extract all FAC IDs and their `traces_to_aac` column
- **Function Contracts**: §Function Contracts — extract function names and signatures
- **Affected Code Paths**: §Affected Code Paths — extract file references

## Criteria

### C1: AAC → FAC Coverage
For each AAC ID in the ADR, verify at least one FAC in the FDR has `traces_to_aac` referencing it.
- **PASS**: Every AAC has ≥1 FAC
- **FAIL**: List each AAC with zero FACs

### C2: No Orphan FAC Traces
For each FAC with a `traces_to_aac` value (not "—"), verify the referenced AAC exists in the ADR.
- **PASS**: All traces resolve
- **FAIL**: List FACs referencing nonexistent AACs

### C3: Existing Contracts Referenced
For each contract in ADR §Existing System Contracts where Must Not Break = Yes, verify the FDR §Affected Code Paths references the same file or the contract type appears in §Function Contracts.
- **PASS**: All must-not-break contracts addressed
- **WARN**: Contract not explicitly referenced but file in scope
- **FAIL**: Contract not referenced at all

### C4: Integration Points Addressed
For each integration point in ADR §Integration Point Signatures, verify FDR §Function Contracts or §Affected Code Paths references the boundary function.
- **PASS**: All integration points covered
- **FAIL**: Integration point not addressed

### C5: New Types Defined
For each type in ADR §New Public Interface Types, verify FDR §Function Contracts uses matching type names in signatures.
- **PASS**: All new types appear in FDR
- **WARN**: Type referenced but signature differs
- **FAIL**: Type not referenced
