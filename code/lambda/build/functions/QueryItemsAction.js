"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryItemsAction = void 0;
const HelpApi_1 = require("../HelpApi");
class QueryItemsAction {
    constructor() {
        this.id = 'query-items';
    }
    async run(data, source, other) {
        var help = new HelpApi_1.HelpApi();
        var value1 = source.value1;
        var value3 = source.value3;
        var value4 = source.value4;
        var toSet = null;
        toSet = new Function('data', 'return ' + help.prefixVars(data, value1))(data);
        if (!toSet) {
            return false;
        }
        var keyConditionExpression = Object
            .keys(toSet)
            .map(x => '#' + x + ' = ' + ':' + x)
            .reduce((x, y) => x + ' and ' + y);
        var expressionAttributeNames = {};
        var expressionAttributeValues = {};
        Object.keys(toSet).forEach(x => expressionAttributeNames['#' + x] = x);
        Object.keys(toSet).forEach(x => expressionAttributeValues[':' + x] = toSet[x]);
        var result = await help.query(value3, keyConditionExpression, expressionAttributeNames, expressionAttributeValues);
        if (result != undefined) {
            help.setObjectValue(data, value4, result);
            return true;
        }
        else {
            return false;
        }
    }
}
exports.QueryItemsAction = QueryItemsAction;
