"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var auth_link_1 = require("./auth-link");
exports.AuthLink = auth_link_1.AuthLink;
exports.AUTH_TYPE = auth_link_1.AUTH_TYPE;
exports.USER_AGENT_HEADER = auth_link_1.USER_AGENT_HEADER;
exports.USER_AGENT = auth_link_1.USER_AGENT;
exports.createAuthLink = function (_a) {
    var url = _a.url, region = _a.region, auth = _a.auth;
    return new auth_link_1.AuthLink({ url: url, region: region, auth: auth });
};
var signer_1 = require("./signer");
exports.Signer = signer_1.Signer;
