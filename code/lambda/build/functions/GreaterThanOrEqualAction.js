"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreaterThanOrEqualAction = void 0;
const HelpApi_1 = require("../HelpApi");
class GreaterThanOrEqualAction {
    constructor() {
        this.id = 'greater-than-or-equal';
    }
    async run(data, source, other) {
        var help = new HelpApi_1.HelpApi();
        var value2 = source.value2;
        var value1 = source.value1;
        var toCompare1 = null;
        var toCompare2 = null;
        toCompare1 = new Function('data', 'return ' + help.prefixVars(data, value1))(data);
        toCompare2 = new Function('data', 'return ' + help.prefixVars(data, value2))(data);
        var s1 = JSON.stringify(toCompare1);
        var s2 = JSON.stringify(toCompare2);
        if (Array.isArray(toCompare1) && Array.isArray(toCompare2)) {
            return s1 >= s2;
        }
        else if (s1.startsWith('{') && s1.endsWith('}') && s2.startsWith('{') && s2.endsWith('}')) {
            return s1 >= s2;
        }
        else {
            return toCompare1 >= toCompare2;
        }
    }
}
exports.GreaterThanOrEqualAction = GreaterThanOrEqualAction;
