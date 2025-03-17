import { Store, Reducer } from 'redux';
import { AWSAppSyncClient, OfflineCallback } from './client';
import { NormalizedCacheObject, IdGetter } from 'apollo-cache-inmemory';
import { NetInfo, NetworkCallback } from '@redux-offline/redux-offline/lib/types';
export declare type StoreOptions<TCacheShape extends NormalizedCacheObject> = {
    clientGetter: () => AWSAppSyncClient<TCacheShape>;
    persistCallback: () => void;
    dataIdFromObject: (obj: any) => string | null;
    keyPrefix?: string;
    storage?: any;
    callback: OfflineCallback;
};
export declare const DEFAULT_KEY_PREFIX: any;
declare const newStore: <TCacheShape extends NormalizedCacheObject>({ clientGetter, persistCallback, dataIdFromObject, keyPrefix, storage, callback, }: StoreOptions<TCacheShape>) => Store<any>;
export declare type OfflineEffectConfig = {
    enqueueAction: string;
    effect?: Function;
    discard?: Function;
    retry?: Function;
    reducer?: (dataIdFromObject: IdGetter) => Reducer<any>;
};
export declare type OfflineStatusChangeCallbackCreator = (callback: NetworkCallback) => void;
export declare type OfflineStatusChangeCallback = (result: {
    online: boolean;
    netInfo?: NetInfo;
}) => void;
export { newStore as createStore };
