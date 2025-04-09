"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpApi = void 0;
const aws_sdk_1 = require("aws-sdk");
const uuid_1 = require("uuid");
class HelpApi {
    async getItem(key) {
        try {
            return (await new aws_sdk_1.DynamoDB.DocumentClient({
                region: process.env.region
            })
                .get({
                TableName: process.env.database,
                Key: key
            })
                .promise())
                .Item;
        }
        catch (error) {
            console.log(error);
            return undefined;
        }
    }
    async putItem(item, conditionExpression) {
        try {
            await new aws_sdk_1.DynamoDB.DocumentClient({
                region: process.env.region
            })
                .put({
                TableName: process.env.database,
                Item: item,
                ConditionExpression: conditionExpression
            })
                .promise();
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async updateItem(key, expressionAttributeValues, expressionAttributeNames, updateExpression, conditionExpression) {
        try {
            await new aws_sdk_1.DynamoDB.DocumentClient({
                region: process.env.region
            })
                .update({
                TableName: process.env.database,
                Key: key,
                ExpressionAttributeNames: expressionAttributeNames,
                ExpressionAttributeValues: expressionAttributeValues,
                UpdateExpression: updateExpression,
                ConditionExpression: conditionExpression
            })
                .promise();
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async deleteItem(key, conditionExpression) {
        try {
            await new aws_sdk_1.DynamoDB.DocumentClient().delete({
                TableName: process.env.database,
                Key: key,
                ConditionExpression: conditionExpression
            })
                .promise();
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async query(indexName, keyConditionExpression, expressionAttributeNames, expressionAttributeValues) {
        try {
            return (await new aws_sdk_1.DynamoDB.DocumentClient().query({
                TableName: process.env.database,
                IndexName: indexName,
                KeyConditionExpression: keyConditionExpression,
                ExpressionAttributeValues: expressionAttributeValues,
                ExpressionAttributeNames: expressionAttributeNames
            })
                .promise())
                .Items;
        }
        catch (error) {
            console.log(error);
            return undefined;
        }
    }
    getUuid() {
        return (0, uuid_1.v4)();
    }
    getObjectValue(obj, path) {
        const keys = path.split('.');
        let currentObj = obj;
        let foundValue;
        keys.forEach(key => {
            if (!currentObj || typeof currentObj !== 'object') {
                foundValue = undefined;
                return;
            }
            currentObj = currentObj[key];
            foundValue = currentObj;
        });
        return foundValue;
    }
    setObjectValue(obj, path, value) {
        const keys = path.split('.');
        let currentObj = obj;
        keys.slice(0, -1).forEach(x => {
            if (!currentObj[x])
                currentObj[x] = {};
            currentObj = currentObj[x];
        });
        currentObj[keys[keys.length - 1]] = value;
    }
    createRegexPattern(prefix) {
        return new RegExp(`^\\/${prefix}$`);
    }
    createRegexPattern2p(prefix) {
        return new RegExp(`^\\/${prefix}\\/[\\w-]+$`);
    }
    createRegexPattern3p(prefix1, prefix2) {
        return new RegExp(`^\\/${prefix1}\\/[\\w-]+\\/${prefix2}$`);
    }
    async describeTable() {
        var described = (await new aws_sdk_1.DynamoDB({
            region: process.env.region
        })
            .describeTable({
            TableName: process.env.database
        })
            .promise());
        return described.Table;
    }
    splitRoute(route) {
        var temp = route;
        if (route.startsWith('/'))
            temp = route.substring(1);
        return temp.split('/').filter(x => x !== '');
    }
    async executeSequentially(functions) {
        return functions.reduce((promiseChain, func) => {
            return promiseChain.then(result => {
                if (result === false)
                    return false;
                console.log(`➡️ Executing function: ${func}`);
                return func().then(success => {
                    console.log(`✅ Finished function: ${func}`);
                    return success;
                });
            });
        }, Promise.resolve(true));
    }
    async promisify(x, data, source, other) {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(await x.run(data, source, other));
            }
            catch (error) {
                reject(error);
            }
        });
    }
    searchForArray(array, val) {
        for (let i = 0; i < array.length; i++) {
            if (JSON.stringify(array[i]) === JSON.stringify(val))
                return true;
        }
        return false;
    }
    extractNumbersFromUUID(uuid) {
        return Number.parseInt(uuid.match(/\d/g).join(''));
    }
    selectMany(input, selectListFn) {
        return input.reduce((out, inx) => {
            out.push(...selectListFn(inx));
            return out;
        }, new Array());
    }
    prefixVars(data, command) {
        command = command.replace(/\.\.\.(\w+)/g, (match, p1) => {
            if (data.hasOwnProperty(p1))
                return `...data.${p1}`;
            return match;
        });
        return command.replace(/\b([a-zA-Z_]\w*)\b/g, (match, p1, offset, string) => {
            if (((token) => /\b\w+\s*\(/.test(token))(match))
                return match;
            const precedingChar = string[offset - 1];
            const followingChar = string[offset + match.length];
            const isWithinQuotes = (precedingChar === '"' || precedingChar === "'" || precedingChar === '`') &&
                (followingChar === '"' || followingChar === "'" || followingChar === '`');
            const isKeyInObject = precedingChar === ':' &&
                (followingChar === ',' || followingChar === '}' || followingChar === undefined);
            if (data.hasOwnProperty(match) && !isWithinQuotes && !(precedingChar === '.' || isKeyInObject))
                return `data.${match}`;
            return match;
        });
    }
    joinArrays(array1, array2, joinType = 'INNER', matchFn, mapFn) {
        let joinedArray = [];
        if (joinType === 'INNER') {
            joinedArray = array1.map(i1 => {
                const i2 = array2.find(item2 => matchFn(i1, item2));
                return i2 ? mapFn(i1, i2) : undefined;
            })
                .filter(i => i !== undefined);
        }
        else if (joinType === 'LEFT') {
            joinedArray = array1.map(i1 => mapFn(i1, array2.find(i2 => matchFn(i1, i2))));
        }
        else if (joinType === 'RIGHT') {
            joinedArray = array2.map(i2 => mapFn(array1.find(i1 => matchFn(i1, i2)) || {}, i2));
        }
        else if (joinType === 'OUTER') {
            joinedArray = [
                ...array1
                    .map(i1 => mapFn(i1, array2.find(i2 => matchFn(i1, i2)))),
                ...array2
                    .filter(i2 => !array1.some(i1 => matchFn(i1, i2)))
                    .map(i2 => mapFn({}, i2))
            ];
        }
        return joinedArray;
    }
}
exports.HelpApi = HelpApi;
