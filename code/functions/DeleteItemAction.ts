import { HelpApi } from "../HelpApi";

export class DeleteItemAction
{  
    id = 'delete-item'
    
    async run(data: any, 
        source: { value1: any, value2: any , value3: any },
        other: { partitionKey: string, sortKey?: string }) : Promise<boolean>
    { 
        var help = new HelpApi();
        var value1 = source.value1; 
        var toSet = null;

        toSet = new Function('data', 'return ' + help.prefixVars(data, value1))(data);
         
        if(!toSet)
        {
            return false;
        }        

        var keys = [other.partitionKey];
        var conditionExpression = 'attribute_exists(' + other.partitionKey + ')';
        var key = {} as any;
        key[other.partitionKey] = toSet[other.partitionKey];

        if(other.sortKey) 
        {
            keys.push(other.sortKey);
            conditionExpression += ' AND attribute_exists(' + other.sortKey + ')';
            key[other.sortKey] = toSet[other.sortKey];
        }
  
        return await help.deleteItem(key, conditionExpression);
    }
}
