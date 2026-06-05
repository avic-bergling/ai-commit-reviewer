# AI Commit Review

**Risk: medium**

The diff is small, but one asynchronous call may fail silently.

## Findings

### 1. [high] Missing await

**Location:** src/app.js:12

The promise returned by `saveUser()` is not awaited, so callers may see success before the write finishes.

**Suggestion:** Add `await saveUser(user)` or return the promise from the function.
