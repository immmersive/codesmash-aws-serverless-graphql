import { HelpApi } from "../HelpApi";

export class UpdateItemAction
{
    id = 'update-item'

    async run(data: any,
        source: { value1: any, value2: any, value3: any, value4: any },
        other: { partitionKey: string, sortKey?: string }) : Promise<boolean>
    {
        var help = new HelpApi();
        var value1 = source.value1;
        var toSet = null as any;

        toSet = new Function('data', 'return ' + help.prefixVars(data, value1))(data);

        if(!toSet)
        {
            return false;
        }

        var keys = [other.partitionKey];
        var conditionExpression = 'attribute_exists(' + other.partitionKey + ')';
        var key: any = {};
        key[other.partitionKey] = toSet[other.partitionKey];

        if(other.sortKey)
        {
            keys.push(other.sortKey);
            conditionExpression += ' AND attribute_exists(' + other.sortKey + ')';
            key[other.sortKey] = toSet[other.sortKey];
        }

        var updateExpression = "set " + Object
            .keys(toSet)
            .filter(x => !keys.includes(x))
            .map(x => '#' + x + ' = ' + ':' + x)
            .reduce((x, y) => x + ', ' + y);

        var expressionAttributeNames: any = {};

        Object.keys(toSet)
            .filter(x => !keys.includes(x))
            .forEach(x => expressionAttributeNames['#' + x] = x);

        var expressionAttributeValues: any = {};

        Object.keys(toSet)
            .filter(x => !keys.includes(x))
            .forEach(x => expressionAttributeValues[':' + x] = toSet[x]);

        return await help.updateItem(
            key,
            expressionAttributeValues,
            expressionAttributeNames,
            updateExpression,
            conditionExpression);
    }
}
