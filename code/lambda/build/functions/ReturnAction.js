"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReturnAction = void 0;
const HelpApi_1 = require("../HelpApi");
class ReturnAction {
    constructor() {
        this.id = 'return';
    }
    async run(data, source) {
        var help = new HelpApi_1.HelpApi();
        var value1 = source.value1;
        help.setObjectValue(data, 'return', value1);
        return true;
    }
}
exports.ReturnAction = ReturnAction;
