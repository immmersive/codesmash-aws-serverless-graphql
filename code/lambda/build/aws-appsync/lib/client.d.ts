/*!
 * Copyright 2017-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import 'setimmediate';
import ApolloClient, { ApolloClientOptions, MutationOptions, OperationVariables, MutationUpdaterFn } from 'apollo-client';
import { ApolloReducerConfig, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloLink, FetchResult } from 'apollo-link';
import { Store } from 'redux';
import { defaultDataIdFromObject } from './cache/index';
import { OfflineCache as OfflineCacheType } from './cache/offline-cache';
import { StoreOptions } from './store';
import { ApolloCache } from 'apollo-cache';
import { AuthOptions, AUTH_TYPE } from 'aws-appsync-auth-link';
import { Credentials, CredentialsOptions } from 'aws-sdk/lib/credentials';
import { DocumentNode } from 'graphql';
import { buildSync } from "./deltaSync";
import { Subscription } from 'apollo-client/util/Observable';
export { defaultDataIdFromObject };
export declare const createAppSyncLink: ({ url, region, auth, complexObjectsCredentials, resultsFetcherLink, conflictResolver, }: {
    url: string;
    region: string;
    auth: AuthOptions;
    complexObjectsCredentials: CredentialsGetter;
    resultsFetcherLink?: ApolloLink;
    conflictResolver?: ConflictResolver;
}) => ApolloLink;
export declare const createLinkWithCache: (createLinkFunc?: (cache: ApolloCache<any>) => ApolloLink) => ApolloLink;
export interface CacheWithStore<T> extends ApolloCache<T> {
    store: Store<OfflineCacheType>;
}
declare type CredentialsGetter = () => (Credentials | CredentialsOptions | Promise<Credentials> | Promise<CredentialsOptions> | null) | Credentials | CredentialsOptions | Promise<Credentials> | Promise<CredentialsOptions> | null;
export interface AWSAppSyncClientOptions {
    url: string;
    region: string;
    auth: AuthOptions;
    conflictResolver?: ConflictResolver;
    complexObjectsCredentials?: CredentialsGetter;
    cacheOptions?: ApolloReducerConfig;
    disableOffline?: boolean;
    offlineConfig?: OfflineConfig;
}
export declare type OfflineConfig = Pick<Partial<StoreOptions<any>>, 'storage' | 'callback' | 'keyPrefix'> & {
    storeCacheRootMutation?: boolean;
};
export declare type OfflineCallback = (err: any, success: any) => void;
export interface ConflictResolutionInfo {
    mutation: DocumentNode;
    mutationName: string;
    operationType: string;
    variables: any;
    data: any;
    retries: number;
}
export declare type ConflictResolver = (obj: ConflictResolutionInfo) => 'DISCARD' | any;
declare class AWSAppSyncClient<TCacheShape extends NormalizedCacheObject> extends ApolloClient<TCacheShape> {
    private _store;
    private hydratedPromise;
    hydrated(): Promise<AWSAppSyncClient<TCacheShape>>;
    private _disableOffline;
    constructor({ url, region, auth, conflictResolver, complexObjectsCredentials, cacheOptions, disableOffline, offlineConfig: { storage, keyPrefix, callback, storeCacheRootMutation, }, }: AWSAppSyncClientOptions, options?: Partial<ApolloClientOptions<TCacheShape>>);
    isOfflineEnabled(): boolean;
    mutate<T, TVariables = OperationVariables>(options: MutationOptions<T, TVariables>): Promise<FetchResult<T>>;
    sync<T, TVariables = OperationVariables>(options: SubscribeWithSyncOptions<T, TVariables>): Subscription;
}
export declare type QuerySyncOptions<T, TVariables = OperationVariables> = {
    query: DocumentNode;
    variables: TVariables;
    update: MutationUpdaterFn<T>;
};
export declare type BaseQuerySyncOptions<T, TVariables = OperationVariables> = QuerySyncOptions<T, TVariables> & {
    baseRefreshIntervalInSeconds?: number;
};
export declare type SubscribeWithSyncOptions<T, TVariables = OperationVariables> = {
    baseQuery?: BaseQuerySyncOptions<T, TVariables>;
    subscriptionQuery?: QuerySyncOptions<T, TVariables>;
    deltaQuery?: QuerySyncOptions<T, TVariables>;
};
export default AWSAppSyncClient;
export { AWSAppSyncClient };
export { AUTH_TYPE, buildSync };
