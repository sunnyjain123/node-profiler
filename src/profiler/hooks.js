// src/profiler/hooks.js

function safeCall(fn, payload) {
    try {
        if (typeof fn === "function") {
            fn(payload);
        }
    } catch (_) {
        // swallow hook errors by design
    }
}

module.exports = { safeCall };
