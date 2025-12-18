function measureCPU() {
    const start = process.cpuUsage();

    return function end() {
        const diff = process.cpuUsage(start);
        return (diff.user + diff.system) / 1000; // ms
    };
}

module.exports = { measureCPU };
