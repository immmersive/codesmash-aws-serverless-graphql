import { ApiDefinition } from "./ApiDefinition"
import { Route } from "./Route"
import { ContainsAction } from "./functions/ContainsAction"
import { DeleteItemAction } from "./functions/DeleteItemAction"
import { DoesntContainAction } from "./functions/DoesntContainAction"
import { EqualsAction } from "./functions/EqualsAction"
import { FetchAction } from "./functions/FetchAction"
import { GetItemAction } from "./functions/GetItemAction"
import { GreaterThanAction } from "./functions/GreaterThanAction"
import { GreaterThanOrEqualAction } from "./functions/GreaterThanOrEqualAction"
import { InsertItemAction } from "./functions/InsertItemAction"
import { LessThanAction } from "./functions/LessThanAction"
import { LessThanOrEqualAction } from "./functions/LessThanOrEqualAction"
import { NotEqualAction } from "./functions/NotEqualAction"
import { QueryItemsAction } from "./functions/QueryItemsAction"
import { SetValueAction } from "./functions/SetValueAction"
import { UpdateItemAction } from "./functions/UpdateItemAction"
import { ReturnAction } from "./functions/ReturnAction"
import { JoinAction } from "./functions/JoinAction"

export class Repo
{
    apiDefinition: ApiDefinition

    constructor()
    {
        this.apiDefinition = new ApiDefinition();
    }

    getRoutes():
    {
        invokeRoute(queryParameters: any, headers: any, path: any, body: any): Promise<any>
        isMatching(operation: string, type: string): boolean
    }[]
    {
        return this.apiDefinition.definitions.map(x =>
            new Route(
                x.route,
                x.type,
                "filtervaluehere",
                x.funcInvocations
                    .filter(f => f.skip === false)
                    .map(f => this.functionSelector(f.funcId))));
    }

    functionSelector(funcId: string):
    {
        id: string,
        run(data: any, source: any, other: any): Promise<boolean>
    }
    {
        return [
            new ContainsAction(),
            new DeleteItemAction(),
            new DoesntContainAction(),
            new EqualsAction(),
            new FetchAction(),
            new GetItemAction(),
            new GreaterThanAction(),
            new GreaterThanOrEqualAction(),
            new InsertItemAction(),
            new LessThanAction(),
            new LessThanOrEqualAction(),
            new NotEqualAction(),
            new QueryItemsAction(),
            new SetValueAction(),
            new UpdateItemAction(),
            new ReturnAction(),
            new JoinAction()
        ].filter(x => x.id === funcId)[0];
    }
}
