"use strict";
var __extends = (this && this.__extends) || (function () {
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
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
Object.defineProperty(exports, "__esModule", { value: true });
/*!
 * Copyright 2017-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
var apollo_link_1 = require("apollo-link");
var apollo_link_2 = require("apollo-link");
var printer_1 = require("graphql/language/printer");
var signer_1 = require("./signer");
var Url = require("url");
var platform_1 = require("./platform");
var packageInfo = require("../package.json");
var SERVICE = 'appsync';
exports.USER_AGENT_HEADER = 'x-amz-user-agent';
exports.USER_AGENT = "aws-amplify/" + packageInfo.version + (platform_1.userAgent && ' ') + platform_1.userAgent;
var AUTH_TYPE;
(function (AUTH_TYPE) {
    AUTH_TYPE["NONE"] = "NONE";
    AUTH_TYPE["API_KEY"] = "API_KEY";
    AUTH_TYPE["AWS_IAM"] = "AWS_IAM";
    AUTH_TYPE["AMAZON_COGNITO_USER_POOLS"] = "AMAZON_COGNITO_USER_POOLS";
    AUTH_TYPE["OPENID_CONNECT"] = "OPENID_CONNECT";
    AUTH_TYPE["AWS_LAMBDA"] = "AWS_LAMBDA";
})(AUTH_TYPE = exports.AUTH_TYPE || (exports.AUTH_TYPE = {}));
var AuthLink = /** @class */ (function (_super) {
    __extends(AuthLink, _super);
    /**
     *
     * @param {*} options
     */
    function AuthLink(options) {
        var _this = _super.call(this) || this;
        _this.link = exports.authLink(options);
        return _this;
    }
    AuthLink.prototype.request = function (operation, forward) {
        return this.link.request(operation, forward);
    };
    return AuthLink;
}(apollo_link_2.ApolloLink));
exports.AuthLink = AuthLink;
var headerBasedAuth = function (_a, operation, forward) {
    var _b = _a === void 0 ? { header: '', value: '' } : _a, header = _b.header, value = _b.value;
    return __awaiter(void 0, void 0, void 0, function () {
        var origContext, headers, headerValue, _c;
        var _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    origContext = operation.getContext();
                    headers = __assign(__assign({}, origContext.headers), (_d = {}, _d[exports.USER_AGENT_HEADER] = exports.USER_AGENT, _d));
                    if (!(header && value)) return [3 /*break*/, 5];
                    if (!(typeof value === 'function')) return [3 /*break*/, 2];
                    return [4 /*yield*/, value.call(undefined)];
                case 1:
                    _c = _f.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, value];
                case 3:
                    _c = _f.sent();
                    _f.label = 4;
                case 4:
                    headerValue = _c;
                    headers = __assign((_e = {}, _e[header] = headerValue, _e), headers);
                    _f.label = 5;
                case 5:
                    operation.setContext(__assign(__assign({}, origContext), { headers: headers }));
                    return [2 /*return*/, forward(operation)];
            }
        });
    });
};
var iamBasedAuth = function (_a, operation, forward) {
    var credentials = _a.credentials, region = _a.region, url = _a.url;
    return __awaiter(void 0, void 0, void 0, function () {
        var service, origContext, creds, _b, accessKeyId, secretAccessKey, sessionToken, _c, host, path, formatted, headers;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    service = SERVICE;
                    origContext = operation.getContext();
                    creds = typeof credentials === 'function' ? credentials.call() : (credentials || {});
                    if (!(creds && typeof creds.getPromise === 'function')) return [3 /*break*/, 2];
                    return [4 /*yield*/, creds.getPromise()];
                case 1:
                    _e.sent();
                    _e.label = 2;
                case 2: return [4 /*yield*/, creds];
                case 3:
                    _b = _e.sent(), accessKeyId = _b.accessKeyId, secretAccessKey = _b.secretAccessKey, sessionToken = _b.sessionToken;
                    _c = Url.parse(url), host = _c.host, path = _c.path;
                    formatted = __assign(__assign({}, formatAsRequest(operation, {})), { service: service, region: region, url: url, host: host, path: path });
                    headers = signer_1.Signer.sign(formatted, { access_key: accessKeyId, secret_key: secretAccessKey, session_token: sessionToken }).headers;
                    operation.setContext(__assign(__assign({}, origContext), { headers: __assign(__assign(__assign({}, origContext.headers), headers), (_d = {}, _d[exports.USER_AGENT_HEADER] = exports.USER_AGENT, _d)) }));
                    return [2 /*return*/, forward(operation)];
            }
        });
    });
};
exports.authLink = function (_a) {
    var url = _a.url, region = _a.region, _b = _a.auth, type = (_b === void 0 ? {} : _b).type, auth = _a.auth;
    return new apollo_link_2.ApolloLink(function (operation, forward) {
        return new apollo_link_1.Observable(function (observer) {
            var handle;
            var promise;
            switch (type) {
                case AUTH_TYPE.NONE:
                    promise = headerBasedAuth(undefined, operation, forward);
                    break;
                case AUTH_TYPE.AWS_IAM:
                    var _a = auth.credentials, credentials = _a === void 0 ? {} : _a;
                    promise = iamBasedAuth({
                        credentials: credentials,
                        region: region,
                        url: url,
                    }, operation, forward);
                    break;
                case AUTH_TYPE.API_KEY:
                    var _b = auth.apiKey, apiKey = _b === void 0 ? '' : _b;
                    promise = headerBasedAuth({ header: 'X-Api-Key', value: apiKey }, operation, forward);
                    break;
                case AUTH_TYPE.AMAZON_COGNITO_USER_POOLS:
                case AUTH_TYPE.OPENID_CONNECT:
                    var _c = auth.jwtToken, jwtToken = _c === void 0 ? '' : _c;
                    promise = headerBasedAuth({ header: 'Authorization', value: jwtToken }, operation, forward);
                    break;
                case AUTH_TYPE.AWS_LAMBDA:
                    var _d = auth.token, token = _d === void 0 ? '' : _d;
                    promise = headerBasedAuth({ header: 'Authorization', value: token }, operation, forward);
                    break;
                default:
                    var error = new Error("Invalid AUTH_TYPE: " + auth.type);
                    throw error;
            }
            promise.then(function (observable) {
                handle = observable.subscribe({
                    next: observer.next.bind(observer),
                    error: observer.error.bind(observer),
                    complete: observer.complete.bind(observer),
                });
            });
            return function () {
                if (handle)
                    handle.unsubscribe();
            };
        });
    });
};
var formatAsRequest = function (_a, options) {
    var operationName = _a.operationName, variables = _a.variables, query = _a.query;
    var body = {
        operationName: operationName,
        variables: removeTemporaryVariables(variables),
        query: printer_1.print(query)
    };
    return __assign(__assign({ body: JSON.stringify(body), method: 'POST' }, options), { headers: __assign({ accept: '*/*', 'content-type': 'application/json; charset=UTF-8' }, options.headers) });
};
/**
 * Removes all temporary variables (starting with '@@') so that the signature matches the final request.
 */
var removeTemporaryVariables = function (variables) {
    return Object.keys(variables)
        .filter(function (key) { return !key.startsWith("@@"); })
        .reduce(function (acc, key) {
        acc[key] = variables[key];
        return acc;
    }, {});
};
