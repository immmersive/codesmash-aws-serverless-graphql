"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetValueAction = void 0;
const HelpApi_1 = require("../HelpApi");
class SetValueAction {
    constructor() {
        this.id = 'set-value';
    }
    async run(data, source) {
        console.log("➡️ Inside SetValueAction.run()");
        console.log("🔍 Input data:", { data, source });
        var help = new HelpApi_1.HelpApi();
        var value1 = source.value1;
        var value2 = source.value2;
        help.setObjectValue(data, value2, new Function('data', 'return ' + help.prefixVars(data, value1))(data));
        return true;
    }
}
exports.SetValueAction = SetValueAction;
