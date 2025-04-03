"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const Repo_1 = require("./Repo");
const handler = async (event) => {
    console.log("Received event:", JSON.stringify(event));
    try {
        var selectedRoute = new Repo_1.Repo()
            .getRoutes()
            .filter(x => x.isMatching(event.operation, event.type))[0];
        if (selectedRoute == null) {
            return {
                statusCode: 404,
                headers: {
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
            headers: {
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
};
exports.handler = handler;
