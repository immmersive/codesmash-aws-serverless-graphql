"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var apollo_link_1 = require("apollo-link");
var DedupLink = (function (_super) {
    tslib_1.__extends(DedupLink, _super);
    function DedupLink() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.inFlightRequestObservables = new Map();
        _this.subscribers = new Map();
        return _this;
    }
    DedupLink.prototype.request = function (operation, forward) {
        var _this = this;
        if (operation.getContext().forceFetch) {
            return forward(operation);
        }
        var key = operation.toKey();
        if (!this.inFlightRequestObservables.get(key)) {
            var singleObserver_1 = forward(operation);
            var subscription_1;
            var sharedObserver = new apollo_link_1.Observable(function (observer) {
                if (!_this.subscribers.has(key))
                    _this.subscribers.set(key, new Set());
                _this.subscribers.get(key).add(observer);
                if (!subscription_1) {
                    subscription_1 = singleObserver_1.subscribe({
                        next: function (result) {
                            var subscribers = _this.subscribers.get(key);
                            _this.subscribers.delete(key);
                            _this.inFlightRequestObservables.delete(key);
                            if (subscribers) {
                                subscribers.forEach(function (obs) { return obs.next(result); });
                                subscribers.forEach(function (obs) { return obs.complete(); });
                            }
                        },
                        error: function (error) {
                            var subscribers = _this.subscribers.get(key);
                            _this.subscribers.delete(key);
                            _this.inFlightRequestObservables.delete(key);
                            if (subscribers) {
                                subscribers.forEach(function (obs) { return obs.error(error); });
                            }
                        },
                    });
                }
                return function () {
                    if (_this.subscribers.has(key)) {
                        _this.subscribers.get(key).delete(observer);
                        if (_this.subscribers.get(key).size === 0) {
                            _this.inFlightRequestObservables.delete(key);
                            if (subscription_1)
                                subscription_1.unsubscribe();
                        }
                    }
                };
            });
            this.inFlightRequestObservables.set(key, sharedObserver);
        }
        return this.inFlightRequestObservables.get(key);
    };
    return DedupLink;
}(apollo_link_1.ApolloLink));
exports.DedupLink = DedupLink;
//# sourceMappingURL=dedupLink.js.map