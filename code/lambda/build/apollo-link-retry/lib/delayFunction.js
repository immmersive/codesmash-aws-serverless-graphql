export function buildDelayFunction(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.initial, initial = _c === void 0 ? 300 : _c, _d = _b.max, max = _d === void 0 ? Infinity : _d, _e = _b.jitter, jitter = _e === void 0 ? true : _e;
    var baseDelay;
    if (jitter) {
        // If we're jittering, baseDelay is half of the maximum delay for that
        // attempt (and is, on average, the delay we will encounter).
        baseDelay = initial;
    }
    else {
        // If we're not jittering, adjust baseDelay so that the first attempt
        // lines up with initialDelay, for everyone's sanity.
        baseDelay = initial / 2;
    }
    return function delayFunction(count) {
        var delay = Math.min(max, baseDelay * Math.pow(2, count));
        if (jitter) {
            // We opt for a full jitter approach for a mostly uniform distribution,
            // but bound it within initialDelay and delay for everyone's sanity.
            delay = Math.random() * delay;
        }
        return delay;
    };
}
//# sourceMappingURL=delayFunction.js.map