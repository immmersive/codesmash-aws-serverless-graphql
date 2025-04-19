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
        var temp = await selectedRoute.invokeRoute(event.operation, event.type, event.field, event.arguments);
        console.log("Route response temp:", JSON.stringify(temp));
        console.log("Derived return key:", temp === null || temp === void 0 ? void 0 : temp['return']);
        console.log("Payload to return:", JSON.stringify(temp === null || temp === void 0 ? void 0 : temp[temp === null || temp === void 0 ? void 0 : temp['return']]));
        const resultKey = temp['return'];
        const resultData = temp[resultKey];
        if (!resultData || typeof resultData !== 'object') {
            console.error("Invalid return data:", resultData);
            throw new Error("Route returned invalid or missing data");
        }
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
