"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryItemsAction = void 0;
const HelpApi_1 = require("../HelpApi");
function objectFromEntries(entries) {
    return entries.reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
    }, {});
}
class QueryItemsAction {
    constructor() {
        this.id = 'query-items';
    }
    async run(data, source) {
        console.log("➡️ Inside QueryItemsAction.run()");
        console.log("🔍 Input data:", { data, source });
        const help = new HelpApi_1.HelpApi();
        const key = source.value1; // The key object from `arguments.key`
        const tableName = source.value3; // The table name
        const resultVariable = source.value4; // Where to store the result
        if (!key || !tableName) {
            console.log("⚠️ Missing tableName or key");
            return false;
        }
        // Construct DynamoDB expressions
        const keyConditionExpression = Object.keys(key)
            .map(field => `#${field} = :${field}`)
            .join(" and ");
        const expressionAttributeNames = objectFromEntries(Object.keys(key).map(field => [`#${field}`, field]));
        const expressionAttributeValues = objectFromEntries(Object.entries(key).map(([field, value]) => [`:${field}`, value]));
        console.log("📤 Sending query to DynamoDB:");
        console.log("Table name:", tableName);
        console.log("KeyConditionExpression:", keyConditionExpression);
        console.log("ExpressionAttributeNames:", JSON.stringify(expressionAttributeNames));
        console.log("ExpressionAttributeValues:", JSON.stringify(expressionAttributeValues));
        // Execute query
        const result = await help.query(tableName, keyConditionExpression, expressionAttributeNames, expressionAttributeValues);
        console.log("🔍 Query result:", JSON.stringify(result, null, 2));
        if (result) {
            help.setObjectValue(data, resultVariable, result);
            console.log("✅ Query result stored successfully");
            return true;
        }
        else {
            console.log("⚠️ Query returned no results");
            return false;
        }
    }
}
exports.QueryItemsAction = QueryItemsAction;
