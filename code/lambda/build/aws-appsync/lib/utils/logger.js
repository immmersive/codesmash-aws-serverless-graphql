"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var debug_1 = require("debug");
var debugLogger = debug_1.default('aws-appsync');
var extend = function (category) {
    if (category === void 0) { category = ''; }
    var newCategory = category ? this.namespace.split(':').concat([category]).join(':') : this.namespace;
    var result = debug_1.default(newCategory);
    result.extend = extend.bind(result);
    return result;
};
debugLogger.extend = extend.bind(debugLogger);
exports.default = debugLogger;
