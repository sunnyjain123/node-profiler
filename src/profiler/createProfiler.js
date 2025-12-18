const normalizeConfig = require("../config/normalize");
const createMatcher = require("../config/matcher");
const Profiler = require("./profiler");

function createProfiler(userConfig) {
    const config = normalizeConfig(userConfig);
    const matcher = createMatcher(config);

    return new Profiler(config, matcher);
}

module.exports = createProfiler;
