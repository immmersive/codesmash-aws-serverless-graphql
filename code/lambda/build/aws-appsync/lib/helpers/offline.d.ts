import { ApolloClient, MutationOptions, SubscribeToMoreOptions, OperationVariables } from 'apollo-client';
import { DocumentNode } from 'graphql';
export declare enum CacheOperationTypes {
    AUTO = "auto",
    ADD = "add",
    REMOVE = "remove",
    UPDATE = "update"
}
export declare const getOpTypeFromOperationName: (opName?: string) => CacheOperationTypes;
export declare type QueryWithVariables<TVariables = OperationVariables> = {
    query: DocumentNode;
    variables?: TVariables;
};
export declare type CacheUpdateQuery = QueryWithVariables | DocumentNode;
export declare type CacheUpdatesDefinitions = {
    [key in CacheOperationTypes]?: CacheUpdateQuery | CacheUpdateQuery[];
} | CacheUpdateQuery | CacheUpdateQuery[];
export declare type CacheUpdatesOptions = ((variables?: object) => CacheUpdatesDefinitions) | CacheUpdatesDefinitions;
/**
 * Builds a SubscribeToMoreOptions object ready to be used by Apollo's subscribeToMore() to automatically update the query result in the
 * cache according to the cacheUpdateQuery parameter
 *
 * @param subscriptionQuery The GraphQL subscription DocumentNode or CacheUpdateQuery
 * @param cacheUpdateQuery The query for which the result needs to be updated
 * @param idField
 * @param operationType
 */
declare const buildSubscription: (subscriptionQuery: CacheUpdateQuery, cacheUpdateQuery: CacheUpdateQuery, idField?: string, operationType?: CacheOperationTypes) => SubscribeToMoreOptions<any, OperationVariables, any>;
export declare const getUpdater: <T>(opType: CacheOperationTypes, idField?: string) => (arr: T[], newItem?: T) => T[];
export declare type VariablesInfo<T = OperationVariables> = {
    inputType: DocumentNode;
    variables: T;
};
/**
 * Builds a MutationOptions object ready to be used by the ApolloClient to automatically update the cache according to the cacheUpdateQuery
 * parameter
 *
 * @param client An ApolloClient instance
 * @param mutation DocumentNode for the muation
 * @param variables An object with the mutation variables
 * @param cacheUpdateQuery The queries to update in the cache
 * @param typename __typename from your schema
 * @param idField The name of the field with the ID
 * @param operationType Override for the operation type
 *
 * @returns Mutation options to be used by the ApolloClient
 */
declare const buildMutation: <T = OperationVariables>(client: ApolloClient<any>, mutation: DocumentNode, variablesInfo: T | VariablesInfo<T>, cacheUpdateQuery: CacheUpdatesOptions, typename: string, idField?: string, operationType?: CacheOperationTypes) => MutationOptions<{
    [key: string]: any;
}, OperationVariables>;
export { buildSubscription, buildMutation };
