import { ApiDefinition } from './ApiDefinition';
import { HelpApi } from "./HelpApi";

export class Route
{
    operation: string
    type: string
    data: any = {}
    filter_value: string
    functions:
    {
        id: string
        run(data: any, source: any, other: any): Promise<boolean>
    }[]

    constructor(
        operation: string,
        type: string,
        filter_value: string,
        functions: { id: string, run(data: any, source: any, other: any): Promise<boolean> }[])
    {
        this.operation = operation;
        this.type = type;
        this.filter_value = filter_value
        this.functions = functions;
        this.data['operation'] = operation;
        this.data['type'] = type;
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
        var partitionKeyType = table.AttributeDefinitions.filter(x => x.AttributeName === partitionKeyName)[0].AttributeType;
        var sortKeyName = tempSort.length > 0 ? tempSort[0].AttributeName : null;
        var sortKeyType = tempSort.length > 0 ? table.AttributeDefinitions.filter(x => x.AttributeName === tempSort[0].AttributeName)[0].AttributeType : undefined;
        var funcInvocations = new ApiDefinition().definitions.filter(d => d.operation === this.operation && d.type === this.type)[0].funcInvocations;

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

    isMatching(operation: string, type: string): boolean {
      return `${type}#${operation}` === this.filter_value;
    }
}
