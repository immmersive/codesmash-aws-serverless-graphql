import { HelpApi } from "../HelpApi";

export class SetValueAction 
{ 
    id = 'set-value';

    async run(
        data: any, 
        source: { value1: any, value2: any }) : Promise<boolean>
    {
        var help = new HelpApi();
        var value1 = source.value1;
        var value2 = source.value2;     
 
        help.setObjectValue(
            data, 
            value2, 
            new Function('data', 'return ' + help.prefixVars(data, value1))(data));
  
        return true;
    }
}
