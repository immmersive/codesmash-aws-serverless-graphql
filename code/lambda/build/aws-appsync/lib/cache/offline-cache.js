"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
/*!
 * Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
var utils_1 = require("../utils");
var apollo_cache_inmemory_1 = require("apollo-cache-inmemory");
exports.defaultDataIdFromObject = apollo_cache_inmemory_1.defaultDataIdFromObject;
var deltaSync_1 = require("../deltaSync");
var logger = utils_1.rootLogger.extend('offline-cache');
// Offline schema keys: Do not change in a non-backwards-compatible way
exports.NORMALIZED_CACHE_KEY = 'appsync';
exports.METADATA_KEY = 'appsync-metadata';
var WRITE_CACHE_ACTION = 'AAS_WRITE_CACHE';
function isOfflineCacheOptions(obj) {
    return !!obj.store;
}
;
var MyCache = /** @class */ (function (_super) {
    __extends(MyCache, _super);
    function MyCache(optionsOrStore, config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.storeCacheRootMutation = false;
        if (isOfflineCacheOptions(optionsOrStore)) {
            var store = optionsOrStore.store, _a = optionsOrStore.storeCacheRootMutation, storeCacheRootMutation = _a === void 0 ? false : _a;
            _this.store = store;
            _this.storeCacheRootMutation = storeCacheRootMutation;
        }
        else {
            _this.store = optionsOrStore;
        }
        var cancelSubscription = _this.store.subscribe(function () {
            var _a = _this.store.getState(), _b = exports.NORMALIZED_CACHE_KEY, _c = _a[_b], normCache = _c === void 0 ? {} : _c, _d = _a.rehydrated, rehydrated = _d === void 0 ? false : _d;
            _super.prototype.restore.call(_this, __assign({}, normCache));
            if (rehydrated) {
                logger('Rehydrated! Cancelling subscription.');
                cancelSubscription();
            }
        });
        return _this;
    }
    MyCache.prototype.restore = function (data) {
        boundWriteCache(this.store, data);
        _super.prototype.restore.call(this, data);
        _super.prototype.broadcastWatches.call(this);
        return this;
    };
    MyCache.prototype.write = function (write) {
        _super.prototype.write.call(this, write);
        if (!this.storeCacheRootMutation && write.dataId === 'ROOT_MUTATION') {
            this.data.delete('ROOT_MUTATION');
        }
        if (this.data && typeof this.data.record === 'undefined') {
            // do not persist contents of a RecordingCache
            var data = _super.prototype.extract.call(this, true);
            boundWriteCache(this.store, data);
        }
        else {
            logger('No dispatch for RecordingCache');
        }
    };
    MyCache.prototype.reset = function () {
        logger('Resetting cache');
        boundWriteCache(this.store, {});
        return _super.prototype.reset.call(this);
    };
    MyCache.prototype.getIdsMap = function () {
        var _a = exports.METADATA_KEY, idsMap = this.store.getState()[_a].idsMap;
        return __assign({}, idsMap);
    };
    return MyCache;
}(apollo_cache_inmemory_1.InMemoryCache));
exports.default = MyCache;
var boundWriteCache = function (store, data) {
    logger("Dispatching " + WRITE_CACHE_ACTION);
    store.dispatch(writeThunk(WRITE_CACHE_ACTION, data));
};
var writeThunk = function (type, payload) { return function (dispatch, _getState) { return dispatch({
    type: type,
    payload: payload,
}); }; };
exports.reducer = function () {
    var _a;
    return (_a = {},
        _a[exports.NORMALIZED_CACHE_KEY] = function (state, action) {
            if (state === void 0) { state = {}; }
            var type = action.type, normCache = action.payload;
            switch (type) {
                case WRITE_CACHE_ACTION:
                    return __assign({}, normCache);
                default:
                    return state;
            }
        },
        _a);
};
