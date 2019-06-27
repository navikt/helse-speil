'use strict';

const AWS = require('aws-sdk');
const bucket = 'speil';

let s3 = null;
const init = (url, accessKeyId, secretAccessKey) => {
    AWS.config.update({
        endpoint: url,
        sslEnabled: false,
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        s3ForcePathStyle: true
    });
    s3 = new AWS.S3({ apiVersion: '2006-03-01' });
};

const save = async (id, json) => {
    return s3
        .putObject({
            Bucket: bucket,
            Key: id,
            ContentType: 'application/json',
            Body: Buffer.from(json, 'utf-8')
        })
        .promise();
};

const load = async key => {
    return s3
        .getObject({
            Bucket: bucket,
            Key: key
        })
        .promise();
};

const bucketExists = async name => {
    return new Promise((resolve, reject) => {
        s3.listBuckets(function(err, data) {
            if (err) reject(err);
            const nrOfMatching = data
                ? data.Buckets.filter(bucket => bucket.Name === name).length
                : 0;
            resolve(nrOfMatching === 1);
        });
    });
};

const createBucket = async name => {
    return new Promise((resolve, reject) => {
        s3.createBucket({ Bucket: name, ACL: 'private' }, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};

module.exports = {
    init: init,
    save: save,
    load: load,
    bucketExists: bucketExists,
    createBucket: createBucket
};
