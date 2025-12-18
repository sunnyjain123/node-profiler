module.exports = function debug(config, ...args) {
    if (config.debug) {
        console.log("[node-profiler]", ...args);
    }
};
