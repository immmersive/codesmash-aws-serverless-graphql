/// <reference types="zen-observable" />
import { ApolloLink, Observable, Operation, GraphQLRequest, NextLink } from "apollo-link";
import { ExecutionResult } from "graphql";
import { Store } from "redux";
import { OfflineCache } from "../cache/offline-cache";
import { MutationUpdaterFn, MutationQueryReducersMap } from "apollo-client";
import { RefetchQueryDescription, FetchPolicy } from "apollo-client/core/watchQueryOptions";
import { OfflineEffectConfig } from "../store";
export declare const isOptimistic: (obj: any) => boolean;
export declare class OfflineLink extends ApolloLink {
    private store;
    constructor(store: Store<OfflineCache>);
    request(operation: Operation, forward: NextLink): Observable<{}>;
}
export declare const boundSaveSnapshot: (store: any, cache: any) => any;
export declare type EnqueuedMutationEffect<T> = {
    optimisticResponse: object;
    operation: GraphQLRequest;
    update: MutationUpdaterFn<T>;
    updateQueries: MutationQueryReducersMap<T>;
    refetchQueries: ((result: ExecutionResult) => RefetchQueryDescription) | RefetchQueryDescription;
    observer: ZenObservable.SubscriptionObserver<T>;
    fetchPolicy?: FetchPolicy;
};
export declare const replaceUsingMap: (obj: any, map?: {}) => any;
export declare const getIds: (dataIdFromObject: any, obj: any, path?: string, acc?: {}) => any;
export declare const offlineEffectConfig: OfflineEffectConfig;
