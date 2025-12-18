function wrapFunction(profiler, name, fn) {
    if (!profiler || typeof profiler.run !== "function") {
        throw new Error(
            "[node-profiler] Invalid profiler instance. Did you forget to call createProfiler()?"
        );
    }

    if (typeof fn !== "function") {
        throw new Error(
            `[node-profiler] wrapFunction expected a function for "${name}"`
        );
    }

    return function wrappedFunction(...args) {
        return profiler.run(name, () => fn.apply(this, args), { type: 'function' });
    };
}


module.exports = { wrapFunction };