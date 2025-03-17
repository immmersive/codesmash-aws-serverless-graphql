/// <reference types="zen-observable" />
import { Store } from "redux";
import { SubscribeWithSyncOptions, QuerySyncOptions } from "./client";
import { OfflineEffectConfig } from "./store";
import { OperationVariables } from "apollo-client";
import { DocumentNode } from "graphql";
import { QueryWithVariables } from "./helpers/offline";
declare type SubscribeWithSyncEffectOptions<T, TVariables = OperationVariables> = SubscribeWithSyncOptions<T, TVariables> & {
    lastSyncTimestamp?: number;
    baseLastSyncTimestamp?: number;
};
export declare type DeltaSyncEffect<T> = {
    options: SubscribeWithSyncEffectOptions<any, any>;
    observer: ZenObservable.SubscriptionObserver<T>;
    callback: (Subscription: any) => void;
};
export declare const DELTASYNC_KEY = "deltaSync";
export declare type DeltaSyncState = {
    metadata: {
        [key: string]: DeltaSyncStateMetadata;
    };
};
export declare type DeltaSyncStateMetadata = {
    baseLastSyncTimestamp: number;
    lastSyncTimestamp: number;
};
export declare const hashForOptions: (options: SubscribeWithSyncOptions<any, OperationVariables>) => string;
export declare const boundEnqueueDeltaSync: <T, TVariables = OperationVariables>(store: Store<any>, options: SubscribeWithSyncEffectOptions<T, TVariables>, observer: ZenObservable.SubscriptionObserver<T>, callback: (Subscription: any) => void) => void;
export declare const buildSync: <T = {
    [key: string]: any;
}, TVariables = OperationVariables>(typename: string, options: {
    baseQuery?: BuildBaseQuerySyncOptions<T, TVariables>;
    subscriptionQuery?: BuildQuerySyncOptions<TVariables>;
    deltaQuery?: BuildQuerySyncOptions<TVariables>;
    cacheUpdates?: (item: T) => QueryWithVariables<OperationVariables>[];
}, idField?: string) => SubscribeWithSyncOptions<T, TVariables>;
export declare type BuildQuerySyncOptions<TVariables = OperationVariables> = {
    query: DocumentNode;
    variables: TVariables;
};
export declare type BuildBaseQuerySyncOptions<T, TVariables = OperationVariables> = QuerySyncOptions<T, TVariables> & {
    baseRefreshIntervalInSeconds?: number;
};
export declare const offlineEffectConfig: OfflineEffectConfig;
export {};
