/*!
 * Copyright 2017-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { ApolloLink, Operation, NextLink } from "apollo-link";
import { ConflictResolver } from "../client";
export default class ConflictResolutionLink extends ApolloLink {
    private conflictResolver;
    private maxRetries;
    private link;
    constructor(conflictResolver: ConflictResolver, maxRetries?: number);
    private hasConflictError;
    request(operation: Operation, forward: NextLink): any;
}
