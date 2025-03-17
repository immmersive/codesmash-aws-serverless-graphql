"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiDefinition = void 0;
const MutationDefinition_1 = require("./routes/MutationDefinition");
const QueryDefinition_1 = require("./routes/QueryDefinition");
class ApiDefinition {
    constructor() {
        this.definitions =
            [
                new MutationDefinition_1.MutationDefinition().definitions,
                new QueryDefinition_1.QueryDefinition().definitions
            ];
    }
}
exports.ApiDefinition = ApiDefinition;
