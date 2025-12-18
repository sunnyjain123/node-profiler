const Profiler = require("./profiler/profiler");
const { wrapFunction } = require("./wrappers/functionWrapper");
const { expressMiddleware } = require("./wrappers/middleware");

const normalizeConfig = require("./config/normalize");
const createMatcher = require("./config/matcher");

function createProfiler(userConfig = {}) {
    const config = normalizeConfig(userConfig);
    const matcher = createMatcher(config);
    return new Profiler(config, matcher);
}

module.exports = {
    createProfiler,
    wrapFunction,
    expressMiddleware
};
