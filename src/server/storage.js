'use strict';

const AWS = require('aws-sdk');
const bucketName = 'speil';

let s3 = null;
const init = async (url, accessKeyId, secretAccessKey) => {
    AWS.config.update({
        endpoint: url,
        sslEnabled: false,
        credentials: {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey
        },
        s3ForcePathStyle: true,
        s3BucketEndpoint: false
    });
    s3 = new AWS.S3({ apiVersion: '2006-03-01' });
    return createBucketIfNotExists(bucketName);
};

const save = async (key, text) => {
    return s3
        .putObject({
            Bucket: bucketName,
            Key: key,
            ContentType: 'text/plain',
            Body: Buffer.from(text, 'utf-8')
        })
        .promise();
};

const load = async key => {
    return s3
        .getObject({
            Bucket: bucketName,
            Key: key
        })
        .promise();
};

const createBucketIfNotExists = async name => {
    const exists = await bucketExists(name);
    if (!exists) {
        console.log(`Creating bucket ${name}`);
        return s3
            .createBucket({
                Bucket: name,
                ACL: 'private',
                CreateBucketConfiguration: {
                    LocationConstraint: ''
                }
            })
            .promise();
    } else {
        console.log(`Bucket ${name} already exists, will keep using it`);
        return Promise.resolve({});
    }
};

const bucketExists = async name => {
    return new Promise((resolve, reject) => {
        s3.listBuckets()
            .promise()
            .then(data => {
                const nrOfMatching = data
                    ? data.Buckets.filter(bucket => bucket.Name === name).length
                    : 0;
                resolve(nrOfMatching === 1);
            })
            .catch(err => {
                reject(err);
            });
    });
};

module.exports = {
    init: init,
    save: save,
    load: load
};
