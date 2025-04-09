"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutationDefinition = void 0;
class MutationDefinition {
    constructor() {
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
exports.MutationDefinition = MutationDefinition;
