function measureMemory() {
    const start = process.memoryUsage().heapUsed;

    return function end() {
        const end = process.memoryUsage().heapUsed;
        return end - start; // bytes
    };
}

module.exports = { measureMemory };
