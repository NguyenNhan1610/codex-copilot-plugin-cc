<hypothesis_generation_guide type="flaky">

## Flaky Test Investigation Focus Areas

When generating hypotheses for a flaky/intermittent test, prioritize:

### Race Conditions
- Shared mutable state between tests (global variables, module-level state)
- Test execution order dependency (passes alone, fails in suite)
- Concurrent writes to the same resource (file, DB row, cache key)
- Event loop timing: `setTimeout`/`setInterval` in tests without proper awaiting

### Timing & Async
- Hardcoded sleep/timeout values that are sometimes too short
- Missing `await` on async operations (test finishes before assertion)
- Polling with insufficient retries or backoff
- Time-dependent logic (date checks, token expiry) near midnight/boundaries

### Test Isolation
- Shared database state not reset between tests (missing teardown)
- Test using real external services (flaky network, rate limits)
- File system side effects (temp files, log files) leaking between tests
- Environment variables set by one test affecting another

### Data & State
- Randomized test data that occasionally triggers edge cases
- Auto-incrementing IDs creating unexpected ordering
- Timezone-dependent assertions
- Floating point comparison without tolerance

### Infrastructure
- CI-specific differences (CPU count, memory limits, network speed)
- Docker layer caching causing stale dependencies
- Parallel test runner conflicts (port binding, file locks)
- Database connection pool exhaustion under parallel tests

## Hypothesis Template

For each hypothesis:
- Note the failure pattern: "Fails ~30% of the time, always with `assertion timeout`"
- Identify the timing window: "Race between `setup()` DB insert and test query"
- Propose a deterministic test: "Run with `--runInBand` to eliminate parallelism"
- State expected outcome: "If passes with serial execution, confirms test isolation issue"

</hypothesis_generation_guide>
