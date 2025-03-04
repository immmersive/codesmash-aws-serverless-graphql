import { HelpApi } from "../HelpApi";

export class QueryItemsAction
{  
    id = 'query-items'
    
    async run(data: any, 
        source: { value1: any, value2: any, value3: any, value4: any },
        other: { partitionKey: string, sortKey?: string }) : Promise<boolean>
    {  
        var help = new HelpApi();
        var value1 = source.value1; 
        var value3 = source.value3;
        var value4 = source.value4;
        var toSet = null as any;
 
        toSet = new Function('data', 'return ' + help.prefixVars(data, value1))(data);

        if(!toSet)
        {
            return false;
        }
 
        var keyConditionExpression = Object
            .keys(toSet)            
            .map(x => '#' + x + ' = ' + ':' + x)
            .reduce((x, y) => x + ' and ' + y);

        var expressionAttributeNames = {} as any;
        var expressionAttributeValues = {} as any;

        Object.keys(toSet).forEach(x => expressionAttributeNames['#' + x] = x);
        Object.keys(toSet).forEach(x => expressionAttributeValues[':' + x] = toSet[x]);

        var result = await help.query(
            value3, 
            keyConditionExpression,
            expressionAttributeNames,
            expressionAttributeValues);

        if(result != undefined) 
        {
            help.setObjectValue(data, value4, result);

            return true;
        }
        else
        { 
            return false;
        }
    } 
}
