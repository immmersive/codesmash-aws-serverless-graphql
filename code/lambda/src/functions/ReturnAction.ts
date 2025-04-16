import { HelpApi } from "../HelpApi";

export class ReturnAction
{
    id = 'return'

    async run(
        data: any,
        source: { value1: any }) : Promise<boolean>
    {
        console.log("➡️ Inside ReturnAction.run()");
        console.log("🔍 Input data:", { data, source });
        var help = new HelpApi();
        var value1 = source.value1;

        help.setObjectValue(data, 'return', value1);

        console.log("ReturnAction finished");
        return true;
    }
}
