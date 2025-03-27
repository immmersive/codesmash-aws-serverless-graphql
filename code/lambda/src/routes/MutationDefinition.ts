export class MutationDefinition
{
    definitions:
    {
        route: string
        type: string
        filter_value: string
        funcInvocations:
        {
            funcId: string
            skip: boolean
            values: any
        }[]
    }

    constructor()
    {
        this.definitions =
        {
			route: '/items/{id}',
			type: 'POST',
      filter_value: "filtery value",
			funcInvocations:
			[
				{
					funcId: 'set-value',
					skip: true,
					values:
					{
						value1: '"/items/100"',
						value2: 'fragment',
					}
				},
				{
					funcId: 'set-value',
					skip: true,
					values:
					{
						value1: 'JSON.stringify({ "name": "Steve", "type": "items" })',
						value2: 'body',
					}
				},
				{
					funcId: 'set-value',
					skip: false,
					values:
					{
						value1: '"failure"',
						value2: 'message',
					}
				},
				{
					funcId: 'return',
					skip: false,
					values:
					{
						value1: 'message',
					}
				},
				{
					funcId: 'set-value',
					skip: false,
					values:
					{
						value1: 'fragment.split("/")[1]',
						value2: 'queryParam',
					}
				},
				{
					funcId: 'set-value',
					skip: false,
					values:
					{
						value1: 'fragment.split("/")[2]',
						value2: 'param',
					}
				},
				{
					funcId: 'set-value',
					skip: false,
					values:
					{
						value1: 'JSON.parse(body)',
						value2: 'body',
					}
				},
				{
					funcId: 'insert-item',
					skip: false,
					values:
					{
						value1: '{ "pk": param.toString(), "sk": param.toString(), "type": queryParam.toString(), ...body }',
						value3: 'result',
					}
				},
				{
					funcId: 'set-value',
					skip: false,
					values:
					{
						value1: '"success"',
						value2: 'message',
					}
				},
			],
		};
    }
}
