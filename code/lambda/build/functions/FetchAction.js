"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAction = void 0;
const HelpApi_1 = require("../HelpApi");
class FetchAction {
    constructor() {
        this.id = 'fetch';
    }
    async run(data, source, other) {
        var help = new HelpApi_1.HelpApi();
        var value5 = source.value5;
        var value4 = source.value4;
        var value3 = source.value3;
        var value2 = source.value2;
        var value1 = source.value1;
        var toUrl = undefined;
        var toHeaders = undefined;
        var toBody = undefined;
        toUrl = new Function('data', 'return ' + help.prefixVars(data, value1))(data);
        if (value2 != undefined)
            toHeaders = new Function('data', 'return ' + help.prefixVars(data, value2))(data);
        if (value3 != undefined)
            toBody = new Function('data', 'return ' + help.prefixVars(data, value3))(data);
        try {
            const response = await fetch(toUrl, {
                method: value4,
                headers: toHeaders ? toHeaders : undefined,
                body: toBody ? toBody : undefined
            });
            var result = await response.json();
            if (result) {
                help.setObjectValue(data, value5, result);
            }
            else {
                return false;
            }
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
}
exports.FetchAction = FetchAction;
