"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinAction = void 0;
const HelpApi_1 = require("../HelpApi");
class JoinAction {
    constructor() {
        this.id = 'join';
    }
    async run(data, source, other) {
        var help = new HelpApi_1.HelpApi();
        var value6 = source.value6;
        var value5 = source.value5;
        var value4 = source.value4;
        var value3 = source.value3;
        var value2 = source.value2;
        var value1 = source.value1;
        var equalityFunction = undefined;
        var mapFunction = undefined;
        var array1 = new Function('data', 'return ' + help.prefixVars(data, value1))(data);
        var array2 = new Function('data', 'return ' + help.prefixVars(data, value2))(data);
        var joinType = value3;
        var equalityFunction = new Function('data', 'return ' + help.prefixVars(data, value4))(data);
        var mapFunction = new Function('data', 'return ' + help.prefixVars(data, value5))(data);
        try {
            var result = help.joinArrays(array1, array2, joinType, equalityFunction, mapFunction);
            help.setObjectValue(data, value6, result);
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
}
exports.JoinAction = JoinAction;
