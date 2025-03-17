/*!
 * Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import * as S3 from 'aws-sdk/clients/s3';
declare const _default: (fileField: any, { credentials }: {
    credentials: any;
}) => Promise<S3.ManagedUpload.SendData>;
export default _default;
