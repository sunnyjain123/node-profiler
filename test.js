const { createProfiler } = require("./src/profiler/createProfiler");


const profiler = createProfiler({
    sampleRate: 0.5
});

console.log(profiler.config);
