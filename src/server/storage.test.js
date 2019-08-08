'use strict';

const storage = require('./storage');
const port = 9001;

const ServerMock = require('mock-http-server');
const server = new ServerMock({ host: 'localhost', port: port });

const fileContents = 'some arbitrary text';

beforeAll(done => {
    server.start(() => {
        setupServer();
        storage
            .init(`localhost:${port}`, 'anAccessKeyId', 'aSecretAccessKey')
            .then(() => {
                done();
            })
            .catch(err => {
                console.log(`oh noes: ${err}`);
            });
    });
});

afterAll(done => {
    server.stop(done);
});

test('save file and read it back', async () => {
    await storage.save('123456ABC', fileContents);
    const fileReadResult = await storage.load('123456ABC');
    expect(fileReadResult.Body.toString()).toEqual(fileContents);
});

const setupServer = () => {
    server.on({
        method: 'GET',
        path: '/',
        reply: {
            status: 200,
            headers: {},
            body: listBucketResponse
        }
    });

    server.on({
        method: 'PUT',
        path: '/speil',
        reply: {
            status: 200,
            headers: { Location: '/speil' },
            body: createBucketResponse
        }
    });

    server.on({
        method: 'PUT',
        path: '/speil/123456ABC',
        reply: {
            status: 200,
            headers: {},
            body: saveFileResponse
        }
    });

    server.on({
        method: 'GET',
        path: '/speil/123456ABC',
        reply: {
            status: 200,
            headers: {},
            body: fileContents
        }
    });
};

const listBucketResponse = `<ListAllMyBucketsResult xmlns="http://s3.amazonaws.com/doc/2006-03-01"><Owner><ID>bcaf1ffd86f41161ca5fb16fd081034f</ID><DisplayName>webfile</DisplayName></Owner><Buckets><Bucket><Name>stuff</Name><CreationDate>2006-02-03T16:45:09.000Z</CreationDate></Bucket></Buckets></ListAllMyBucketsResult>`;

const saveFileResponse = `<PutObjectResponse xmlns="http://s3.amazonaws.com/doc/2006-03-01"><PutObjectResponse><ETag>&#34;b04a65db998c7683491bce872e1d33f0&#34;</ETag><LastModified>2019-07-04T08:45:10.203Z</LastModified></PutObjectResponse></PutObjectResponse>`;

const createBucketResponse = `<CreateBucketResponse xmlns="http://s3.amazonaws.com/doc/2006-03-01"><CreateBucketResponse><Bucket>speil</Bucket></CreateBucketResponse></CreateBucketResponse>`;
