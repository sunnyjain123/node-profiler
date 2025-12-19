const defaults = require("./defaults");

function normalizeConfig(userConfig = {}) {
    const config = {
        ...defaults,
        ...userConfig
    };

    // Defensive normalization
    config.types = Array.isArray(config.types)
        ? config.types
        : defaults.types;

    config.include = Array.isArray(config.include)
        ? config.include
        : [];

    config.exclude = Array.isArray(config.exclude)
        ? config.exclude
        : [];

    config.sampleRate =
        typeof config.sampleRate === "number"
            ? config.sampleRate
            : defaults.sampleRate;

    config.onResult =
        typeof config.onResult === "function"
            ? config.onResult
            : defaults.onResult;

    config.onError =
        typeof config.onError === "function"
            ? config.onError
            : defaults.onError;

    config.onFlush =
        typeof config.onFlush === "function"
            ? config.onFlush
            : defaults.onFlush;

    return config;
}

module.exports = normalizeConfig;
