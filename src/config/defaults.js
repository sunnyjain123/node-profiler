module.exports = {
    enabled: true,
    sampleRate: 1,
    types: ["function", "http"],
    include: [],
    exclude: [],
    aggregation: {
        percentiles: [50, 90, 99]
    },
    debug: false,
    onResult: null,
    onError: null,
    flushIntervalMs: null
};