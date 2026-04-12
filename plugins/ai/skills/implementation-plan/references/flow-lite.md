<!-- IMPL flow fragment: loaded when no TP exists (lite flow or --lite flag).
     Insert the Inline Test Cases section after the EAC table in the IMPL output.
     Use iTC- prefix to distinguish from full TP's TC- IDs. -->

## Inline Test Cases

<!-- Lite TP: when no standalone Test Plan exists, the IMPL derives test cases
     directly from the FDR's I/O tables, edge cases, and FAC entries.
     Each iTC traces to a FAC and maps to an EAC in the table above. -->

| ID | Description | Type | traces_to_fac | Input | Expected |
|----|-------------|------|--------------|-------|----------|
| iTC-{N} | {from FDR I/O table row B-{N}} | unit | FAC-{N} | {concrete input from FDR} | {expected output from FDR} |
| iTC-{N} | {from FDR edge case E{N}} | {unit/integration} | FAC-{N} | {test data from FDR edge case} | {expected handling} |
| iTC-{N} | {from FAC-{N} verification} | {integration/e2e} | FAC-{N} | {scenario input} | {observable behavior} |

### Derivation Rules

1. **From FDR I/O table rows**: Each row B-{N} becomes one iTC. Use the function signature from FDR §Function Contracts and the exact input/output from the I/O table.
2. **From FDR edge cases**: Each edge case E{N} with concrete test data becomes one iTC. Use the Test Data column from the FDR edge case table.
3. **From FAC entries**: Each FAC that isn't already covered by I/O rows or edge cases gets one iTC verifying the observable behavior.

### EAC Linkage

In the EAC table above, set `traces_to_tc` to the `iTC-{N}` IDs from this section instead of `TC-{N}` IDs.
