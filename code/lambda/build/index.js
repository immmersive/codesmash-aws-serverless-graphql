"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const Repo_1 = require("./Repo");
const handler = async (event) => {
    var _a, _b;
    console.log("Received event:", JSON.stringify(event));
    try {
        if (event.httpMethod === 'OPTIONS') {
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Allow-Methods": "*"
                },
                body: 'OPTIONS OK'
            };
        }
        const requestBody = JSON.parse(event.body || "{}");
        const graphQLMethod = requestBody.operationName;
        const graphQLType = (_b = (_a = requestBody.query) === null || _a === void 0 ? void 0 : _a.split(/\s+/)[0]) === null || _b === void 0 ? void 0 : _b.trim();
        console.log(`GraphQL Method: ${graphQLMethod}, Type: ${graphQLType}`);
        if (!graphQLMethod || !graphQLType) {
            console.error("Invalid GraphQL request");
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Allow-Methods": "*",
                },
                body: JSON.stringify({
                    message: 'Invalid GraphQL request',
                    code: 'InvalidGraphQLRequest',
                }),
            };
        }
        var selectedRoute = new Repo_1.Repo()
            .getRoutes()
            .filter(x => x.isMatching(event.path, event.httpMethod))[0];
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
