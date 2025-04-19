"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryDefinition = void 0;
class QueryDefinition {
    constructor() {
        this.definitions =
            {
                operation: 'getItem',
                type: 'Query',
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
                        funcId: 'get-item',
                        skip: false,
                        values: {
                            value1: 'key',
                            value3: 'tableName',
                            value4: 'result',
                        }
                    },
                    {
                        funcId: 'return',
                        skip: false,
                        values: {
                            value1: 'result',
                        }
                    },
                ],
            };
    }
}
exports.QueryDefinition = QueryDefinition;
