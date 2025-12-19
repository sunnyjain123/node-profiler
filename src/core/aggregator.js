const store = new Map();

/**
 * Record a metric for a function or API
 */
function record(result) {
    const key = `${result.context.type}:${result.context.name}`;
    if (!store.has(key)) store.set(key, []);
    store.get(key).push(result.metrics.timeMs);
}

/**
 * Compute percentiles from an array of numbers
 */
function getPercentiles(values) {
    if (!values || values.length === 0) return { p50: 0, p90: 0, p99: 0, count: 0 };
    const sorted = [...values].sort((a, b) => a - b);
    const percentile = (p) =>
        sorted[Math.floor((p / 100) * (sorted.length - 1))] || 0;

    return {
        p50: percentile(50),
        p90: percentile(90),
        p99: percentile(99),
        count: sorted.length
    };
}

/**
 * Build aggregates for all recorded keys
 */
function getAggregates() {
    const result = {};
    for (const [key, arr] of store.entries()) {
        result[key] = getPercentiles(arr);
    }
    return result;
}

/**
 * Clear all stored metrics
 */
function reset() {
    store.clear();
}

module.exports = { record, getAggregates, reset };
