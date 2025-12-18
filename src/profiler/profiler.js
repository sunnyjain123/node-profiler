const async_hooks = require("async_hooks");
const { shouldSample } = require("../core/sampler");
const { record, getAggregates, reset } = require("../core/aggregator");
const debugLog = require("../utils/debug");

class Profiler {
    constructor(config, matcher) {
        this.config = config;
        this.matcher = matcher;

        this.inFlight = new Map();

        // Track async execution context (future use)
        this.executionMap = new Map();
        this.hook = async_hooks.createHook({
            init: (asyncId, type, triggerAsyncId) => {
                const parent = this.executionMap.get(triggerAsyncId);
                if (parent) this.executionMap.set(asyncId, parent);
            },
            destroy: (asyncId) => {
                this.executionMap.delete(asyncId);
            }
        });

        this.hook.enable();

        debugLog(this.config, "Profiler initialized");
    }

    increment(name) {
        const next = (this.inFlight.get(name) || 0) + 1;
        this.inFlight.set(name, next);
        debugLog(this.config, `In-flight increment [${name}] → ${next}`);
    }

    decrement(name) {
        const current = this.inFlight.get(name) || 1;
        if (current <= 1) {
            this.inFlight.delete(name);
            debugLog(this.config, `In-flight cleared [${name}]`);
        } else {
            this.inFlight.set(name, current - 1);
            debugLog(this.config, `In-flight decrement [${name}] → ${current - 1}`);
        }
    }

    getInFlight(name) {
        return this.inFlight.get(name) || 0;
    }

    async run(name, fn, context = { type: "function" }) {
        debugLog(this.config, "Attempting profile:", name, context.type);

        // 1️⃣ Matching
        if (!this.matcher({ name, type: context.type })) {
            debugLog(this.config, "Skipped by matcher:", name);
            return fn();
        }

        // 2️⃣ Sampling
        if (!shouldSample(this.config.sampleRate)) {
            debugLog(this.config, "Skipped by sampler:", name);
            return fn();
        }

        this.increment(name);

        const startTime = Date.now();
        const startCPU = process.cpuUsage();

        let result;
        try {
            result = fn();
            if (result instanceof Promise) {
                result = await result;
            }
        } catch (err) {
            debugLog(this.config, "Execution error:", name, err);
            if (typeof this.config.onError === "function") {
                this.config.onError(err);
            }
            throw err;
        } finally {
            this.decrement(name);
        }

        const durationMs = Date.now() - startTime;
        const cpuUsage = process.cpuUsage(startCPU);

        const metrics = {
            timeMs: durationMs,
            cpuMs: (cpuUsage.user + cpuUsage.system) / 1000,
            memoryBytes: process.memoryUsage().heapUsed,
            inFlight: this.getInFlight(name)
        };

        const execution = {
            context: { name, type: context.type },
            metrics
        };

        record(execution);

        debugLog(this.config, "Recorded execution:", execution);

        if (typeof this.config.onResult === "function") {
            this.config.onResult(execution);
        }

        return result;
    }

    flush() {
        const aggregates = getAggregates();

        if (typeof this.config.onFlush === "function") {
            this.config.onFlush(aggregates);
        }

        if (this.config.debug) {
            console.log("[node-profiler] Flushed aggregates:", aggregates);
        }

        reset();
    }


}

module.exports = Profiler;
