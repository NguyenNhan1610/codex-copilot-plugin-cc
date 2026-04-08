<hypothesis_generation_guide type="performance">

## Performance Investigation Focus Areas

When generating hypotheses for a performance issue, prioritize:

### Database
- N+1 query patterns (loop calling DB per item instead of batch)
- Missing indexes on filter/sort/join columns
- Full table scans on large tables
- Unnecessary eager loading of unused relationships
- Connection pool exhaustion (too few connections, leaked connections)

### I/O & Network
- Synchronous I/O in async handlers (blocking event loop)
- Sequential API calls that could be parallel (Promise.all)
- Missing response streaming for large payloads
- Chatty protocols (many small requests instead of batched)
- Missing compression (gzip, brotli)

### Computation
- O(n^2) or worse algorithms in hot paths
- Redundant computation (same expensive calc repeated)
- Missing caching for frequently accessed data
- CPU-bound work blocking request handling
- Large JSON serialization/deserialization in hot paths

### Memory
- Unbounded caches or collections growing without limits
- Large object retention preventing GC
- Memory leaks from event listeners, closures, or unclosed resources
- Loading entire datasets into memory instead of streaming

### Frontend (if applicable)
- Excessive re-renders (missing memoization, unstable references)
- Large bundle size (importing entire libraries, missing code splitting)
- Unoptimized images (missing lazy loading, wrong format, no CDN)
- Waterfall data fetching (serial instead of parallel)

## Hypothesis Template

For each hypothesis:
- Quantify impact: "N+1 on `orders.items` generates ~50 queries per page load"
- Identify the hot path: "Called on every request to `/api/dashboard`"
- Propose a measurable test: "Count SQL queries with `django.db.connection.queries`"
- State expected outcome: "Query count drops from ~50 to 2 with `prefetch_related`"

</hypothesis_generation_guide>
