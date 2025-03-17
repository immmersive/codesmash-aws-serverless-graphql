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
 * Copyright 2017-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
var apollo_link_1 = require("apollo-link");
var apollo_link_retry_1 = require("apollo-link-retry");
var utils_1 = require("../utils");
var ConflictResolutionLink = /** @class */ (function (_super) {
    __extends(ConflictResolutionLink, _super);
    function ConflictResolutionLink(conflictResolver, maxRetries) {
        if (maxRetries === void 0) { maxRetries = 10; }
        var _this = _super.call(this) || this;
        _this.conflictResolver = conflictResolver;
        _this.maxRetries = maxRetries;
        _this.link = apollo_link_1.ApolloLink.from([
            new apollo_link_retry_1.RetryLink({
                delay: { initial: 0, max: 0 },
                attempts: function (count, operation, error) {
                    if (count > _this.maxRetries) {
                        return false;
                    }
                    if (_this.hasConflictError(error)) {
                        if (typeof _this.conflictResolver === 'function') {
                            var data = error.data;
                            var mutation = operation.query;
                            var mutationName = utils_1.getOperationFieldName(mutation);
                            var operationType = 'mutation';
                            var retries = count;
                            var variables = __assign({}, operation.variables);
                            var newVars = _this.conflictResolver({
                                data: data,
                                mutation: mutation,
                                mutationName: mutationName,
                                operationType: operationType,
                                retries: retries,
                                variables: variables,
                            });
                            if (newVars === 'DISCARD') {
                                return false;
                            }
                            if (newVars) {
                                operation.variables = newVars;
                                return true;
                            }
                        }
                    }
                    return false;
                }
            }),
            new apollo_link_1.ApolloLink(function (op, fwd) { return new apollo_link_1.Observable(function (observer) {
                fwd(op).subscribe({
                    next: function (data) {
                        var err = (data.errors || []).find(_this.hasConflictError);
                        if (err) {
                            observer.error(err);
                        }
                        else {
                            observer.next(__assign({}, data, { context: __assign({}, data.context, { additionalDataContext: {
                                        newVars: op.variables,
                                    } }) }));
                        }
                    },
                    error: observer.error.bind(observer),
                    complete: observer.complete.bind(observer),
                });
                return function () { return null; };
            }); })
        ]);
        return _this;
    }
    ConflictResolutionLink.prototype.hasConflictError = function (error) {
        var hasConflictError = [
            'DynamoDB:ConditionalCheckFailedException'
        ].some(function (err) { return err === error.errorType; });
        return hasConflictError;
    };
    ConflictResolutionLink.prototype.request = function (operation, forward) {
        if (typeof this.conflictResolver !== 'function') {
            return utils_1.passthroughLink(operation, forward);
        }
        return this.link.request(operation, forward);
    };
    return ConflictResolutionLink;
}(apollo_link_1.ApolloLink));
exports.default = ConflictResolutionLink;
