import { MutationDefinition } from "./routes/MutationDefinition";
import { QueryDefinition } from "./routes/QueryDefinition";

export class ApiDefinition {
  definitions: {
    operation: string
    type: string
    filter_value: string,
    funcInvocations: {
      funcId: string
      skip: boolean
      values: any
    }[]
  }[];

  constructor() {
    const mutationDefinitions = new MutationDefinition().definitions;
    const queryDefinitions = new QueryDefinition().definitions;

    this.definitions = [
        {
            ...mutationDefinitions,
            filter_value: `${mutationDefinitions.type}#${mutationDefinitions.operation}`,
        },
        {
            ...queryDefinitions,
            filter_value: `${queryDefinitions.type}#${queryDefinitions.operation}`,
        },
    ];
  }
}
