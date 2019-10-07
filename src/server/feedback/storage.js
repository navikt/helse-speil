'use strict';

const AWS = require('aws-sdk');
const bucketName = 'speil';

const logger = require('../logging');

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

const save = async (key, text, mimetype) => {
    return s3
        .putObject({
            Bucket: bucketName,
            Key: key,
            ContentType: mimetype || 'application/octet-stream',
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

const loadAll = async () => {
    return s3
        .listObjects({
            Bucket: bucketName
        })
        .promise()
        .then(res => {
            const keys = res.Contents.map(item => item.Key);
            const objects = keys.map(key =>
                load(key).then(res => ({
                    key,
                    value: JSON.parse(res.Body)
                }))
            );
            return Promise.all(objects);
        })
        .catch(err => console.warn(err));
};

const loadSome = async keys => {
    const objects = keys.map(key =>
        load(key)
            .then(res => ({
                key,
                value: JSON.parse(res.Body)
            }))
            .catch(() => {
                return undefined;
            })
    );
    return Promise.all(objects);
};

const createBucketIfNotExists = async name => {
    const exists = await bucketExists(name);
    if (!exists) {
        logger.info(`Creating bucket ${name}`);
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
        logger.info(`Bucket ${name} already exists, will keep using it`);
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
    init,
    save,
    load,
    loadAll,
    loadSome
};
