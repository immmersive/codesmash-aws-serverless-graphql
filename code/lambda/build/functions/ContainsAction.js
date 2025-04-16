"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainsAction = void 0;
const HelpApi_1 = require("../HelpApi");
class ContainsAction {
    constructor() {
        this.id = 'contains';
    }
    async run(data, source, other) {
        var help = new HelpApi_1.HelpApi();
        var value2 = source.value2;
        var value1 = source.value1;
        var toCompare1 = null;
        var toCompare2 = null;
        toCompare1 = new Function('data', 'return ' + help.prefixVars(data, value1))(data);
        toCompare2 = new Function('data', 'return ' + help.prefixVars(data, value2))(data);
        if (toCompare2) {
            if (Array.isArray(toCompare1)) {
                return help.searchForArray(toCompare2, toCompare1);
            }
            else {
                return toCompare2.includes(toCompare1);
            }
        }
        else {
            return false;
        }
    }
}
exports.ContainsAction = ContainsAction;
