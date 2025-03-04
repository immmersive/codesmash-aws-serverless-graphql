import { HelpApi } from "../HelpApi";

export class InsertItemAction 
{  
    id = 'insert-item'
    
    async run(data: any, 
        source: { value1: any, value2: any , value3: any },
        other: { partitionKey: string, partitionKeyType: string, sortKey?: string, sortKeyType?: string }) : Promise<boolean>
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
        var conditionExpression = 'attribute_not_exists(' + other.partitionKey + ')';

        if(other.sortKey) 
        {
            keys.push(other.sortKey);
            conditionExpression += ' AND attribute_not_exists(' + other.sortKey + ')';
        }

        if(keys.length === 1)
        {
            var id = help.getUuid();

            if(!toSet[other.partitionKey]) 
            {
                if (other.partitionKeyType === 'S') 
                {
                    toSet[other.partitionKey] = id;
                }
                else 
                {
                    toSet[other.partitionKey] = help.extractNumbersFromUUID(id);
                }
            }
        }
        else if(keys.length === 2)
        {
            var id = help.getUuid();
            
            if(!toSet[other.partitionKey] && !toSet[other.sortKey] && ( other.partitionKeyType === other.sortKeyType))
            {
                if (other.partitionKeyType === 'S') 
                {
                    toSet[other.partitionKey] = id;
                    toSet[other.sortKey] = id;
                }
                else 
                {
                    var numID = help.extractNumbersFromUUID(id);
                    toSet[other.partitionKey] = numID
                    toSet[other.sortKey] = numID;
                }
            }
        }
        else
        {
            return false;
        }
 
        return await help.putItem(toSet, conditionExpression);
    } 
}
