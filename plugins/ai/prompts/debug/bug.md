<hypothesis_generation_guide type="bug">

## Bug Investigation Focus Areas

When generating hypotheses for a bug, prioritize these categories:

### Input Handling
- Missing or incorrect input validation
- Type coercion errors (string vs number, null vs undefined)
- Edge cases: empty strings, special characters, unicode, very large inputs
- Missing sanitization before DB/shell/template operations

### Error Paths
- Uncaught exceptions in async code (missing try/catch, unhandled promise rejection)
- Error handlers that swallow context (bare catch, generic error messages)
- Partial failure states (half-committed transactions, partial writes)
- Resource cleanup failures (unclosed connections, leaked file handles)

### State Corruption
- Race conditions between concurrent operations
- Stale cache serving outdated data
- Session/auth state inconsistency after token refresh
- Database constraint violations masked by ORM

### Configuration & Environment
- Dev vs prod config differences (DEBUG mode, different DB, different auth)
- Missing or wrong environment variables
- Version mismatches between dependencies
- Feature flags in unexpected state

### Data Flow
Trace the data from user input to error output:
1. Where does the input enter?
2. What transformations happen?
3. Where does it first go wrong?
4. What does the error message actually mean vs what the user sees?

## Hypothesis Template

For each hypothesis:
- Be specific: "SQL injection in `views.py:142` via unsanitized `name` parameter" not "input validation issue"
- Cite evidence: "The `process_form()` function at line 142 uses f-string SQL"
- Propose a concrete test: "Send a POST with `name=O'Brien` and check for 500"
- State the expected outcome: "500 with SQL syntax error in logs"

</hypothesis_generation_guide>
