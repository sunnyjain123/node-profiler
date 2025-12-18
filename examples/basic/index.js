const {
    createProfiler,
    wrapFunction
} = require("../../src");

const profiler = createProfiler({
    debug: true,
    sampleRate: 1,
    onResult: (data) => {
        console.log("PROFILE RESULT:", JSON.stringify(data, null, 2));
    }
});

async function slowTask() {
    await new Promise(r => setTimeout(r, 150));
    return "done";
}

const profiledTask = wrapFunction(profiler, "slowTask", slowTask);

(async () => {
    await profiledTask();
})();
