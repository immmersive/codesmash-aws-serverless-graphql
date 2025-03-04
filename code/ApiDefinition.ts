import { RouteDefinition1 } from "./routes/RouteDefinition1";

export class ApiDefinition
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
    }[];

    constructor()
    {
        this.definitions =
        [
          new RouteDefinition1().definitions
        ];
    }
}
