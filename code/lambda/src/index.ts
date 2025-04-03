import { Repo } from "./Repo"

export const handler = async (event: {
    operation: string
    type: string
    arguments: any
}): Promise<any> => {
  console.log("Received event:", JSON.stringify(event));

  try {
    var selectedRoute: {
      invokeRoute(operation: string, type: string): Promise<any>
      isMatching(operation: string, type: string): boolean
    } = new Repo()
            .getRoutes()
            .filter(x => x.isMatching(event.operation, event.type))[0];

    if (selectedRoute == null) {
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

    var temp = await selectedRoute.invokeRoute(event.operation, event.type);

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
  catch (error) {
    return {
        statusCode: 500,
        headers: {
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
