"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteItemAction = void 0;
const HelpApi_1 = require("../HelpApi");
class DeleteItemAction {
    constructor() {
        this.id = 'delete-item';
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
        return await help.deleteItem(key, conditionExpression);
    }
}
exports.DeleteItemAction = DeleteItemAction;
