export function buildRetryFunction(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.max, max = _c === void 0 ? 5 : _c, retryIf = _b.retryIf;
    return function retryFunction(count, operation, error) {
        if (count >= max)
            return false;
        return retryIf ? retryIf(error, operation) : !!error;
    };
}
//# sourceMappingURL=retryFunction.js.map