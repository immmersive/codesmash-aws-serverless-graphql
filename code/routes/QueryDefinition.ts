export class QueryDefinition
{
    definitions:
    {
        route: string
        method: string
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
			route: '/items',
			method: 'GET',
			funcInvocations:
			[
				{
					funcId: 'set-value',
					skip: true,
					values:
					{
						value1: '"/items"',
						value2: 'fragment',
					}
				},
				{
					funcId: 'set-value',
					skip: false,
					values:
					{
						value1: '"failure"',
						value2: 'result',
					}
				},
				{
					funcId: 'return',
					skip: false,
					values:
					{
						value1: 'result',
					}
				},
				{
					funcId: 'set-value',
					skip: false,
					values:
					{
						value1: 'fragment.split("/")[1]',
						value2: 'param',
					}
				},
				{
					funcId: 'query-items',
					skip: false,
					values:
					{
						value1: '{ "type": param.toString() }',
						value3: 'type-index',
						value4: 'result',
					}
				},
			],
		};
    }
}
