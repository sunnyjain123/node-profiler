function createMatcher(config) {
    const types = config.types || [];

    return function match({ name, type }) {
        if (types.length && !types.includes(type)) return false;

        if (config.exclude.some(pattern => name.includes(pattern))) {
            return false;
        }

        if (config.include.length === 0) return true;

        return config.include.some(pattern => name.includes(pattern));
    };
}

module.exports = createMatcher;
