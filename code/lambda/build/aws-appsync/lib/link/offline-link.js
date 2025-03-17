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
var apollo_cache_inmemory_1 = require("apollo-cache-inmemory");
var apollo_link_1 = require("apollo-link");
var apollo_utilities_1 = require("apollo-utilities");
var constants_1 = require("@redux-offline/redux-offline/lib/constants");
var cache_1 = require("../cache");
var utils_1 = require("../utils");
var apollo_client_1 = require("apollo-client");
var retry_link_1 = require("./retry-link");
var logger = utils_1.rootLogger.extend('offline-link');
var actions = {
    SAVE_SNAPSHOT: 'SAVE_SNAPSHOT',
    ENQUEUE: 'ENQUEUE_OFFLINE_MUTATION',
    COMMIT: 'COMMIT_OFFLINE_MUTATION',
    ROLLBACK: 'ROLLBACK_OFFLINE_MUTATION',
    SAVE_SERVER_ID: 'SAVE_SERVER_ID',
};
var IS_OPTIMISTIC_KEY = typeof Symbol !== 'undefined' ? Symbol('isOptimistic') : '@@isOptimistic';
exports.isOptimistic = function (obj) { return typeof obj[IS_OPTIMISTIC_KEY] !== undefined ? !!obj[IS_OPTIMISTIC_KEY] : false; };
var OfflineLink = /** @class */ (function (_super) {
    __extends(OfflineLink, _super);
    function OfflineLink(store) {
        var _this = _super.call(this) || this;
        _this.store = store;
        return _this;
    }
    OfflineLink.prototype.request = function (operation, forward) {
        var _this = this;
        return new apollo_link_1.Observable(function (observer) {
            var _a;
            var online = _this.store.getState().offline.online;
            var operationType = apollo_utilities_1.getOperationDefinition(operation.query).operation;
            var isMutation = operationType === 'mutation';
            var isQuery = operationType === 'query';
            if (!online && isQuery) {
                var data = processOfflineQuery(operation, _this.store);
                observer.next({ data: data });
                observer.complete();
                return function () { return null; };
            }
            if (isMutation) {
                var _b = operation.getContext(), _c = _b.AASContext, _d = (_c === void 0 ? {} : _c).doIt, doIt = _d === void 0 ? false : _d, cache = _b.cache;
                if (!doIt) {
                    var _e = cache_1.METADATA_KEY, enqueuedMutations = _this.store.getState()[_e].snapshot.enqueuedMutations;
                    if (enqueuedMutations === 0) {
                        exports.boundSaveSnapshot(_this.store, cache);
                    }
                    var data = enqueueMutation(operation, _this.store, observer);
                    if (!online) {
                        observer.next((_a = { data: data }, _a[IS_OPTIMISTIC_KEY] = true, _a));
                        observer.complete();
                    }
                    return function () { return null; };
                }
            }
            var handle = forward(operation).subscribe({
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
            });
            return function () {
                if (handle)
                    handle.unsubscribe();
            };
        });
    };
    return OfflineLink;
}(apollo_link_1.ApolloLink));
exports.OfflineLink = OfflineLink;
exports.boundSaveSnapshot = function (store, cache) { return store.dispatch(saveSnapshot(cache)); };
var saveSnapshot = function (cache) { return ({
    type: actions.SAVE_SNAPSHOT,
    payload: { cache: cache },
}); };
var processOfflineQuery = function (operation, theStore) {
    var _a = cache_1.NORMALIZED_CACHE_KEY, _b = theStore.getState()[_a], normalizedCache = _b === void 0 ? {} : _b;
    var query = operation.query, variables = operation.variables;
    var cache = operation.getContext().cache;
    var store = apollo_cache_inmemory_1.defaultNormalizedCacheFactory(normalizedCache);
    var data = cache.storeReader.readQueryFromStore({
        store: store,
        query: query,
        variables: variables,
    });
    return data;
};
var enqueueMutation = function (operation, theStore, observer) {
    var mutation = operation.query, variables = operation.variables;
    var _a = operation.getContext().AASContext, origOptimistic = _a.optimisticResponse, update = _a.update, updateQueries = _a.updateQueries, refetchQueries = _a.refetchQueries, fetchPolicy = _a.fetchPolicy;
    var optimisticResponse = typeof origOptimistic === 'function' ? origOptimistic(variables) : origOptimistic;
    setImmediate(function () {
        var effect = {
            optimisticResponse: optimisticResponse,
            operation: operation,
            update: update,
            updateQueries: updateQueries,
            refetchQueries: refetchQueries,
            fetchPolicy: fetchPolicy,
            observer: observer,
        };
        theStore.dispatch({
            type: actions.ENQUEUE,
            payload: { optimisticResponse: optimisticResponse },
            meta: {
                offline: {
                    effect: effect,
                    commit: { type: actions.COMMIT },
                    rollback: { type: actions.ROLLBACK },
                }
            }
        });
    });
    var result;
    if (optimisticResponse) {
        result = optimisticResponse;
    }
    else {
        var mutationDefinition = apollo_utilities_1.getMutationDefinition(mutation);
        result = mutationDefinition.selectionSet.selections.reduce(function (acc, elem) {
            acc[apollo_utilities_1.resultKeyNameFromField(elem)] = null;
            return acc;
        }, {});
    }
    return result;
};
var effect = function (store, client, effect, action, callback) { return __awaiter(_this, void 0, void 0, function () {
    var _a, doIt, origOptimistic, _b, origVars, mutation, context, update, updateQueries, refetchQueries, fetchPolicy, observer, _c, idsMap, variables, optimisticResponse;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                doIt = true;
                origOptimistic = effect.optimisticResponse, _b = effect.operation, origVars = _b.variables, mutation = _b.query, context = _b.context, update = effect.update, updateQueries = effect.updateQueries, refetchQueries = effect.refetchQueries, fetchPolicy = effect.fetchPolicy, observer = effect.observer;
                return [4 /*yield*/, client.hydrated()];
            case 1:
                _d.sent();
                _c = cache_1.METADATA_KEY, idsMap = store.getState()[_c].idsMap;
                variables = __assign({}, exports.replaceUsingMap(__assign({}, origVars), idsMap), (_a = {}, _a[retry_link_1.SKIP_RETRY_KEY] = true, _a));
                optimisticResponse = exports.replaceUsingMap(__assign({}, origOptimistic), idsMap);
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if (!client.queryManager) {
                            client.initQueryManager();
                        }
                        var buildOperationForLink = client.queryManager.buildOperationForLink;
                        var extraContext = __assign({ AASContext: {
                                doIt: doIt
                            } }, context, { optimisticResponse: optimisticResponse });
                        var operation = buildOperationForLink.call(client.queryManager, mutation, variables, extraContext);
                        logger('Executing link', operation);
                        apollo_link_1.execute(client.link, operation).subscribe({
                            next: function (data) {
                                var _a;
                                boundSaveServerId(store, optimisticResponse, data.data);
                                var _b = store.getState(), _c = cache_1.METADATA_KEY, _d = _b[_c], idsMap = _d.idsMap, cacheSnapshot = _d.snapshot.cache, _e = _b.offline.outbox, enquededMutations = _e.slice(1);
                                // Restore from cache snapshot
                                client.cache.restore(cacheSnapshot);
                                var dataStore = client.queryManager.dataStore;
                                if (fetchPolicy !== 'no-cache') {
                                    dataStore.markMutationResult({
                                        mutationId: null,
                                        result: data,
                                        document: mutation,
                                        variables: variables,
                                        updateQueries: {},
                                        update: update
                                    });
                                }
                                exports.boundSaveSnapshot(store, client.cache);
                                // Apply enqueued update functions to new cache
                                var enqueuedActionsFilter = [
                                    exports.offlineEffectConfig.enqueueAction
                                ];
                                enquededMutations
                                    .filter(function (_a) {
                                    var type = _a.type;
                                    return enqueuedActionsFilter.indexOf(type) > -1;
                                })
                                    .forEach(function (_a) {
                                    var effect = _a.meta.offline.effect;
                                    var _b = effect, _c = _b.operation, _d = _c === void 0 ? {} : _c, _e = _d.variables, variables = _e === void 0 ? {} : _e, _f = _d.query, document = _f === void 0 ? null : _f, update = _b.update, origOptimisticResponse = _b.optimisticResponse, fetchPolicy = _b.fetchPolicy;
                                    if (typeof update !== 'function') {
                                        logger('No update function for mutation', { document: document, variables: variables });
                                        return;
                                    }
                                    var optimisticResponse = exports.replaceUsingMap(__assign({}, origOptimisticResponse), idsMap);
                                    var result = { data: optimisticResponse };
                                    if (fetchPolicy !== 'no-cache') {
                                        logger('Running update function for mutation', { document: document, variables: variables });
                                        dataStore.markMutationResult({
                                            mutationId: null,
                                            result: result,
                                            document: document,
                                            variables: variables,
                                            updateQueries: {},
                                            update: update
                                        });
                                    }
                                });
                                client.queryManager.broadcastQueries();
                                resolve({ data: data });
                                if (observer.next && !observer.closed) {
                                    observer.next(__assign({}, data, (_a = {}, _a[IS_OPTIMISTIC_KEY] = false, _a)));
                                    observer.complete();
                                }
                                else {
                                    // throw new Error('Manually interact with cache');
                                }
                                if (typeof callback === 'function') {
                                    var mutationName_1 = utils_1.getOperationFieldName(mutation);
                                    var _f = data.context || {}, _g = _f.additionalDataContext, _h = (_g === void 0 ? {} : _g).newVars, newVars_1 = _h === void 0 ? operation.variables : _h, restContext = __rest(_f, ["additionalDataContext"]);
                                    if (!Object.keys(restContext || {}).length) {
                                        delete data.context;
                                    }
                                    else {
                                        data.context = restContext;
                                    }
                                    apollo_utilities_1.tryFunctionOrLogError(function () {
                                        var errors = data.errors ? {
                                            mutation: mutationName_1,
                                            variables: newVars_1,
                                            error: new apollo_client_1.ApolloError({
                                                graphQLErrors: data.errors,
                                            }),
                                            notified: !!observer.next,
                                        } : null;
                                        var success = errors === null ? __assign({ mutation: mutationName_1, variables: newVars_1 }, data, { notified: !!observer.next }) : null;
                                        callback(errors, success);
                                    });
                                }
                            },
                            error: function (err) {
                                logger('Error when executing link', err);
                                reject(err);
                            }
                        });
                    })];
        }
    });
}); };
var reducer = function (dataIdFromObject) { return function (state, action) {
    var type = action.type, payload = action.payload;
    switch (type) {
        case constants_1.PERSIST_REHYDRATE:
            var _a = cache_1.METADATA_KEY, rehydratedState = payload[_a];
            return rehydratedState || state;
        default:
            var _b = state || {}, _c = _b.idsMap, origIdsMap = _c === void 0 ? {} : _c, _d = _b.snapshot, origSnapshot = _d === void 0 ? {} : _d, restState = __rest(_b, ["idsMap", "snapshot"]);
            var snapshot = snapshotReducer(origSnapshot, action);
            var idsMap = idsMapReducer(origIdsMap, __assign({}, action, { remainingMutations: snapshot.enqueuedMutations }), dataIdFromObject);
            return __assign({}, restState, { snapshot: snapshot,
                idsMap: idsMap });
    }
}; };
var snapshotReducer = function (state, action) {
    var enqueuedMutations = enqueuedMutationsReducer(state && state.enqueuedMutations, action);
    var cache = cacheSnapshotReducer(state && state.cache, __assign({}, action, { enqueuedMutations: enqueuedMutations }));
    return {
        enqueuedMutations: enqueuedMutations,
        cache: cache,
    };
};
var enqueuedMutationsReducer = function (state, action) {
    if (state === void 0) { state = 0; }
    var type = action.type;
    switch (type) {
        case actions.ENQUEUE:
            return state + 1;
        case actions.COMMIT:
        case actions.ROLLBACK:
            return state - 1;
        default:
            return state;
    }
};
var cacheSnapshotReducer = function (state, action) {
    if (state === void 0) { state = {}; }
    var type = action.type, payload = action.payload;
    switch (type) {
        case actions.SAVE_SNAPSHOT:
            var cache = payload.cache;
            var cacheContents = __assign({}, cache.extract(false));
            return cacheContents;
        default:
            return state;
    }
};
var boundSaveServerId = function (store, optimisticResponse, data) { return store.dispatch(saveServerId(optimisticResponse, data)); };
var saveServerId = function (optimisticResponse, data) { return ({
    type: actions.SAVE_SERVER_ID,
    payload: { data: data, optimisticResponse: optimisticResponse },
}); };
var idsMapReducer = function (state, action, dataIdFromObject) {
    if (state === void 0) { state = {}; }
    var type = action.type, _a = action.payload, payload = _a === void 0 ? {} : _a;
    var optimisticResponse = payload.optimisticResponse;
    switch (type) {
        case actions.ENQUEUE:
            var ids = exports.getIds(dataIdFromObject, optimisticResponse);
            var entries = Object.values(ids).reduce(function (acc, id) { return (acc[id] = null, acc); }, {});
            return __assign({}, state, entries);
        case actions.COMMIT:
            var remainingMutations = action.remainingMutations;
            // Clear ids map on last mutation
            return remainingMutations ? state : {};
        case actions.SAVE_SERVER_ID:
            var data = payload.data;
            var oldIds = exports.getIds(dataIdFromObject, optimisticResponse);
            var newIds = exports.getIds(dataIdFromObject, data);
            var mapped = mapIds(oldIds, newIds);
            return __assign({}, state, mapped);
        default:
            return state;
    }
};
var discard = function (callback, error, action, retries) {
    var discardResult = _discard(error, action, retries);
    if (discardResult) {
        // Call global error callback and observer
        var observer = action.meta.offline.effect.observer;
        if (observer && !observer.closed) {
            observer.error(error);
        }
        if (typeof callback === 'function') {
            apollo_utilities_1.tryFunctionOrLogError(function () {
                callback({ error: error }, null);
            });
        }
    }
    return discardResult;
};
var _discard = function (error, action, retries) {
    var _a = error.graphQLErrors, graphQLErrors = _a === void 0 ? [] : _a;
    if (graphQLErrors.length) {
        logger('Discarding action.', action, graphQLErrors);
        return true;
    }
    else {
        var _b = error.networkError, _c = (_b === void 0 ? { graphQLErrors: [] } : _b).graphQLErrors, graphQLErrors_1 = _c === void 0 ? [] : _c;
        var appSyncClientError = graphQLErrors_1.find(function (err) { return err.errorType && err.errorType.startsWith('AWSAppSyncClient:'); });
        if (appSyncClientError) {
            logger('Discarding action.', action, appSyncClientError);
            return true;
        }
    }
    return error.permanent || retries > 10;
};
//#region utils
exports.replaceUsingMap = function (obj, map) {
    if (map === void 0) { map = {}; }
    if (!obj || !map) {
        return obj;
    }
    var newVal = map[obj];
    if (newVal) {
        obj = newVal;
        return obj;
    }
    if (typeof obj === 'object') {
        Object.keys(obj).forEach(function (key) {
            var val = obj[key];
            if (Array.isArray(val)) {
                obj[key] = val.map(function (v, i) { return exports.replaceUsingMap(v, map); });
            }
            else if (typeof val === 'object') {
                obj[key] = exports.replaceUsingMap(val, map);
            }
            else {
                var newVal_1 = map[val];
                if (newVal_1) {
                    obj[key] = newVal_1;
                }
            }
        });
    }
    return obj;
};
exports.getIds = function (dataIdFromObject, obj, path, acc) {
    if (path === void 0) { path = ''; }
    if (acc === void 0) { acc = {}; }
    if (!obj) {
        return acc;
    }
    if (typeof obj === 'object') {
        var dataId = dataIdFromObject(obj);
        if (dataId) {
            var _a = dataId.match(/(.+:)?(.+)/) || [], _b = _a[2], id = _b === void 0 ? null : _b;
            if (utils_1.isUuid(dataId)) {
                acc[path] = id;
            }
        }
        Object.keys(obj).forEach(function (key) {
            var val = obj[key];
            if (Array.isArray(val)) {
                val.forEach(function (v, i) { return exports.getIds(dataIdFromObject, v, path + "." + key + "[" + i + "]", acc); });
            }
            else if (typeof val === 'object') {
                exports.getIds(dataIdFromObject, val, "" + path + (path && '.') + key, acc);
            }
        });
    }
    return exports.getIds(dataIdFromObject, null, path, acc);
};
var intersectingKeys = function (obj1, obj2) {
    if (obj1 === void 0) { obj1 = {}; }
    if (obj2 === void 0) { obj2 = {}; }
    var keys1 = Object.keys(obj1);
    var keys2 = Object.keys(obj2);
    return keys1.filter(function (k) { return keys2.indexOf(k) !== -1; });
};
var mapIds = function (obj1, obj2) { return intersectingKeys(obj1, obj2).reduce(function (acc, k) { return (acc[obj1[k]] = obj2[k], acc); }, {}); };
//#endregion
exports.offlineEffectConfig = {
    enqueueAction: actions.ENQUEUE,
    effect: effect,
    discard: discard,
    reducer: reducer,
};
