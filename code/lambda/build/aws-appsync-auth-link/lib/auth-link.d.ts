/*!
 * Copyright 2017-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { Observable } from 'apollo-link';
import { ApolloLink } from 'apollo-link';
import { Credentials, CredentialProvider } from '@aws-sdk/types';
export declare const USER_AGENT_HEADER = "x-amz-user-agent";
export declare const USER_AGENT: string;
export declare enum AUTH_TYPE {
    NONE = "NONE",
    API_KEY = "API_KEY",
    AWS_IAM = "AWS_IAM",
    AMAZON_COGNITO_USER_POOLS = "AMAZON_COGNITO_USER_POOLS",
    OPENID_CONNECT = "OPENID_CONNECT",
    AWS_LAMBDA = "AWS_LAMBDA"
}
export declare class AuthLink extends ApolloLink {
    private link;
    /**
     *
     * @param {*} options
     */
    constructor(options: any);
    request(operation: any, forward: any): Observable<import("apollo-link").FetchResult<{
        [key: string]: any;
    }, Record<string, any>, Record<string, any>>>;
}
declare type KeysWithType<O, T> = {
    [K in keyof O]: O[K] extends T ? K : never;
}[keyof O];
declare type AuthOptionsNone = {
    type: AUTH_TYPE.NONE;
};
declare type AuthOptionsIAM = {
    type: KeysWithType<typeof AUTH_TYPE, AUTH_TYPE.AWS_IAM>;
    credentials: (() => Credentials | CredentialProvider | Promise<Credentials | CredentialProvider | null>) | Credentials | CredentialProvider | null;
};
declare type AuthOptionsApiKey = {
    type: KeysWithType<typeof AUTH_TYPE, AUTH_TYPE.API_KEY>;
    apiKey: (() => (string | Promise<string>)) | string;
};
declare type AuthOptionsOAuth = {
    type: KeysWithType<typeof AUTH_TYPE, AUTH_TYPE.AMAZON_COGNITO_USER_POOLS> | KeysWithType<typeof AUTH_TYPE, AUTH_TYPE.OPENID_CONNECT>;
    jwtToken: (() => (string | Promise<string>)) | string;
};
declare type AuthOptionsLambda = {
    type: KeysWithType<typeof AUTH_TYPE, AUTH_TYPE.AWS_LAMBDA>;
    token: (() => (string | Promise<string>)) | string;
};
export declare type AuthOptions = AuthOptionsNone | AuthOptionsIAM | AuthOptionsApiKey | AuthOptionsOAuth | AuthOptionsLambda;
export declare const authLink: ({ url, region, auth: { type }, auth }: {
    url: any;
    region: any;
    auth: any;
}) => ApolloLink;
export {};
