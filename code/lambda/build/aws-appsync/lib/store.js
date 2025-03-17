"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
/*!
 * Copyright 2017-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
var utils_1 = require("./utils");
var redux_1 = require("redux");
var redux_offline_1 = require("@redux-offline/redux-offline");
var defaults_1 = require("@redux-offline/redux-offline/lib/defaults");
var constants_1 = require("@redux-offline/redux-offline/lib/constants");
var constants_2 = require("redux-persist/constants");
var redux_thunk_1 = require("redux-thunk");
var index_1 = require("./cache/index");
var retry_link_1 = require("./link/retry-link");
var offline_link_1 = require("./link/offline-link");
var deltaSync_1 = require("./deltaSync");
var apollo_link_1 = require("apollo-link");
var detectNetwork = defaults_1.default.detectNetwork;
var logger = utils_1.rootLogger.extend('store');
exports.DEFAULT_KEY_PREFIX = constants_2.KEY_PREFIX;
var newStore = function (_a) {
    var _b = _a.clientGetter, clientGetter = _b === void 0 ? function () { return null; } : _b, _c = _a.persistCallback, persistCallback = _c === void 0 ? function () { return null; } : _c, dataIdFromObject = _a.dataIdFromObject, keyPrefix = _a.keyPrefix, storage = _a.storage, _d = _a.callback, callback = _d === void 0 ? function () { } : _d;
    logger('Creating store');
    var store = redux_1.createStore(redux_1.combineReducers(__assign({ rehydrated: function (state, action) {
            if (state === void 0) { state = false; }
            switch (action.type) {
                case constants_1.PERSIST_REHYDRATE:
                    return true;
                default:
                    return state;
            }
        } }, index_1.reducer(), reducer(dataIdFromObject))), typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(), redux_1.compose(redux_1.applyMiddleware(redux_thunk_1.default), redux_offline_1.offline(__assign({}, defaults_1.default, { retry: retry_link_1.getEffectDelay, persistCallback: function () {
            logger('Storage ready');
            persistCallback();
        }, persistOptions: __assign({}, (keyPrefix && { keyPrefix: keyPrefix + ":" }), (storage && { storage: storage }), { whitelist: [
                index_1.NORMALIZED_CACHE_KEY,
                index_1.METADATA_KEY,
                'offline',
            ] }), effect: function (effectPayload, action) { return effect(effectPayload, action, store, clientGetter(), callback, detectNetwork); }, discard: function (error, action, retries) { return discard(callback, error, action, retries); } }))));
    return store;
};
exports.createStore = newStore;
var offlineEffectsConfigs = [
    offline_link_1.offlineEffectConfig,
    deltaSync_1.offlineEffectConfig
].filter(Boolean).reduce(function (acc, _a) {
    var enqueueAction = _a.enqueueAction, rest = __rest(_a, ["enqueueAction"]);
    acc[enqueueAction] = __assign({ enqueueAction: enqueueAction }, rest);
    return acc;
}, {});
var reducer = function (dataIdFromObject) {
    var _a;
    return (_a = {},
        _a[index_1.METADATA_KEY] = function (state, action) { return Object.entries(offlineEffectsConfigs)
            .reduce(function (acc, _a) {
            var _b = _a[1].reducer, reducer = _b === void 0 ? function () { return function (x) { return x; }; } : _b;
            return reducer(dataIdFromObject)(acc, action);
        }, state); },
        _a);
};
var effect = function (effect, action, store, clientGetter, callback, offlineStatusChangeCallbackCreator) { return __awaiter(_this, void 0, void 0, function () {
    var config, observable;
    return __generator(this, function (_a) {
        config = offlineEffectsConfigs[action.type];
        observable = new apollo_link_1.Observable(function (observer) {
            offlineStatusChangeCallbackCreator(function (onlineStatus) {
                observer.next(onlineStatus);
            });
            return function () { };
        });
        if (config && config.effect) {
            logger("Executing effect for " + action.type);
            return [2 /*return*/, config.effect(store, clientGetter, effect, action, callback, observable)];
        }
        logger("No effect found for " + action.type);
        return [2 /*return*/];
    });
}); };
var discard = function (callback, error, action, retries) {
    var discard = offlineEffectsConfigs[action.type].discard;
    if (discard) {
        logger("Executing discard for " + action.type, discard);
        return discard(callback, error, action, retries);
    }
    logger("No custom discard found for " + action.type + ". Discarding effect.");
    return true;
};
