import { MutationDefinition } from "./routes/MutationDefinition";
import { QueryDefinition } from "./routes/QueryDefinition";

export class ApiDefinition
{
    definitions:
    {
        route: string
        type: string
        filter_value: string,
        funcInvocations:
        {
            funcId: string
            skip: boolean
            values: any
        }[]
    }[];

    constructor()
    {
        this.definitions =
        [
          new MutationDefinition().definitions,
          new QueryDefinition().definitions
        ];
    }
}
