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
var apollo_cache_inmemory_1 = require("apollo-cache-inmemory");
var offline_cache_1 = require("./cache/offline-cache");
var apollo_utilities_1 = require("apollo-utilities");
var utils_1 = require("./utils");
var apollo_link_1 = require("apollo-link");
var retry_link_1 = require("./link/retry-link");
var graphql_1 = require("graphql");
var offline_1 = require("./helpers/offline");
var offline_link_1 = require("./link/offline-link");
var aws_appsync_subscription_link_1 = require("aws-appsync-subscription-link");
var logger = utils_1.rootLogger.extend('deltasync');
exports.DELTASYNC_KEY = 'deltaSync';
//#endregion
//#region Constants
var actions = {
    ENQUEUE: 'DELTASYNC_ENQUEUE_RECONNECT',
    UPDATE_LASTSYNC: 'DELTASYNC_UPDATE_LASTSYNC',
};
var DEFAULT_UPPER_BOUND_TIME_MS = 24 * 60 * 60 * 1000;
var MIN_UPPER_BOUND_TIME_MS = 2 * 1000;
var BUFFER_MILLISECONDS = 2000;
//#endregion
//#region helpers
var subscriptionMessagesProcessorCreator = function (proxy, updateFunction) {
    var buffer = [];
    var ready = false;
    var wrappedUpdateFunction = function (proxy, record) { return apollo_utilities_1.tryFunctionOrLogError(function () { return updateFunction(proxy, record); }); };
    var processor = {
        enqueue: function (record) {
            if (ready) {
                wrappedUpdateFunction(proxy, record);
                return;
            }
            buffer.push(record);
        },
        ready: function () {
            if (ready) {
                return;
            }
            buffer.forEach(function (record) { return wrappedUpdateFunction(proxy, record); });
            buffer = [];
            ready = true;
        },
        close: function () {
            buffer = [];
            ready = true;
        }
    };
    return processor;
};
exports.hashForOptions = function (options) {
    var _a = options.baseQuery, _b = _a === void 0 ? {} : _a, _c = _b.query, baseQueryQuery = _c === void 0 ? null : _c, _d = _b.variables, baseQueryVariables = _d === void 0 ? {} : _d, _e = options.subscriptionQuery, _f = _e === void 0 ? {} : _e, _g = _f.query, subscriptionQueryQuery = _g === void 0 ? null : _g, _h = _f.variables, subscriptionQueryVariables = _h === void 0 ? {} : _h, _j = options.deltaQuery, _k = _j === void 0 ? {} : _j, _l = _k.query, deltaQueryQuery = _l === void 0 ? null : _l, _m = _k.variables, deltaQueryVariables = _m === void 0 ? {} : _m;
    var baseQuery = baseQueryQuery ? {
        query: graphql_1.print(baseQueryQuery),
        variables: baseQueryVariables,
    } : {};
    var subscriptionQuery = subscriptionQueryQuery ? {
        query: graphql_1.print(subscriptionQueryQuery),
        variables: subscriptionQueryVariables,
    } : {};
    var deltaQuery = deltaQueryQuery ? {
        query: graphql_1.print(deltaQueryQuery),
        variables: deltaQueryVariables,
    } : {};
    return utils_1.hash(JSON.stringify({
        baseQuery: baseQuery,
        subscriptionQuery: subscriptionQuery,
        deltaQuery: deltaQuery,
    }));
};
//#endregion
//#region Redux
var effect = function (store, client, effect, _action, _offlineCallback, offlineStatusChangeObservable) { return __awaiter(_this, void 0, void 0, function () {
    var options, _a, baseQuery, subscriptionQuery, deltaQuery, observer, _b, callback, upperBoundTimeMS, hash, itemInHash, _c, lastSyncTimestamp, _d, baseLastSyncTimestamp, networkStatusSubscription, subscription, baseQueryTimeoutId, subscriptionProcessor, unsubscribeAll, enqueueAgain, handle, STOP_CACHE_RECORDING, recorderCacheWrites, cacheProxy, error_2, _e, _f, _g, idsMap_1, cacheSnapshot, enquededMutations, subsControlLogger_1, baseRefreshIntervalInSeconds, skipBaseQuery, query, update_1, variables, result_1, _h, cacheSnapshot_1, data, query, update_2, variables, result_2, dataStore_1, enqueuedActionsFilter_1, baseQueryTimeout, error_1;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                options = effect.options, _a = effect.options, baseQuery = _a.baseQuery, subscriptionQuery = _a.subscriptionQuery, deltaQuery = _a.deltaQuery, observer = effect.observer, _b = effect.callback, callback = _b === void 0 ? function () { } : _b;
                if (!observer || typeof observer.next !== 'function' || observer.closed) {
                    // If we don't have an observer, we complete this effect (this means the app was closed/opened and a completely 
                    // new deltaSync will happen)
                    return [2 /*return*/];
                }
                upperBoundTimeMS = DEFAULT_UPPER_BOUND_TIME_MS;
                hash = exports.hashForOptions(options);
                itemInHash = store.getState()[offline_cache_1.METADATA_KEY][exports.DELTASYNC_KEY].metadata[hash];
                _c = options.lastSyncTimestamp, lastSyncTimestamp = _c === void 0 ? itemInHash.lastSyncTimestamp : _c, _d = options.baseLastSyncTimestamp, baseLastSyncTimestamp = _d === void 0 ? itemInHash.baseLastSyncTimestamp : _d;
                unsubscribeAll = function () {
                    logger('Unsubscribing');
                    if (networkStatusSubscription)
                        networkStatusSubscription.unsubscribe();
                    if (subscription)
                        subscription.unsubscribe();
                    if (baseQueryTimeoutId)
                        clearTimeout(baseQueryTimeoutId);
                    if (subscriptionProcessor)
                        subscriptionProcessor.close();
                };
                enqueueAgain = function () {
                    unsubscribeAll();
                    logger('Re-queuing', { baseLastSyncTimestamp: baseLastSyncTimestamp, lastSyncTimestamp: lastSyncTimestamp });
                    exports.boundEnqueueDeltaSync(store, __assign({}, options, { lastSyncTimestamp: lastSyncTimestamp, baseLastSyncTimestamp: baseLastSyncTimestamp }), observer, callback);
                };
                if (typeof callback === 'function') {
                    handle = new apollo_link_1.Observable(function () { return function () { return unsubscribeAll(); }; }).subscribe({ next: function () { } });
                    callback(handle);
                }
                networkStatusSubscription = new apollo_link_1.Observable(function (obs) {
                    var handle = offlineStatusChangeObservable.subscribe({
                        next: function (_a) {
                            var online = _a.online;
                            if (!online) {
                                obs.next(null);
                                obs.complete();
                            }
                        },
                        complete: function () { return obs.complete(); },
                    });
                    return function () { return handle.unsubscribe(); };
                }).subscribe({
                    next: function () {
                        enqueueAgain();
                    }
                });
                STOP_CACHE_RECORDING = typeof Symbol !== 'undefined' ? Symbol('stopCacheRecording') : '@@stopCacheRecording';
                recorderCacheWrites = [];
                cacheProxy = new Proxy(client.cache, {
                    get: function (target, name, receiver) {
                        switch (name) {
                            case 'write':
                                return function (options) {
                                    if (!receiver[STOP_CACHE_RECORDING]) {
                                        recorderCacheWrites.push(options);
                                    }
                                    return target[name](options);
                                };
                        }
                        return target[name];
                    }
                });
                subscriptionProcessor = subscriptionMessagesProcessorCreator(cacheProxy, function (proxy, record) {
                    var update = options.subscriptionQuery.update;
                    if (typeof update === 'function') {
                        update(proxy, record);
                        client.queryManager.broadcastQueries();
                    }
                });
                _j.label = 1;
            case 1:
                _j.trys.push([1, 8, , 9]);
                _e = store.getState(), _f = offline_cache_1.METADATA_KEY, _g = _e[_f], idsMap_1 = _g.idsMap, cacheSnapshot = _g.snapshot.cache, enquededMutations = _e.offline.outbox;
                subsControlLogger_1 = logger.extend('subsc-control');
                return [4 /*yield*/, new Promise(function (resolve) {
                        var _a;
                        if (subscriptionQuery && subscriptionQuery.query) {
                            var query = subscriptionQuery.query, variables = subscriptionQuery.variables;
                            subscription = client.subscribe({
                                query: query,
                                variables: __assign({}, variables, (_a = {}, _a[retry_link_1.SKIP_RETRY_KEY] = true, _a[aws_appsync_subscription_link_1.CONTROL_EVENTS_KEY] = true, _a)),
                            }).filter(function (data) {
                                var _a = data.extensions, _b = _a === void 0 ? {} : _a, _c = _b.controlMsgType, controlMsgType = _c === void 0 ? undefined : _c, _d = _b.controlMsgInfo, controlMsgInfo = _d === void 0 ? undefined : _d;
                                var isControlMsg = typeof controlMsgType !== 'undefined';
                                if (controlMsgType) {
                                    subsControlLogger_1(controlMsgType, controlMsgInfo);
                                    if (controlMsgType === 'CONNECTED') {
                                        resolve();
                                    }
                                }
                                return !isControlMsg;
                            }).subscribe({
                                next: function (data) {
                                    subscriptionProcessor.enqueue(data);
                                },
                                error: function (err) {
                                    resolve();
                                    error_2 = err;
                                    unsubscribeAll();
                                    if (apollo_utilities_1.graphQLResultHasError(err) || err.graphQLErrors) {
                                        // send error to observable, unsubscribe all, do not enqueue
                                        observer.error(err);
                                        return;
                                    }
                                    enqueueAgain();
                                }
                            });
                        }
                        else {
                            resolve();
                        }
                    })];
            case 2:
                _j.sent();
                if (error_2) {
                    throw error_2;
                }
                baseRefreshIntervalInSeconds = (baseQuery || { baseRefreshIntervalInSeconds: undefined }).baseRefreshIntervalInSeconds;
                upperBoundTimeMS = baseRefreshIntervalInSeconds ? baseRefreshIntervalInSeconds * 1000 : DEFAULT_UPPER_BOUND_TIME_MS;
                skipBaseQuery = !(baseQuery && baseQuery.query) || (baseLastSyncTimestamp
                    ? Date.now() - baseLastSyncTimestamp < upperBoundTimeMS
                    : itemInHash.baseLastSyncTimestamp && Date.now() - itemInHash.baseLastSyncTimestamp < upperBoundTimeMS);
                if (!(baseQuery && baseQuery.query)) return [3 /*break*/, 5];
                query = baseQuery.query, update_1 = baseQuery.update, variables = baseQuery.variables;
                logger((skipBaseQuery ? 'Skipping' : 'Running') + " base query", { baseLastSyncTimestamp: baseLastSyncTimestamp, itemInHash: itemInHash });
                if (!!skipBaseQuery) return [3 /*break*/, 4];
                return [4 /*yield*/, client.query({
                        fetchPolicy: 'no-cache',
                        query: query,
                        variables: variables,
                    })];
            case 3:
                result_1 = _j.sent();
                cacheProxy.writeQuery({ query: query, variables: variables, data: result_1.data });
                if (typeof update_1 === 'function') {
                    apollo_utilities_1.tryFunctionOrLogError(function () {
                        update_1(cacheProxy, result_1);
                    });
                }
                baseLastSyncTimestamp = Date.now() - BUFFER_MILLISECONDS;
                boundUpdateLastSync(store, { hash: hash, baseLastSyncTimestamp: baseLastSyncTimestamp });
                return [3 /*break*/, 5];
            case 4:
                try {
                    if (enquededMutations.length === 1) {
                        offline_link_1.boundSaveSnapshot(store, client.cache);
                    }
                    _h = offline_cache_1.METADATA_KEY, cacheSnapshot_1 = store.getState()[_h].snapshot.cache;
                    data = cacheProxy.storeReader.readQueryFromStore({
                        store: apollo_cache_inmemory_1.defaultNormalizedCacheFactory(cacheSnapshot_1),
                        query: apollo_utilities_1.addTypenameToDocument(query),
                        variables: variables,
                    });
                    cacheProxy.writeQuery({ query: query, variables: variables, data: data });
                }
                catch (error) {
                    logger('Error reading/writting baseQuery from store', error);
                }
                _j.label = 5;
            case 5:
                //#endregion
                //#region Delta query
                if (deltaQuery && deltaQuery.query && !skipBaseQuery) {
                    logger('Skipping deltaQuery');
                }
                if (!(deltaQuery && deltaQuery.query && skipBaseQuery)) return [3 /*break*/, 7];
                query = deltaQuery.query, update_2 = deltaQuery.update, variables = deltaQuery.variables;
                logger('Running deltaQuery', { lastSyncTimestamp: lastSyncTimestamp, baseLastSyncTimestamp: baseLastSyncTimestamp });
                return [4 /*yield*/, client.query({
                        fetchPolicy: 'no-cache',
                        query: query,
                        variables: __assign({}, variables, { lastSync: Math.floor((lastSyncTimestamp || baseLastSyncTimestamp) / 1000) || 0 }),
                    })];
            case 6:
                result_2 = _j.sent();
                if (typeof update_2 === 'function') {
                    apollo_utilities_1.tryFunctionOrLogError(function () {
                        update_2(cacheProxy, result_2);
                    });
                }
                lastSyncTimestamp = Date.now() - BUFFER_MILLISECONDS;
                boundUpdateLastSync(store, { hash: hash, lastSyncTimestamp: lastSyncTimestamp });
                _j.label = 7;
            case 7:
                //#endregion
                if (error_2) {
                    throw error_2;
                }
                // process subscription messages
                subscriptionProcessor.ready();
                cacheProxy[STOP_CACHE_RECORDING] = true;
                if (enquededMutations.length === 1) {
                    offline_link_1.boundSaveSnapshot(store, client.cache);
                }
                else {
                    // Restore from cache snapshot
                    client.cache.restore(cacheSnapshot);
                }
                recorderCacheWrites.forEach(client.cache.write.bind(client.cache));
                offline_link_1.boundSaveSnapshot(store, client.cache);
                client.initQueryManager();
                dataStore_1 = client.queryManager.dataStore;
                enqueuedActionsFilter_1 = [offline_link_1.offlineEffectConfig.enqueueAction];
                enquededMutations
                    .filter(function (_a) {
                    var type = _a.type;
                    return enqueuedActionsFilter_1.indexOf(type) > -1;
                })
                    .forEach(function (_a) {
                    var effect = _a.meta.offline.effect;
                    var _b = effect, _c = _b.operation, _d = _c === void 0 ? {} : _c, _e = _d.variables, variables = _e === void 0 ? {} : _e, _f = _d.query, document = _f === void 0 ? null : _f, update = _b.update, origOptimisticResponse = _b.optimisticResponse;
                    if (typeof update !== 'function') {
                        return;
                    }
                    var optimisticResponse = offline_link_1.replaceUsingMap(__assign({}, origOptimisticResponse), idsMap_1);
                    var result = { data: optimisticResponse };
                    dataStore_1.markMutationResult({
                        mutationId: null,
                        result: result,
                        document: document,
                        variables: variables,
                        updateQueries: {},
                        update: update
                    });
                });
                client.queryManager.broadcastQueries();
                if (baseQuery && baseQuery.query) {
                    baseQueryTimeout = Math.max(upperBoundTimeMS - (Date.now() - baseLastSyncTimestamp), MIN_UPPER_BOUND_TIME_MS);
                    logger("Re-running in " + baseQueryTimeout / 1000 / 60 + " minutes");
                    baseQueryTimeoutId = global.setTimeout(function () { return enqueueAgain(); }, baseQueryTimeout);
                }
                return [3 /*break*/, 9];
            case 8:
                error_1 = _j.sent();
                unsubscribeAll();
                throw error_1;
            case 9: return [2 /*return*/];
        }
    });
}); };
var discard = function (_callback, error, action, retries) {
    var effect = action.meta.offline.effect;
    var observer = effect.observer;
    if (observer && observer.error && !observer.closed) {
        observer.error(error);
    }
    return true;
};
var reducer = function () { return function (state, action) {
    var _a;
    switch (action.type) {
        case actions.UPDATE_LASTSYNC:
            logger(action.type, action.payload);
            return lastSyncReducer(state, action);
        case actions.ENQUEUE:
            logger(action.type, action.meta.offline.effect.options);
            return metadataReducer(state, action);
        default:
            var newState = __assign({}, state, (_a = {}, _a[exports.DELTASYNC_KEY] = __assign({ metadata: {} }, state.deltaSync), _a));
            return newState;
    }
}; };
var lastSyncReducer = function (state, action) {
    var _a, _b;
    var _c = action.payload, lastSyncTimestamp = _c.lastSyncTimestamp, hash = _c.hash, baseLastSyncTimestamp = _c.baseLastSyncTimestamp;
    var _d = state[exports.DELTASYNC_KEY], metadata = _d.metadata, deltaSync = __rest(_d, ["metadata"]);
    var _e = hash, hashMetadata = metadata[_e], otherHashes = __rest(metadata, [typeof _e === "symbol" ? _e : _e + ""]);
    var newMetadata = {
        baseLastSyncTimestamp: baseLastSyncTimestamp || hashMetadata.baseLastSyncTimestamp,
        lastSyncTimestamp: lastSyncTimestamp,
    };
    var newState = __assign({}, state, (_a = {}, _a[exports.DELTASYNC_KEY] = __assign({}, deltaSync, { metadata: __assign({}, otherHashes, (_b = {}, _b[hash] = newMetadata, _b)) }), _a));
    return newState;
};
var metadataReducer = function (state, action) {
    var _a, _b;
    var effect = action.meta.offline.effect;
    var options = effect.options;
    var metadata = state[exports.DELTASYNC_KEY].metadata;
    var hash = exports.hashForOptions(options);
    var hashMetadata = metadata[hash];
    var _c = hashMetadata || {}, _d = _c.lastSyncTimestamp, lastSyncTimestamp = _d === void 0 ? options.lastSyncTimestamp : _d, _e = _c.baseLastSyncTimestamp, baseLastSyncTimestamp = _e === void 0 ? options.baseLastSyncTimestamp : _e;
    var newMetadata = {
        lastSyncTimestamp: lastSyncTimestamp,
        baseLastSyncTimestamp: options.baseLastSyncTimestamp === null ? null : baseLastSyncTimestamp,
    };
    var newState = __assign({}, state, (_a = {}, _a[exports.DELTASYNC_KEY] = {
        metadata: __assign({}, metadata, (_b = {}, _b[hash] = newMetadata, _b))
    }, _a));
    return newState;
};
exports.boundEnqueueDeltaSync = function (store, options, observer, callback) {
    var effect = { options: options, observer: observer, callback: callback };
    store.dispatch({
        type: exports.offlineEffectConfig.enqueueAction,
        meta: {
            offline: {
                effect: effect
            },
        }
    });
};
var boundUpdateLastSync = function (store, _a) {
    var hash = _a.hash, lastSyncTimestamp = _a.lastSyncTimestamp, baseLastSyncTimestamp = _a.baseLastSyncTimestamp;
    var action = {
        type: actions.UPDATE_LASTSYNC,
        payload: {
            hash: hash,
            lastSyncTimestamp: lastSyncTimestamp,
            baseLastSyncTimestamp: baseLastSyncTimestamp,
        }
    };
    store.dispatch(action);
};
//#endregion
//#region Builder
exports.buildSync = function (typename, options, idField) {
    if (idField === void 0) { idField = 'id'; }
    var baseQuery = options.baseQuery, subscriptionQuery = options.subscriptionQuery, deltaQuery = options.deltaQuery, _a = options.cacheUpdates, cacheUpdates = _a === void 0 ? function () { return []; } : _a;
    var loggerHelper = logger.extend('helper');
    var result = {
        baseQuery: __assign({}, baseQuery, (baseQuery && {
            update: function (cache, _a) {
                var data = _a.data;
                var opFieldName = utils_1.getOperationFieldName(baseQuery.query);
                var _b = opFieldName, result = data[_b];
                writeCacheUpdates(loggerHelper, cache, result, cacheUpdates);
            }
        })),
        subscriptionQuery: __assign({}, subscriptionQuery, (subscriptionQuery && {
            update: function (cache, _a) {
                var data = _a.data;
                updateBaseWithDelta(loggerHelper, baseQuery, subscriptionQuery, cache, data, cacheUpdates, typename, idField);
            }
        })),
        deltaQuery: __assign({}, deltaQuery, (deltaQuery && {
            update: function (cache, _a) {
                var data = _a.data;
                updateBaseWithDelta(loggerHelper, baseQuery, deltaQuery, cache, data, cacheUpdates, typename, idField);
            }
        })),
    };
    loggerHelper('buildSync options', result);
    return result;
};
var writeCacheUpdates = function (logger, cache, result, cacheUpdates) {
    if (cacheUpdates === void 0) { cacheUpdates = function () { return []; }; }
    var cacheUpdatesLogger = logger.extend('cacheUpdates');
    cacheUpdatesLogger('writeCacheUpdates');
    result.forEach(function (item) { return cacheUpdates(item).forEach(function (_a) {
        var query = _a.query, variables = _a.variables;
        var _b;
        var opFieldName = utils_1.getOperationFieldName(query);
        var data = (_b = {}, _b[opFieldName] = item, _b);
        cacheUpdatesLogger("Writing " + opFieldName, { variables: variables, data: data });
        cache.writeQuery({ query: query, variables: variables, data: data });
    }); });
};
var deltaRecordsProcessor = function (logger, deltaOperationName, deltaRecords, baseResult, typename, idField) {
    var opType = offline_1.getOpTypeFromOperationName(deltaOperationName);
    logger({ deltaOperationName: deltaOperationName, opType: opType, deltaRecords: deltaRecords });
    if (!deltaRecords.length) {
        return baseResult;
    }
    var result = baseResult.slice();
    deltaRecords.forEach(function (deltaRecord) {
        var incomingRecord = __assign({}, deltaRecord, { __typename: typename });
        var isRemove = opType === offline_1.CacheOperationTypes.REMOVE || incomingRecord.aws_ds === 'DELETE';
        var updater = offline_1.getUpdater(opType === offline_1.CacheOperationTypes.AUTO && !isRemove
            ? offline_1.CacheOperationTypes.ADD
            : (isRemove ? offline_1.CacheOperationTypes.REMOVE : opType), idField);
        logger({ incomingRecord: incomingRecord, isRemove: isRemove });
        result = updater(result.slice(), incomingRecord);
    });
    return result;
};
var updateBaseWithDelta = function (logger, baseQuery, otherQuery, cache, data, cacheUpdates, typename, idField) {
    if (cacheUpdates === void 0) { cacheUpdates = function () { return []; }; }
    if (idField === void 0) { idField = 'id'; }
    var _a;
    var updateLogger = logger.extend('update');
    var opDefinition = apollo_utilities_1.getMainDefinition(otherQuery.query);
    var _b = opDefinition.selectionSet.selections[0], opName = _b.name.value, opAliasNode = _b.alias;
    var _c = (opAliasNode || {}).value, opAlias = _c === void 0 ? null : _c;
    var _d = opDefinition, kind = _d.kind, graphqlOperation = _d.operation;
    var isSubscription = kind === 'OperationDefinition' && graphqlOperation === 'subscription';
    var deltaOperationName = (isSubscription ? Object.keys(data) : [opAlias || opName])[0];
    var _e = deltaOperationName, records = data[_e];
    var deltaRecords = [].concat(records);
    if (!baseQuery || !baseQuery.query) {
        updateLogger('No baseQuery provided');
    }
    else {
        var query = baseQuery.query, variables = baseQuery.variables;
        var operationName = utils_1.getOperationFieldName(query);
        var _f = operationName, baseResult = cache.readQuery({ query: query, variables: variables })[_f];
        if (!Array.isArray(baseResult)) {
            throw new Error('Result of baseQuery is not an array');
        }
        var result = deltaRecordsProcessor(updateLogger, deltaOperationName, deltaRecords, baseResult, typename, idField);
        if (result !== baseResult) {
            cache.writeQuery({ query: query, data: (_a = {}, _a[operationName] = result, _a) });
        }
    }
    writeCacheUpdates(updateLogger, cache, deltaRecords, cacheUpdates);
};
//#endregion
exports.offlineEffectConfig = {
    enqueueAction: actions.ENQUEUE,
    effect: effect,
    discard: discard,
    reducer: reducer,
};
