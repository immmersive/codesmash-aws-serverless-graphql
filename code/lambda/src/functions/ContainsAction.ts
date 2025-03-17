import { HelpApi } from "../HelpApi";

export class ContainsAction
{
    id = 'contains'

    async run(data: any,
        source: { value1: any, value2: any , value3: any },
        other: { partitionKey: string, sortKey?: string }) : Promise<boolean>
    {
        var help = new HelpApi();
        var value2 = source.value2;
        var value1 = source.value1;
        var toCompare1 = null;
        var toCompare2 = null;

        toCompare1 = new Function('data', 'return ' + help.prefixVars(data, value1))(data);
        toCompare2 = new Function('data', 'return ' + help.prefixVars(data, value2))(data);

        if(toCompare2)
        {
            if(Array.isArray(toCompare1))
            {
                return help.searchForArray(toCompare2, toCompare1);
            }
            else
            {
                return (toCompare2 as any[]).includes(toCompare1);
            }
        }
        else
        {
            return false;
        }
    }
}
