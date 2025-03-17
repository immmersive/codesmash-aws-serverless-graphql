/*!
 * Copyright 2017-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { ApolloLink } from "apollo-link";
import { OfflineAction } from "@redux-offline/redux-offline/lib/types";
export declare const PERMANENT_ERROR_KEY: string | symbol;
export declare const SKIP_RETRY_KEY = "@@skipRetry";
export declare const getEffectDelay: (_action: OfflineAction, retries: number) => number;
export declare const createRetryLink: (origLink: ApolloLink) => ApolloLink;
