<!-- Validation fragment: IMPL → TODO
     Checks whether the TODO YAML tracks all IMPL tasks and acceptance criteria. -->

## Extraction

### From upstream (IMPL)
- **Task list**: all T{NN} from §Task Details — extract task IDs, titles, depends_on, acceptance_criteria
- **EAC table**: §Engineering Acceptance Criteria — extract all EAC IDs
- **Source header**: `Source:` field — to find FDR for FAC extraction
- **Source ADR**: from FDR's `Source ADR:` — to find AAC if applicable

### From downstream (TODO — YAML)
- **tasks[]**: extract task IDs, depends_on, acceptance_criteria fields
- **acceptance_trace.eac[]**: extract EAC IDs
- **acceptance_trace.fac[]**: extract FAC IDs
- **acceptance_trace.aac[]**: extract AAC IDs (may be empty list)

## Criteria

### C1: Task Existence
For each T{NN} in IMPL §Task Details, verify a task with matching ID exists in TODO tasks[].
- **PASS**: Every IMPL task exists in TODO
- **FAIL**: Task missing from TODO

### C2: Acceptance Trace — EAC
For each EAC in IMPL's EAC table, verify it appears in TODO's acceptance_trace.eac[].
- **PASS**: Every EAC tracked
- **FAIL**: EAC missing from acceptance_trace

### C3: Acceptance Trace — FAC
For each FAC referenced in IMPL's EAC traces_to_fac, verify it appears in TODO's acceptance_trace.fac[].
- **PASS**: Every FAC tracked
- **FAIL**: FAC missing from acceptance_trace

### C4: Acceptance Trace — AAC
If the chain includes an ADR (FDR's Source ADR is not "—"):
- Verify every AAC appears in TODO's acceptance_trace.aac[]
- **PASS**: Every AAC tracked
- **FAIL**: AAC missing
If no ADR: verify acceptance_trace.aac is empty [].
- **PASS**: aac is empty as expected
- **FAIL**: aac has entries but no ADR exists

### C5: Dependency Graph Match
For each task in IMPL with depends_on, verify TODO's depends_on field matches.
- **PASS**: Dependencies match
- **FAIL**: Mismatch in dependency list

### C6: Per-Task Acceptance Criteria
For each task in IMPL with `Acceptance criteria: [EAC-N]`, verify the TODO task has matching acceptance_criteria field.
- **PASS**: Fields match
- **FAIL**: Mismatch or missing
