function measureTime() {
    const start = process.hrtime.bigint();

    return function end() {
        const end = process.hrtime.bigint();
        return Number(end - start) / 1e6; // ms
    };
}

module.exports = { measureTime };
