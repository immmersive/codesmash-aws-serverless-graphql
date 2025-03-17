import { ApiDefinition } from './ApiDefinition';
import { HelpApi } from "./HelpApi";
 
export class Route 
{ 
    route: string    
    method: string
    data: any = {}
    functions: 
    {
        id: string
        run(data: any, source: any, other: any): Promise<boolean>
    }[]

    constructor(
        route: string, 
        method: string,
        functions: { id: string, run(data: any, source: any, other: any): Promise<boolean> }[])
    {
        this.route = route;
        this.method = method;
        this.functions = functions;
        this.data['route'] = route;
        this.data['method'] = method;  
    }

    async invokeRoute(queryParameters: any, headers: any, path: any, body: any) : Promise<any>
    {
        this.data['parameters'] = queryParameters;
        this.data['headers'] = headers;
        this.data['fragment'] = path;
        this.data['body'] = body;

        var help = new HelpApi();
        var table = await help.describeTable();
        var tempSort = table.KeySchema.filter(x => x.KeyType === 'RANGE'); 
        var partitionKeyName = table.KeySchema.filter(x => x.KeyType === 'HASH')[0].AttributeName;
        var partitionKeyType = table.AttributeDefinitions.filter(x => x.AttributeName === partitionKeyName)[0].AttributeType;
        var sortKeyName = tempSort.length > 0 ? tempSort[0].AttributeName : null;
        var sortKeyType = tempSort.length > 0 ? table.AttributeDefinitions.filter(x => x.AttributeName === tempSort[0].AttributeName)[0].AttributeType : undefined;
        var funcInvocations = new ApiDefinition().definitions.filter(d => d.route === this.route && d.method === this.method)[0].funcInvocations;
 
        await help.executeSequentially(this.functions.map((x, i) => () => help.promisify(
            x, 
            this.data,
            funcInvocations.filter(f => f.skip === false)[i].values,
            { 
                partitionKey: partitionKeyName, 
                partitionKeyType: partitionKeyType,
                sortKey: sortKeyName,
                sortKeyType: sortKeyType
            })));

        return this.data;
    }

    isMatching(path: string, httpMethod: string): boolean
    { 
        var help = new HelpApi(); 
        var parts = help.splitRoute(this.route);
        var regex = null;

        if(parts.length === 1)
        { 
            regex = help.createRegexPattern(parts[0]);
        }
        else if(parts.length === 2)
        { 
            regex = help.createRegexPattern2p(parts[0]);
        }
        else if(parts.length === 3)
        { 
            regex = help.createRegexPattern3p(parts[0], parts[2]);
        }
        else
        {
            return false;
        }

        return regex.test(path) === true && httpMethod === this.method;
    }    
}
