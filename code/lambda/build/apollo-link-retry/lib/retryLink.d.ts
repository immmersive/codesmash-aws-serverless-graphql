import { ApolloLink, Observable, Operation, NextLink, FetchResult } from 'apollo-link';
import { DelayFunction, DelayFunctionOptions } from './delayFunction';
import { RetryFunction, RetryFunctionOptions } from './retryFunction';
export declare namespace RetryLink {
    interface Options {
        /**
         * Configuration for the delay strategy to use, or a custom delay strategy.
         */
        delay?: DelayFunctionOptions | DelayFunction;
        /**
         * Configuration for the retry strategy to use, or a custom retry strategy.
         */
        attempts?: RetryFunctionOptions | RetryFunction;
    }
}
export declare class RetryLink extends ApolloLink {
    private delayFor;
    private retryIf;
    constructor({ delay, attempts }?: RetryLink.Options);
    request(operation: Operation, nextLink: NextLink): Observable<FetchResult>;
}
