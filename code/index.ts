import { Repo } from "./Repo";
 
export const handler = async (event: 
{ 
    path: string 
    httpMethod: string 
    queryStringParameters: any
    headers: any    
    body: any    
}): Promise<any> => 
{    
    console.log(JSON.stringify(event));

    try 
    {
        if(event.httpMethod === 'OPTIONS')
        {
            return { 
                statusCode: 200,
                headers: 
                {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Allow-Methods": "*"
                },
                body: 'OPTIONS OK'
            };   
        }

        var selectedRoute: 
        {  
            invokeRoute(queryParameters: any, headers: any, path: any, body: any) : Promise<any>
            isMatching(path: string, httpMethod: string): boolean
        } = new Repo()
                .getRoutes()
                .filter(x => x.isMatching(event.path, event.httpMethod))[0];
 
        if(selectedRoute == null)
        {
            return { 
                statusCode: 404,
                headers: 
                {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Allow-Methods": "*"
                },
                body: JSON.stringify({ 
                    message: 'Invalid Route',
                    code: 'Invalid Route'
                })
            };   
        }

        var temp = await selectedRoute.invokeRoute(event.queryStringParameters, event.headers, event.path, event.body);
 
        return { 
            statusCode: 200,
            headers: 
            {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "*"
            },
            body: JSON.stringify((temp['return'] && temp[temp['return']]) ? temp[temp['return']] : {})
        };
    } 
    catch (error) 
    {  
        return { 
            statusCode: 500,
            headers: 
            {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "*"
            },
            body: JSON.stringify({ 
                message: error.message ? error.message : 'API Call Failed',
                code: error.code ? error.code : 'APICallFailed'
            })
        };
    }
}
