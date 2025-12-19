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
                    let done = false;
                    const finish = () => {
                        if (done) return;
                        done = true;
                        resolve();
                    };

                    res.on("finish", finish);
                    res.on("close", finish);
                    res.on("error", finish);

                    next();
                }),
            { type: "http" }
        );
    };
}

module.exports = { expressMiddleware };
