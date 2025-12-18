// src/core/sampler.js

function shouldSample(rate) {
    if (rate >= 1) return true;
    return Math.random() < rate;
}

module.exports = { shouldSample };
