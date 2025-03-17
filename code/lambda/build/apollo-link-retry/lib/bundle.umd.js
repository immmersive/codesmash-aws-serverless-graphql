(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('apollo-link')) :
    typeof define === 'function' && define.amd ? define(['exports', 'apollo-link'], factory) :
    (factory((global.apolloLink = global.apolloLink || {}, global.apolloLink.retry = {}),global.apolloLink.core));
}(this, (function (exports,apolloLink) { 'use strict';

    function buildDelayFunction(_a) {
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

    function buildRetryFunction(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.max, max = _c === void 0 ? 5 : _c, retryIf = _b.retryIf;
        return function retryFunction(count, operation, error) {
            if (count >= max)
                return false;
            return retryIf ? retryIf(error, operation) : !!error;
        };
    }

    var __extends = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    /**
     * Tracking and management of operations that may be (or currently are) retried.
     */
    var RetryableOperation = /** @class */ (function () {
        function RetryableOperation(operation, nextLink, delayFor, retryIf) {
            var _this = this;
            this.operation = operation;
            this.nextLink = nextLink;
            this.delayFor = delayFor;
            this.retryIf = retryIf;
            this.retryCount = 0;
            this.values = [];
            this.complete = false;
            this.canceled = false;
            this.observers = [];
            this.currentSubscription = null;
            this.onNext = function (value) {
                _this.values.push(value);
                for (var _i = 0, _a = _this.observers; _i < _a.length; _i++) {
                    var observer = _a[_i];
                    if (!observer)
                        continue;
                    observer.next(value);
                }
            };
            this.onComplete = function () {
                _this.complete = true;
                for (var _i = 0, _a = _this.observers; _i < _a.length; _i++) {
                    var observer = _a[_i];
                    if (!observer)
                        continue;
                    observer.complete();
                }
            };
            this.onError = function (error) { return __awaiter(_this, void 0, void 0, function () {
                var shouldRetry, _i, _a, observer;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.retryCount += 1;
                            return [4 /*yield*/, this.retryIf(this.retryCount, this.operation, error)];
                        case 1:
                            shouldRetry = _b.sent();
                            if (shouldRetry) {
                                this.scheduleRetry(this.delayFor(this.retryCount, this.operation, error));
                                return [2 /*return*/];
                            }
                            this.error = error;
                            for (_i = 0, _a = this.observers; _i < _a.length; _i++) {
                                observer = _a[_i];
                                if (!observer)
                                    continue;
                                observer.error(error);
                            }
                            return [2 /*return*/];
                    }
                });
            }); };
        }
        /**
         * Register a new observer for this operation.
         *
         * If the operation has previously emitted other events, they will be
         * immediately triggered for the observer.
         */
        RetryableOperation.prototype.subscribe = function (observer) {
            if (this.canceled) {
                throw new Error("Subscribing to a retryable link that was canceled is not supported");
            }
            this.observers.push(observer);
            // If we've already begun, catch this observer up.
            for (var _i = 0, _a = this.values; _i < _a.length; _i++) {
                var value = _a[_i];
                observer.next(value);
            }
            if (this.complete) {
                observer.complete();
            }
            else if (this.error) {
                observer.error(this.error);
            }
        };
        /**
         * Remove a previously registered observer from this operation.
         *
         * If no observers remain, the operation will stop retrying, and unsubscribe
         * from its downstream link.
         */
        RetryableOperation.prototype.unsubscribe = function (observer) {
            var index = this.observers.indexOf(observer);
            if (index < 0) {
                throw new Error("RetryLink BUG! Attempting to unsubscribe unknown observer!");
            }
            // Note that we are careful not to change the order of length of the array,
            // as we are often mid-iteration when calling this method.
            this.observers[index] = null;
            // If this is the last observer, we're done.
            if (this.observers.every(function (o) { return o === null; })) {
                this.cancel();
            }
        };
        /**
         * Start the initial request.
         */
        RetryableOperation.prototype.start = function () {
            if (this.currentSubscription)
                return; // Already started.
            this.try();
        };
        /**
         * Stop retrying for the operation, and cancel any in-progress requests.
         */
        RetryableOperation.prototype.cancel = function () {
            if (this.currentSubscription) {
                this.currentSubscription.unsubscribe();
            }
            clearTimeout(this.timerId);
            this.timerId = null;
            this.currentSubscription = null;
            this.canceled = true;
        };
        RetryableOperation.prototype.try = function () {
            this.currentSubscription = this.nextLink(this.operation).subscribe({
                next: this.onNext,
                error: this.onError,
                complete: this.onComplete,
            });
        };
        RetryableOperation.prototype.scheduleRetry = function (delay) {
            var _this = this;
            if (this.timerId) {
                throw new Error("RetryLink BUG! Encountered overlapping retries");
            }
            this.timerId = setTimeout(function () {
                _this.timerId = null;
                _this.try();
            }, delay);
        };
        return RetryableOperation;
    }());
    var RetryLink = /** @class */ (function (_super) {
        __extends(RetryLink, _super);
        function RetryLink(_a) {
            var _b = _a === void 0 ? {} : _a, delay = _b.delay, attempts = _b.attempts;
            var _this = _super.call(this) || this;
            _this.delayFor =
                typeof delay === 'function' ? delay : buildDelayFunction(delay);
            _this.retryIf =
                typeof attempts === 'function' ? attempts : buildRetryFunction(attempts);
            return _this;
        }
        RetryLink.prototype.request = function (operation, nextLink) {
            var retryable = new RetryableOperation(operation, nextLink, this.delayFor, this.retryIf);
            retryable.start();
            return new apolloLink.Observable(function (observer) {
                retryable.subscribe(observer);
                return function () {
                    retryable.unsubscribe(observer);
                };
            });
        };
        return RetryLink;
    }(apolloLink.ApolloLink));

    exports.RetryLink = RetryLink;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=bundle.umd.js.map
