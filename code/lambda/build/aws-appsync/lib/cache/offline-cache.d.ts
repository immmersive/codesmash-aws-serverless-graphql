import { Cache } from 'apollo-cache';
import { InMemoryCache, ApolloReducerConfig, defaultDataIdFromObject, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { Store } from 'redux';
import { DeltaSyncState, DELTASYNC_KEY } from '../deltaSync';
export declare const NORMALIZED_CACHE_KEY = "appsync";
export declare const METADATA_KEY = "appsync-metadata";
export { defaultDataIdFromObject };
export declare type AppSyncMetadataState = {
    idsMap: {
        [key: string]: string;
    };
    snapshot: {
        cache: NormalizedCacheObject;
        enqueuedMutations: number;
    };
    [DELTASYNC_KEY]: DeltaSyncState;
};
declare type AppState = {
    offline: {
        online: boolean;
        outbox: any[];
    };
};
export interface OfflineCache extends AppState {
    rehydrated: boolean;
    [NORMALIZED_CACHE_KEY]: NormalizedCacheObject;
    [METADATA_KEY]: AppSyncMetadataState;
}
export declare type OfflineCacheOptions = {
    store: Store<OfflineCache>;
    storeCacheRootMutation?: boolean;
};
export default class MyCache extends InMemoryCache {
    private store;
    private storeCacheRootMutation;
    constructor(optionsOrStore: Store<OfflineCache> | OfflineCacheOptions, config?: ApolloReducerConfig);
    restore(data: NormalizedCacheObject): this;
    write(write: Cache.WriteOptions): void;
    reset(): Promise<void>;
    getIdsMap(): {
        [x: string]: string;
    };
}
export declare const reducer: () => {
    [NORMALIZED_CACHE_KEY]: (state: {}, action: any) => any;
};
