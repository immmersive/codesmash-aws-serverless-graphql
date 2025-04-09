export class MutationDefinition
{
    definitions:
    {
        operation: string
        type: string
        funcInvocations:
        {
            funcId: string
            skip: boolean
            values: any
        }[]
    }

    constructor()
    {
      this.definitions = {
        operation: 'createItem',
        type: 'Mutation',
        funcInvocations: [
            {
                funcId: 'set-value',
                skip: false,
                values: {
                    value1: 'arguments.tableName',
                    value2: 'tableName',
                }
            },
            {
                funcId: 'set-value',
                skip: false,
                values: {
                    value1: 'arguments.key',
                    value2: 'key',
                }
            },
            {
                funcId: 'insert-item',
                skip: false,
                values: {
                    value1: '{ "pk": key.universityId.toString(), "sk": key.studentId.toString(), "data": arguments }',
                    value3: 'result',
                }
            },
            {
                funcId: 'return',
                skip: false,
                values: {
                    value1: 'result',
                }
            }
        ],
      };
    }
}
