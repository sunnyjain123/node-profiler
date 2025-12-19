# Node Profiler

A lightweight Node.js profiler to track CPU, memory, and response time for functions and APIs. Supports per-route aggregation, percentiles, async functions, and middleware.

---

## Installation

```bash
npm install node-lite-profiler
```

---

## Upgrade

```bash
npm install node-lite-profiler@latest
```

---

## Quick Start

```js
const { createProfiler, wrapFunction } = require('node-lite-profiler');

const profiler = createProfiler({
  enabled: true,
  sampleRate: 1,            // 1 for full sampling
  debug: true,              // optional: prints debug info
  onResult: (data) => {
    console.log('PROFILE RESULT:', data);
  },
  flushIntervalMs: 5000,    // optional: auto-flush every 5 seconds
  onFlush: (aggregates) => {
    console.log('Aggregated metrics:', aggregates);
  }
});

// Profile a standalone function
async function fetchUser() {
  await new Promise(r => setTimeout(r, 120));
  return { id: 1, name: 'Sunny' };
}

const profiledFetchUser = wrapFunction(profiler, 'fetchUser', fetchUser);

(async () => {
  await profiledFetchUser();
})();
```

---

## Express Middleware

```js
const express = require('express');
const { expressMiddleware } = require('node-lite-profiler');

const app = express();

// Add profiler middleware to all routes
app.use(expressMiddleware(profiler));

app.get('/users/:id', async (req, res) => {
  await profiledFetchUser();
  res.send({ id: req.params.id });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

* Automatically tracks per-route metrics
* Aggregates percentiles (p50, p90, p99) per route
* Handles concurrent requests with `inFlight` tracking

---

## Wrapping Functions

```js
const profiledFunction = wrapFunction(profiler, 'functionName', asyncFunction);

// Now calling profiledFunction will measure CPU, memory, and time
await profiledFunction();
```

* Works with **sync** and **async** functions
* Automatically handles errors and decrements in-flight counters

---

## Aggregates & Flush

Manual flush:

```js
profiler.flush();
```

* Computes percentiles per function/API
* Clears stored metrics for the next interval
* Can also use `flushIntervalMs` for automatic periodic flush

**Example output:**

```json
{
  "function:fetchUser": { "count": 5, "p50": 120, "p90": 180, "p99": 200 },
  "api:GET /users/:id": { "count": 20, "p50": 30, "p90": 50, "p99": 80 }
}
```

---

## Concurrency & Async

* Handles multiple async executions in parallel
* `inFlight` counter tracks concurrent executions per function/API
* Percentiles computed over all samples

---

## Limitations

* CPU/memory are **process-wide**, not exact per async task
* Per-route aggregation assumes **route path is stable**
* Async_hooks tracking may add minor overhead

---

## Next Steps / How to Experiment

1. Fork the repo and try profiling multiple functions/APIs
2. Experiment with **different sampling rates**
3. Try integrating profiler into a real Node.js server

This profiler is designed to help developers **understand real performance metrics** without much setup, while keeping the usage simple and minimal.
