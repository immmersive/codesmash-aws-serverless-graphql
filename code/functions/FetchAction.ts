import { HelpApi } from "../HelpApi"; 

export class FetchAction
{
    id = 'fetch'
    
    async run(data: any, 
        source: { value1: any, value2: any , value3: any, value4: any, value5: any },
        other: { partitionKey: string, sortKey?: string }) : Promise<boolean>
    {  
        var help = new HelpApi();
        var value5 = source.value5;
        var value4 = source.value4;
        var value3 = source.value3;
        var value2 = source.value2;
        var value1 = source.value1;
        var toUrl = undefined as any;
        var toHeaders = undefined as any;
        var toBody = undefined as any;
 
        toUrl = new Function('data', 'return ' + help.prefixVars(data, value1))(data);
        if(value2 != undefined) toHeaders = new Function('data', 'return ' + help.prefixVars(data, value2))(data);
        if(value3 != undefined) toBody = new Function('data', 'return ' + help.prefixVars(data, value3))(data);
   
        try 
        { 
            const response = await fetch(toUrl,
            {
                method: value4,
                headers: toHeaders ? toHeaders : undefined,
                body: toBody ? toBody : undefined
            });

            var result = await response.json();
 
            if(result) 
            {
                help.setObjectValue(data, value5, result);
            }
            else
            { 
                return false;
            }
 
            return true;
        } 
        catch (error) 
        { 
            console.log(error);
            return false;
        } 
    }   
}
