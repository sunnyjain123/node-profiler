// src/profiler/lifecycle.js

function enable(profiler) {
    profiler.enabled = true;
}

function disable(profiler) {
    profiler.enabled = false;
}

function flush() {
    // placeholder for exporters / buffers
}

module.exports = { enable, disable, flush };
