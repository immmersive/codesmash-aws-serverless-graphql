"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateItemAction = void 0;
const HelpApi_1 = require("../HelpApi");
class UpdateItemAction {
    constructor() {
        this.id = 'update-item';
    }
    async run(data, source, other) {
        var help = new HelpApi_1.HelpApi();
        var value1 = source.value1;
        var toSet = null;
        toSet = new Function('data', 'return ' + help.prefixVars(data, value1))(data);
        if (!toSet) {
            return false;
        }
        var keys = [other.partitionKey];
        var conditionExpression = 'attribute_exists(' + other.partitionKey + ')';
        var key = {};
        key[other.partitionKey] = toSet[other.partitionKey];
        if (other.sortKey) {
            keys.push(other.sortKey);
            conditionExpression += ' AND attribute_exists(' + other.sortKey + ')';
            key[other.sortKey] = toSet[other.sortKey];
        }
        var updateExpression = "set " + Object
            .keys(toSet)
            .filter(x => !keys.includes(x))
            .map(x => '#' + x + ' = ' + ':' + x)
            .reduce((x, y) => x + ', ' + y);
        var expressionAttributeNames = {};
        Object.keys(toSet)
            .filter(x => !keys.includes(x))
            .forEach(x => expressionAttributeNames['#' + x] = x);
        var expressionAttributeValues = {};
        Object.keys(toSet)
            .filter(x => !keys.includes(x))
            .forEach(x => expressionAttributeValues[':' + x] = toSet[x]);
        return await help.updateItem(key, expressionAttributeValues, expressionAttributeNames, updateExpression, conditionExpression);
    }
}
exports.UpdateItemAction = UpdateItemAction;
