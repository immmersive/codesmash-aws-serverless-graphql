/*!
 * Copyright 2017-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { DocumentNode } from "graphql";
export declare const passthroughLink: (op: any, forward: any) => any;
export declare const isUuid: (val: any) => RegExpMatchArray;
export declare const getOperationFieldName: (operation: DocumentNode) => string;
export declare const hash: (src: any) => string;
export { default as rootLogger } from './logger';
