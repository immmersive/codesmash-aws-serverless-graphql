"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repo = void 0;
const ApiDefinition_1 = require("./ApiDefinition");
const Route_1 = require("./Route");
const ContainsAction_1 = require("./functions/ContainsAction");
const DeleteItemAction_1 = require("./functions/DeleteItemAction");
const DoesntContainAction_1 = require("./functions/DoesntContainAction");
const EqualsAction_1 = require("./functions/EqualsAction");
const FetchAction_1 = require("./functions/FetchAction");
const GetItemAction_1 = require("./functions/GetItemAction");
const GreaterThanAction_1 = require("./functions/GreaterThanAction");
const GreaterThanOrEqualAction_1 = require("./functions/GreaterThanOrEqualAction");
const InsertItemAction_1 = require("./functions/InsertItemAction");
const LessThanAction_1 = require("./functions/LessThanAction");
const LessThanOrEqualAction_1 = require("./functions/LessThanOrEqualAction");
const NotEqualAction_1 = require("./functions/NotEqualAction");
const QueryItemsAction_1 = require("./functions/QueryItemsAction");
const SetValueAction_1 = require("./functions/SetValueAction");
const UpdateItemAction_1 = require("./functions/UpdateItemAction");
const ReturnAction_1 = require("./functions/ReturnAction");
const JoinAction_1 = require("./functions/JoinAction");
class Repo {
    constructor() {
        this.apiDefinition = new ApiDefinition_1.ApiDefinition();
    }
    getRoutes() {
        return this.apiDefinition.definitions.map(x => new Route_1.Route(x.operation, x.type, "filtervaluehere", x.funcInvocations
            .filter(f => f.skip === false)
            .map(f => this.functionSelector(f.funcId))));
    }
    functionSelector(funcId) {
        return [
            new ContainsAction_1.ContainsAction(),
            new DeleteItemAction_1.DeleteItemAction(),
            new DoesntContainAction_1.DoesntContainAction(),
            new EqualsAction_1.EqualsAction(),
            new FetchAction_1.FetchAction(),
            new GetItemAction_1.GetItemAction(),
            new GreaterThanAction_1.GreaterThanAction(),
            new GreaterThanOrEqualAction_1.GreaterThanOrEqualAction(),
            new InsertItemAction_1.InsertItemAction(),
            new LessThanAction_1.LessThanAction(),
            new LessThanOrEqualAction_1.LessThanOrEqualAction(),
            new NotEqualAction_1.NotEqualAction(),
            new QueryItemsAction_1.QueryItemsAction(),
            new SetValueAction_1.SetValueAction(),
            new UpdateItemAction_1.UpdateItemAction(),
            new ReturnAction_1.ReturnAction(),
            new JoinAction_1.JoinAction()
        ].filter(x => x.id === funcId)[0];
    }
}
exports.Repo = Repo;
