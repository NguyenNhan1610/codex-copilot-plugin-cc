# TDD Method Template

Every implementation task gets a paired test-first task.

## DAG Pattern

```mermaid
graph TD
    T01["T01: Write model tests"]:::test --> T02["T02: Implement model"]:::impl
    T02 --> T03["T03: Write service tests"]:::test
    T03 --> T04["T04: Implement service"]:::impl
    T04 --> T05["T05: Write API tests"]:::test
    T05 --> T06["T06: Implement API"]:::impl
    T06 --> T07["T07: Refactor pass"]:::refactor

    classDef test fill:#f8d7da,stroke:#721c24
    classDef impl fill:#d4edda,stroke:#155724
    classDef refactor fill:#cce5ff,stroke:#004085
```

## Task Pair Format

```
T{NN}-test: Write failing test for {component}
  Depends on: previous impl task (or root)
  Done when: Tests exist and FAIL

T{NN}-impl: Make tests pass for {component}
  Depends on: T{NN}-test
  Done when: All T{NN}-test tests PASS

T{NN}-refactor: Clean up {component}
  Depends on: T{NN}-impl
  Done when: Tests still pass, code clean
```

## Cycle

```
RED: Write failing test → GREEN: Minimal code to pass → REFACTOR: Clean up
```
