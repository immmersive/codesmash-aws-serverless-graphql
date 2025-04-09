export class QueryDefinition
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
      this.definitions =
      {
          operation: 'getItem',
          type: 'Query',
          funcInvocations:
          [
              {
                  funcId: 'set-value',
                  skip: false,
                  values:
                  {
                      value1: 'arguments.tableName',
                      value2: 'tableName',
                  }
              },
              {
                  funcId: 'set-value',
                  skip: false,
                  values:
                  {
                      value1: 'arguments.key',
                      value2: 'key',
                  }
              },
              {
                  funcId: 'query-items',
                  skip: false,
                  values:
                  {
                      value1: 'key',
                      value3: 'tableName',
                      value4: 'result',
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
          ],
      };
    }
}
