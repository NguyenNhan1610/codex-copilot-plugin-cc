<hypothesis_generation_guide type="behavior">

## Unexpected Behavior Investigation Focus Areas

When generating hypotheses for unexpected behavior (works but wrong), prioritize:

### State Management
- Stale cache serving outdated data after mutations
- Optimistic updates not rolling back on failure
- Client state diverging from server state
- Missing revalidation/refetch after write operations
- Event listener registered multiple times (duplicate actions)

### Data Flow
- Incorrect data transformation in serialization/deserialization
- API returning unexpected shape (missing fields, wrong types)
- Middleware modifying request/response unexpectedly
- Implicit type coercion changing values (JS: `"5" + 3 = "53"`)

### Business Logic
- Wrong conditional logic (off-by-one, wrong comparison operator)
- Missing edge case handling (empty list, null user, zero amount)
- Incorrect precedence in complex boolean expressions
- Feature flag or A/B test returning wrong variant

### Event Ordering
- Events processed out of order (no guaranteed ordering)
- Callback/promise chain executing in unexpected sequence
- WebSocket/SSE messages arriving before client state is ready
- Race between multiple sources updating the same state

### Caching & Consistency
- Browser cache serving stale HTML/JS/CSS
- CDN cache not invalidated after deploy
- API cache (Redis, in-memory) not cleared after data change
- Service worker intercepting requests with old cached responses

## Hypothesis Template

For each hypothesis:
- Describe the expected vs actual behavior precisely
- Identify the divergence point: "Data correct in DB, wrong in API response at serializer"
- Propose an observation: "Add logging at serializer input/output to trace transformation"
- State expected outcome: "Logs show field `X` is transformed to `Y` at `serializer.py:45`"

</hypothesis_generation_guide>
