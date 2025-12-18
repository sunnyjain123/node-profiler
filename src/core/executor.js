// src/core/executor.js

const { startMeasurements } = require("../measure");

/**
 * Executes a function safely while collecting metrics.
 * Supports sync and async functions.
 *
 * @param {Function} fn - user function to execute
 * @param {Object} context - metadata (name, type, etc.)
 */
async function execute(fn, context = {}) {
    const stopMeasurements = startMeasurements();

    let result;
    let error = null;

    try {
        result = fn();

        // Handle async functions
        if (result && typeof result.then === "function") {
            result = await result;
        }

        return {
            ok: true,
            result,
            error: null,
            metrics: stopMeasurements(),
            context
        };
    } catch (err) {
        error = err;

        return {
            ok: false,
            result: null,
            error,
            metrics: stopMeasurements(),
            context
        };
    }
}

module.exports = { execute };
