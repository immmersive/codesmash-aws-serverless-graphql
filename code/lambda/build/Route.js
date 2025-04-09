"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route = void 0;
const ApiDefinition_1 = require("./ApiDefinition");
const HelpApi_1 = require("./HelpApi");
class Route {
    constructor(operation, type, filter_value, functions) {
        this.data = {};
        this.operation = operation;
        this.type = type;
        this.filter_value = filter_value;
        this.functions = functions;
    }
    async invokeRoute(operation, type, routeArgs) {
        this.data['operation'] = operation;
        this.data['type'] = type;
        this.data['arguments'] = routeArgs;
        var help = new HelpApi_1.HelpApi();
        var table = await help.describeTable();
        var tempSort = table.KeySchema.filter(x => x.KeyType === 'RANGE');
        var partitionKeyName = table.KeySchema.filter(x => x.KeyType === 'HASH')[0].AttributeName;
        var partitionKeyType = table.AttributeDefinitions.filter(x => x.AttributeName === partitionKeyName)[0].AttributeType;
        var sortKeyName = tempSort.length > 0 ? tempSort[0].AttributeName : null;
        var sortKeyType = tempSort.length > 0 ? table.AttributeDefinitions.filter(x => x.AttributeName === tempSort[0].AttributeName)[0].AttributeType : undefined;
        var funcInvocations = new ApiDefinition_1.ApiDefinition().definitions.filter(d => d.operation === this.operation && d.type === this.type)[0].funcInvocations;
        console.log("🧭 Invocation steps:", funcInvocations.map(f => f.funcId));
        await help.executeSequentially(this.functions.map((x, i) => () => help.promisify(x, this.data, funcInvocations.filter(f => f.skip === false)[i].values, {
            partitionKey: partitionKeyName,
            partitionKeyType: partitionKeyType,
            sortKey: sortKeyName,
            sortKeyType: sortKeyType
        })));
        return this.data;
    }
    isMatching(operation, type) {
        return `${type}#${operation}` === this.filter_value;
    }
}
exports.Route = Route;
