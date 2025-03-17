"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*!
 * Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
var S3 = require("aws-sdk/clients/s3");
exports.default = (function (fileField, _a) {
    var credentials = _a.credentials;
    var Bucket = fileField.bucket, Key = fileField.key, region = fileField.region, ContentType = fileField.mimeType, Body = fileField.localUri;
    var s3 = new S3({
        credentials: credentials,
        region: region,
    });
    return s3.upload({
        Bucket: Bucket,
        Key: Key,
        Body: Body,
        ContentType: ContentType,
    }).promise();
});
