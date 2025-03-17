"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetItemAction = void 0;
const HelpApi_1 = require("../HelpApi");
class GetItemAction {
    constructor() {
        this.id = 'get-item';
    }
    async run(data, source, other) {
        var help = new HelpApi_1.HelpApi();
        var value1 = source.value1;
        var value3 = source.value3;
        var toSet = null;
        toSet = new Function('data', 'return ' + help.prefixVars(data, value1))(data);
        var keys = [other.partitionKey];
        var key = {};
        key[other.partitionKey] = toSet[other.partitionKey];
        if (other.sortKey) {
            keys.push(other.sortKey);
            key[other.sortKey] = toSet[other.sortKey];
        }
        var result = await help.getItem(key);
        if (result != undefined) {
            help.setObjectValue(data, value3, result);
            return true;
        }
        else {
            return false;
        }
    }
}
exports.GetItemAction = GetItemAction;
