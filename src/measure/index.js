const { measureCPU } = require("./cpu");
const { measureMemory } = require("./memory");
const { measureTime } = require("./time");

function startMeasurements() {
    const endTime = measureTime();
    const endCPU = measureCPU();
    const endMemory = measureMemory();

    return function stop() {
        return {
            timeMs: endTime(),
            cpuMs: endCPU(),
            memoryBytes: endMemory()
        };
    };
}

module.exports = { startMeasurements };
