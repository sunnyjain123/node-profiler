function expressMiddleware(profiler, options = {}) {
    if (!profiler || typeof profiler.run !== "function") {
        throw new Error(
            "[node-profiler] Invalid profiler instance passed to expressMiddleware"
        );
    }

    return function (req, res, next) {
        const routeName =
            options.name || `${req.method} ${req.route?.path || req.path}`;

        profiler.run(
            routeName,
            () =>
                new Promise((resolve) => {
                    res.on("finish", resolve);
                    res.on("close", resolve);
                    res.on("error", resolve);
                    next();
                }),
            { type: "http" }
        );
    };
}

module.exports = { expressMiddleware };
