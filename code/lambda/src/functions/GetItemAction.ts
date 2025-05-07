import { HelpApi } from "../HelpApi";

export class GetItemAction
{
    id = 'get-item';

    async run(
        data: any,
        source: { value1: any, value3: any , value4: any },
        other: { partitionKey: string, sortKey?: string }) : Promise<boolean>
    {
        var help = new HelpApi();
        var value1 = source.value1;
        var value4 = source.value4;
        var toSet = null;

        toSet = new Function('data', 'return ' + help.prefixVars(data, value1))(data);

        var keys = [other.partitionKey];
        var key = {};
        (key as any)[other.partitionKey] = (toSet as any)[other.partitionKey];

        if(other.sortKey)
        {
            keys.push(other.sortKey);
            (key as any)[other.sortKey] = (toSet as any)[other.sortKey];
        }

        var result = await help.getItem(key);

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
