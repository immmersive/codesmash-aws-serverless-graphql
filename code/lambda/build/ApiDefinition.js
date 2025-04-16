"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiDefinition = void 0;
const MutationDefinition_1 = require("./routes/MutationDefinition");
const QueryDefinition_1 = require("./routes/QueryDefinition");
class ApiDefinition {
    constructor() {
        const mutationDefinitions = new MutationDefinition_1.MutationDefinition().definitions;
        const queryDefinitions = new QueryDefinition_1.QueryDefinition().definitions;
        this.definitions = [
            Object.assign(Object.assign({}, mutationDefinitions), { filter_value: `${mutationDefinitions.type}#${mutationDefinitions.operation}` }),
            Object.assign(Object.assign({}, queryDefinitions), { filter_value: `${queryDefinitions.type}#${queryDefinitions.operation}` }),
        ];
    }
}
exports.ApiDefinition = ApiDefinition;
